// @vitest-environment jsdom
/**
 * A tela de concessão de permissões: classificação, identificador técnico e herança.
 *
 * <p><b>Por que existe.</b> Este modal é onde se decide quem pode o quê, e não tinha teste nenhum.
 * As três queixas que motivaram a mudança são justamente as que um teste pega:
 *
 * <ul>
 *   <li>recurso de tela e recurso de endpoint desenhados lado a lado, indistinguíveis — o backend
 *       sabe a diferença desde sempre e não a enviava;</li>
 *   <li>só a descrição na linha, nunca o identificador — e as descrições do catálogo são geradas em
 *       massa pelo {@code useArchbaseCrudSecurity}, então ficam quase idênticas;</li>
 *   <li>permissão vinda de grupo ou perfil aparecendo com botão de remover que não faz nada, sem
 *       uma palavra explicando por quê.</li>
 * </ul>
 *
 * <p>Não testam aparência. Testam o que a tela <b>afirma</b> sobre o catálogo — que é onde ela
 * estava enganando quem administra.
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const getPermissionsBySecurityId = vi.fn();
const getAllPermissionsAvailable = vi.fn();
const createPermission = vi.fn();
const deletePermission = vi.fn();
const getCapabilityDependencies = vi.fn();

vi.mock('@archbase/core', async (importOriginal) => ({
    ...(await importOriginal<any>()),
    /**
     * Dublê FIEL ao i18next, não uma identidade.
     *
     * O dublê anterior devolvia a chave inteira em `t()` e não tinha `exists`. Com ele, o defeito
     * que trocava a descrição da capacidade pelo identificador cru passava despercebido: a
     * comparação errada dava "igual" por acaso e a tela caía no caminho certo.
     *
     * O i18next de verdade faz duas coisas que importam aqui: para chave ausente devolve a chave
     * SEM o namespace, e é `exists` que diz se ela existe. Reproduzir isso é o que faz a suíte
     * proteger o comportamento em vez de descrevê-lo.
     */
    getI18nextInstance: () => ({
        t: (chave: string) => (typeof chave === 'string' ? chave.replace(/^archbase:/, '') : chave),
        exists: () => false,
    }),
}));

vi.mock('@archbase/data', async (importOriginal) => ({
    ...(await importOriginal<any>()),
    useArchbaseRemoteServiceApi: () => ({
        getPermissionsBySecurityId,
        getAllPermissionsAvailable,
        createPermission,
        deletePermission,
        getCapabilityDependencies,
    }),
}));

vi.mock('@archbase/layout', () => ({
    ArchbaseSpaceFixed: ({ children }: any) => <div>{children}</div>,
    ArchbaseSpaceFill: ({ children }: any) => <div>{children}</div>,
    ArchbaseSpaceBottom: ({ children }: any) => <div>{children}</div>,
}));

import { PermissionsSelectorModal } from '../src/PermissionsSelectorModal';

/** O datasource que o modal consulta: nome, id e tipo da entidade em edição. */
const dataSource = (campos: Record<string, any>) => ({
    getFieldValue: (campo: string) => campos[campo],
}) as any;

const renderizar = () =>
    render(
        <MantineProvider>
            <PermissionsSelectorModal
                dataSource={dataSource({ id: 'u1', name: 'Fulano', type: 'user' })}
                opened
                close={() => undefined}
            />
        </MantineProvider>,
    );

/** O botão que carrega determinado ícone do tabler — os dois do meio não têm rótulo textual. */
const botao = (icone: string): HTMLButtonElement => {
    const svg = document.querySelector(`svg.tabler-icon-${icone}`);
    const alvo = svg?.closest('button');
    if (!alvo) {
        throw new Error(`Botão com ícone ${icone} não encontrado`);
    }
    return alvo as HTMLButtonElement;
};

/** Clica no rótulo de um nó para expandi-lo. */
const expandir = async (rotulo: string) => {
    fireEvent.click(await screen.findByText(rotulo));
};

