import { useEffect, useState } from 'react'
import { ArchbaseAccessToken } from '../ArchbaseAccessToken'
import { useContainer } from 'inversify-react'
import { ArchbaseAuthenticator } from '../ArchbaseAuthenticator'
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core'
import { ArchbaseTokenManager } from '../ArchbaseTokenManager'
import { processErrorMessage } from '@archbase/core'
import { useArchbaseStore } from '@archbase/data'
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
  const securityStore = useArchbaseStore(ARCHBASE_SECURITY_MANAGER_STORE)

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
      setAccessToken(token)
    }
    setIsInitializing(false)
  }, [])

  const clearError = () => {
    setIsError(false)
    setError('')
  }

  const logout = (clearRememberMe?: boolean) => {
    setAuthenticating(false)
    setAuthenticated(false)
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
      setAccessToken(access_token)
      setAuthenticating(false)
      setAuthenticated(true)
    } catch (error) {
      setAuthenticating(false)
      setAuthenticated(false)
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
      setAccessToken(access_token)
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
      setAccessToken(access_token)
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
      setAccessToken(access_token)
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

  const renovarToken = async () => {
    if (accessToken) {
      try {
        const response = await authenticator.refreshToken(accessToken?.refresh_token)
        tokenManager.saveToken(response)
        setAccessToken(response)
      } catch (error) {
        console.error('Erro ao renovar o token:', error)
        logout()
      }
    }
  }

  return {
    // Métodos básicos (compatibilidade)
    login,
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
    loginWithContext: capabilities.hasContextualLogin ? loginWithContext : undefined,
    loginFlexible: capabilities.hasFlexibleLogin ? loginFlexible : undefined,
    loginSocial: capabilities.hasSocialLogin ? loginSocial : undefined,
    register: capabilities.hasRegistration ? register : undefined,
    getSupportedContexts: getSupportedContextsMethod,
    validateContext: validateContextMethod,
    
    // Informações de contexto
    context,
    
    // Detecção de capacidades
    capabilities
  }
}