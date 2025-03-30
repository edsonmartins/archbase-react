import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "../../components/service";
import { UserDto } from "./SecurityDomain";
import * as inversify from 'inversify';
import { ARCHBASE_IOC_API_TYPE } from "../../components/core/ioc/ArchbaseIOCTypes";

export class ArchbaseUserService extends ArchbaseRemoteApiService<UserDto, string> implements ArchbaseEntityTransformer<UserDto> {
  constructor(client: ArchbaseRemoteApiClient) {
    super(client)
  }

  protected configureHeaders(): Record<string, string> {
    return {}
  }

  public transform(entity: UserDto): UserDto {
    return new UserDto(entity)
  }

  protected getEndpoint(): string {
    return '/api/v1/user'
  }

  public getId(entity: UserDto): string {
    return entity.id
  }

  isNewRecord(entity: UserDto): boolean {
    return entity.isNewUser
  }

  public async getUserByEmail(email: string): Promise<UserDto> {
    const response = await this.client.get<UserDto>(
      `${this.getEndpoint()}/byEmail/${email}`,
      this.configureHeaders()
    );
    return this.transform(response);
  }
}
inversify.decorate(inversify.inject(ARCHBASE_IOC_API_TYPE.ApiClient), ArchbaseUserService, 0);
inversify.decorate(inversify.injectable(), ArchbaseUserService);