const CATALOGO = [
    {
        resourceId: 'r-view',
        resourceName: 'Cockpit',
        resourceDescription: 'Cockpit do vendedor',
        resourceType: 'VIEW',
        permissions: [{ actionId: 'a1', actionName: 'abrir', actionDescription: 'Abrir cockpit' }],
    },
    {
        resourceId: 'r-api',
        resourceName: 'tms.ordemservico',
        resourceDescription: 'Ordens de serviço',
        resourceType: 'API',
        permissions: [
            { actionId: 'a2', actionName: 'aprovar_custo', actionDescription: 'Aprovar o custo da OS' },
        ],
    },
    {
        resourceId: 'r-legado',
        resourceName: 'legado.recurso',
        resourceDescription: 'Recurso legado',
        // Sem tipo: criado antes de a coluna existir. Não pode ser empurrado para um dos baldes.
        resourceType: null,
        permissions: [{ actionId: 'a3', actionName: 'usar', actionDescription: 'Usar o legado' }],
    },
];

// O jsdom não implementa nem matchMedia (que o MantineProvider consulta no primeiro render) nem
// ResizeObserver (que o ScrollArea da árvore usa). Sem os dois, a montagem falha antes de qualquer
// asserção — e o erro não diz nada sobre o componente sendo testado.
beforeAll(() => {
    (globalThis as any).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }),
    });
});

beforeEach(() => {
    vi.clearAllMocks();
    getAllPermissionsAvailable.mockResolvedValue(CATALOGO);
    getPermissionsBySecurityId.mockResolvedValue([]);
    getCapabilityDependencies.mockResolvedValue({
        actionId: 'a2', capability: 'tms.ordemservico:aprovar_custo',
        dependencies: [], truncated: false,
    });
});

afterEach(cleanup);

describe('classificação do catálogo', () => {
    it('separa telas, endpoints e o que ainda não tem classificação', async () => {
        renderizar();

        expect(await screen.findAllByText('Screens')).not.toHaveLength(0);
        expect(await screen.findAllByText('Services')).not.toHaveLength(0);
        expect(await screen.findAllByText('Unclassified')).not.toHaveLength(0);
    });

    it('seção sem nenhum recurso não é desenhada', async () => {
        getAllPermissionsAvailable.mockResolvedValue([CATALOGO[0]]);
        renderizar();

        expect(await screen.findAllByText('Screens')).not.toHaveLength(0);
        // Pasta que nunca abre é ruído: só existe seção que tem conteúdo.
        expect(screen.queryByText('Services')).toBeNull();
        expect(screen.queryByText('Unclassified')).toBeNull();
    });

    it('backend anterior a 3.3.3 não envia tipo — tudo cai em "sem classificação", e a árvore funciona', async () => {
        getAllPermissionsAvailable.mockResolvedValue(
            CATALOGO.map(({ resourceType, ...resto }) => resto),
        );
        renderizar();

        expect(await screen.findAllByText('Unclassified')).not.toHaveLength(0);
        expect(screen.queryByText('Screens')).toBeNull();
        expect(screen.queryByText('Services')).toBeNull();
    });
});

describe('identificador técnico', () => {
    it('mostra o nome do recurso ao lado da descrição', async () => {
        renderizar();

        await expandir('Services');
        expect(await screen.findByText('Ordens de serviço')).toBeTruthy();
        // O que está no @ArchbaseResource, e que a tela nunca mostrou.
        expect(await screen.findByText('tms.ordemservico')).toBeTruthy();
    });

    it('mostra o nome da ação ao lado da descrição gerada', async () => {
        renderizar();

        await expandir('Services');
        await expandir('Ordens de serviço');

        expect(await screen.findByText('Aprovar o custo da OS')).toBeTruthy();
        expect(await screen.findByText('aprovar_custo')).toBeTruthy();
    });

    it('não repete o identificador quando ele é igual à descrição', async () => {
        getAllPermissionsAvailable.mockResolvedValue([{
            ...CATALOGO[1],
            resourceDescription: 'tms.ordemservico',
        }]);
        renderizar();

        await expandir('Services');
        expect(await screen.findAllByText('tms.ordemservico')).toHaveLength(1);
    });
});

