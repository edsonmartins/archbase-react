// @vitest-environment jsdom
/**
 * O inspetor de capacidades.
 *
 * <p><b>Por que existe.</b> Quem administra precisa do nome técnico da ação para concedê-la, e esse
 * nome não aparece em lugar nenhum da aplicação rodando — o caminho era abrir o código. O inspetor
 * responde isso sobre a tela que está na frente da pessoa.
 *
 * <p>Os testes cobrem o que ele <b>afirma</b>: quais capacidades a tela declara, quais o usuário
 * alcança, e que o painel não existe para quem não administra. Aparência não é testada.
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act, fireEvent, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

vi.mock('@archbase/core', async (importOriginal) => ({
    ...(await importOriginal<any>()),
    // Dublê fiel o bastante: devolve a chave sem o namespace, que é o que o i18next faz quando a
    // tradução não existe. Uma identidade crua deixaria `archbase:` colado e esconderia erros de
    // chave.
    getI18nextInstance: () => ({
        t: (chave: string) => String(chave).replace(/^archbase:/, ''),
        exists: () => false,
    }),
    ARCHBASE_IOC_API_TYPE: { Resource: Symbol.for('Resource') },
    IOCContainer: { getContainer: () => ({ get: () => ({}) }) },
    processErrorMessage: (e: any) => String(e?.message ?? e),
}));

const { ArchbaseSecurityInspector } = await import('../src/ArchbaseSecurityInspector');
const { registrarTelaInspecionada } = await import('../src/registroDeTelasInspecionadas');
const { archbaseActionProps, ATRIBUTO_DE_ACAO } = await import('@archbase/core');
const { ArchbaseSecurityContext } = await import('../src/ArchbaseSecurityContext');

/**
 * Um manager de mentira com a superfície que o inspetor usa.
 *
 * <p>Não é a classe real de propósito: o inspetor depende de quatro métodos, e amarrar o teste ao
 * construtor real traria o container de IOC e a requisição de registro para dentro de um teste que
 * não tem nada a ver com isso.
 */
function managerFalso(
    resourceName: string,
    resourceDescription: string,
    acoes: Array<{ actionName: string; actionDescription: string; actionLabel?: string; actionCategory?: string }>,
    concedidas: string[],
) {
    return {
        getResource: () => ({ resourceName, resourceDescription }),
        getRegisteredActions: () => acoes,
        getPermissions: () => concedidas,
        hasPermission: (nome: string) => concedidas.includes(nome),
    } as any;
}

const ACOES_DA_OS = [
    { actionName: 'aprovar_custo', actionDescription: 'Aprovar Custo da OS', actionLabel: 'Aprovar custo', actionCategory: 'Custos' },
    { actionName: 'concluir', actionDescription: 'Concluir OS', actionLabel: 'Concluir', actionCategory: 'Execução' },
    { actionName: 'sem_rotulo', actionDescription: 'Ação sem rótulo' },
];

function contextoGlobal(isAdmin: boolean) {
    return {
        user: { id: '1' },
        isLoading: false,
        hasGlobalPermission: () => false,
        hasAnyGlobalPermission: () => false,
        hasAllGlobalPermissions: () => false,
        hasResourcePermission: () => false,
        canAccessResource: () => false,
        permissionsByResource: {},
        permissionsUnavailable: false,
        isAdmin,
        error: null,
        setError: () => undefined,
    } as any;
}

function montar(isAdmin: boolean, props: any = {}) {
    return render(
        <MantineProvider>
            <ArchbaseSecurityContext.Provider value={contextoGlobal(isAdmin)}>
                <ArchbaseSecurityInspector defaultOpened {...props} />
            </ArchbaseSecurityContext.Provider>
        </MantineProvider>,
    );
}

// O jsdom não implementa matchMedia (que o MantineProvider consulta no primeiro render) nem
// ResizeObserver (que o ScrollArea usa). Sem os dois, a montagem falha antes de qualquer asserção,
// e o erro não diz nada sobre o componente sendo testado.
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

let desregistrar: Array<() => void> = [];

beforeEach(() => {
    desregistrar = [];
});

afterEach(() => {
    desregistrar.forEach(f => f());
    cleanup();
});

describe('quem enxerga o inspetor', () => {
    it('não renderiza nada para quem não administra', () => {
        montar(false);
        expect(screen.queryByText('Action inspector')).toBeNull();
    });

    it('renderiza para administrador', () => {
        montar(true);
        expect(screen.getByText('Action inspector')).toBeTruthy();
    });

    it('`enabled` explícito vence o padrão, nos dois sentidos', () => {
        const { unmount } = montar(false, { enabled: true });
        expect(screen.getByText('Action inspector')).toBeTruthy();
        unmount();

        montar(true, { enabled: false });
        expect(screen.queryByText('Action inspector')).toBeNull();
    });
});

