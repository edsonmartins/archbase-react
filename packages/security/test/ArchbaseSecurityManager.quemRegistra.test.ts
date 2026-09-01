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
