import { Container } from 'inversify'

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
}

const iocHelperInstance = Object.freeze(new ArchbaseIOCHelper())

export default iocHelperInstance
