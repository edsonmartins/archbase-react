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

  /**
   * Envia o recurso e as ações registradas, e guarda o que o usuário pode neste recurso.
   *
   * <p><b>Aguarda de verdade.</b> Antes o método era `async` mas devolvia antes de a requisição
   * terminar — o `.then` era encadeado sem `return`. Quem escrevia `await manager.apply()` seguia
   * em frente com `permissions` ainda vazio, e o `catch` de quem chamava nunca era alcançado
   * porque a falha morria no `.catch` interno, virando o campo `error` que ninguém lia.
   *
   * <p>A exceção volta a ser lançada, além de gravada em `error`: quem prefere o campo continua
   * podendo lê-lo, e quem espera um `catch` finalmente o recebe.
   */
  public async apply(callback?: Function): Promise<void> {
    if (this.alreadyApplied) {
      return;
    }
    this.alreadyApplied = true;
    try {
      const resourcePermissions = await this.resourceService.registerResource({
        resource: this.resource,
        actions: this.actions,
      });
      this.permissions = resourcePermissions.permissions;
      this.error = "";
      if (callback) {
        callback();
      }
    } catch (error) {
      // Libera para nova tentativa: a falha costuma ser de rede, e travar `alreadyApplied` em
      // true condenaria a tela a nunca mais carregar permissão nenhuma.
      this.alreadyApplied = false;
      this.error = processErrorMessage(error);
      throw error;
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
