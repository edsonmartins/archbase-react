// @vitest-environment jsdom
/**
 * A segurança dos templates, que era decorativa.
 *
 * <p><b>O que havia.</b> `useOptionalTemplateSecurity` devolvia sempre `isAvailable: false`,
 * `hasPermission: () => true` e `registerAction: () => {}`. Nove componentes de template o
 * consumiam, então nenhum deles verificava nada e nenhuma ação chegava ao catálogo. Não foi
 * regressão: nasceu assim, com o comentário "será implementada posteriormente".
 *
 * <p><b>Por que estes testes são sobre NÃO negar.</b> Ligar uma verificação inerte esconde botões
 * que hoje aparecem. O risco não é deixar passar — é negar o que não devia, e transformar uma
 * resposta que ainda não chegou em "você não pode". Cada teste abaixo fixa uma das situações em
 * que a resposta certa é permitir.
 */
import React, { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { ArchbaseViewSecurityContext } from '@archbase/security';
import { useOptionalTemplateSecurity } from '../src/hooks/useOptionalTemplateSecurity';

function contextoDe(parcial: any) {
    return {
        securityManager: {
            getRegisteredActions: () => parcial.declaradas ?? [],
            getPermissions: () => parcial.concedidas ?? [],
        },
        hasPermission: (nome: string) => (parcial.concedidas ?? []).includes(nome),
        hasAnyPermission: () => false,
        hasAllPermissions: () => false,
        registerAction: parcial.registerAction ?? (() => undefined),
        isLoading: parcial.isLoading ?? false,
        error: parcial.error ?? null,
    };
}

function comContexto(valor: any) {
    return ({ children }: { children: ReactNode }) => (
        <ArchbaseViewSecurityContext.Provider value={valor}>{children}</ArchbaseViewSecurityContext.Provider>
    );
}

describe('sem contexto, sem opinião', () => {
    it('fora de um provider permite tudo, como antes', () => {
        const { result } = renderHook(() => useOptionalTemplateSecurity());

        expect(result.current.isAvailable).toBe(false);
        expect(result.current.hasPermission('create')).toBe(true);
        expect(result.current.canDelete).toBe(true);
    });

    it('registrar fora de um provider não estoura', () => {
        const { result } = renderHook(() => useOptionalTemplateSecurity());
        expect(() => result.current.registerAction('create', 'Criar')).not.toThrow();
    });
});

describe('nunca negar pelo que não se sabe', () => {
    it('enquanto as permissões carregam, permite', () => {
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ isLoading: true, declaradas: [{ actionName: 'create' }] })),
        });

        expect(result.current.isAvailable).toBe(false);
        expect(result.current.hasPermission('create')).toBe(true);
    });

    it('se a carga falhou, permite', () => {
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ error: 'rede', declaradas: [{ actionName: 'create' }] })),
        });

        expect(result.current.isAvailable).toBe(false);
        expect(result.current.hasPermission('create')).toBe(true);
    });

    it('capacidade que o catálogo não conhece é permitida, não negada', () => {
        // Foi o caso do `add`: a barra pedia um nome que nenhuma tela registrou. Negar diria
        // "você não tem permissão" quando a verdade é "essa capacidade não existe".
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ declaradas: [{ actionName: 'create' }], concedidas: [] })),
        });

        expect(result.current.hasPermission('add')).toBe(true);
    });
});

describe('negação de verdade', () => {
    it('declarada e não concedida é negada', () => {
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ declaradas: [{ actionName: 'delete' }], concedidas: [] })),
        });

        expect(result.current.isAvailable).toBe(true);
        expect(result.current.hasPermission('delete')).toBe(false);
        expect(result.current.canDelete).toBe(false);
    });

    it('declarada e concedida passa', () => {
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ declaradas: [{ actionName: 'edit' }], concedidas: ['edit'] })),
        });

        expect(result.current.hasPermission('edit')).toBe(true);
        expect(result.current.canEdit).toBe(true);
    });

    it('concedida sem estar declarada também passa', () => {
        // Um recurso pode ser declarado por mais de uma tela; a concessão vale mesmo que ESTA
        // tela não tenha registrado a ação.
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ declaradas: [], concedidas: ['view'] })),
        });

        expect(result.current.hasPermission('view')).toBe(true);
    });
});

describe('registro', () => {
    it('chega ao contexto com nome e descrição', () => {
        const registerAction = vi.fn();
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ registerAction })),
        });

        result.current.registerAction('create', 'Criar registro');

        expect(registerAction).toHaveBeenCalledWith('create', 'Criar registro', undefined);
    });

    it('sem nome não registra nada', () => {
        const registerAction = vi.fn();
        const { result } = renderHook(() => useOptionalTemplateSecurity(), {
            wrapper: comContexto(contextoDe({ registerAction })),
        });

        result.current.registerAction();

        expect(registerAction).not.toHaveBeenCalled();
    });
});
