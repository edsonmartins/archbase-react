import { inject, injectable } from 'inversify'
import { ActionDto, GroupDto, ProfileDto, ResourceDto, UserDto } from './SecurityDomain'
import { ArchbaseRemoteApiService } from '@components/service'
import type { ArchbaseRemoteApiClient } from '@components/service'
import { ARCHBASE_IOC_API_TYPE } from '../core/ioc'

@injectable()
export class UserRemoteService extends ArchbaseRemoteApiService<UserDto, string> {
  constructor(@inject(ARCHBASE_IOC_API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return {}
  }

  protected transform(entity: UserDto): UserDto {
    return new UserDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/user'
  }

  public getId(entity: UserDto): string {
    return entity.id
  }

  
}
