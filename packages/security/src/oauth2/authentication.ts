/* eslint-disable */
import { generateCodeChallenge, generateRandomString } from './pkceUtils'
import {
  TInternalConfig,
  TTokenResponse,
  TTokenRequest,
  TTokenRequestWithCodeAndVerifier,
  TTokenRequestForRefresh
} from './Types'
import { postWithXForm } from './httpUtils'

const codeVerifierStorageKey = 'PKCE_code_verifier'
const stateStorageKey = 'ROCP_auth_state'

export async function redirectToLogin(
  config: TInternalConfig,
  customState?: string
): Promise<void> {
  // Crie e armazene uma string aleatória em sessionStorage, usada como 'code_verifier'
  const codeVerifier = generateRandomString(96)
  sessionStorage.setItem(codeVerifierStorageKey, codeVerifier)

  // Hash e Base64URL codificam o code_verifier, usado como o 'code_challenge'
  return generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    // Defina os parâmetros de consulta e redirecione o usuário para o endpoint de autenticação OAuth2
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      ...config.extraAuthParameters
    })

    if (config.scope !== undefined) {
      params.append('scope', config.scope)
    }

    sessionStorage.removeItem(stateStorageKey)
    const state = customState ?? config.state
    if (state) {
      sessionStorage.setItem(stateStorageKey, state)
      params.append('state', state)
    }
    // Chame qualquer função preLogin em authConfig
    if (config?.preLogin) config.preLogin()
    window.location.replace(`${config.authorizationEndpoint}?${params.toString()}`)
  })
}

// Isso é chamado de "predicado de tipo". O que nos permite saber que tipo de resposta obtivemos, de maneira segura.
function isTokenResponse(body: any | TTokenResponse): body is TTokenResponse {
  return (body as TTokenResponse).access_token !== undefined
}

function postTokenRequest(
  tokenEndpoint: string,
  tokenRequest: TTokenRequest
): Promise<TTokenResponse> {
  return postWithXForm(tokenEndpoint, tokenRequest).then((response) => {
    return response.json().then((body: TTokenResponse | any): TTokenResponse => {
      if (isTokenResponse(body)) {
        return body
      } else {
        throw Error(body)
      }
    })
  })
}

export const fetchTokens = (config: TInternalConfig): Promise<TTokenResponse> => {
  /*
    O navegador foi redirecionado do endpoint de autenticação com
    um parâmetro de url 'code'.
    Este código agora será trocado por tokens de acesso e atualização.
  */
  const urlParams = new URLSearchParams(window.location.search)
  const authCode = urlParams.get('code')
  const codeVerifier = window.sessionStorage.getItem(codeVerifierStorageKey)

  if (!authCode) {
    throw Error("Parâmetro 'código' não encontrado na URL. \nA autenticação ocorreu?")
  }
  if (!codeVerifier) {
    throw Error('Não é possível obter tokens sem o CodeVerifier. \nA autenticação ocorreu?')
  }

  const tokenRequest: TTokenRequestWithCodeAndVerifier = {
    grant_type: 'authorization_code',
    code: authCode,
    scope: config.scope,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code_verifier: codeVerifier,
    ...config.extraTokenParameters,
    ...config.extraAuthParams
  }
  return postTokenRequest(config.tokenEndpoint, tokenRequest)
}

export const fetchWithRefreshToken = (props: {
  config: TInternalConfig
  refreshToken: string
}): Promise<TTokenResponse> => {
  const { config, refreshToken } = props
  const refreshRequest: TTokenRequestForRefresh = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    scope: config.scope,
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    ...config.extraTokenParameters
  }
  return postTokenRequest(config.tokenEndpoint, refreshRequest)
}

export function redirectToLogout(
  config: TInternalConfig,
  token: string,
  refresh_token?: string,
  idToken?: string,
  state?: string,
  logoutHint?: string
) {
  const params = new URLSearchParams({
    token: refresh_token || token,
    token_type_hint: refresh_token ? 'refresh_token' : 'access_token',
    client_id: config.clientId,
    post_logout_redirect_uri: config.logoutRedirect ?? config.redirectUri,
    ui_locales: window.navigator.languages.reduce((a: string, b: string) => a + ' ' + b),
    ...config.extraLogoutParameters
  })
  if (idToken) params.append('id_token_hint', idToken)
  if (state) params.append('state', state)
  if (logoutHint) params.append('logout_hint', logoutHint)

  window.location.replace(`${config.logoutEndpoint}?${params.toString()}`)
}

export function validateState(urlParams: URLSearchParams) {
  const receivedState = urlParams.get('state')
  const loadedState = sessionStorage.getItem(stateStorageKey)
  if (receivedState !== loadedState) {
    throw new Error(
      '"state" valor recebido do servidor de autenticação não corresponde à solicitação do cliente. Possível falsificação de solicitação entre sites'
    )
  }
}
