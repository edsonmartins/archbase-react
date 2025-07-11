import { Container } from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from '.';

let instance: any;
const container = new Container();

class ArchbaseIOCHelper {
  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!');
    }

    instance = this;
  }

  getContainer(): Container {
    return container;
  }
  
  registerService<T>(serviceIdentifier: symbol | string, implementation: new (...args: any[]) => T): void {
    container.bind<T>(serviceIdentifier).to(implementation);
  }
  
  getService<T>(serviceIdentifier: symbol | string): T {
    return container.get<T>(serviceIdentifier);
  }
  
  hasService(serviceIdentifier: symbol | string): boolean {
    return container.isBound(serviceIdentifier);
  }

  /**
   * Registra o token manager padrão do Archbase
   * Note: Deve ser chamado APÓS importar e registrar o DefaultArchbaseTokenManager
   */
  registerDefaultTokenManager(): void {
    console.warn('ArchbaseIOCHelper.registerDefaultTokenManager(): Este método deve ser chamado manualmente após importar DefaultArchbaseTokenManager do @archbase/security');
  }

  /**
   * Registra os serviços de segurança padrão do Archbase
   * Note: Deve ser chamado APÓS importar e registrar os serviços do @archbase/security
   */
  registerDefaultSecurity(): void {
    console.warn('ArchbaseIOCHelper.registerDefaultSecurity(): Este método deve ser chamado manualmente após importar os serviços do @archbase/security');
  }

  /**
   * Registra os containers padrão do Archbase (TokenManager + Security)
   * Note: Deve ser usado junto com registerTokenManager e registerSecurityServices
   */
  registerDefaultContainers(): void {
    this.registerDefaultTokenManager();
    this.registerDefaultSecurity();
  }

  /**
   * Registra o token manager padrão com a classe fornecida
   */
  registerTokenManager<T>(tokenManagerClass: new (...args: any[]) => T): void {
    if (!container.isBound(ARCHBASE_IOC_API_TYPE.TokenManager)) {
      container.bind(ARCHBASE_IOC_API_TYPE.TokenManager).to(tokenManagerClass as any);
    }
  }

  /**
   * Registra os serviços de segurança com as classes fornecidas
   */
  registerSecurityServices<
    TUser extends new (...args: any[]) => any,
    TProfile extends new (...args: any[]) => any,
    TGroup extends new (...args: any[]) => any,
    TResource extends new (...args: any[]) => any,
    TApiToken extends new (...args: any[]) => any,
    TAccessToken extends new (...args: any[]) => any
  >(services: {
    userService?: TUser;
    profileService?: TProfile;
    groupService?: TGroup;
    resourceService?: TResource;
    apiTokenService?: TApiToken;
    accessTokenService?: TAccessToken;
  }): void {
    if (services.userService && !container.isBound(ARCHBASE_IOC_API_TYPE.User)) {
      container.bind(ARCHBASE_IOC_API_TYPE.User).to(services.userService as any);
    }
    if (services.profileService && !container.isBound(ARCHBASE_IOC_API_TYPE.Profile)) {
      container.bind(ARCHBASE_IOC_API_TYPE.Profile).to(services.profileService as any);
    }
    if (services.groupService && !container.isBound(ARCHBASE_IOC_API_TYPE.Group)) {
      container.bind(ARCHBASE_IOC_API_TYPE.Group).to(services.groupService as any);
    }
    if (services.resourceService && !container.isBound(ARCHBASE_IOC_API_TYPE.Resource)) {
      container.bind(ARCHBASE_IOC_API_TYPE.Resource).to(services.resourceService as any);
    }
    if (services.apiTokenService && !container.isBound(ARCHBASE_IOC_API_TYPE.ApiToken)) {
      container.bind(ARCHBASE_IOC_API_TYPE.ApiToken).to(services.apiTokenService as any);
    }
    if (services.accessTokenService && !container.isBound(ARCHBASE_IOC_API_TYPE.AccessToken)) {
      container.bind(ARCHBASE_IOC_API_TYPE.AccessToken).to(services.accessTokenService as any);
    }
  }

  /**
   * Remove um serviço registrado
   */
  unbindService(serviceIdentifier: symbol | string): void {
    if (container.isBound(serviceIdentifier)) {
      container.unbind(serviceIdentifier);
    }
  }

  /**
   * Remove todos os serviços registrados
   */
  unbindAll(): void {
    container.unbindAll();
  }

  /**
   * Registra uma instância específica ao invés de uma classe
   */
  registerInstance<T>(serviceIdentifier: symbol | string, instance: T): void {
    container.bind<T>(serviceIdentifier).toConstantValue(instance);
  }

  /**
   * Registra um factory para criação dinâmica
   */
  registerFactory<T>(serviceIdentifier: symbol | string, factory: () => T): void {
    container.bind<T>(serviceIdentifier).toFactory(() => factory);
  }
}

export const IOCContainer = Object.freeze(new ArchbaseIOCHelper());
