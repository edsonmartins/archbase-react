// src/services/mocks/MockArchbaseRemoteApiService.ts
import { injectable } from 'inversify';
import { ArchbaseRemoteApiService } from '@components/service';
import { UserDto } from '@components/security';
import { IUserService } from '@components/service/types';

@injectable()
export class FakeUserService extends ArchbaseRemoteApiService<UserDto, string> implements IUserService {
  constructor() {
    super(null as any);
  }

  protected configureHeaders(): Record<string, string> {
    return {};
  }

  public transform(entity: UserDto): UserDto {
    return new UserDto(entity);
  }

  protected getEndpoint(): string {
    return '/mock-api/v1/user';
  }

  public getId(entity: UserDto): string {
    return entity.id;
  }

  isNewRecord(entity: UserDto): boolean {
    return entity.isNewUser;
  }

  public async getUserByEmail(email: string): Promise<UserDto> {
    // Retorna um usuário mockado
    return Promise.resolve(new UserDto({ id: '1', email, name: 'Mock User', isNewUser: false }));
  }
}
