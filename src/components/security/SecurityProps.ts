import { ArchbaseSecurityManager } from "./ArchbaseSecurityManager";

export interface SecurityProps {
    securityManager: ArchbaseSecurityManager;
    actionName: string;
    actionDescription: string;
}