describe('dependências entre capacidades', () => {
    const COM_DEPENDENCIA = [
        {
            resourceId: 'r-api',
            resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço',
            resourceType: 'API',
            permissions: [
                {
                    actionId: 'a2',
                    actionName: 'aprovar_custo',
                    actionDescription: 'Aprovar o custo da OS',
                    requires: ['tms.ordemservico:view'],
                },
                { actionId: 'a9', actionName: 'view', actionDescription: 'Ver OS' },
            ],
        },
        {
            resourceId: 'r-view',
            resourceName: 'Cockpit',
            resourceDescription: 'Cockpit do vendedor',
            resourceType: 'VIEW',
            permissions: [{
                actionId: 'a1', actionName: 'aprovar', actionDescription: 'Aprovar',
                requires: ['tms.ordemservico:aprovar_custo'],
            }],
        },
    ];

    const abrirCapacidadeDisponivel = async (secao: string, recurso: string, acao: string) => {
        const secoes = await screen.findAllByText(secao);
        fireEvent.click(secoes[0]);
        const recursos = await screen.findAllByText(recurso);
        fireEvent.click(recursos[0]);
        const linhas = await screen.findAllByText(acao);
        fireEvent.click(linhas[0]);
    };

    it('mostra quais telas usam um endpoint — a pergunta que o aninhamento responderia', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[0]);

        expect(await screen.findByText('used by 1')).toBeTruthy();
    });

    it('marca quantas dependências diretas a capacidade tem', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[0]);

        expect(await screen.findByText('depends on 1')).toBeTruthy();
    });

    it('capacidade sem dependência é concedida direto, sem perguntar ao servidor', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        createPermission.mockResolvedValue({
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissionId: 'p9', actionId: 'a9', actionName: 'view', actionDescription: 'Ver OS',
        });
        renderizar();

        await abrirCapacidadeDisponivel('Services', 'Ordens de serviço', 'Ver OS');
        fireEvent.click(botao('arrow-right'));

        await waitFor(() => expect(createPermission).toHaveBeenCalledWith('u1', 'a9', 'user'));
        // O catálogo já diz que não há dependência: buscar o fecho seria uma ida ao servidor por
        // clique, em quase todo o catálogo.
        expect(getCapabilityDependencies).not.toHaveBeenCalled();
    });

    it('capacidade com dependência faltando abre a confirmação em vez de conceder', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getCapabilityDependencies.mockResolvedValue({
            actionId: 'a2', capability: 'tms.ordemservico:aprovar_custo',
            dependencies: [{
                capability: 'tms.ordemservico:view', actionId: 'a9',
                resourceName: 'tms.ordemservico', actionName: 'view', actionDescription: 'Ver OS',
                depth: 1, requiredBy: 'tms.ordemservico:aprovar_custo', resolved: true,
            }],
            truncated: false,
        });
        renderizar();

        await abrirCapacidadeDisponivel('Services', 'Ordens de serviço', 'Aprovar o custo da OS');
        fireEvent.click(botao('arrow-right'));

        expect(await screen.findByText('This permission depends on others')).toBeTruthy();
        expect(createPermission).not.toHaveBeenCalled();
    });

    it('"conceder junto" grava a dependência ANTES da capacidade que depende dela', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getCapabilityDependencies.mockResolvedValue({
            actionId: 'a2', capability: 'tms.ordemservico:aprovar_custo',
            dependencies: [{
                capability: 'tms.ordemservico:view', actionId: 'a9',
                resourceName: 'tms.ordemservico', actionName: 'view', actionDescription: 'Ver OS',
                depth: 1, requiredBy: 'tms.ordemservico:aprovar_custo', resolved: true,
            }],
            truncated: false,
        });
        createPermission.mockImplementation((_s: string, actionId: string) => Promise.resolve({
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissionId: 'p-' + actionId, actionId, actionName: actionId,
            actionDescription: actionId,
        }));
        renderizar();

        await abrirCapacidadeDisponivel('Services', 'Ordens de serviço', 'Aprovar o custo da OS');
        fireEvent.click(botao('arrow-right'));
        fireEvent.click(await screen.findByText('Grant together'));

        await waitFor(() => expect(createPermission).toHaveBeenCalledTimes(2));
        // Se a última chamada falhar, o que ficou concedido é o pré-requisito — não a capacidade
        // que depende dele.
        expect(createPermission.mock.calls[0][1]).toBe('a9');
        expect(createPermission.mock.calls[1][1]).toBe('a2');
    });

    it('"conceder só esta" respeita a decisão de quem administra', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getCapabilityDependencies.mockResolvedValue({
            actionId: 'a2', capability: 'tms.ordemservico:aprovar_custo',
            dependencies: [{
                capability: 'tms.ordemservico:view', actionId: 'a9',
                resourceName: 'tms.ordemservico', actionName: 'view', actionDescription: 'Ver OS',
                depth: 1, requiredBy: 'tms.ordemservico:aprovar_custo', resolved: true,
            }],
            truncated: false,
        });
        createPermission.mockResolvedValue({
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissionId: 'p2', actionId: 'a2', actionName: 'aprovar_custo',
            actionDescription: 'Aprovar o custo da OS',
        });
        renderizar();

        await abrirCapacidadeDisponivel('Services', 'Ordens de serviço', 'Aprovar o custo da OS');
        fireEvent.click(botao('arrow-right'));
        fireEvent.click(await screen.findByText('Grant only this one'));

        await waitFor(() => expect(createPermission).toHaveBeenCalledTimes(1));
        expect(createPermission.mock.calls[0][1]).toBe('a2');
    });

    it('dependência que a entidade JÁ alcança não é oferecida de novo', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getPermissionsBySecurityId.mockResolvedValue([{
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissions: [{
                actionId: 'a9', actionName: 'view', actionDescription: 'Ver OS',
                permissionId: 'p9', types: ['USER'],
            }],
        }]);
        getCapabilityDependencies.mockResolvedValue({
            actionId: 'a2', capability: 'tms.ordemservico:aprovar_custo',
            dependencies: [{
                capability: 'tms.ordemservico:view', actionId: 'a9',
                resourceName: 'tms.ordemservico', actionName: 'view', actionDescription: 'Ver OS',
                depth: 1, requiredBy: 'tms.ordemservico:aprovar_custo', resolved: true,
            }],
            truncated: false,
        });
        createPermission.mockResolvedValue({
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissionId: 'p2', actionId: 'a2', actionName: 'aprovar_custo',
            actionDescription: 'Aprovar o custo da OS',
        });
        renderizar();

        await abrirCapacidadeDisponivel('Services', 'Ordens de serviço', 'Aprovar o custo da OS');
        fireEvent.click(botao('arrow-right'));

        // Nada falta: concede direto, sem diálogo.
        await waitFor(() => expect(createPermission).toHaveBeenCalledTimes(1));
        expect(screen.queryByText('This permission depends on others')).toBeNull();
    });

    it('avisa ao remover uma capacidade da qual outras concedidas dependem', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getPermissionsBySecurityId.mockResolvedValue([{
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissions: [
                {
                    actionId: 'a2', actionName: 'aprovar_custo',
                    actionDescription: 'Aprovar o custo da OS',
                    permissionId: 'p2', types: ['USER'],
                    requires: ['tms.ordemservico:view'],
                },
                {
                    actionId: 'a9', actionName: 'view', actionDescription: 'Ver OS',
                    permissionId: 'p9', types: ['USER'],
                },
            ],
        }]);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[secoes.length - 1]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[recursos.length - 1]);
        const linhas = await screen.findAllByText('Ver OS');
        fireEvent.click(linhas[linhas.length - 1]);

        fireEvent.click(botao('arrow-left'));

        expect(await screen.findByText('Other permissions depend on this one')).toBeTruthy();
        // Aviso, não bloqueio: nada foi removido ainda.
        expect(deletePermission).not.toHaveBeenCalled();
    });

    it('"remover mesmo assim" prossegue — a decisão continua sendo de quem administra', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getPermissionsBySecurityId.mockResolvedValue([{
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissions: [
                {
                    actionId: 'a2', actionName: 'aprovar_custo',
                    actionDescription: 'Aprovar o custo da OS',
                    permissionId: 'p2', types: ['USER'],
                    requires: ['tms.ordemservico:view'],
                },
                {
                    actionId: 'a9', actionName: 'view', actionDescription: 'Ver OS',
                    permissionId: 'p9', types: ['USER'],
                },
            ],
        }]);
        deletePermission.mockResolvedValue(undefined);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[secoes.length - 1]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[recursos.length - 1]);
        const linhas = await screen.findAllByText('Ver OS');
        fireEvent.click(linhas[linhas.length - 1]);

        fireEvent.click(botao('arrow-left'));
        fireEvent.click(await screen.findByText('Remove anyway'));

        await waitFor(() => expect(deletePermission).toHaveBeenCalledWith('p9'));
    });

    it('remover capacidade da qual ninguém depende não abre aviso', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_DEPENDENCIA);
        getPermissionsBySecurityId.mockResolvedValue([{
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissions: [{
                actionId: 'a2', actionName: 'aprovar_custo',
                actionDescription: 'Aprovar o custo da OS',
                permissionId: 'p2', types: ['USER'],
                requires: ['tms.ordemservico:view'],
            }],
        }]);
        deletePermission.mockResolvedValue(undefined);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[secoes.length - 1]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[recursos.length - 1]);
        const linhas = await screen.findAllByText('Aprovar o custo da OS');
        fireEvent.click(linhas[linhas.length - 1]);

        fireEvent.click(botao('arrow-left'));

        await waitFor(() => expect(deletePermission).toHaveBeenCalledWith('p2'));
        expect(screen.queryByText('Other permissions depend on this one')).toBeNull();
    });
});

