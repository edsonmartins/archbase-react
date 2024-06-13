import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "components/service";
import { ResourceDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "@components/core";
import { ResourcePermissionsDto } from "./ArchbaseResourcePermissions";

export class ArchbaseResourceService extends ArchbaseRemoteApiService<ResourceDto, string> implements ArchbaseEntityTransformer<ResourceDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return {}
  }

  public transform(entity: ResourceDto): ResourceDto {
    return new ResourceDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/resource'
  }

  public getId(entity: ResourceDto): string {
    return entity.id
  }

  isNewRecord(entity: ResourceDto): boolean {
    return entity.isNewResource
  }

  public getPermissions(resourceName: string) {
    return this.client.get<ResourcePermissionsDto>(
      `${this.getEndpoint()}/permissions/${resourceName}`,
      this.configureHeaders()
    );
  }

}

inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseResourceService, 0);
inversify.decorate(inversify.injectable(), ArchbaseResourceService);