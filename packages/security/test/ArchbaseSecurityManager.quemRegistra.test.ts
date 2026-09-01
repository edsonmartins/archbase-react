import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * <b>Quem registra o catálogo é o administrador; os demais apenas leem o que podem.</b>
 *
 * <h2>O defeito</h2>
 *
 * <p>O `apply()` chamava `POST /resource/register` para TODO usuário ao abrir cada tela. Esse
 * endpoint <b>escreve o catálogo de segurança</b> e o backend o marca como administrativo. Em
 * qualquer projeto com `archbase.security.admin-endpoints.policy=admin-only`, todo não-admin
 * tomava <b>403 em toda tela</b>: `permissions` ficava vazio, `hasPermission` respondia `false`
 * para tudo, e o menu inteiro aparecia desabilitado. Conceder a permissão no banco não mudava
 * nada — a resposta que a carregaria nunca chegava.</p>
 *
 * <h2>Por que isto não é uma tela cinza, e sim autorização afrouxada</h2>
 *
 * <p>Dois projetos independentes reagiram do mesmo jeito: voltaram a política para `permit` para
 * destravar o produto. E `permit` deixa qualquer autenticado alcançar <b>criar usuário</b> e
 * <b>conceder permissão</b> — quem se promove a gestor atravessa depois todas as demais guardas
 * legitimamente. Um método que só precisava LER estava cobrando poder de ESCRITA, e o preço foi
 * pago abrindo a escalação de privilégio.</p>
 */

const registerResource = vi.fn();
const findLoggedUserResourcePermissions = vi.fn();

vi.mock('@archbase/core', () => ({
  ARCHBASE_IOC_API_TYPE: { Resource: Symbol.for('Resource') },
  IOCContainer: {
    getContainer: () => ({
      get: () => ({ registerResource, findLoggedUserResourcePermissions }),
    }),
  },
  processErrorMessage: (e: any) => String(e?.message ?? e),
}));

const { ArchbaseSecurityManager } = await import('../src/ArchbaseSecurityManager');

const ADMIN = true;
const NAO_ADMIN = false;

function manager(isAdmin: boolean) {
  const m = new ArchbaseSecurityManager('Cockpit', 'Cockpit do vendedor', isAdmin);
  m.registerAction('ACEITAR', 'Aceitar tarefa');
  return m;
}

beforeEach(() => {
  registerResource.mockReset();
  findLoggedUserResourcePermissions.mockReset();
  registerResource.mockResolvedValue({ resourceName: 'Cockpit', permissions: ['ACEITAR'] });
  findLoggedUserResourcePermissions.mockResolvedValue({
    resourceName: 'Cockpit',
    permissions: ['ACEITAR'],
  });
});

