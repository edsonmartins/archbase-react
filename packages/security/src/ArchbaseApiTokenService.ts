import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { ApiTokenDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "@archbase/core";
import { ArchbaseTenantManager } from "./ArchbaseTenantManager";

export class ArchbaseApiTokenService extends ArchbaseRemoteApiService<ApiTokenDto, string> implements ArchbaseEntityTransformer<ApiTokenDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return ArchbaseTenantManager.getInstance().getHeaders();
  }

  public transform(entity: ApiTokenDto): ApiTokenDto {
    return new ApiTokenDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/apiToken'
  }

  public getId(entity: ApiTokenDto): string {
    return entity.id
  }

  isNewRecord(entity: ApiTokenDto): boolean {
    return entity.isNovoToken
  }

  public async create(email: string, expirationDate: string, name: string, description: string): Promise<ApiTokenDto> {
    const response = await this.client.post<undefined,ApiTokenDto>(
      `${this.getEndpoint()}/create?email=${email}&expirationDate=${expirationDate}&name=${name}&description=${description}`,
      undefined,
      this.configureHeaders()
    );
    return this.transform(response);
  }

  public async revoke(token: string): Promise<undefined> {
    const response = await this.client.post<undefined,undefined>(
      `${this.getEndpoint()}/revoke?token=${token}`,
      undefined,
      this.configureHeaders()
    );
    return
  }
}
inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseApiTokenService, 0);
inversify.decorate(inversify.injectable(), ArchbaseApiTokenService);
