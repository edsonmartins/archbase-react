import { ArchbaseRemoteApiService } from "@archbase/data";
import type { ArchbaseEntityTransformer, ArchbaseRemoteApiClient} from "@archbase/data";
import { ProfileDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "@archbase/core";
import { ArchbaseTenantManager } from "./ArchbaseTenantManager";

export class ArchbaseProfileService extends ArchbaseRemoteApiService<ProfileDto, string> implements ArchbaseEntityTransformer<ProfileDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }
  protected configureHeaders(): Record<string, string> {
    return ArchbaseTenantManager.getInstance().getHeaders();
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
