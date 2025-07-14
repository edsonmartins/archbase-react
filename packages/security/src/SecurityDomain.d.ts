export declare enum TipoRecurso {
    VIEW = "VIEW",
    API = "API"
}
export declare class AccessScheduleDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    description: string;
    intervals: AccessIntervalDto[];
    constructor(data: any);
    static newInstance: () => AccessScheduleDto;
}
export declare class AccessIntervalDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    accessSchedule?: AccessScheduleDto;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    constructor(data: any);
    static newInstance: () => AccessIntervalDto;
}
export declare abstract class SecurityDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    name: string;
    description: string;
    actions: ActionDto[];
    constructor(data: any);
}
export declare class ActionDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    name: string;
    description: string;
    resource?: ResourceDto;
    category: string;
    active: boolean;
    actionVersion: string;
    isNewAction: boolean;
    constructor(data: any);
    static newInstance: () => ActionDto;
}
export declare class ProfileDto extends SecurityDto {
    type: string;
    isNewProfile: boolean;
    constructor(data: any);
    static newInstance: () => ProfileDto;
}
export declare class UserGroupDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    group?: GroupDto;
    constructor(data: any);
    static newInstance: (group: GroupDto) => UserGroupDto;
}
export declare class GroupDto extends SecurityDto {
    type: string;
    isNewGroup: boolean;
    constructor(data: any);
    static newInstance: () => GroupDto;
}
export declare class ResourceDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    name: string;
    description: string;
    actions: ActionDto[];
    active: boolean;
    type: TipoRecurso;
    isNewResource: boolean;
    constructor(data: any);
    static newInstance: () => ResourceDto;
}
export declare class UserDto extends SecurityDto {
    userName: string;
    password: string;
    changePasswordOnNextLogin: boolean;
    allowPasswordChange: boolean;
    allowMultipleLogins: boolean;
    passwordNeverExpires: boolean;
    accountDeactivated: boolean;
    accountLocked: boolean;
    unlimitedAccessHours: boolean;
    isAdministrator: boolean;
    accessSchedule?: AccessScheduleDto;
    groups: UserGroupDto[];
    profile?: ProfileDto;
    avatar?: string;
    nickname: string;
    email?: string;
    type: string;
    isNewUser: boolean;
    constructor(data: any);
    static newInstance: () => UserDto;
}
export declare class PermissionDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    security?: SecurityDto;
    action?: ActionDto;
    tenantId: string;
    companyId: string;
    projectId: string;
    constructor(data: any);
    static createDtoFromJson(data: any): SecurityDto;
    static newInstance: () => PermissionDto;
}
export declare class ApiTokenDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    tenantId: string;
    name: string;
    description: string;
    token: string;
    user: UserDto;
    expirationDate: string;
    revoked: boolean;
    activated: boolean;
    isNovoToken: boolean;
    constructor(data: any);
    static newInstance: () => ApiTokenDto;
}
export declare class AccessTokenDto {
    id: string;
    code: string;
    version: number;
    createEntityDate: string;
    updateEntityDate: string;
    createdByUser: string;
    lastModifiedByUser: string;
    token: string;
    tokenType: string;
    revoked: boolean;
    expired: boolean;
    expirationTime: number;
    expirationDate: string;
    user: UserDto;
    isNewAccessToken: boolean;
    constructor(data: any);
    static newInstance: () => AccessTokenDto;
}
export interface GrantPermissionDto {
    securityId: string;
    actionId: string;
    type: string;
}
export interface PermissionWithTypesDto {
    permissionId?: string;
    actionId: string;
    actionDescription: string;
    types?: string[];
}
export interface ResoucePermissionsWithTypeDto {
    resourceId: string;
    resourceDescription: string;
    permissions: PermissionWithTypesDto[];
}
export interface ResouceActionPermissionDto {
    resourceId: string;
    resourceDescription: string;
    permissionId: string;
    actionId: string;
    actionDescription: string;
}
export interface SimpleActionDto {
    actionName: string;
    actionDescription: string;
}
export interface SimpleResourceDto {
    resourceName: string;
    resourceDescription: string;
}
export interface ResourceRegisterDto {
    resource: SimpleResourceDto;
    actions: SimpleActionDto[];
}
export interface ResourcePermissionsDto {
    resourceName: string;
    permissions: string[];
}
//# sourceMappingURL=SecurityDomain.d.ts.map