describe('o que o painel diz sobre a tela', () => {
    it('lista o recurso e as capacidades declaradas, com nome técnico', () => {
        desregistrar.push(registrarTelaInspecionada(
            managerFalso('tms.ordemservico', 'Ordens de Serviço', ACOES_DA_OS, ['concluir'])));

        montar(true);

        expect(screen.getByText('Ordens de Serviço')).toBeTruthy();
        expect(screen.getByText('tms.ordemservico')).toBeTruthy();
        expect(screen.getByText('aprovar_custo')).toBeTruthy();
        expect(screen.getByText('concluir')).toBeTruthy();
    });

    it('usa o rótulo quando existe, e a descrição quando não', () => {
        desregistrar.push(registrarTelaInspecionada(
            managerFalso('tms.ordemservico', 'Ordens de Serviço', ACOES_DA_OS, [])));

        montar(true);

        expect(screen.getByText('Aprovar custo')).toBeTruthy();
        // Sem rótulo, a descrição é o que sobra — nunca o identificador cru na coluna do texto.
        expect(screen.getByText('Ação sem rótulo')).toBeTruthy();
    });

    it('mostra a categoria quando a ação declara uma', () => {
        desregistrar.push(registrarTelaInspecionada(
            managerFalso('tms.ordemservico', 'Ordens de Serviço', ACOES_DA_OS, [])));

        montar(true);

        expect(screen.getByText('Custos')).toBeTruthy();
        expect(screen.getByText('Execução')).toBeTruthy();
    });

    it('capacidade concedida mas NÃO declarada por esta tela aparece, e marcada', () => {
        // Um recurso pode ser declarado por mais de uma tela, e cada uma registra só o que usa.
        // Esconder o que a outra declarou faria concluir que a capacidade não existe.
        desregistrar.push(registrarTelaInspecionada(
            managerFalso('tms.ordemservico', 'Ordens de Serviço', ACOES_DA_OS, ['create'])));

        montar(true);

        expect(screen.getByText('create')).toBeTruthy();
        expect(screen.getByText('Not declared by this screen')).toBeTruthy();
    });

    it('lista TODAS as telas montadas, não uma eleita', () => {
        // Aplicações com abas mantêm várias montadas; eleger "a atual" exigiria saber qual aba está
        // visível, informação que o módulo de segurança não tem.
        desregistrar.push(registrarTelaInspecionada(
            managerFalso('tms.ordemservico', 'Ordens de Serviço', ACOES_DA_OS, [])));
        desregistrar.push(registrarTelaInspecionada(
            managerFalso('tms.pneu', 'Pneus', [{ actionName: 'instalar', actionDescription: 'Instalar' }], [])));

        montar(true);

        expect(screen.getByText('tms.ordemservico')).toBeTruthy();
        expect(screen.getByText('tms.pneu')).toBeTruthy();
    });

    it('sem tela montada, diz isso em vez de ficar em branco', () => {
        montar(true);
        expect(screen.getByText('No screen registered')).toBeTruthy();
    });
});

