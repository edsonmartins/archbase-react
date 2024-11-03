import { ResouceActionPermissionDto, ResoucePermissionsWithTypeDto, ResourceRegisterDto, SecurityType, UserDto } from "components/security";
import { ArchbaseRemoteApiService } from "./ArchbaseRemoteApiService";

export interface IUserService extends ArchbaseRemoteApiService<UserDto, string> {
    getUserByEmail(email: string): Promise<UserDto>
}

export interface IResourceService extends ArchbaseRemoteApiService<UserDto, string> {
    getAllPermissionsAvailable(): ResoucePermissionsWithTypeDto[]

    getPermissionsBySecurityId(securityId: string, type: SecurityType): ResoucePermissionsWithTypeDto[]

    createPermission(securityId: string, actionId: string, type: SecurityType): ResouceActionPermissionDto

    deletePermission(permissionId: string)

    registerResource(resourceRegister: ResourceRegisterDto)
}