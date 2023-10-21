export class ArchbaseUser {
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


export class ArchbaseUsernameAndPassword {
  username: string

  password: string

  remember: boolean

  constructor(data: any) {
    this.username = data.username
    this.password = data.password
    this.remember = data.remember
  }

  static newInstance(
    ): ArchbaseUsernameAndPassword {
      return new ArchbaseUsernameAndPassword({})
    }
}
