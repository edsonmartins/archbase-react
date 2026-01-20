/**
 * Exemplo de como implementar e usar os novos métodos opcionais de autenticação contextual
 * Este arquivo serve como documentação e referência para desenvolvedores.
 */

import {
  ArchbaseAuthenticator,
  ArchbaseAccessToken,
  ContextualAuthenticationRequest,
  ContextualAuthenticationResponse,
  FlexibleLoginRequest,
  SocialLoginRequest,
  RegisterUserRequest,
  useArchbaseAuthenticationManager
} from '@archbase/security'

/**
 * Exemplo de implementação de um ArchbaseAuthenticator com métodos contextuais opcionais
 */
export class ExampleContextualAuthenticator implements ArchbaseAuthenticator {
  // Métodos básicos obrigatórios (compatibilidade)
  async login(username: string, password: string): Promise<ArchbaseAccessToken> {
    // Implementação básica existente - retorna token de acesso
    return {
      token_type: 'BEARER',
      scope: 'all',
      expires_in: Date.now() + (24 * 60 * 60 * 1000),
      ext_expires_in: Date.now() + (24 * 60 * 60 * 1000),
      access_token: 'eyJhbGciOiJIUzI1NiJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiJ9...',
      id_token: 'ca22e694-d123-4449-a595-6cdec4339c3f'
    };
  }

  async refreshToken(refresh_token: string): Promise<ArchbaseAccessToken> {
    // Implementação básica existente - retorna token de acesso
    return {
      token_type: 'BEARER',
      scope: 'all',
      expires_in: Date.now() + (24 * 60 * 60 * 1000),
      ext_expires_in: Date.now() + (24 * 60 * 60 * 1000),
      access_token: 'eyJhbGciOiJIUzI1NiJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiJ9...',
      id_token: 'ca22e694-d123-4449-a595-6cdec4339c3f'
    };
  }

  async sendResetPasswordEmail(email: string) {
    // Implementação básica existente - não muda
    throw new Error('Implementar reset password email')
  }

  async resetPassword(email: string, passwordResetToken: string, newPassword: string) {
    // Implementação básica existente - não muda
    throw new Error('Implementar reset password')
  }

  // Métodos opcionais para autenticação avançada (NOTA: Agora devem retornar dados que podem ser desestruturados)
  async loginWithContext(request: ContextualAuthenticationRequest) {
    // Exemplo baseado na estrutura real da resposta - retorna objeto que será desestruturado
    return {
      // Campos do token (serão extraídos com spread operator)
      access_token: "eyJhbGciOiJIUzI1NiJ9...",
      refresh_token: "eyJhbGciOiJIUzI1NiJ9...",
      expires_in: Date.now() + (24 * 60 * 60 * 1000), // 24 horas a partir de agora
      id_token: "ca22e694-d123-4449-a595-6cdec4339c3f",
      token_type: "BEARER",
      
      // Campos especiais (serão extraídos separadamente)
      user: {
        id: { identifier: "d1167e22-04b1-411f-a4bc-eec5ae5389ac" },
        name: "João Silva",
        description: "Usuário WEB_ADMIN - João Silva",
        userName: "joao.silva@exemplo.com",
        email: "joao.silva@exemplo.com",
        createEntityDate: new Date().toISOString(),
        version: 1,
        changePasswordOnNextLogin: false,
        allowPasswordChange: true,
        allowMultipleLogins: false,
        passwordNeverExpires: true,
        accountDeactivated: false,
        accountLocked: false,
        unlimitedAccessHours: false,
        isAdministrator: true,
        groups: [],
        profile: null,
        avatar: null,
        nickname: null
      },
      context: {
        type: request.context || "WEB_ADMIN",
        adminId: "04a161be-d5ed-4be2-8a3b-fe96bc2a8d2f",
        name: "João Silva",
        email: "joao.silva@exemplo.com",
        profilePicture: null,
        accessLevel: "PLATFORM_ADMIN",
        availableModules: [
          "DASHBOARD",
          "STORES", 
          "USERS",
          "ORDERS",
          "DRIVERS",
          "ANALYTICS",
          "REPORTS",
          "SETTINGS"
        ],
        status: "ACTIVE"
      }
    }
  }

  async loginFlexible(request: FlexibleLoginRequest) {
    // Implementação similar, mas pode resolverEmail/telefone para email
    const contextualRequest: ContextualAuthenticationRequest = {
      email: this.resolveEmailFromIdentifier(request.identifier),
      password: request.password,
      context: request.context
    }
    
    return this.loginWithContext(contextualRequest)
  }