describe('o atalho', () => {
    /**
     * <b>O defeito:</b> o atalho nunca abria em nenhum Mac.
     *
     * <p>Option é tecla de composição no macOS: `Option+A` produz `'å'`, não `'a'`. A verificação
     * comparava `event.key` com a letra pedida, e a comparação falhava sempre. O teste de navegador
     * não pegou porque a automação SINTETIZA o evento com `key: 'a'` — ela não passa pelo layout do
     * teclado, então reproduzia um Mac que não existe.
     *
     * <p>Por isso estes testes disparam o evento do jeito que o sistema operacional o entrega.
     */
    function teclar(init: KeyboardEventInit) {
        window.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...init }));
    }

    it('abre com Ctrl+Alt+A num teclado que produz a letra', () => {
        render(
            <MantineProvider>
                <ArchbaseSecurityContext.Provider value={contextoGlobal(true)}>
                    <ArchbaseSecurityInspector />
                </ArchbaseSecurityContext.Provider>
            </MantineProvider>,
        );
        expect(screen.queryByText('Action inspector')).toBeNull();

        act(() => teclar({ key: 'a', code: 'KeyA', ctrlKey: true, altKey: true }));
        expect(screen.getByText('Action inspector')).toBeTruthy();
    });

    it('abre no macOS, onde Option+A produz "å"', () => {
        render(
            <MantineProvider>
                <ArchbaseSecurityContext.Provider value={contextoGlobal(true)}>
                    <ArchbaseSecurityInspector />
                </ArchbaseSecurityContext.Provider>
            </MantineProvider>,
        );

        act(() => teclar({ key: 'å', code: 'KeyA', ctrlKey: true, altKey: true }));
        expect(screen.getByText('Action inspector')).toBeTruthy();
    });

    it('o mesmo atalho fecha', () => {
        render(
            <MantineProvider>
                <ArchbaseSecurityContext.Provider value={contextoGlobal(true)}>
                    <ArchbaseSecurityInspector defaultOpened />
                </ArchbaseSecurityContext.Provider>
            </MantineProvider>,
        );
        expect(screen.getByText('Action inspector')).toBeTruthy();

        act(() => teclar({ key: 'å', code: 'KeyA', ctrlKey: true, altKey: true }));
        expect(screen.queryByText('Action inspector')).toBeNull();
    });

    it('não abre sem os modificadores, nem com a tecla errada', () => {
        render(
            <MantineProvider>
                <ArchbaseSecurityContext.Provider value={contextoGlobal(true)}>
                    <ArchbaseSecurityInspector />
                </ArchbaseSecurityContext.Provider>
            </MantineProvider>,
        );

        act(() => teclar({ key: 'a', code: 'KeyA' }));
        act(() => teclar({ key: 'a', code: 'KeyA', ctrlKey: true }));
        act(() => teclar({ key: 'b', code: 'KeyB', ctrlKey: true, altKey: true }));
        expect(screen.queryByText('Action inspector')).toBeNull();
    });

    it('quem não administra não abre nem com o atalho certo', () => {
        render(
            <MantineProvider>
                <ArchbaseSecurityContext.Provider value={contextoGlobal(false)}>
                    <ArchbaseSecurityInspector />
                </ArchbaseSecurityContext.Provider>
            </MantineProvider>,
        );

        act(() => teclar({ key: 'a', code: 'KeyA', ctrlKey: true, altKey: true }));
        expect(screen.queryByText('Action inspector')).toBeNull();
    });
});

describe('o realce', () => {
    /**
     * <b>A queixa:</b> "abri o inspetor na tela de tickets, liguei o realce, nada ficou realçado."
     *
     * <p>O comportamento estava certo — aquela tela não tem nenhum controle marcado — e a interface
     * não dizia nada. Ligar um interruptor e a tela não mudar é indistinguível de defeito.
     */
    it('avisa quando não há nenhum controle marcado na tela', () => {
        montar(true);
        expect(screen.queryByText(/No control marked on this screen/)).toBeNull();

        fireEvent.click(screen.getByLabelText('Highlight on screen'));

        expect(screen.getByText(/No control marked on this screen/)).toBeTruthy();
    });

    it('havendo controle marcado, conta em vez de avisar', () => {
        render(<button {...archbaseActionProps('concluir')}>ok</button>);
        // jsdom devolve caixa zerada; o realce descarta elemento sem dimensão para não desenhar
        // badge solto no canto. Sem isto o teste mediria o descarte, não a contagem.
        Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ top: 10, left: 10, width: 80, height: 30, right: 90, bottom: 40, x: 10, y: 10, toJSON: () => ({}) }),
        });

        montar(true);
        fireEvent.click(screen.getByLabelText('Highlight on screen'));

        return waitFor(() => {
            expect(screen.queryByText(/No control marked on this screen/)).toBeNull();
            expect(screen.getByText(/marked controls/)).toBeTruthy();
        });
    });
});

describe('registro de telas', () => {
    it('desregistrar remove a tela do painel', () => {
        const cancelar = registrarTelaInspecionada(
            managerFalso('tms.ordemservico', 'Ordens de Serviço', ACOES_DA_OS, []));

        const { unmount } = montar(true);
        expect(screen.getByText('tms.ordemservico')).toBeTruthy();
        unmount();

        cancelar();

        montar(true);
        expect(screen.queryByText('tms.ordemservico')).toBeNull();
    });
});

describe('marcação de ação', () => {
    it('devolve o atributo que o realce procura', () => {
        expect(archbaseActionProps('aprovar_custo')).toEqual({ [ATRIBUTO_DE_ACAO]: 'aprovar_custo' });
    });

    it('o atributo sobrevive ao spread num elemento real', () => {
        render(<button {...archbaseActionProps('concluir')}>ok</button>);
        expect(document.querySelector(`[${ATRIBUTO_DE_ACAO}="concluir"]`)).toBeTruthy();
    });
});
