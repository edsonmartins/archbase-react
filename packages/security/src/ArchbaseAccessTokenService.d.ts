import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { AccessTokenDto } from "./SecurityDomain";
export declare class ArchbaseAccessTokenService extends ArchbaseRemoteApiService<AccessTokenDto, string> implements ArchbaseEntityTransformer<AccessTokenDto> {
    constructor(client: ArchbaseRemoteApiClient);
    protected configureHeaders(): Record<string, string>;
    transform(entity: AccessTokenDto): AccessTokenDto;
    protected getEndpoint(): string;
    getId(entity: AccessTokenDto): string;
    isNewRecord(entity: AccessTokenDto): boolean;
    revoke(token: string): Promise<undefined>;
}
//# sourceMappingURL=ArchbaseAccessTokenService.d.ts.map