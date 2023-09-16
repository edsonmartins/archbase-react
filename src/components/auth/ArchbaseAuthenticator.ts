import { injectable } from 'inversify'
import { ArchbaseAccessToken } from './ArchbaseAccessToken'

export interface ArchbaseAuthenticator {
  login(username: string, password: string): Promise<ArchbaseAccessToken>
  refreshToken(refresh_token: string): Promise<ArchbaseAccessToken>
}

