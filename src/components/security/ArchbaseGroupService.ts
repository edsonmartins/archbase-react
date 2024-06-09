import { ArchbaseRemoteApiService } from "@components/service";
import type { ArchbaseEntityTransformer, ArchbaseRemoteApiClient} from "@components/service";
import * as inversify from 'inversify';
import { GroupDto } from "./SecurityDomain";
import { ARCHBASE_IOC_API_TYPE } from "components/core";

export class ArchbaseGroupService extends ArchbaseRemoteApiService<GroupDto, string> implements ArchbaseEntityTransformer<GroupDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return {}
  }

  public transform(entity: GroupDto): GroupDto {
    return new GroupDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/group'
  }

  public getId(entity: GroupDto): string {
    return entity.id
  }

}

inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseGroupService, 0);
inversify.decorate(inversify.injectable(), ArchbaseGroupService);