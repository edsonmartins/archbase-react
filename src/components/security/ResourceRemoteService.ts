import { inject, injectable } from 'inversify'
import { ActionDto, GroupDto, ProfileDto, ResourceDto, UserDto } from './SecurityDomain'
import { ArchbaseRemoteApiService } from '@components/service'
import type { ArchbaseRemoteApiClient } from '@components/service'
import { ARCHBASE_IOC_API_TYPE } from 'components/core'

@injectable()
export class ResourceRemoteService extends ArchbaseRemoteApiService<ResourceDto, string> {
  constructor(@inject(ARCHBASE_IOC_API_TYPE.ApiClient) client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return {}
  }

  protected transform(entity: ResourceDto): ResourceDto {
    return new ResourceDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/resource'
  }

  public getId(entity: ResourceDto): string {
    return entity.id
  }

  
}
