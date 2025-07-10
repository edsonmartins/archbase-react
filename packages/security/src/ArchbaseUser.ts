import { ArchbaseUsernameAndPassword as IArchbaseUsernameAndPassword, ArchbaseUser as IArchbaseUser } from '@archbase/core'

export class ArchbaseUser implements IArchbaseUser {
  id: string
  displayName: string
  email: string
  photo: string
  isAdmin: boolean

  constructor(data: any) {
    this.id = data.id
    this.displayName = data.displayName
    this.email = data.email
    this.photo = data.photo
    this.isAdmin = data.isAdmin
  }

  static newInstance(
    ): ArchbaseUser {
      return new ArchbaseUser({})
    }
}

// Create a class implementation that implements the interface from core
export class ArchbaseUsernameAndPasswordImpl implements IArchbaseUsernameAndPassword {
  username: string
  password: string
  remember: boolean

  constructor(data: any) {
    this.username = data.username
    this.password = data.password
    this.remember = data.remember
  }

  static newInstance(): ArchbaseUsernameAndPasswordImpl {
    return new ArchbaseUsernameAndPasswordImpl({})
  }
}

// Export the concrete class for backward compatibility
export { ArchbaseUsernameAndPasswordImpl as ArchbaseUsernameAndPassword }
// Re-export the interface type
export type { ArchbaseUsernameAndPassword as IArchbaseUsernameAndPassword } from '@archbase/core'
