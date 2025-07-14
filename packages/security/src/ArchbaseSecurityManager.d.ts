import { ArchbaseResourceService } from './ArchbaseResourceService';
import { SimpleActionDto, SimpleResourceDto } from './SecurityDomain';
export interface ISecurityManager {
    registerAction(actionName: string, actionDescription: string): void;
}
export declare class ArchbaseSecurityManager implements ISecurityManager {
    protected resourceService: ArchbaseResourceService;
    protected resource: SimpleResourceDto;
    protected actions: SimpleActionDto[];
    protected permissions: string[];
    protected alreadyApplied: boolean;
    protected error: string;
    protected isAdmin: boolean;
    constructor(resourceName: string, resourceDescription: string, isAdmin: boolean);
    registerAction(actionName: string, actionDescription: string): void;
    apply(callback?: Function): Promise<void>;
    hasPermission(actionName: string): boolean;
    isError(): boolean;
    getError(): string;
}
//# sourceMappingURL=ArchbaseSecurityManager.d.ts.map