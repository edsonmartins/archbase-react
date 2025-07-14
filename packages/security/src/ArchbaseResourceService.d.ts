import { ArchbaseEntityTransformer, ArchbaseRemoteApiClient, ArchbaseRemoteApiService } from "@archbase/data";
import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto, ResourceDto, ResourcePermissionsDto, ResourceRegisterDto } from "./SecurityDomain";
import { SecurityType } from "./SecurityType";
export declare class ArchbaseResourceService extends ArchbaseRemoteApiService<ResourceDto, string> implements ArchbaseEntityTransformer<ResourceDto> {
    constructor(client: ArchbaseRemoteApiClient);
    protected configureHeaders(): Record<string, string>;
    transform(entity: ResourceDto): ResourceDto;
    protected getEndpoint(): string;
    getId(entity: ResourceDto): string;
    isNewRecord(entity: ResourceDto): boolean;
    getAllPermissionsAvailable(): Promise<ResoucePermissionsWithTypeDto[]>;
    getPermissionsBySecurityId(securityId: string, type: SecurityType): Promise<ResoucePermissionsWithTypeDto[]>;
    createPermission(securityId: string, actionId: string, type: SecurityType): Promise<ResouceActionPermissionDto>;
    deletePermission(permissionId: string): Promise<void>;
    registerResource(resourceRegister: ResourceRegisterDto): Promise<ResourcePermissionsDto>;
}
//# sourceMappingURL=ArchbaseResourceService.d.ts.map