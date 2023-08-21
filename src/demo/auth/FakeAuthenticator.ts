import { ArchbaseAuthenticator } from '../../components/auth';
import { injectable } from 'inversify'

@injectable()
export class FakeAuthenticator implements ArchbaseAuthenticator {
  getToken(): string | null {
    return "fake_token";
  }
}
