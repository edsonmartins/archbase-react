import { ARCHBASE_IOC_API_TYPE, IOCContainer, processErrorMessage } from '@archbase/core';
import { ArchbaseResourceService } from './ArchbaseResourceService';
import { ResourcePermissionsDto, SimpleActionDto, SimpleResourceDto } from './SecurityDomain';


export interface ISecurityManager {
  registerAction(actionName: string, actionDescription: string): void
}

export class ArchbaseSecurityManager implements ISecurityManager {
  protected resourceService: ArchbaseResourceService
  protected resource: SimpleResourceDto
  protected actions: SimpleActionDto[]
  protected permissions: string[]
  protected alreadyApplied: boolean
  protected error: string
  protected isAdmin: boolean

  constructor(resourceName: string, resourceDescription: string, isAdmin: boolean) {
    this.resourceService = IOCContainer.getContainer().get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
    this.resource = { resourceName, resourceDescription }
    this.alreadyApplied = false
    this.actions = []
    this.permissions = []
    this.error = ""
    this.isAdmin = isAdmin
  }

  public registerAction(actionName: string, actionDescription: string) {
    if (!this.alreadyApplied && this.actions.findIndex(action => action.actionName === actionName) < 0) {
      this.actions.push({ actionName, actionDescription })
    }
  }

  public async apply(callback?: Function) {
    if (!this.alreadyApplied) {
      this.alreadyApplied = true;
      this.resourceService.registerResource({ resource: this.resource, actions: this.actions })
        .then((resourcePermissions) => {
          this.permissions = resourcePermissions.permissions;
          this.error = "";
          if (callback) {
            callback();
          }
        })
        .catch((error) => {
          this.alreadyApplied = false;
          this.error = processErrorMessage(error)
        })
    }
  }

  public hasPermission(actionName: string) {
    return this.permissions.includes(actionName) || this.isAdmin
  }

  public isError() {
    return !!this.error
  }

  public getError() {
    return this.error
  }

  /**
   * Retorna todas as permissões atuais
   */
  public getPermissions(): string[] {
    return [...this.permissions];
  }

  /**
   * Retorna o status de carregamento
   */
  public isLoading(): boolean {
    return !this.alreadyApplied;
  }

  /**
   * Verifica múltiplas permissões
   */
  public hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Verifica se tem todas as permissões
   */
  public hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Retorna informações detalhadas sobre uma permissão
   */
  public getPermissionInfo(actionName: string): {
    hasPermission: boolean;
    isAdmin: boolean;
    reason: string;
  } {
    const hasPermission = this.hasPermission(actionName);
    return {
      hasPermission,
      isAdmin: this.isAdmin,
      reason: hasPermission 
        ? (this.isAdmin ? 'Usuário é administrador' : 'Usuário tem permissão específica')
        : 'Usuário não tem permissão'
    };
  }

  /**
   * Registra múltiplas ações de uma vez
   */
  public registerActions(actions: Array<{ actionName: string; actionDescription: string }>): void {
    actions.forEach(({ actionName, actionDescription }) => {
      this.registerAction(actionName, actionDescription);
    });
  }

  /**
   * Retorna todas as ações registradas
   */
  public getRegisteredActions(): Array<{ actionName: string; actionDescription: string }> {
    return [...this.actions];
  }
}
