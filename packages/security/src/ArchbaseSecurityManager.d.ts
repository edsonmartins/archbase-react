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
    /**
     * Retorna todas as permissões atuais
     */
    getPermissions(): string[];
    /**
     * Retorna o status de carregamento
     */
    isLoading(): boolean;
    /**
     * Verifica múltiplas permissões
     */
    hasAnyPermission(permissions: string[]): boolean;
    /**
     * Verifica se tem todas as permissões
     */
    hasAllPermissions(permissions: string[]): boolean;
    /**
     * Retorna informações detalhadas sobre uma permissão
     */
    getPermissionInfo(actionName: string): {
        hasPermission: boolean;
        isAdmin: boolean;
        reason: string;
    };
    /**
     * Registra múltiplas ações de uma vez
     */
    registerActions(actions: Array<{
        actionName: string;
        actionDescription: string;
    }>): void;
    /**
     * Retorna todas as ações registradas
     */
    getRegisteredActions(): Array<{
        actionName: string;
        actionDescription: string;
    }>;
}
