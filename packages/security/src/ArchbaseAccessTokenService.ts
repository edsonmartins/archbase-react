import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { AccessTokenDto, ApiTokenDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "@archbase/core";
import { ArchbaseTenantManager } from "./ArchbaseTenantManager";

export class ArchbaseAccessTokenService extends ArchbaseRemoteApiService<AccessTokenDto, string> implements ArchbaseEntityTransformer<AccessTokenDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return ArchbaseTenantManager.getInstance().getHeaders();
  }

  public transform(entity: AccessTokenDto): AccessTokenDto {
    return new AccessTokenDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/accessToken'
  }

  public getId(entity: AccessTokenDto): string {
    return entity.id
  }

  isNewRecord(entity: AccessTokenDto): boolean {
    return entity.isNewAccessToken
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
inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseAccessTokenService, 0);
inversify.decorate(inversify.injectable(), ArchbaseAccessTokenService);
