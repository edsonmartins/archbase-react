import { ArchbaseAuthenticator } from '@components/auth';
import { ArchbaseAccessToken } from 'components/auth/ArchbaseAccessToken';
import { injectable } from 'inversify';

@injectable()
export class FakeAuthenticator implements ArchbaseAuthenticator {
  
  login(username: string, password: string): Promise<ArchbaseAccessToken> {
    throw new Error('Method not implemented.');
  }
  refreshToken(refresh_token: string): Promise<ArchbaseAccessToken> {
    throw new Error('Method not implemented.');
  }
  getToken(): string | null {
    return 'fake_token';
  }
}
