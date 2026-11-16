import { useEffect, useRef, useState } from 'react'
import { ArchbaseAccessToken } from '../ArchbaseAccessToken'
import { useContainer } from 'inversify-react'
import { ArchbaseAuthenticator } from '../ArchbaseAuthenticator'
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core'
import { ArchbaseTokenManager } from '../ArchbaseTokenManager'
import { processErrorMessage } from '@archbase/core'
import { useArchbaseStore, registerArchbaseTokenRenewer } from '@archbase/data'
import { ARCHBASE_SECURITY_MANAGER_STORE } from './useArchbaseSecurityManager'
import { 
  ContextualAuthenticationRequest,
  FlexibleLoginRequest,
  SocialLoginRequest,
  RegisterUserRequest,
  SupportedContextsResponse,
  ContextValidationResponse,
  ContextObject
} from '../types/ContextualAuthentication'

/**
 * Reconhece a recusa de login por credenciais expiradas devolvida pelo archbase-security:
 * HTTP 403 com `{ error: 'CREDENTIALS_EXPIRED', requirePasswordChange: true }`. Aceita tanto o
 * erro do axios quanto o corpo já desembrulhado.
 */
export function isCredentialsExpiredError(error: any): boolean {
  const payload = error?.response?.data ?? error?.data ?? error
  return payload?.error === 'CREDENTIALS_EXPIRED' || payload?.requirePasswordChange === true
}

export interface AuthenticationManagerReturnType {
  // Métodos básicos (compatibilidade)
  login: (username: string, password: string, rememberMe: boolean) => void
  logout: (clearRememberMe?: boolean) => void
  username: string
  isAuthenticating: boolean
  isInitializing: boolean
  isAuthenticated: boolean
  isError: boolean
  error: any
  clearError: () => void
  accessToken?: string | null
  
  // MFA / segundo fator (2 passos)
  mfaRequired: boolean
  verifyMfa?: (code: string) => Promise<void>
  cancelMfa: () => void

  /**
   * O backend recusou o login com CREDENTIALS_EXPIRED: há troca de senha obrigatória pendente
   * ou a senha venceu pela política de validade. O app deve levar o usuário ao fluxo de
   * redefinição de senha (ArchbaseResetPassword) em vez de só exibir o erro.
   */
  passwordChangeRequired: boolean
  clearPasswordChangeRequired: () => void

  // Novos métodos opcionais para autenticação avançada
  loginWithContext?: (request: ContextualAuthenticationRequest, rememberMe?: boolean) => Promise<void>
  loginFlexible?: (request: FlexibleLoginRequest, rememberMe?: boolean) => Promise<void>
  loginSocial?: (request: SocialLoginRequest) => Promise<void>
  register?: (request: RegisterUserRequest) => Promise<{ email: string; businessId?: string; message: string }>
  getSupportedContexts?: () => Promise<SupportedContextsResponse>
  validateContext?: (context: string) => Promise<ContextValidationResponse>
  
  // Informações de contexto
  context?: ContextObject | null
  
  // Detecção de capacidades
  capabilities: {
    hasContextualLogin: boolean
    hasFlexibleLogin: boolean
    hasSocialLogin: boolean
    hasRegistration: boolean
    hasContextSupport: boolean
  }
}

export interface ArchbaseAuthenticationManagerProps {
  checkIntervalTokenHasExpired?: number
  expirationThresholdOfToken?: number
}

