import { ArchbaseRemoteApiService } from "@components/service";
import type { ArchbaseEntityTransformer, ArchbaseRemoteApiClient} from "@components/service";
import { ProfileDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "../../components/core/ioc/ArchbaseIOCTypes";

export class ArchbaseProfileService extends ArchbaseRemoteApiService<ProfileDto, string> implements ArchbaseEntityTransformer<ProfileDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }
  protected configureHeaders(): Record<string, string> {
    return {}
  }

  public transform(entity: ProfileDto): ProfileDto {
    return new ProfileDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/userProfile'
  }

  public getId(entity: ProfileDto): string {
    return entity.id
  }

  isNewRecord(entity: ProfileDto): boolean {
    return entity.isNewProfile
  }

}

inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseProfileService, 0);
inversify.decorate(inversify.injectable(), ArchbaseProfileService);