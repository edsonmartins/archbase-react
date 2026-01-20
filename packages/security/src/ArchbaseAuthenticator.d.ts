import { ArchbaseAccessToken } from './ArchbaseAccessToken';
import { ContextualAuthenticationResponse, ContextualAuthenticationRequest, FlexibleLoginRequest, SocialLoginRequest, RegisterUserRequest, SupportedContextsResponse, ContextValidationResponse } from './types/ContextualAuthentication';
export interface ArchbaseAuthenticator {
    login(username: string, password: string): Promise<ArchbaseAccessToken>;
    refreshToken(refresh_token: string): Promise<ArchbaseAccessToken>;
    sendResetPasswordEmail(email: string): Promise<void>;
    resetPassword(email: string, passwordResetToken: string, newPassword: string): Promise<void>;
    /** Login contextual com suporte a enrichers específicos da aplicação */
    loginWithContext?(request: ContextualAuthenticationRequest): Promise<ContextualAuthenticationResponse>;
    /** Login flexível com email ou telefone */
    loginFlexible?(request: FlexibleLoginRequest): Promise<ContextualAuthenticationResponse>;
    /** Login via provedores sociais (Google, Facebook, Apple) */
    loginSocial?(request: SocialLoginRequest): Promise<ContextualAuthenticationResponse>;
    /** Registro de usuário com dados adicionais de negócio */
    register?(request: RegisterUserRequest): Promise<{
        email: string;
        businessId?: string;
        message: string;
    }>;
    /** Lista contextos suportados pela implementação */
    getSupportedContexts?(): Promise<SupportedContextsResponse>;
    /** Valida se um contexto específico é suportado */
    validateContext?(context: string): Promise<ContextValidationResponse>;
}
