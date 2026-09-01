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
   *
   * <h2>Quem registra é o administrador; os demais apenas leem</h2>
   *
   * <p>Antes, TODO usuário chamava `POST /resource/register` ao abrir cada tela. Esse endpoint
   * <b>escreve o catálogo de segurança</b> e o backend o marca como administrativo — então, em
   * qualquer projeto com `archbase.security.admin-endpoints.policy=admin-only`, todo não-admin
   * tomava <b>403 em toda tela</b>: `permissions` ficava vazio, `hasPermission` respondia `false`
   * para tudo, e o menu inteiro aparecia desabilitado. Nenhuma permissão concedida no banco
   * mudava isso, porque a resposta que as carregaria nunca chegava.</p>
   *
   * <p>O efeito colateral era pior que a tela cinza: dois projetos voltaram a política para
   * `permit` para destravar o produto, e `permit` deixa qualquer autenticado alcançar
   * <b>criar usuário</b> e <b>conceder permissão</b>. Um método que só precisava LER estava
   * cobrando poder de ESCRITA, e o preço foi pago afrouxando a autorização inteira.</p>
   *
   * <p>A separação já existia no backend e não estava sendo usada: `GET /permissions/{recurso}` é
   * `selfService` e devolve o mesmo DTO. Agora o administrador registra — que é quando o catálogo
   * de fato precisa ser escrito — e os demais leem o que podem.</p>
   *
   * <p><b>O que isto exige em troca:</b> o catálogo de um recurso passa a nascer quando um
   * administrador abre aquela tela. Tela que nenhum admin abriu não tem ação cadastrada, e sem ação
   * cadastrada não há o que conceder. É o comportamento correto — o catálogo descreve o sistema,
   * não quem passou por ele —, mas quem esconde telas do admin por papel precisa saber que está
   * escondendo também o registro delas.</p>
   */
  public async apply(callback?: Function): Promise<void> {
    if (this.alreadyApplied) {
      return;
    }
    this.alreadyApplied = true;
    try {
      const resourcePermissions = this.isAdmin
        ? await this.resourceService.registerResource({
            resource: this.resource,
            actions: this.actions,
          })
        : await this.resourceService.findLoggedUserResourcePermissions(this.resource.resourceName);
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
