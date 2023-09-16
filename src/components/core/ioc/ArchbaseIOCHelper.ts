import { ArchbaseTokenManager } from '@/components/auth/ArchbaseTokenManager';
import { Container } from 'inversify'
import { API_TYPE } from '.';
import { DefaultArchbaseTokenManager } from '@/components/auth/DefaultArchbaseTokenManager';

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
    container.bind<ArchbaseTokenManager>(API_TYPE.TokenManager).to(DefaultArchbaseTokenManager)
  }
}

const iocHelperInstance = Object.freeze(new ArchbaseIOCHelper())

export default iocHelperInstance