  async loginSocial(request: SocialLoginRequest): Promise<ContextualAuthenticationResponse> {
    // Implementação que valida token do provedor social
    // e retorna objeto que pode ser desestruturado
    return {
      access_token: 'eyJhbGciOiJIUzI1NiJ9...',
      refresh_token: 'eyJhbGciOiJIUzI1NiJ9...',
      expires_in: Date.now() + (24 * 60 * 60 * 1000),
      id_token: `${request.provider}-token-id`,
      token_type: 'BEARER',
      user: {
        id: { identifier: 'd1167e22-04b1-411f-a4bc-eec5ae5389ac' },
        name: 'Social Login User',
        description: `Usuário ${request.provider} - Social Login User`,
        userName: `${request.provider}-user@exemplo.com`,
        email: `${request.provider}-user@exemplo.com`,
        createEntityDate: new Date().toISOString(),
        version: 1,
        changePasswordOnNextLogin: false,
        allowPasswordChange: true,
        allowMultipleLogins: false,
        passwordNeverExpires: true,
        accountDeactivated: false,
        accountLocked: false,
        unlimitedAccessHours: false,
        isAdministrator: false,
        groups: [],
        profile: null,
        avatar: null,
        nickname: null
      },
      context: {
        type: request.context || 'CUSTOMER_APP',
        adminId: '',
        name: 'Social Login User',
        email: `${request.provider}-user@exemplo.com`,
        profilePicture: null,
        accessLevel: 'STANDARD',
        availableModules: ['DASHBOARD', 'SETTINGS'],
        status: 'ACTIVE'
      }
    };
  }

  async register(request: RegisterUserRequest) {
    // Implementação de registro com dados de negócio
    return {
      email: request.email,
      businessId: "generated-business-id",
      message: "Usuário registrado com sucesso"
    }
  }

  async getSupportedContexts() {
    return {
      supportedContexts: ["WEB_ADMIN", "STORE_APP", "CUSTOMER_APP", "DRIVER_APP"],
      defaultContext: "WEB_ADMIN"
    }
  }

  async validateContext(context: string) {
    const supported = ["WEB_ADMIN", "STORE_APP", "CUSTOMER_APP", "DRIVER_APP"]
    return {
      context,
      supported: supported.includes(context)
    }
  }

  private resolveEmailFromIdentifier(identifier: string): string {
    // Se já é email, retorna como está
    if (identifier.includes('@')) {
      return identifier
    }
    
    // Se é telefone, busca email associado (implementação específica)
    // Por enquanto apenas exemplo
    return identifier + '@exemplo.com'
  }
}

/**
 * Exemplo de uso do hook com recursos contextuais
 */
export function ExampleUsageComponent() {
  const {
    // Métodos básicos (sempre disponíveis)
    login,
    logout,
    isAuthenticated,
    username,
    
    // Métodos opcionais (podem ser undefined)
    loginWithContext,
    loginFlexible,
    loginSocial,
    register,
    
    // Informações de contexto
    context,
    
    // Detecção de capacidades
    capabilities
  } = useArchbaseAuthenticationManager({})

  const handleBasicLogin = async () => {
    // Login básico - sempre funciona
    login('usuario@exemplo.com', 'senha123', true)
  }

  const handleContextualLogin = async () => {
    // Verifica se login contextual está disponível
    if (capabilities.hasContextualLogin && loginWithContext) {
      try {
        await loginWithContext({
          email: 'admin@exemplo.com',
          password: 'senha123',
          context: 'WEB_ADMIN',
          contextData: JSON.stringify({ storeId: '123' })
        })
        
        // Após login, context conterá o objeto completo:
        console.log('Contexto:', context?.type) // "WEB_ADMIN"
        console.log('Módulos disponíveis:', context?.availableModules)
        console.log('Nível de acesso:', context?.accessLevel)
      } catch (error) {
        console.error('Erro no login contextual:', error)
      }
    } else {
      console.log('Login contextual não suportado nesta implementação')
    }
  }

  const handleFlexibleLogin = async () => {
    // Login flexível com telefone
    if (capabilities.hasFlexibleLogin && loginFlexible) {
      try {
        await loginFlexible({
          identifier: '11999999999', // telefone
          password: 'senha123',
          context: 'CUSTOMER_APP'
        })
      } catch (error) {
        console.error('Erro no login flexível:', error)
      }
    }
  }

  const handleSocialLogin = async () => {
    // Login social
    if (capabilities.hasSocialLogin && loginSocial) {
      try {
        await loginSocial({
          provider: 'google',
          token: 'google-oauth-token',
          context: 'CUSTOMER_APP'
        })
      } catch (error) {
        console.error('Erro no login social:', error)
      }
    }
  }

  const handleRegister = async () => {
    // Registro com dados adicionais
    if (capabilities.hasRegistration && register) {
      try {
        const result = await register({
          name: 'Novo Usuário',
          email: 'novo@exemplo.com',
          password: 'senha123',
          role: 'USER',
          additionalData: {
            phone: '+5511999999999',
            storeId: '123'
          }
        })
        
        console.log('Usuário registrado:', result)
      } catch (error) {
        console.error('Erro no registro:', error)
      }
    }
  }

  return null // Este é apenas um exemplo, não um componente real
}

/**
 * Exemplo de como verificar capacidades antes de usar
 */
export function CapabilitiesExample() {
  const { capabilities } = useArchbaseAuthenticationManager({})

  console.log('Capacidades disponíveis:')
  console.log('- Login contextual:', capabilities.hasContextualLogin)
  console.log('- Login flexível:', capabilities.hasFlexibleLogin)
  console.log('- Login social:', capabilities.hasSocialLogin)
  console.log('- Registro:', capabilities.hasRegistration)
  console.log('- Suporte a contexto:', capabilities.hasContextSupport)

  return null
}