describe('apply — quem escreve o catálogo e quem só lê', () => {
  /**
   * <b>O caso que estava quebrado.</b> Sem isto, o não-admin bate no endpoint administrativo e
   * qualquer backend endurecido responde 403.
   */
  it('não-admin LÊ as próprias permissões, e não toca no endpoint de escrita', async () => {
    const m = manager(NAO_ADMIN);
    await m.apply();

    expect(registerResource).not.toHaveBeenCalled();
    expect(findLoggedUserResourcePermissions).toHaveBeenCalledWith('Cockpit');
    expect(m.getPermissions()).toEqual(['ACEITAR']);
  });

  /**
   * <b>O controle que impede a correção de ir longe demais.</b>
   *
   * <p>Se este caso não existisse, trocar as duas chamadas por leitura em TODOS os casos também
   * passaria — e o catálogo nunca mais seria escrito por ninguém. Aí não haveria ação nenhuma para
   * conceder, e o sintoma seria idêntico ao defeito original: menu desabilitado para todo mundo,
   * por uma causa oposta.</p>
   */
  it('controle: o admin REGISTRA, com as ações declaradas na tela', async () => {
    const m = manager(ADMIN);
    await m.apply();

    expect(findLoggedUserResourcePermissions).not.toHaveBeenCalled();
    expect(registerResource).toHaveBeenCalledWith({
      resource: { resourceName: 'Cockpit', resourceDescription: 'Cockpit do vendedor' },
      actions: [{ actionName: 'ACEITAR', actionDescription: 'Aceitar tarefa' }],
    });
  });

  /**
   * O `hasPermission` responde `true` para admin por outro caminho (`|| this.isAdmin`), o que
   * mascararia a troca de chamada. Este caso olha as PERMISSÕES CARREGADAS, não o `hasPermission`
   * — senão o teste do admin passaria mesmo com a requisição errada.
   */
  it('as permissões do não-admin vêm da resposta, não do papel', async () => {
    findLoggedUserResourcePermissions.mockResolvedValue({
      resourceName: 'Cockpit',
      permissions: [],
    });
    const m = manager(NAO_ADMIN);
    await m.apply();

    expect(m.hasPermission('ACEITAR')).toBe(false);
  });

  // A falha continua liberando nova tentativa: travar `alreadyApplied` condenaria a tela a nunca
  // mais carregar permissão nenhuma depois de um erro de rede.
  it('falha na leitura não trava a tela para sempre', async () => {
    findLoggedUserResourcePermissions.mockRejectedValueOnce(new Error('rede'));
    const m = manager(NAO_ADMIN);

    await expect(m.apply()).rejects.toThrow('rede');

    findLoggedUserResourcePermissions.mockResolvedValue({
      resourceName: 'Cockpit',
      permissions: ['ACEITAR'],
    });
    await m.apply();
    expect(m.getPermissions()).toEqual(['ACEITAR']);
  });
});

/**
 * <b>"Já dá para ler `permissions`?" — e o menu inteiro nascia desabilitado.</b>
 *
 * <p>`isLoading()` devolvia `!alreadyApplied`, e `alreadyApplied` vira `true` no INÍCIO do
 * `apply()`, antes do `await`: respondia <i>"pronto"</i> no instante em que a requisição
 * <b>partia</b>.</p>
 *
 * <p>O `ArchbaseAdvancedSidebar` decide com <code>!isLoading() && !isError()</code>, monta o menu
 * com <code>disabled: !hasPermission(label)</code> e então TRAVA — não recalcula quando a resposta
 * chega. Lia a lista vazia e desabilitava tudo, permanentemente.</p>
 *
 * <p>Só aparecia para quem não é administrador, porque `hasPermission` termina em
 * <code>|| this.isAdmin</code>. E era uma corrida: com a resposta rápida, funcionava. Por isso o
 * teste segura a promessa em vez de confiar no relógio — defeito de tempo que se mede com tempo
 * volta a passar despercebido na máquina de outra pessoa.</p>
 */
describe('isLoading — pronto é quando a resposta chega, não quando o pedido sai', () => {
  it('continua carregando enquanto a requisição está em voo', async () => {
    let liberar!: (v: unknown) => void;
    findLoggedUserResourcePermissions.mockReturnValue(
      new Promise((resolve) => {
        liberar = resolve;
      })
    );

    const m = manager(NAO_ADMIN);
    const emVoo = m.apply();

    // O ponto exato do defeito: aqui o sidebar montava o menu.
    expect(m.isLoading()).toBe(true);
    expect(m.hasPermission('ACEITAR')).toBe(false);

    liberar({ resourceName: 'Cockpit', permissions: ['ACEITAR'] });
    await emVoo;

    expect(m.isLoading()).toBe(false);
    expect(m.hasPermission('ACEITAR')).toBe(true);
  });

  // Antes de `apply()` também não há o que ler — quem perguntar deve esperar, não receber
  // uma lista vazia como se fosse resposta.
  it('antes de apply, carregando', () => {
    expect(manager(NAO_ADMIN).isLoading()).toBe(true);
  });

  /**
   * <b>O controle que impede a correção de travar a tela.</b>
   *
   * <p>Se `loading` só fosse desligado no caminho feliz, uma falha de rede deixaria o sidebar
   * esperando para sempre — trocaríamos "menu desabilitado" por "menu que nunca aparece". Quem diz
   * o que aconteceu é o `isError()`.</p>
   */
  it('controle: falha também termina o carregamento', async () => {
    findLoggedUserResourcePermissions.mockRejectedValueOnce(new Error('rede'));
    const m = manager(NAO_ADMIN);

    await expect(m.apply()).rejects.toThrow('rede');

    expect(m.isLoading()).toBe(false);
    expect(m.isError()).toBe(true);
  });
});