describe('rótulo, descrição e categoria', () => {
    const COM_ROTULO = [{
        resourceId: 'r-api',
        resourceName: 'tms.ordemservico',
        resourceDescription: 'Ordens de serviço',
        resourceType: 'API',
        permissions: [
            {
                actionId: 'a2', actionName: 'aprovar_custo',
                actionLabel: 'Aprovar custo',
                actionDescription: 'Aprovar o custo da ordem de serviço',
                actionCategory: 'Custos',
            },
            {
                actionId: 'a3', actionName: 'estornar',
                actionLabel: 'Estornar',
                actionDescription: 'Estornar o custo aprovado',
                actionCategory: 'Custos',
            },
            { actionId: 'a9', actionName: 'view', actionDescription: 'Ver OS' },
        ],
    }];

    const abrirRecurso = async () => {
        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[0]);
    };

    it('mostra o RÓTULO na linha, não a descrição', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_ROTULO);
        renderizar();
        await abrirRecurso();
        fireEvent.click(await screen.findByText('Custos'));

        expect(await screen.findByText('Aprovar custo')).toBeTruthy();
        // A frase inteira sai da linha e vira explicação no tooltip.
        expect(screen.queryByText('Aprovar o custo da ordem de serviço')).toBeNull();
    });

    it('capacidade sem rótulo continua mostrando a descrição — o comportamento de hoje', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_ROTULO);
        renderizar();
        await abrirRecurso();

        expect(await screen.findByText('Ver OS')).toBeTruthy();
    });

    it('agrupa por categoria quando alguma capacidade declara', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_ROTULO);
        renderizar();
        await abrirRecurso();

        expect(await screen.findByText('Custos')).toBeTruthy();
        // As de categoria ficam sob o grupo; a sem categoria fica solta ao lado.
        expect(screen.queryByText('Aprovar custo')).toBeNull();
        expect(await screen.findByText('Ver OS')).toBeTruthy();
    });

    it('recurso sem categoria nenhuma mantém a árvore de dois níveis', async () => {
        getAllPermissionsAvailable.mockResolvedValue([{
            ...COM_ROTULO[0],
            permissions: COM_ROTULO[0].permissions.map(({ actionCategory, ...resto }) => resto),
        }]);
        renderizar();
        await abrirRecurso();

        // A capacidade aparece direto sob o recurso, sem nível extra.
        expect(await screen.findByText('Aprovar custo')).toBeTruthy();
        expect(screen.queryByText('Custos')).toBeNull();
    });

    it('o filtro alcança o identificador técnico e o rótulo', async () => {
        getAllPermissionsAvailable.mockResolvedValue(COM_ROTULO);
        renderizar();
        await abrirRecurso();

        fireEvent.click(await screen.findByText('Custos'));
        expect(await screen.findByText('Aprovar custo')).toBeTruthy();

        const filtro = screen.getByPlaceholderText('Filter available permissions');
        // 'estornar' é o actionName; o rótulo é 'Estornar' e a descrição é outra frase. O filtro
        // precisa alcançar os três.
        fireEvent.change(filtro, { target: { value: 'estornar' } });

        // O filtro é debounced: sem esperar, a asserção leria a árvore anterior.
        await waitFor(() => expect(screen.queryByText('Aprovar custo')).toBeNull());
        expect(screen.getByText('Estornar')).toBeTruthy();
    });

    it('a seleção avança atravessando o agrupamento de categoria', async () => {
        // folhasDe: sem ele, num recurso agrupado a lista devolveria as categorias em vez das
        // capacidades, e a seleção nunca avançaria depois de conceder.
        getAllPermissionsAvailable.mockResolvedValue(COM_ROTULO);
        createPermission.mockResolvedValue({
            resourceId: 'r-api', resourceName: 'tms.ordemservico',
            resourceDescription: 'Ordens de serviço', resourceType: 'API',
            permissionId: 'p2', actionId: 'a2', actionName: 'aprovar_custo',
            actionLabel: 'Aprovar custo', actionDescription: 'Aprovar o custo da ordem de serviço',
            actionCategory: 'Custos',
        });
        renderizar();
        await abrirRecurso();
        fireEvent.click(await screen.findByText('Custos'));
        fireEvent.click(await screen.findByText('Aprovar custo'));
        fireEvent.click(botao('arrow-right'));

        await waitFor(() => expect(createPermission).toHaveBeenCalledWith('u1', 'a2', 'user'));
        // A próxima capacidade não concedida da mesma categoria fica selecionada, e o botão segue
        // habilitado — prova de que a folha foi encontrada dentro do grupo.
        await waitFor(() => expect(botao('arrow-right').hasAttribute('disabled')).toBe(false));
    });
});

