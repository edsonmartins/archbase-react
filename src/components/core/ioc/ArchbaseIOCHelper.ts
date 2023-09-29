import { ArchbaseTokenManager } from '../../auth/ArchbaseTokenManager';
import { Container } from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from '.';
import { DefaultArchbaseTokenManager } from '../../auth/DefaultArchbaseTokenManager';

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
}

export const IOCContainer = Object.freeze(new ArchbaseIOCHelper());
