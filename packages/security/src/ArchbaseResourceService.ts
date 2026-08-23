import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { GrantPermissionDto, LoggedUserPermissionsDto, ResouceActionPermissionDto, ResoucePermissionsWithTypeDto, ResourceDto, ResourcePermissionsDto, ResourceRegisterDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "@archbase/core";
import { SecurityType } from "./SecurityType";
import {getKeyByEnumValue} from "@archbase/core";
import { ArchbaseTenantManager } from "./ArchbaseTenantManager";

export class ArchbaseResourceService extends ArchbaseRemoteApiService<ResourceDto, string> implements ArchbaseEntityTransformer<ResourceDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return ArchbaseTenantManager.getInstance().getHeaders();
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

  /**
   * Tudo que o usuário logado alcança, em uma requisição.
   *
   * <p>Existe porque a pergunta "o que esta pessoa pode?" não tinha resposta barata: o caminho por
   * recurso (`/permissions/{resourceName}`) obriga uma requisição por recurso, e quem monta um menu
   * precisa da resposta para dezenas deles. Sem isto, o produto desiste de perguntar e mostra tudo
   * para todo mundo.
   *
   * <p><b>Devolve `null` quando o backend não tem o endpoint</b> (archbase-security anterior a
   * 3.2.3), em vez de estourar. Quem chama distingue "não pode nada" de "não deu para saber" — os
   * dois viram mapa vazio se a diferença for engolida, e é assim que uma tela passa a esconder o
   * que deveria mostrar.
   */
  public async findLoggedUserPermissions(): Promise<LoggedUserPermissionsDto | null> {
    try {
      return await this.client.get<LoggedUserPermissionsDto>(
        `${this.getEndpoint()}/my-permissions`,
        this.configureHeaders(),
      );
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;
      if (status === 404 || status === 405) {
        return null;
      }
      throw error;
    }
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
