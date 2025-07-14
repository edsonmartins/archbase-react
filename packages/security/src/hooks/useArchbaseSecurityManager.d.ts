import { ArchbaseSecurityManager } from '../ArchbaseSecurityManager';
export declare const ARCHBASE_SECURITY_MANAGER_STORE = "archbaseSecurityManagerStore";
export type UseArchbaseSecurityManagerProps = {
    resourceName: string;
    resourceDescription: string;
    enableSecurity?: boolean;
};
export type UseArchbaseSecurityManagerReturnType = {
    securityManager: ArchbaseSecurityManager;
};
export declare const useArchbaseSecurityManager: ({ resourceName, resourceDescription, enableSecurity }: UseArchbaseSecurityManagerProps) => UseArchbaseSecurityManagerReturnType;
//# sourceMappingURL=useArchbaseSecurityManager.d.ts.map