describe('recurso desativado e catálogo incompleto', () => {
    it('marca o recurso desativado em vez de escondê-lo', async () => {
        // Esconder tiraria do admin a chance de arrumar antes de ligar require-active — e escondê-lo
        // da tela sem tirá-lo da decisão seria a interface discordando do avaliador.
        getAllPermissionsAvailable.mockResolvedValue([{
            ...CATALOGO[1],
            resourceActive: false,
        }]);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);

        expect(await screen.findByText('Ordens de serviço')).toBeTruthy();
        expect(await screen.findByText('inactive resource')).toBeTruthy();
    });

    it('recurso ativo não ganha a marca', async () => {
        getAllPermissionsAvailable.mockResolvedValue([{ ...CATALOGO[1], resourceActive: true }]);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);

        await screen.findByText('Ordens de serviço');
        expect(screen.queryByText('inactive resource')).toBeNull();
    });

    it('backend que não envia o campo se comporta como antes', async () => {
        // Ausente é tratado como ativo. Tratar como inativo marcaria o catálogo inteiro de vermelho
        // em toda instalação que ainda não atualizou o servidor.
        getAllPermissionsAvailable.mockResolvedValue([CATALOGO[1]]);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);

        await screen.findByText('Ordens de serviço');
        expect(screen.queryByText('inactive resource')).toBeNull();
    });

    it('explica como o catálogo de uma tela nasce', async () => {
        // A regra que ninguém conta a quem administra: registro é endpoint administrativo, então
        // tela que nenhum admin abriu não tem capacidade cadastrada — e a lista parece completa.
        renderizar();

        expect(await screen.findByText('Available')).toBeTruthy();
        expect(document.querySelector('svg.tabler-icon-info-circle')).toBeTruthy();
    });
});

