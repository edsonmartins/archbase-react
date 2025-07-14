import { Container } from 'inversify';
declare class ArchbaseIOCHelper {
    constructor();
    getContainer(): Container;
    registerService<T>(serviceIdentifier: symbol | string, implementation: new (...args: any[]) => T): void;
    getService<T>(serviceIdentifier: symbol | string): T;
    hasService(serviceIdentifier: symbol | string): boolean;
    /**
     * Registra o token manager padrão do Archbase
     * Note: Deve ser chamado APÓS importar e registrar o DefaultArchbaseTokenManager
     */
    registerDefaultTokenManager(): void;
    /**
     * Registra os serviços de segurança padrão do Archbase
     * Note: Deve ser chamado APÓS importar e registrar os serviços do @archbase/security
     */
    registerDefaultSecurity(): void;
    /**
     * Registra os containers padrão do Archbase (TokenManager + Security)
     * Note: Deve ser usado junto com registerTokenManager e registerSecurityServices
     */
    registerDefaultContainers(): void;
    /**
     * Registra o token manager padrão com a classe fornecida
     */
    registerTokenManager<T>(tokenManagerClass: new (...args: any[]) => T): void;
    /**
     * Registra os serviços de segurança com as classes fornecidas
     */
    registerSecurityServices<TUser extends new (...args: any[]) => any, TProfile extends new (...args: any[]) => any, TGroup extends new (...args: any[]) => any, TResource extends new (...args: any[]) => any, TApiToken extends new (...args: any[]) => any, TAccessToken extends new (...args: any[]) => any>(services: {
        userService?: TUser;
        profileService?: TProfile;
        groupService?: TGroup;
        resourceService?: TResource;
        apiTokenService?: TApiToken;
        accessTokenService?: TAccessToken;
    }): void;
    /**
     * Remove um serviço registrado
     */
    unbindService(serviceIdentifier: symbol | string): void;
    /**
     * Remove todos os serviços registrados
     */
    unbindAll(): void;
    /**
     * Registra uma instância específica ao invés de uma classe
     */
    registerInstance<T>(serviceIdentifier: symbol | string, instance: T): void;
    /**
     * Registra um factory para criação dinâmica
     */
    registerFactory<T>(serviceIdentifier: symbol | string, factory: () => T): void;
}
export declare const IOCContainer: Readonly<ArchbaseIOCHelper>;
export {};
//# sourceMappingURL=ArchbaseIOCHelper.d.ts.map