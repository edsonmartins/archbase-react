// @vitest-environment jsdom
/**
 * Os componentes de guarda marcam o que protegem.
 *
 * <p><b>Por que isto existe.</b> A primeira versão do realce exigia espalhar
 * `archbaseActionProps` à mão em cada botão — trabalho repetido, e fácil de esquecer justamente no
 * controle que importa. Mas o componente de guarda JÁ SABE a capacidade: é o argumento dele. Quem
 * envolve um botão em `ArchbaseProtectedComponent` passa a ganhar o realce sem escrever mais nada.
 *
 * <p>Clonar, e não envolver numa `div`: envolver mudaria o layout de quem já usa o componente — um
 * botão dentro de um `Group` do Mantine deixaria de ser filho direto e perderia o espaçamento.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

const hasPermission = vi.fn();
const registerAction = vi.fn();

vi.mock('./../src/ArchbaseSecurityHooks', () => ({
    useArchbaseViewSecurity: () => ({
        hasPermission,
        hasAnyPermission: () => false,
        hasAllPermissions: () => false,
        registerAction,
        securityManager: null,
        isLoading: false,
        error: null,
    }),
    useArchbaseSecurity: () => ({ isAdmin: true }),
}));

const { ArchbaseProtectedComponent } = await import('../src/ArchbaseSecurityComponents');
const { ATRIBUTO_DE_ACAO } = await import('../src/marcacaoDeAcao');

beforeEach(() => {
    hasPermission.mockReset();
    registerAction.mockReset();
});
afterEach(() => cleanup());

describe('ArchbaseProtectedComponent marca o que protege', () => {
    it('o filho renderizado carrega a capacidade', () => {
        hasPermission.mockReturnValue(true);

        render(
            <ArchbaseProtectedComponent actionName="aprovar_custo">
                <button>Aprovar</button>
            </ArchbaseProtectedComponent>,
        );

        expect(document.querySelector(`[${ATRIBUTO_DE_ACAO}="aprovar_custo"]`)).toBeTruthy();
    });

    it('marca cada filho quando há mais de um', () => {
        hasPermission.mockReturnValue(true);

        render(
            <ArchbaseProtectedComponent actionName="concluir">
                <button>Um</button>
                <button>Dois</button>
            </ArchbaseProtectedComponent>,
        );

        expect(document.querySelectorAll(`[${ATRIBUTO_DE_ACAO}="concluir"]`).length).toBe(2);
    });

    it('sem actionName não marca nada — não há capacidade a anunciar', () => {
        render(
            <ArchbaseProtectedComponent>
                <button>Livre</button>
            </ArchbaseProtectedComponent>,
        );

        expect(document.querySelector(`[${ATRIBUTO_DE_ACAO}]`)).toBeNull();
    });

    it('negado renderiza o fallback, e o fallback NÃO é marcado', () => {
        // O fallback é o que se mostra no lugar do controle; marcá-lo faria o realce desenhar a
        // capacidade sobre justamente o que ela não governa.
        hasPermission.mockReturnValue(false);

        render(
            <ArchbaseProtectedComponent actionName="concluir" fallback={<span>sem acesso</span>}>
                <button>Concluir</button>
            </ArchbaseProtectedComponent>,
        );

        expect(document.querySelector(`[${ATRIBUTO_DE_ACAO}]`)).toBeNull();
        expect(document.body.textContent).toContain('sem acesso');
    });

    it('texto solto como filho não quebra', () => {
        hasPermission.mockReturnValue(true);

        render(
            <ArchbaseProtectedComponent actionName="listar">
                texto puro
            </ArchbaseProtectedComponent>,
        );

        expect(document.body.textContent).toContain('texto puro');
    });
});