describe('tradução por chave estável', () => {
    const COM_DESCRICAO = [{
        resourceId: 'r-api',
        resourceName: 'tms.abastecimento',
        resourceDescription: 'Abastecimentos',
        resourceType: 'API',
        permissions: [{
            actionId: 'a1', actionName: 'aprovar',
            actionDescription: 'aprovar em Abastecimentos',
        }],
    }];

    it('sem tradução para a chave estável, mostra a DESCRIÇÃO — nunca o identificador', async () => {
        // O defeito que isto tranca: a checagem de "chave ausente" comparava o retorno do i18next
        // contra a chave COM namespace, e o i18next devolve SEM. A comparação nunca batia, e a
        // linha exibia `tms.abastecimento:aprovar` no lugar de "aprovar em Abastecimentos".
        getAllPermissionsAvailable.mockResolvedValue(COM_DESCRICAO);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);
        const recursos = await screen.findAllByText('Abastecimentos');
        fireEvent.click(recursos[0]);

        expect(await screen.findByText('aprovar em Abastecimentos')).toBeTruthy();
        expect(screen.queryByText('tms.abastecimento:aprovar')).toBeNull();
        // O identificador da AÇÃO continua ao lado, que é outra coisa.
        expect(screen.getByText('aprovar')).toBeTruthy();
    });
});