export const useArchbaseAuthenticationManager = ({
  checkIntervalTokenHasExpired = 30000, // Verificar a 30 segundos
  expirationThresholdOfToken = 300 // Antecipar em 5 minutos
}: ArchbaseAuthenticationManagerProps): AuthenticationManagerReturnType => {
  const tokenManager = useContainer((container) =>
    container.get<ArchbaseTokenManager>(ARCHBASE_IOC_API_TYPE.TokenManager)
  )
  const authenticator = useContainer((container) =>
    container.get<ArchbaseAuthenticator>(ARCHBASE_IOC_API_TYPE.Authenticator)
  )
  const [accessToken, setAccessToken] = useState<ArchbaseAccessToken | null>(null)
  const [isAuthenticating, setAuthenticating] = useState<boolean>(false)
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [context, setContext] = useState<ContextObject | null>(null)
  const [mfaRequired, setMfaRequired] = useState<boolean>(false)
  const [passwordChangeRequired, setPasswordChangeRequired] = useState<boolean>(false)
  const [mfaChallengeToken, setMfaChallengeToken] = useState<string | null>(null)
  /**
   * A renovação em curso, compartilhada: o intervalo e todo pedido que recebe 401 esperam a mesma. Com sessão única,
   * duas renovações concorrentes rotacionam o mesmo refresh token e a segunda é negada por causa da primeira. Ref, e
   * não state, para não reagendar o intervalo a cada troca.
   */
  const renovacaoEmCurso = useRef<Promise<ArchbaseAccessToken | null> | null>(null)
  /** O token do estado, legível de dentro de listeners e do renovador sem closure velha. */
  const tokenAtual = useRef<ArchbaseAccessToken | null>(null)
  /**
   * O login em curso. Um segundo envio enquanto o primeiro não voltou (clique e Enter, duplo clique) recebe a mesma
   * promessa: com sessão única, dois logins no mesmo milissegundo revogam os tokens um do outro (VEN-1126, 15/11).
   */
  const loginEmCurso = useRef<Promise<any> | null>(null)
  const securityStore = useArchbaseStore(ARCHBASE_SECURITY_MANAGER_STORE)

  const definirToken = (token: ArchbaseAccessToken | null) => {
    tokenAtual.current = token
    setAccessToken(token)
  }

  /** Um login por vez: a chamada que chega com outro em curso espera o mesmo resultado em vez de mandar outro. */
  const umPorVez = <A extends any[], R>(fn: (...args: A) => Promise<R>) => (...args: A): Promise<R> => {
    if (loginEmCurso.current) {
      return loginEmCurso.current
    }
    const p = fn(...args).finally(() => {
      loginEmCurso.current = null
    })
    loginEmCurso.current = p
    return p
  }

  // Detectar capacidades do authenticator
  const capabilities = {
    hasContextualLogin: typeof authenticator.loginWithContext === 'function',
    hasFlexibleLogin: typeof authenticator.loginFlexible === 'function',
    hasSocialLogin: typeof authenticator.loginSocial === 'function',
    hasRegistration: typeof authenticator.register === 'function',
    hasContextSupport: typeof tokenManager.saveContext === 'function'
  }

  useEffect(() => {
    const savedUsername = tokenManager.getUsername();
    if (savedUsername && savedUsername != '') {
      setUsername(savedUsername)
    }
    
    // Carregar contexto se suportado
    if (capabilities.hasContextSupport && tokenManager.getContext) {
      const savedContext = tokenManager.getContext()
      if (savedContext) {
        try {
          // Se savedContext é string, fazer parse para objeto
          const contextObj = typeof savedContext === 'string' ? JSON.parse(savedContext) : savedContext
          setContext(contextObj)
        } catch (ex) {
          console.warn('Erro ao carregar contexto salvo:', ex)
        }
      }
    }
    
    const token = tokenManager.getToken()
    if (token) {
      setAuthenticated(true)
      setError('')
      setIsError(false)
      definirToken(token)
    }
    setIsInitializing(false)
  }, [])

  const clearError = () => {
    setIsError(false)
    setError('')
  }

  const clearPasswordChangeRequired = () => {
    setPasswordChangeRequired(false)
  }

  const logout = (clearRememberMe?: boolean) => {
    setAuthenticating(false)
    setAuthenticated(false)
    // Sem isto o token continua no estado depois do logout, e o intervalo que vigia a expiração
    // -- que depende de `accessToken` -- segue vivo tentando renovar um token que já morreu. Como
    // a renovação que falha chama justamente este logout, o ciclo se realimenta: falha, desloga,
    // tenta de novo, para sempre. Em produção isso apareceu como um erro de refresh se repetindo
    // de minuto em minuto, sem ninguém nunca ser deslogado de fato.
    definirToken(null)
    tokenManager.clearToken()
    if (clearRememberMe) {
      tokenManager.clearUsernameAndPassword()
    }
    
    // Limpar contexto se suportado
    if (capabilities.hasContextSupport && tokenManager.clearContext) {
      tokenManager.clearContext()
    }
    
    setUsername('')
    setContext(null)
    setError('')
    setIsError(false)
    setPasswordChangeRequired(false)
    securityStore.clearAllValues()
  }

  const login = async (username: string, password: string, rememberMe: boolean) => {
    try {
      setAuthenticating(true)
      setAuthenticated(false)
      const access_token = await authenticator.login(username, password)
      tokenManager.saveToken(access_token)
      if (rememberMe) {
        tokenManager.saveUsernameAndPassword(username, password)
      }
      tokenManager.saveUsername(username)
      setUsername(username)
      definirToken(access_token)
      setAuthenticating(false)
      setAuthenticated(true)
    } catch (error) {
      setAuthenticating(false)
      setAuthenticated(false)
      // Troca de senha obrigatória: não é credencial inválida — o app precisa redirecionar
      // para a redefinição de senha, senão o usuário fica preso na tela de login.
      if (isCredentialsExpiredError(error)) {
        setUsername(username)
        setPasswordChangeRequired(true)
      }
      setError(processErrorMessage(error))
      setIsError(true)
    }
  }


  // Novos métodos de login contextual
  const loginWithContext = async (request: ContextualAuthenticationRequest, rememberMe: boolean = false) => {
    if (!capabilities.hasContextualLogin || !authenticator.loginWithContext) {
      throw new Error('Login contextual não suportado por esta implementação do ArchbaseAuthenticator')
    }

    try {
      setAuthenticating(true)
      setAuthenticated(false)
      
      // Desestruturação direta - separa context/user do resto (que é o access_token)
      const { context, user, ...tokenData } = await authenticator.loginWithContext(request)

      // Segundo fator pendente (MFA): a senha conferiu, mas falta o código. Não autentica
      // ainda — guarda o desafio e sinaliza mfaRequired; o app completa via verifyMfa().
      if ((tokenData as any).mfa_required) {
        setMfaChallengeToken((tokenData as any).challenge_token ?? null)
        setMfaRequired(true)
        setUsername(request.email)
        setAuthenticating(false)
        return
      }

      // Adicionar campos obrigatórios que podem estar faltando
      const access_token: ArchbaseAccessToken = {
        scope: '',
        ext_expires_in: tokenData.expires_in,
        ...tokenData
      }
      
      // Usa access_token diretamente (MESMO padrão do login básico)
      tokenManager.saveToken(access_token)
      if (rememberMe) {
        tokenManager.saveUsernameAndPassword(request.email, request.password)
      } else {
        tokenManager.clearUsernameAndPassword()
      }
      tokenManager.saveUsername(request.email)
      
      // Salvar contexto separadamente
      if (capabilities.hasContextSupport && tokenManager.saveContext && context) {
        tokenManager.saveContext(JSON.stringify(context))
        setContext(context)
      }

      setUsername(request.email)
      definirToken(access_token)
      setAuthenticating(false)
      setAuthenticated(true)
    } catch (error) {
      setAuthenticating(false)
      setAuthenticated(false)
      if (isCredentialsExpiredError(error)) {
        setUsername(request.email)
        setPasswordChangeRequired(true)
      }
      setError(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  const verifyMfa = async (code: string) => {
    if (!authenticator.verifyMfa) {
      throw new Error('verifyMfa não suportado por esta implementação do ArchbaseAuthenticator')
    }
    if (!mfaChallengeToken) {
      throw new Error('Nenhum desafio de MFA pendente')
    }
    try {
      setAuthenticating(true)
      setError('')
      setIsError(false)
      const access_token = await authenticator.verifyMfa(mfaChallengeToken, code)
      tokenManager.saveToken(access_token)
      tokenManager.saveUsername(username)
      definirToken(access_token)
      setMfaRequired(false)
      setMfaChallengeToken(null)
      setAuthenticating(false)
      setAuthenticated(true)
    } catch (error) {
      setAuthenticating(false)
      setError(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  const cancelMfa = () => {
    setMfaRequired(false)
    setMfaChallengeToken(null)
    setError('')
    setIsError(false)
  }

  const loginFlexible = async (request: FlexibleLoginRequest, rememberMe: boolean = false) => {
    if (!capabilities.hasFlexibleLogin || !authenticator.loginFlexible) {
      throw new Error('Login flexível não suportado por esta implementação do ArchbaseAuthenticator')
    }

    try {
      setAuthenticating(true)
      setAuthenticated(false)
      
      // Desestruturação direta - separa context/user do resto (que é o access_token)
      const { context, user, ...tokenData } = await authenticator.loginFlexible(request)
      
      // Adicionar campos obrigatórios que podem estar faltando
      const access_token: ArchbaseAccessToken = {
        scope: '',
        ext_expires_in: tokenData.expires_in,
        ...tokenData
      }
      
      // Usa access_token diretamente (MESMO padrão do login básico)
      tokenManager.saveToken(access_token)
      if (rememberMe) {
        tokenManager.saveUsernameAndPassword(request.identifier, request.password)
      }
      tokenManager.saveUsername(user.email || request.identifier)
      
      // Salvar contexto separadamente
      if (capabilities.hasContextSupport && tokenManager.saveContext && context) {
        tokenManager.saveContext(JSON.stringify(context))
        setContext(context)
      }

      setUsername(user.email || request.identifier)
      definirToken(access_token)
      setAuthenticating(false)
      setAuthenticated(true)
    } catch (error) {
      setAuthenticating(false)
      setAuthenticated(false)
      if (isCredentialsExpiredError(error)) {
        setUsername(request.identifier)
        setPasswordChangeRequired(true)
      }
      setError(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  const loginSocial = async (request: SocialLoginRequest) => {
    if (!capabilities.hasSocialLogin || !authenticator.loginSocial) {
      throw new Error('Login social não suportado por esta implementação do ArchbaseAuthenticator')
    }

    try {
      setAuthenticating(true)
      setAuthenticated(false)
      
      // Desestruturação direta - separa context/user do resto (que é o access_token)
      const { context, user, ...tokenData } = await authenticator.loginSocial(request)
      
      // Adicionar campos obrigatórios que podem estar faltando
      const access_token: ArchbaseAccessToken = {
        scope: '',
        ext_expires_in: tokenData.expires_in,
        ...tokenData
      }
      
      // Usa access_token diretamente (MESMO padrão do login básico)
      tokenManager.saveToken(access_token)
      tokenManager.saveUsername(user.email)
      
      // Salvar contexto separadamente
      if (capabilities.hasContextSupport && tokenManager.saveContext && context) {
        tokenManager.saveContext(JSON.stringify(context))
        setContext(context)
      }

      setUsername(user.email)
      definirToken(access_token)
      setAuthenticating(false)
      setAuthenticated(true)
    } catch (error) {
      setAuthenticating(false)
      setAuthenticated(false)
      setError(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  const register = async (request: RegisterUserRequest) => {
    if (!capabilities.hasRegistration || !authenticator.register) {
      throw new Error('Registro não suportado por esta implementação do ArchbaseAuthenticator')
    }

    try {
      setAuthenticating(true)
      const result = await authenticator.register(request)
      setAuthenticating(false)
      return result
    } catch (error) {
      setAuthenticating(false)
      setError(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  const getSupportedContextsMethod = async () => {
    if (!authenticator.getSupportedContexts) {
      return { supportedContexts: ['DEFAULT'], defaultContext: 'DEFAULT' }
    }
    return await authenticator.getSupportedContexts()
  }

  const validateContextMethod = async (contextToValidate: string) => {
    if (!authenticator.validateContext) {
      return { context: contextToValidate, supported: contextToValidate === 'DEFAULT' }
    }
    return await authenticator.validateContext(contextToValidate)
  }

  useEffect(() => {
    const checkTokenExpirationInterval = setInterval(() => {
      if (accessToken && accessToken.access_token) {
        if (tokenManager.isTokenExpired(accessToken, expirationThresholdOfToken)) {
          renovarToken()
        }
      }
    }, checkIntervalTokenHasExpired)

    return () => {
      clearInterval(checkTokenExpirationInterval)
    }
  }, [accessToken])

  /** Adota o token que outra aba (ou outro login) gravou, sem ir à rede. */
  const adotar = (guardado: ArchbaseAccessToken) => {
    definirToken(guardado)
    setAuthenticated(true)
    setError('')
    setIsError(false)
  }

  /**
   * A renovação negada encerra a sessão: o refresh token não volta a valer sozinho, e insistir só repete o erro. A
   * tela de login diz por quê (SESSAO_ENCERRADA), em vez de aparecer sem explicação.
   */
  const encerrarSessao = () => {
    logout()
    setError(processErrorMessage({ response: { status: 401, data: { error: 'SESSAO_ENCERRADA' } } }))
    setIsError(true)
  }

  /**
   * Renova a sessão uma vez só, para o intervalo e para os pedidos que receberam 401.
   *
   * Antes de ir à rede, olha o armazenamento: se outra aba já fez login ou renovou, o token guardado é outro e
   * ainda vale, e renovar de novo com o refresh velho seria negado (ou, pior, revogaria o token da outra aba). Se a
   * renovação for negada mas o armazenamento tiver ganhado um token novo no meio-tempo, adota esse em vez de sair.
   *
   * @param recusado o access token que o servidor recusou (do 401); sem ele, o do estado
   * @returns o token em vigor depois da renovação, ou null quando a sessão acabou
   */
  const renovarToken = (recusado?: string): Promise<ArchbaseAccessToken | null> => {
    if (renovacaoEmCurso.current) {
      return renovacaoEmCurso.current
    }
    const emUso = recusado ?? tokenAtual.current?.access_token
    const guardado = tokenManager.getToken()
    if (guardado && guardado.access_token !== emUso && !tokenManager.isTokenExpired(guardado, expirationThresholdOfToken)) {
      adotar(guardado)
      return Promise.resolve(guardado)
    }
    const base = guardado ?? tokenAtual.current
    if (!base?.refresh_token) {
      return Promise.resolve(null)
    }
    const renovacao = (async () => {
      try {
        const response = await authenticator.refreshToken(base.refresh_token)
        tokenManager.saveToken(response)
        definirToken(response)
        return response
      } catch (error) {
        const agora = tokenManager.getToken()
        if (agora && agora.access_token !== base.access_token) {
          adotar(agora)
          return agora
        }
        console.error('Erro ao renovar o token:', error)
        encerrarSessao()
        return null
      } finally {
        renovacaoEmCurso.current = null
      }
    })()
    renovacaoEmCurso.current = renovacao
    return renovacao
  }

  // O cliente HTTP chama isto no 401 (ArchbaseAxiosRemoteApiClient.comSessao).
  useEffect(() => {
    return registerArchbaseTokenRenewer(async (recusado) => (await renovarToken(recusado))?.access_token ?? null)
  }, [])

  /**
   * A aba acompanha o armazenamento. O token é um só por navegador (localStorage), mas cada aba guardava o seu na
   * memória: depois de um login em outra aba, esta seguia renovando com o refresh revogado, e a renovação negada
   * limpava o armazenamento, derrubando a aba boa também (VEN-1126). O evento `storage` só chega às OUTRAS abas; o
   * foco cobre o navegador que suspendeu a aba e perdeu o evento.
   */
  useEffect(() => {
    const sincronizar = () => {
      const guardado = tokenManager.getToken()
      const atual = tokenAtual.current
      if (guardado?.access_token === atual?.access_token) {
        return
      }
      if (guardado) {
        adotar(guardado)
      } else if (atual) {
        // Outra aba saiu: o armazenamento está vazio, e esta não tem mais com o que falar com o servidor.
        logout()
      }
    }
    const aoVoltar = () => {
      if (document.visibilityState === 'visible') {
        sincronizar()
      }
    }
    window.addEventListener('storage', sincronizar)
    window.addEventListener('focus', sincronizar)
    document.addEventListener('visibilitychange', aoVoltar)
    return () => {
      window.removeEventListener('storage', sincronizar)
      window.removeEventListener('focus', sincronizar)
      document.removeEventListener('visibilitychange', aoVoltar)
    }
  }, [])

  return {
    // Métodos básicos (compatibilidade)
    login: umPorVez(login),
    logout,
    username,
    isAuthenticated,
    isAuthenticating,
    isInitializing,
    isError,
    error,
    clearError,
    accessToken: accessToken ? accessToken.access_token : null,
    
    // Métodos opcionais para autenticação avançada
    loginWithContext: capabilities.hasContextualLogin ? umPorVez(loginWithContext) : undefined,
    loginFlexible: capabilities.hasFlexibleLogin ? umPorVez(loginFlexible) : undefined,
    loginSocial: capabilities.hasSocialLogin ? umPorVez(loginSocial) : undefined,
    register: capabilities.hasRegistration ? register : undefined,
    getSupportedContexts: getSupportedContextsMethod,
    validateContext: validateContextMethod,

    // MFA / segundo fator (2 passos)
    mfaRequired,
    verifyMfa: typeof authenticator.verifyMfa === 'function' ? verifyMfa : undefined,
    cancelMfa,

    // Troca de senha obrigatória (CREDENTIALS_EXPIRED)
    passwordChangeRequired,
    clearPasswordChangeRequired,

    // Informações de contexto
    context,

    // Detecção de capacidades
    capabilities
  }
}