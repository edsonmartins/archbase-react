import { injectable } from 'inversify'
import { ArchbaseAccessToken } from './ArchbaseAccessToken'
import { ArchbaseUsernameAndPassword } from './ArchbaseUser'

export interface ArchbaseTokenManager {
  saveUsernameAndPassword(username: string, password: string): void
  getUsernameAndPassword(): ArchbaseUsernameAndPassword|null
  saveToken(accessToken?: ArchbaseAccessToken): void
  clearToken(): void
  clearUsernameAndPassword(): void
  getToken(): ArchbaseAccessToken | null
  isTokenExpired(token?: ArchbaseAccessToken): boolean;
}

