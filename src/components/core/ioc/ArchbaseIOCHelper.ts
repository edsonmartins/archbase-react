import { ArchbaseTokenManager } from 'components/auth/ArchbaseTokenManager';
import { Container } from 'inversify'
import { DefaultArchbaseTokenManager } from 'components/auth/DefaultArchbaseTokenManager';
import { ARCHBASE_IOC_API_TYPE } from './ArchbaseIOCTypes';

let instance:any;
const container = new Container()

class ArchbaseIOCHelper {
  constructor() {
    if (instance) {
      throw new Error('New instance cannot be created!!')
    }

    instance = this
  }

  getContainer(): Container {
    return container
  }
  registerDefaultTokenManager(): void {
    container.bind<ArchbaseTokenManager>(ARCHBASE_IOC_API_TYPE.TokenManager).to(DefaultArchbaseTokenManager)
  }
}

const iocHelperInstance = Object.freeze(new ArchbaseIOCHelper())

export default iocHelperInstance
