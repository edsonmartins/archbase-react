import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { ApiTokenDto } from "./SecurityDomain";
export declare class ArchbaseApiTokenService extends ArchbaseRemoteApiService<ApiTokenDto, string> implements ArchbaseEntityTransformer<ApiTokenDto> {
    constructor(client: ArchbaseRemoteApiClient);
    protected configureHeaders(): Record<string, string>;
    transform(entity: ApiTokenDto): ApiTokenDto;
    protected getEndpoint(): string;
    getId(entity: ApiTokenDto): string;
    isNewRecord(entity: ApiTokenDto): boolean;
    create(email: string, expirationDate: string, name: string, description: string): Promise<ApiTokenDto>;
    revoke(token: string): Promise<undefined>;
}
//# sourceMappingURL=ArchbaseApiTokenService.d.ts.map