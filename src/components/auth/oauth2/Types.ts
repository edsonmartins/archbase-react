import { ReactNode } from 'react'

interface TTokenRqBase {
  grant_type: string
  scope?: string
  client_id: string
  redirect_uri: string
}

export interface TTokenRequestWithCodeAndVerifier extends TTokenRqBase {
  code: string
  code_verifier: string
}

export interface TTokenRequestForRefresh extends TTokenRqBase {
  refresh_token: string
}

export type TTokenRequest = TTokenRequestWithCodeAndVerifier | TTokenRequestForRefresh

export type TTokenData = {
  [x: string]: any
}

export type TTokenResponse = {
  access_token: string
  scope: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  refresh_token_expires_in?: number
  refresh_expires_in?: number
  id_token?: string
}

export interface IArchbaseAuthProvider {
  authConfig: TArchbaseAuthConfig
  children: ReactNode
}

export interface IArchbaseAuthContext {
  token: string
  logOut: (state?: string, logoutHint?: string) => void
  login: (state?: string) => void
  error: string | null
  tokenData?: TTokenData
  idToken?: string
  idTokenData?: TTokenData
  loginInProgress: boolean
}

// Entrada dos usuários do pacote, alguns valores opcionais
export type TArchbaseAuthConfig = {
  clientId: string
  authorizationEndpoint: string
  tokenEndpoint: string
  redirectUri: string
  scope?: string
  state?: string
  logoutEndpoint?: string
  logoutRedirect?: string
  preLogin?: () => void
  postLogin?: () => void
  onRefreshTokenExpire?: (event: TArchbaseRefreshTokenExpiredEvent) => void
  decodeToken?: boolean
  autoLogin?: boolean
  clearURL?: boolean
  extraAuthParams?: { [key: string]: string | boolean | number }
  extraAuthParameters?: { [key: string]: string | boolean | number }
  extraTokenParameters?: { [key: string]: string | boolean | number }
  extraLogoutParameters?: { [key: string]: string | boolean | number }
  tokenExpiresIn?: number
  refreshTokenExpiresIn?: number
  storage?: 'session' | 'local'
}

export type TArchbaseRefreshTokenExpiredEvent = {
  login: () => void
}

// O tipo de configuração interna AuthProviders. Todos os valores serão definidos pelo usuário fornecido ou valores padrão
export type TInternalConfig = {
  clientId: string
  authorizationEndpoint: string
  tokenEndpoint: string
  redirectUri: string
  scope?: string
  state?: string
  logoutEndpoint?: string
  logoutRedirect?: string
  preLogin?: () => void
  postLogin?: () => void
  onRefreshTokenExpire?: (event: TArchbaseRefreshTokenExpiredEvent) => void
  decodeToken: boolean
  autoLogin: boolean
  clearURL: boolean
  extraAuthParams?: { [key: string]: string | boolean | number }
  extraAuthParameters?: { [key: string]: string | boolean | number }
  extraTokenParameters?: { [key: string]: string | boolean | number }
  extraLogoutParameters?: { [key: string]: string | boolean | number }
  tokenExpiresIn?: number
  refreshTokenExpiresIn?: number
  storage: 'session' | 'local'
}
