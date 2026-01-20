import { ArchbaseRemoteApiService } from "@archbase/data";
import type { ArchbaseEntityTransformer, ArchbaseRemoteApiClient } from "@archbase/data";
import { ProfileDto } from "./SecurityDomain";
export declare class ArchbaseProfileService extends ArchbaseRemoteApiService<ProfileDto, string> implements ArchbaseEntityTransformer<ProfileDto> {
    constructor(client: ArchbaseRemoteApiClient);
    protected configureHeaders(): Record<string, string>;
    transform(entity: ProfileDto): ProfileDto;
    protected getEndpoint(): string;
    getId(entity: ProfileDto): string;
    isNewRecord(entity: ProfileDto): boolean;
}