describe('filtro', () => {
    it('esconde o recurso que ficou sem capacidade nenhuma', async () => {
        // O filtro reduz as ações DENTRO de cada recurso. Sem descartar o recurso vazio, filtrar
        // por uma capacidade deixava os 154 recursos do tenant na tela, e quem procurava rolava a
        // lista inteira até achar o único que interessava.
        getAllPermissionsAvailable.mockResolvedValue([
            {
                resourceId: 'r-api', resourceName: 'tms.ordemservico',
                resourceDescription: 'Ordens de serviço', resourceType: 'API',
                permissions: [{ actionId: 'a2', actionName: 'aprovar_custo', actionDescription: 'Aprovar o custo' }],
            },
            {
                resourceId: 'r-pneu', resourceName: 'tms.pneu',
                resourceDescription: 'Pneus', resourceType: 'API',
                permissions: [{ actionId: 'a5', actionName: 'trocar', actionDescription: 'Trocar pneu' }],
            },
        ]);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);
        expect(await screen.findByText('Pneus')).toBeTruthy();

        const filtro = screen.getByPlaceholderText('Filter available permissions');
        fireEvent.change(filtro, { target: { value: 'aprovar_custo' } });

        // O recurso sem correspondência sai da lista; o que tem fica.
        await waitFor(() => expect(screen.queryByText('Pneus')).toBeNull());
        expect(screen.getByText('Ordens de serviço')).toBeTruthy();
    });

    it('a seção inteira some quando nenhum recurso dela sobra', async () => {
        getAllPermissionsAvailable.mockResolvedValue([
            {
                resourceId: 'r-view', resourceName: 'Cockpit',
                resourceDescription: 'Cockpit do vendedor', resourceType: 'VIEW',
                permissions: [{ actionId: 'a1', actionName: 'abrir', actionDescription: 'Abrir cockpit' }],
            },
            {
                resourceId: 'r-api', resourceName: 'tms.ordemservico',
                resourceDescription: 'Ordens de serviço', resourceType: 'API',
                permissions: [{ actionId: 'a2', actionName: 'aprovar_custo', actionDescription: 'Aprovar o custo' }],
            },
        ]);
        renderizar();

        expect(await screen.findAllByText('Screens')).not.toHaveLength(0);

        const filtro = screen.getByPlaceholderText('Filter available permissions');
        fireEvent.change(filtro, { target: { value: 'aprovar_custo' } });

        // Sem recurso sobrando, "Telas" deixa de ser uma pasta que nunca abre.
        await waitFor(() => expect(screen.queryByText('Screens')).toBeNull());
        expect(screen.getAllByText('Services')).not.toHaveLength(0);
    });

    it('filtro vazio não esconde nada', async () => {
        getAllPermissionsAvailable.mockResolvedValue(CATALOGO);
        renderizar();

        expect(await screen.findAllByText('Screens')).not.toHaveLength(0);
        expect(screen.getAllByText('Services')).not.toHaveLength(0);
        expect(screen.getAllByText('Unclassified')).not.toHaveLength(0);
    });
});

