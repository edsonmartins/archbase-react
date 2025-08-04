import { ArchbaseAccessToken, ArchbaseUser } from '@archbase/core'

/**
 * Objeto de contexto com informações específicas da aplicação
 */
export interface ContextObject {
  /** Tipo do contexto (WEB_ADMIN, STORE_APP, CUSTOMER_APP, etc.) */
  type: string
  /** ID do admin/usuário no contexto específico */
  adminId?: string
  /** ID da loja (para contexto STORE_APP) */
  storeId?: string
  /** ID do cliente (para contexto CUSTOMER_APP) */
  customerId?: string
  /** ID do motorista (para contexto DRIVER_APP) */
  driverId?: string
  /** Nome do usuário no contexto */
  name?: string
  /** Email do usuário no contexto */
  email?: string
  /** Foto de perfil */
  profilePicture?: string
  /** Nível de acesso (PLATFORM_ADMIN, STORE_ADMIN, etc.) */
  accessLevel?: string
  /** Módulos disponíveis para o usuário */
  availableModules?: string[]
  /** Status do usuário no contexto */
  status?: string
  /** Dados adicionais específicos do contexto */
  [key: string]: any
}

/**
 * Usuário completo retornado pela autenticação contextual
 */
export interface ContextualUser {
  id: {
    identifier: string
  }
  code?: string
  version?: number
  updateEntityDate?: string
  createEntityDate?: string
  createdByUser?: string
  lastModifiedByUser?: string
  name: string
  description?: string
  accessSchedule?: any
  userName: string
  password?: string
  changePasswordOnNextLogin?: boolean
  allowPasswordChange?: boolean
  allowMultipleLogins?: boolean
  passwordNeverExpires?: boolean
  accountDeactivated?: boolean
  accountLocked?: boolean
  unlimitedAccessHours?: boolean
  isAdministrator?: boolean
  groups?: any[]
  profile?: any
  avatar?: string | null
  email: string
  nickname?: string
}

/**
 * Response de autenticação contextual que inclui dados específicos do contexto
 */
export interface ContextualAuthenticationResponse {
  /** Token de acesso JWT */
  access_token: string
  /** Token de refresh JWT */
  refresh_token: string
  /** Timestamp absoluto de expiração */
  expires_in: number
  /** ID token (UUID) */
  id_token: string
  /** Tipo do token (BEARER) */
  token_type: string
  /** Informações do usuário completas */
  user: ContextualUser
  /** Contexto da aplicação com dados específicos */
  context: ContextObject
}

/**
 * Request para login contextual
 */
export interface ContextualAuthenticationRequest {
  /** Email do usuário */
  email: string
  /** Senha do usuário */
  password: string
  /** Tipo do contexto da aplicação (WEB_ADMIN, STORE_APP, CUSTOMER_APP, etc.) */
  context?: string
  /** Dados adicionais do contexto em formato JSON string */
  contextData?: string
}

/**
 * Request para login flexível (email ou telefone)
 */
export interface FlexibleLoginRequest {
  /** Identificador (email ou telefone) */
  identifier: string
  /** Senha do usuário */
  password: string
  /** Tipo do contexto da aplicação */
  context?: string
}

/**
 * Request para login social
 */
export interface SocialLoginRequest {
  /** Provedor social (google, facebook, apple) */
  provider: string
  /** Token do provedor */
  token: string
  /** Tipo do contexto da aplicação */
  context?: string
  /** Dados adicionais do usuário */
  additionalData?: string
}

/**
 * Request para registro de usuário
 */
export interface RegisterUserRequest {
  /** Nome do usuário */
  name: string
  /** Email do usuário */
  email: string
  /** Senha do usuário */
  password: string
  /** Role do usuário */
  role?: string
  /** Avatar do usuário */
  avatar?: string
  /** Dados adicionais para lógica de negócio */
  additionalData?: Record<string, any>
}

/**
 * Response para listar contextos suportados
 */
export interface SupportedContextsResponse {
  /** Lista de contextos suportados */
  supportedContexts: string[]
  /** Contexto padrão */
  defaultContext: string
}

/**
 * Response para validação de contexto
 */
export interface ContextValidationResponse {
  /** Contexto validado */
  context: string
  /** Se o contexto é suportado */
  supported: boolean
}

/**
 * Token de acesso contextual que estende o token padrão
 */
export interface ContextualAccessToken extends ArchbaseAccessToken {
  /** Contexto da aplicação */
  context?: ContextObject
}