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
  /**
   * A requisição ainda não terminou — **separado de `alreadyApplied` de propósito**.
   *
   * <p>`alreadyApplied` é a trava de reentrância: vira `true` no INÍCIO do `apply()`, antes do
   * `await`, para que duas telas montando juntas não disparem duas requisições. Isso a torna
   * inútil como resposta a <i>"já dá para ler `permissions`?"</i> — e era exatamente assim que o
   * `isLoading()` a usava.</p>
   */
  protected loading: boolean
  /**
   * A requisição em curso — **uma só, compartilhada por todos os que pedirem**.
   *
   * <p>Existe porque o mesmo manager é reaproveitado entre montagens (o hook o guarda no store, com
   * chave por usuário e recurso). Sem ela, a segunda montagem via `alreadyApplied === true`, saía
   * sem fazer nada e <b>sem avisar ninguém</b>.</p>
   */
  protected pendente: Promise<void> | null
  protected error: string
  protected isAdmin: boolean

  constructor(resourceName: string, resourceDescription: string, isAdmin: boolean) {
    this.resourceService = IOCContainer.getContainer().get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
    this.resource = { resourceName, resourceDescription }
    this.alreadyApplied = false
    // Começa carregando: antes de `apply()` as permissões também não estão prontas, e quem
    // perguntar deve esperar em vez de ler uma lista vazia.
    this.loading = true
    this.pendente = null
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
    /*
      TODO CHAMADOR É RESPONDIDO — inclusive quem chegou com a requisição já em curso.

      Antes isto era `if (this.alreadyApplied) return`, e o segundo chamador saía sem nada: sem
      esperar, sem erro e SEM EXECUTAR O CALLBACK. Quem monta o menu no callback ficava esperando
      um aviso que nunca vinha e caía no timeout de 3s, que carrega a navegação SEM FILTRO DE
      SEGURANÇA — todos os itens habilitados para quem não tem permissão nenhuma.

      Não era um caso raro: o React monta o efeito duas vezes em desenvolvimento, e o manager é
      reaproveitado entre montagens (o hook o guarda no store). A primeira montagem disparava a
      requisição e era descartada; a segunda encontrava `alreadyApplied === true`.

      Uma promessa compartilhada resolve os dois lados: a requisição continua acontecendo UMA vez,
      e todos os que pedirem são avisados quando ela terminar — inclusive quem pediu depois de
      pronta, que resolve na hora.
    */
    if (!this.pendente) {
      this.pendente = this.carregarPermissoes();
    }
    await this.pendente;
    if (callback) {
      callback();
    }
  }

  private async carregarPermissoes(): Promise<void> {
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
    } catch (error) {
      // Libera para nova tentativa: a falha costuma ser de rede, e travar aqui condenaria a tela a
      // nunca mais carregar permissão nenhuma. A promessa também é descartada — senão a tentativa
      // seguinte reaproveitaria a falha antiga em vez de pedir de novo.
      this.alreadyApplied = false;
      this.pendente = null;
      this.error = processErrorMessage(error);
      throw error;
    } finally {
      // No `finally` para valer também quando a requisição falha: quem espera precisa parar de
      // esperar, e o `isError()` é que diz o que aconteceu.
      this.loading = false;
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
   * As permissões ainda estão a caminho — **e quem pergunta isto está prestes a ler `permissions`**.
   *
   * <h2>O menu inteiro nascia desabilitado</h2>
   *
   * <p>Isto devolvia `!alreadyApplied`, e o `alreadyApplied` vira `true` no INÍCIO do `apply()`,
   * antes do `await`. Ou seja: `isLoading()` respondia "pronto" no instante em que a requisição
   * <b>partia</b>.</p>
   *
   * <p>O `ArchbaseAdvancedSidebar` decide com <code>!isLoading() && !isError()</code>, monta o menu
   * com <code>disabled: !hasPermission(label)</code> e então <b>trava</b> — marca o item como
   * processado e não recalcula quando a resposta chega. Resultado: ele lia `permissions` ainda
   * vazio e desabilitava tudo, de forma permanente.</p>
   *
   * <p><b>Só aparecia para quem não é administrador</b>, porque `hasPermission` termina em
   * <code>|| this.isAdmin</code> — o admin passa mesmo com a lista vazia. E era uma corrida: se a
   * resposta chegasse antes do efeito do sidebar rodar, funcionava. Defeito que depende de tempo
   * some quando se procura, e reaparece na máquina de outra pessoa.</p>
   *
   * <p>Agora existe um sinalizador próprio, ligado no construtor e desligado no `finally` do
   * `apply()`. `alreadyApplied` continua sendo a trava de reentrância, que é o que ele sempre foi —
   * as duas perguntas apenas deixaram de compartilhar a mesma resposta.</p>
   */
  public isLoading(): boolean {
    return this.loading;
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
