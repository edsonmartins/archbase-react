import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchTokens, fetchWithRefreshToken, redirectToLogin, redirectToLogout, validateState } from './authentication'
import useBrowserStorage from './hooks'
import {
  IArchbaseAuthContext,
  IArchbaseAuthProvider,
  TInternalConfig,
  TArchbaseRefreshTokenExpiredEvent,
  TTokenData,
  TTokenResponse,
} from './Types'
import { createInternalConfig } from './authConfig'
import { epochAtSecondsFromNow, epochTimeIsPast, FALLBACK_EXPIRE_TIME, getRefreshExpiresIn } from './timeUtils'
import { decodeJWT } from './decodeJWT'
import { FetchError } from './errors'

export const ArchbaseAuthContext = createContext<IArchbaseAuthContext>({
  token: '',
  login: () => null,
  logOut: () => null,
  error: null,
  loginInProgress: false,
})

export const ArchbaseAuthProvider = ({ authConfig, children }: IArchbaseAuthProvider) => {
  const config: TInternalConfig = useMemo(() => createInternalConfig(authConfig), [authConfig])

  const [refreshToken, setRefreshToken] = useBrowserStorage<string | undefined>(
    'ROCP_refreshToken',
    undefined,
    config.storage
  )
  const [refreshTokenExpire, setRefreshTokenExpire] = useBrowserStorage<number>(
    'ROCP_refreshTokenExpire',
    epochAtSecondsFromNow(2 * FALLBACK_EXPIRE_TIME),
    config.storage
  )
  const [token, setToken] = useBrowserStorage<string>('ROCP_token', '', config.storage)
  const [tokenExpire, setTokenExpire] = useBrowserStorage<number>(
    'ROCP_tokenExpire',
    epochAtSecondsFromNow(FALLBACK_EXPIRE_TIME),
    config.storage
  )
  const [idToken, setIdToken] = useBrowserStorage<string | undefined>('ROCP_idToken', undefined, config.storage)
  const [loginInProgress, setLoginInProgress] = useBrowserStorage<boolean>(
    'ROCP_loginInProgress',
    false,
    config.storage
  )
  const [refreshInProgress, setRefreshInProgress] = useBrowserStorage<boolean>(
    'ROCP_refreshInProgress',
    false,
    config.storage
  )
  const [tokenData, setTokenData] = useState<TTokenData | undefined>()
  const [idTokenData, setIdTokenData] = useState<TTokenData | undefined>()
  const [error, setError] = useState<string | null>(null)

  let interval: any

  function clearStorage() {
    setRefreshToken(undefined)
    setToken('')
    setTokenExpire(epochAtSecondsFromNow(FALLBACK_EXPIRE_TIME))
    setRefreshTokenExpire(epochAtSecondsFromNow(FALLBACK_EXPIRE_TIME))
    setIdToken(undefined)
    setTokenData(undefined)
    setIdTokenData(undefined)
    setLoginInProgress(false)
  }

  function logOut(state?: string, logoutHint?: string) {
    clearStorage()
    setError(null)
    if (config?.logoutEndpoint) redirectToLogout(config, token, refreshToken, idToken, state, logoutHint)
  }

  function login(state?: string) {
    clearStorage()
    setLoginInProgress(true)
    let typeSafePassedState = state
    if (state && typeof state !== 'string') {
      console.warn(`O estado de login aprovado deve ser do tipo 'string'. Recebido'${state}'. Ignorando o valor...`)
      typeSafePassedState = undefined
    }
    redirectToLogin(config, typeSafePassedState).catch((error) => {
      console.error(error)
      setError(error.message)
      setLoginInProgress(false)
    })
  }

  function handleTokenResponse(response: TTokenResponse) {
    setToken(response.access_token)
    setRefreshToken(response.refresh_token)
    const tokenExpiresIn = config.tokenExpiresIn ?? response.expires_in ?? FALLBACK_EXPIRE_TIME
    setTokenExpire(epochAtSecondsFromNow(tokenExpiresIn))
    const refreshTokenExpiresIn = config.refreshTokenExpiresIn ?? getRefreshExpiresIn(tokenExpiresIn, response)
    setRefreshTokenExpire(epochAtSecondsFromNow(refreshTokenExpiresIn))
    setIdToken(response.id_token)
    try {
      if (response.id_token) setIdTokenData(decodeJWT(response.id_token))
    } catch (e) {
      console.warn(`Falha ao decodificar idToken: ${(e as Error).message}`)
    }
    try {
      if (config.decodeToken) setTokenData(decodeJWT(response.access_token))
    } catch (e) {
      console.warn(`Falha ao decodificar o token de acesso: ${(e as Error).message}`)
    }
  }

  function handleExpiredRefreshToken(initial = false): void {
    // Se for o primeiro carregamento de página OU não houver callback sessionExpire, acionamos um novo login
    if (initial) return login()
    // TODO: Mudança de última hora - remover login automático durante a sessão em andamento
    else if (!config.onRefreshTokenExpire) return login()
    else return config.onRefreshTokenExpire({ login } as TArchbaseRefreshTokenExpiredEvent)
  }

  function refreshAccessToken(initial = false): void {
    if (!token) return
    // O token não expirou. Fazer nada
    if (!epochTimeIsPast(tokenExpire)) return

    // Outra instância (guia) está sendo atualizada no momento. Esta instância ignora a atualização se não for inicial
    if (refreshInProgress && !initial) return

    // O refreshToken expirou
    if (epochTimeIsPast(refreshTokenExpire)) return handleExpiredRefreshToken(initial)

    // O access_token expirou e temos um refresh_token não expirado. Use-o para atualizar access_token.
    if (refreshToken) {
      setRefreshInProgress(true)
      fetchWithRefreshToken({ config, refreshToken })
        .then((result: TTokenResponse) => handleTokenResponse(result))
        .catch((error: unknown) => {
          if (error instanceof FetchError) {
            // Se a busca falhou com o status 400, assume o token de atualização expirado
            if (error.status === 400) {
              return handleExpiredRefreshToken(initial)
            }
            // Erro desconhecido. Defina o erro e faça o login se a primeira página for carregada
            else {
              console.error(error)
              setError(error.message)
              if (initial) login()
            }
          }
          // Erro desconhecido. Defina o erro e faça o login se a primeira página for carregada
          else if (error instanceof Error) {
            console.error(error)
            setError(error.message)
            if (initial) login()
          }
        })
        .finally(() => {
          setRefreshInProgress(false)
        })
      return
    }
    console.warn(
      'Falha ao atualizar access_token. Muito provavelmente não há refresh_token ou o servidor de autenticação não respondeu com um tempo de expiração explícito e os tempos de expiração padrão são maiores do que o tempo de expiração real dos tokens'
    )
  }

  // Registre o intervalo 'verificar se o token de acesso está prestes a expirar' (a cada 10 segundos)
  useEffect(() => {
    interval = setInterval(() => refreshAccessToken(), 10000) // eslint-disable-line
    return () => clearInterval(interval)
  }, [token, refreshToken, refreshTokenExpire, tokenExpire]) // Substitua o intervalo por um novo quando os valores usados ​​dentro do refreshAccessToken forem alterados

  // Esta referência é usada para garantir que a chamada 'fetchTokens' seja feita apenas uma vez.
  // Múltiplas chamadas com o mesmo código irão, e devem, retornar um erro da API
  // Veja: https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  const didFetchTokens = useRef(false)

  // Executa uma vez no carregamento da página
  useEffect(() => {
    // O cliente foi redirecionado de volta do endpoint de autenticação com um código de autenticação
    if (loginInProgress) {
      const urlParams = new URLSearchParams(window.location.search)
      if (!urlParams.get('code')) {
        // Isso não deveria acontecer. Deve haver um parâmetro 'código' no URL agora..."
        const error_description =
          urlParams.get('error_description') || 'Estado de autorização inválido. Atualizar a página pode resolver o problema.'
        console.error(error_description)
        setError(error_description)
        logOut()
        return
      }
      // Certifique-se de que tentamos usar o código de autenticação apenas uma vez
      if (!didFetchTokens.current) {
        didFetchTokens.current = true
        try {
          validateState(urlParams)
        } catch (e: any) {
          console.error(e)
          setError((e as Error).message)
        }
        // Solicite tokens do servidor de autenticação com o código de autenticação
        fetchTokens(config)
          .then((tokens: TTokenResponse) => {
            handleTokenResponse(tokens)
            // Chame qualquer função postLogin em authConfig
            if (config?.postLogin) config.postLogin()
          })
          .catch((error: Error) => {
            console.error(error)
            setError(error.message)
          })
          .finally(() => {
            if (config.clearURL) {
              // Limpar parâmetros de url 
              window.history.replaceState(null, '', window.location.pathname)
            }
            setLoginInProgress(false)
          })
      }
      return
    }

    // Visita da primeira página
    if (!token && config.autoLogin) return login()

    // Atualização da página após o login bem-sucedido
    try {
      if (idToken) setIdTokenData(decodeJWT(idToken))
    } catch (e) {
      console.warn(`Falha ao decodificar idToken: ${(e as Error).message}`)
    }
    try {
      if (config.decodeToken) setTokenData(decodeJWT(token))
    } catch (e) {
      console.warn(`Falha ao decodificar o token de acesso: ${(e as Error).message}`)
    }
    refreshAccessToken(true) // Verifique se o token deve ser atualizado
  }, []) // eslint-disable-line

  return (
    <ArchbaseAuthContext.Provider value={{ token, tokenData, idToken, idTokenData, login, logOut, error, loginInProgress }}>
      {children}
    </ArchbaseAuthContext.Provider>
  )
}
