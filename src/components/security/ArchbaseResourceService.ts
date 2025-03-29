import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "../../components/service";
import { GrantPermissionDto, ResouceActionPermissionDto, ResoucePermissionsWithTypeDto, ResourceDto, ResourcePermissionsDto, ResourceRegisterDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "../../components/core/ioc/ArchbaseIOCTypes";
import { SecurityType } from "./SecurityType";
import {getKeyByEnumValue} from "../../components/core/utils";

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

  public getAllPermissionsAvailable() {
    return this.client.get<ResoucePermissionsWithTypeDto[]>(
      `${this.getEndpoint()}/permissions`,
      this.configureHeaders()
    );
  }

  public getPermissionsBySecurityId(securityId: string, type: SecurityType) {
    return this.client.get<ResoucePermissionsWithTypeDto[]>(
      `${this.getEndpoint()}/permissions/security/${securityId}`,
      this.configureHeaders(),
      false,
      {
        params: {
          type: getKeyByEnumValue(SecurityType, type)
        }
      }
    );
  }

  public createPermission(securityId: string, actionId: string, type: SecurityType) {
    return this.client.post<GrantPermissionDto, ResouceActionPermissionDto>(
      `${this.getEndpoint()}/permissions`,
      {
        securityId,
        actionId,
        type: getKeyByEnumValue(SecurityType, type)
      },
      this.configureHeaders(),
    );
  }

  public deletePermission(permissionId: string) {
    return this.client.delete<void>(
      `${this.getEndpoint()}/permissions/${permissionId}`,
      this.configureHeaders(),
    );
  }

  public registerResource(resourceRegister: ResourceRegisterDto) {
    return this.client.post<ResourceRegisterDto, ResourcePermissionsDto>(
      `${this.getEndpoint()}/register`,
      resourceRegister,
      this.configureHeaders(),
    );
  }
}

inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseResourceService, 0);
inversify.decorate(inversify.injectable(), ArchbaseResourceService);