/**
 * <b>Todo chamador é respondido</b> — e este é o defeito que habilitou o menu inteiro.
 *
 * <p>O `ArchbaseAdvancedSidebar` monta a navegação DENTRO do callback do `apply()`:</p>
 *
 * <pre>return L.apply(() =&gt; { clearTimeout(K); V(); }), () =&gt; { ... }</pre>
 *
 * <p>Com <code>if (alreadyApplied) return</code>, o segundo chamador saía sem esperar, sem erro e
 * <b>sem executar o callback</b>. O sidebar ficava esperando um aviso que nunca vinha e caía no
 * timeout de 3s — que carrega a navegação <b>sem filtro de segurança</b>. Uma vendedora com duas
 * permissões via o menu administrativo inteiro habilitado.</p>
 *
 * <p>E não era caso raro: o React monta o efeito duas vezes em desenvolvimento, e o hook guarda o
 * manager no store — a segunda montagem sempre encontrava `alreadyApplied === true`.</p>
 *
 * <p><b>Falhar aberto é pior que falhar fechado</b>, e as duas versões deste defeito mostram os
 * dois lados: antes o menu vinha todo desabilitado (irritante, visível na hora); depois, todo
 * habilitado (silencioso, e mostra o que não devia).</p>
 */
describe('apply — a segunda montagem também é avisada', () => {
  it('o callback dispara mesmo quando a requisição já está em curso', async () => {
    let liberar!: (v: unknown) => void;
    findLoggedUserResourcePermissions.mockReturnValue(
      new Promise((resolve) => {
        liberar = resolve;
      })
    );

    const m = manager(NAO_ADMIN);
    const primeira = vi.fn();
    const segunda = vi.fn();

    const voo1 = m.apply(primeira); // montagem 1: dispara
    const voo2 = m.apply(segunda); // montagem 2: encontra em curso

    liberar({ resourceName: 'Cockpit', permissions: ['ACEITAR'] });
    await Promise.all([voo1, voo2]);

    expect(primeira).toHaveBeenCalled();
    expect(segunda).toHaveBeenCalled();
  });

  /**
   * <b>O controle que impede a correção de multiplicar requisições.</b>
   *
   * <p>Responder todo mundo não pode virar "pedir uma vez por chamador": o `alreadyApplied` existe
   * para que várias telas montando juntas não disparem N requisições. Uma só, e todos avisados.</p>
   */
  it('controle: a requisição acontece UMA vez, por mais chamadores que haja', async () => {
    const m = manager(NAO_ADMIN);

    await Promise.all([m.apply(), m.apply(), m.apply()]);

    expect(findLoggedUserResourcePermissions).toHaveBeenCalledTimes(1);
  });

  // Quem chega depois de tudo pronto também é respondido — resolve na hora, sem nova requisição.
  it('quem pede com as permissões já carregadas é atendido na hora', async () => {
    const m = manager(NAO_ADMIN);
    await m.apply();

    const tardio = vi.fn();
    await m.apply(tardio);

    expect(tardio).toHaveBeenCalled();
    expect(findLoggedUserResourcePermissions).toHaveBeenCalledTimes(1);
  });

  // Depois de uma falha, a tentativa seguinte pede DE NOVO em vez de reaproveitar a promessa
  // rejeitada — senão a tela ficaria presa no primeiro erro de rede.
  it('depois de falhar, a próxima tentativa refaz a requisição', async () => {
    findLoggedUserResourcePermissions.mockRejectedValueOnce(new Error('rede'));
    const m = manager(NAO_ADMIN);

    await expect(m.apply()).rejects.toThrow('rede');

    const depois = vi.fn();
    await m.apply(depois);

    expect(depois).toHaveBeenCalled();
    expect(m.getPermissions()).toEqual(['ACEITAR']);
    expect(findLoggedUserResourcePermissions).toHaveBeenCalledTimes(2);
  });
});
