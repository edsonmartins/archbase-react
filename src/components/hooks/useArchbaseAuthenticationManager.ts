import { useEffect, useState } from 'react'
import { ArchbaseAccessToken } from '../auth/ArchbaseAccessToken'
import { useContainer } from 'inversify-react'
import { ArchbaseAuthenticator } from '../auth/ArchbaseAuthenticator'
import { ARCHBASE_IOC_API_TYPE } from '../core/ioc'
import { ArchbaseTokenManager } from '../auth/ArchbaseTokenManager'
import { processErrorMessage } from '../core/exceptions'

export interface AuthenticationManagerReturnType {
  login: (username: string, password: string, rememberMe: boolean) => void
  logout: ()=>void
  username: string
  isAuthenticating: boolean
  isAuthenticated: boolean
  isError: boolean
  error: any
  clearError: () => void
  accessToken?: string | null
}

export interface ArchbaseAuthenticationManagerProps {
  checkIntervalTokenHasExpired?: number
  expirationThresholdOfToken?: number
}

export const useArchbaseAuthenticationManager = ({
  checkIntervalTokenHasExpired = 30000, // Verificar a 30 segundos
  expirationThresholdOfToken = 300 // Antecipar em 5 minutos
} : ArchbaseAuthenticationManagerProps): AuthenticationManagerReturnType => {
  const tokenManager = useContainer((container) =>
    container.get<ArchbaseTokenManager>(ARCHBASE_IOC_API_TYPE.TokenManager)
  )
  const authenticator = useContainer((container) =>
    container.get<ArchbaseAuthenticator>(ARCHBASE_IOC_API_TYPE.Authenticator)
  )
  const [accessToken, setAccessToken] = useState<ArchbaseAccessToken | null>(null)
  const [isAuthenticating, setAuthenticating] = useState<boolean>(false)
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const savedUsername = tokenManager.getUsername();
    if (savedUsername && savedUsername != '') {
      setUsername(savedUsername)
    }
    const token = tokenManager.getToken()
    if (token) {
      setAuthenticating(false)
      setAuthenticated(true)
      setError('')
      setIsError(false)
      setAccessToken(token)
    }
  }, [])

  const clearError = () => {
    setIsError(false)
    setError('')
  }

  const logout = () => {
    setAuthenticating(false)
    setAuthenticated(false)
    tokenManager.clearToken()
    tokenManager.clearUsernameAndPassword()
    setUsername('')
    setError('')
    setIsError(false)
  }

  const login = async (username: string, password: string, rememberMe: boolean) => {
    try {
      setAuthenticating(true)
      setAuthenticated(false)
      const access_token = await authenticator.login(username, password)
      tokenManager.saveToken(access_token)
      if (rememberMe){
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
    login,
    logout,
    username,
    isAuthenticated,
    isAuthenticating,
    isError,
    error,
    clearError,
    accessToken: accessToken ? accessToken.access_token : null
  }
}
