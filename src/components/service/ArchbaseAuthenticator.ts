import { injectable } from 'inversify'

export interface ArchbaseAuthenticator {
  getToken(): string | null
}

@injectable()
export class ArchbaseAuthenticatorImpl implements ArchbaseAuthenticator {
  getToken(): string | null {
    const token = localStorage.getItem('ROCP_token')
    return token
  }
}