describe('permissão herdada', () => {
    const HERDADA = [{
        resourceId: 'r-api',
        resourceName: 'tms.ordemservico',
        resourceDescription: 'Ordens de serviço',
        resourceType: 'API',
        permissions: [{
            actionId: 'a2',
            actionName: 'aprovar_custo',
            actionDescription: 'Aprovar o custo da OS',
            // Sem permissionId: a concessão é do grupo, não desta pessoa.
            types: ['GROUP'],
        }],
    }];

    it('marca na linha que a capacidade vem de outra origem', async () => {
        getPermissionsBySecurityId.mockResolvedValue(HERDADA);
        renderizar();

        // O painel das concedidas é o segundo; a etiqueta aparece na linha da ação.
        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[secoes.length - 1]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[recursos.length - 1]);

        expect(await screen.findByText('inherited')).toBeTruthy();
    });

    it('selecionar a linha herdada não habilita remover, e nada é apagado', async () => {
        getPermissionsBySecurityId.mockResolvedValue(HERDADA);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[secoes.length - 1]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[recursos.length - 1]);

        const linhas = await screen.findAllByText('Aprovar o custo da OS');
        fireEvent.click(linhas[linhas.length - 1]);

        // A explicação fica na própria linha — o tooltip do botão é reforço, e só aparece no
        // hover; testar por ele seria testar o Mantine, não a tela.
        expect(await screen.findByText('inherited')).toBeTruthy();

        const remover = botao('arrow-left');
        expect(remover.hasAttribute('disabled')).toBe(true);
        fireEvent.click(remover);
        expect(deletePermission).not.toHaveBeenCalled();
    });

    it('a concessão PRÓPRIA continua removível — a trava é só para a herdada', async () => {
        getPermissionsBySecurityId.mockResolvedValue([{
            ...HERDADA[0],
            permissions: [{ ...HERDADA[0].permissions[0], permissionId: 'p1', types: ['USER'] }],
        }]);
        deletePermission.mockResolvedValue(undefined);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[secoes.length - 1]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[recursos.length - 1]);

        const linhas = await screen.findAllByText('Aprovar o custo da OS');
        fireEvent.click(linhas[linhas.length - 1]);

        expect(screen.queryByText('inherited')).toBeNull();
        const remover = botao('arrow-left');
        expect(remover.hasAttribute('disabled')).toBe(false);
        fireEvent.click(remover);
        expect(deletePermission).toHaveBeenCalledWith('p1');
    });

    it('avisa, na lista de disponíveis, que a pessoa já alcança aquilo por outra via', async () => {
        getPermissionsBySecurityId.mockResolvedValue(HERDADA);
        renderizar();

        const secoes = await screen.findAllByText('Services');
        fireEvent.click(secoes[0]);
        const recursos = await screen.findAllByText('Ordens de serviço');
        fireEvent.click(recursos[0]);

        // Antes a mesma capacidade aparecia sem marca nenhuma à esquerda e com etiqueta "grupo" à
        // direita — a tela se contradizendo na mesma linha.
        expect(await screen.findByText('already inherited')).toBeTruthy();
    });
});
