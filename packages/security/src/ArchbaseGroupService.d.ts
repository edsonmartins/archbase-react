import { ArchbaseRemoteApiService } from "@archbase/data";
import type { ArchbaseEntityTransformer, ArchbaseRemoteApiClient } from "@archbase/data";
import { GroupDto } from "./SecurityDomain";
export declare class ArchbaseGroupService extends ArchbaseRemoteApiService<GroupDto, string> implements ArchbaseEntityTransformer<GroupDto> {
    constructor(client: ArchbaseRemoteApiClient);
    protected configureHeaders(): Record<string, string>;
    transform(entity: GroupDto): GroupDto;
    protected getEndpoint(): string;
    getId(entity: GroupDto): string;
    isNewRecord(entity: GroupDto): boolean;
}
//# sourceMappingURL=ArchbaseGroupService.d.ts.map