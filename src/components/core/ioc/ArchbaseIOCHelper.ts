import { ArchbaseTokenManager } from '../../auth';
import { Container } from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from '.';
import { DefaultArchbaseTokenManager } from '../../auth';
import { ArchbaseGroupService, ArchbaseProfileService, ArchbaseResourceService, ArchbaseUserService } from '@components/security';
import { ArchbaseApiTokenService } from '@components/security/ArchbaseApiTokenService';
import { ArchbaseAccessTokenService } from '@components/security/ArchbaseAccessTokenService';
import { IUserService } from '@components/service/types';


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
  registerDefaultTokenManager(): void {
    container.bind<ArchbaseTokenManager>(ARCHBASE_IOC_API_TYPE.TokenManager).to(DefaultArchbaseTokenManager);
  }
  registerDefaultSecurity(): void {
    container.bind<IUserService>(ARCHBASE_IOC_API_TYPE.User).to(ArchbaseUserService);
    container.bind<ArchbaseProfileService>(ARCHBASE_IOC_API_TYPE.Profile).to(ArchbaseProfileService);
    container.bind<ArchbaseGroupService>(ARCHBASE_IOC_API_TYPE.Group).to(ArchbaseGroupService);
    container.bind<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource).to(ArchbaseResourceService);
    container.bind<ArchbaseApiTokenService>(ARCHBASE_IOC_API_TYPE.ApiToken).to(ArchbaseApiTokenService);
    container.bind<ArchbaseAccessTokenService>(ARCHBASE_IOC_API_TYPE.AccessToken).to(ArchbaseAccessTokenService);
  }
  registerDefaultContainers(): void {
    this.registerDefaultTokenManager()
    this.registerDefaultSecurity()
  }
}

export const IOCContainer = Object.freeze(new ArchbaseIOCHelper());
