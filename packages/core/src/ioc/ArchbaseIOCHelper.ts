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
}

export const IOCContainer = Object.freeze(new ArchbaseIOCHelper());
