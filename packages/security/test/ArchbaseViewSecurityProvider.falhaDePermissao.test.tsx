// @vitest-environment jsdom
/**
 * Falha na consulta de permissão nega a tela — não derruba a aplicação.
 *
 * <p><b>O defeito.</b> O `useEffect` que anuncia a tela ao inspetor ficava depois dos retornos
 * antecipados do provider. O primeiro render (carregando) passava por ele; quando a consulta
 * falhava, o render seguinte saía no ramo de erro, antes do hook — React #300, "Rendered fewer
 * hooks than expected" — e a barreira de erro da aplicação derrubava tudo. Só acontecia com
 * não-administrador recebendo erro de `GET /resource/permissions/{recurso}`, que é justamente
 * quando o provider precisa negar com motivo visível.
 */
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import type { ArchbaseSecurityContextType } from '../src/ArchbaseSecurityContext';

const registerResource = vi.fn();
const findLoggedUserResourcePermissions = vi.fn();

vi.mock('@archbase/core', async (original) => ({
    ...(await original<typeof import('@archbase/core')>()),
    IOCContainer: {
        getContainer: () => ({
            get: () => ({ registerResource, findLoggedUserResourcePermissions }),
        }),
    },
}));

const { ArchbaseSecurityContext, ArchbaseViewSecurityProvider } = await import('../src/ArchbaseSecurityContext');

const contextoGlobal = (user: any): ArchbaseSecurityContextType =>
    ({
        user,
        isAdmin: false,
        isLoading: false,
        error: null,
        hasPermission: () => false,
        hasAnyPermission: () => false,
        hasAllPermissions: () => false,
    }) as unknown as ArchbaseSecurityContextType;

function Tela({ user = { id: 'u1' } as any, onError }: { user?: any; onError?: (e: string) => void }) {
    return (
        <ArchbaseSecurityContext.Provider value={contextoGlobal(user)}>
            <ArchbaseViewSecurityProvider resourceName="Cockpit" resourceDescription="Cockpit" onError={onError}>
                <div>conteúdo da tela</div>
            </ArchbaseViewSecurityProvider>
        </ArchbaseSecurityContext.Provider>
    );
}

const rejeicoes: unknown[] = [];
const aoRejeitar = (motivo: unknown) => rejeicoes.push(motivo);

beforeEach(() => {
    registerResource.mockReset();
    findLoggedUserResourcePermissions.mockReset();
    rejeicoes.length = 0;
    process.on('unhandledRejection', aoRejeitar);
});

afterEach(() => {
    process.off('unhandledRejection', aoRejeitar);
    cleanup();
    vi.restoreAllMocks();
});

describe('ArchbaseViewSecurityProvider quando a consulta de permissão falha', () => {
    it('carregando → erro renderiza o estado de erro sem lançar', async () => {
        findLoggedUserResourcePermissions.mockRejectedValue(new Error('Request failed with status code 503'));
        const onError = vi.fn();
        const erroDeConsole = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(<Tela onError={onError} />);

        // Carregando: os filhos montam (é o que permite registrarem suas ações).
        expect(screen.getByText('conteúdo da tela')).toBeTruthy();

        await waitFor(() => expect(document.querySelector('.archbase-security-error')).toBeTruthy());

        expect(screen.queryByText('conteúdo da tela')).toBeNull();
        expect(document.querySelector('.archbase-security-error')?.textContent).toContain('503');
        expect(onError).toHaveBeenCalledTimes(1);
        // O React avisa da troca de ordem de hooks pelo console antes de lançar.
        expect(erroDeConsole).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(rejeicoes).toEqual([]);
    });

    it('sucesso → erro numa nova consulta também não troca a contagem de hooks', async () => {
        findLoggedUserResourcePermissions.mockResolvedValueOnce({ permissions: ['VER'] });
        const erroDeConsole = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { rerender } = render(<Tela />);
        await waitFor(() => expect(findLoggedUserResourcePermissions).toHaveBeenCalledTimes(1));
        expect(screen.getByText('conteúdo da tela')).toBeTruthy();

        // Outro usuário: manager novo, consulta nova — e desta vez ela falha.
        findLoggedUserResourcePermissions.mockRejectedValueOnce(new Error('Request failed with status code 404'));
        rerender(<Tela user={{ id: 'u2' }} />);

        await waitFor(() => expect(document.querySelector('.archbase-security-error')).toBeTruthy());
        expect(erroDeConsole).not.toHaveBeenCalled();
    });

    it('sem usuário → com usuário não troca a contagem de hooks', async () => {
        findLoggedUserResourcePermissions.mockResolvedValue({ permissions: [] });
        const erroDeConsole = vi.spyOn(console, 'error').mockImplementation(() => {});

        const { rerender } = render(<Tela user={null} />);
        expect(document.querySelector('.archbase-security-no-user')).toBeTruthy();

        rerender(<Tela />);
        await waitFor(() => expect(screen.getByText('conteúdo da tela')).toBeTruthy());
        expect(erroDeConsole).not.toHaveBeenCalled();
    });
});
