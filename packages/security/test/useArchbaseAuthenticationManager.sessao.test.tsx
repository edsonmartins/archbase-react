// @vitest-environment jsdom
/**
 * <b>A sessão do admin caía a toda hora (VEN-1126).</b>
 *
 * <p>Medido no homolog do VendaX em 15/11: em seis dias, mais de 150 pares de token do mesmo usuário de sessão
 * única, cada um revogando o anterior, alguns a segundos um do outro. Três defeitos no front, um para cada grupo
 * de testes abaixo:</p>
 * <ol>
 *   <li><b>Aba desatualizada:</b> cada aba guardava o token na memória e não acompanhava o armazenamento. Depois de
 *   um login em outra aba, ela renovava com o refresh revogado; a renovação negada limpava o armazenamento e
 *   derrubava a aba boa também.</li>
 *   <li><b>Sem reação ao 401:</b> não se tentava o token guardado nem uma renovação. Quando havia renovação, cada
 *   chamada fazia a sua, e com sessão única a segunda é negada por causa da primeira.</li>
 *   <li><b>Login duplicado:</b> dois `loginWithContext` no mesmo milissegundo, que revogam os tokens um do
 *   outro.</li>
 * </ol>
 */
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { processErrorMessage } from '@archbase/core'

const container = vi.hoisted(() => ({ tokenManager: null as any, authenticator: null as any }))

vi.mock('inversify-react', () => ({
  useContainer: (fn: (c: any) => any) =>
    fn({ get: (tipo: any) => (String(tipo).includes('Token') ? container.tokenManager : container.authenticator) }),
}))
vi.mock('@archbase/data', async (original) => ({
  ...(await original<any>()),
  useArchbaseStore: () => ({ clearAllValues: () => {} }),
}))
vi.mock('@archbase/core', async (original) => {
  const real = await original<any>()
  return {
    ...real,
    ARCHBASE_IOC_API_TYPE: { ...real.ARCHBASE_IOC_API_TYPE, TokenManager: 'TokenManager', Authenticator: 'Authenticator' },
  }
})

const { useArchbaseAuthenticationManager } = await import('../src/hooks/useArchbaseAuthenticationManager')
const { getArchbaseTokenRenewer } = await import('@archbase/data')

const token = (nome: string) => ({ access_token: nome, refresh_token: 'refresh-' + nome, expires_in: 3600 }) as any

/** O localStorage do navegador, compartilhado entre as abas. */
let guardado: any
const SESSAO_ENCERRADA = processErrorMessage({ response: { status: 401, data: { error: 'SESSAO_ENCERRADA' } } })

/** Outra aba grava (ou apaga) o token: o navegador avisa as demais pelo evento `storage`. */
function outraAbaGrava(t: any) {
  guardado = t
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: 'token' }))
  })
}

function montar(inicial: any) {
  guardado = inicial
  return renderHook(() => useArchbaseAuthenticationManager({}))
}

beforeEach(() => {
  guardado = null
  container.tokenManager = {
    getToken: () => guardado,
    saveToken: (t: any) => {
      guardado = t
    },
    clearToken: () => {
      guardado = null
    },
    isTokenExpired: (t: any) => Boolean(t?.vencido),
    getUsername: () => null,
    saveUsername: () => {},
    clearUsernameAndPassword: () => {},
    saveUsernameAndPassword: () => {},
  }
  container.authenticator = {
    refreshToken: vi.fn(),
    login: vi.fn(),
    loginWithContext: vi.fn(),
  }
})

afterEach(() => cleanup())

describe('1. a aba acompanha o armazenamento', () => {
  it('login em outra aba: esta passa a usar o token novo', () => {
    const { result } = montar(token('A'))
    expect(result.current.accessToken).toBe('A')

    outraAbaGrava(token('B'))

    expect(result.current.accessToken).toBe('B')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('logout em outra aba: esta sai também, em vez de seguir com um token que já não vale', () => {
    const { result } = montar(token('A'))

    outraAbaGrava(null)

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.accessToken).toBeNull()
  })

  it('a renovação não roda com o refresh velho quando outra aba já gravou um token que vale', async () => {
    const { result } = montar(token('A'))
    guardado = token('B') // sem evento: a aba estava suspensa e não o recebeu

    const novo = await act(() => getArchbaseTokenRenewer()!('A'))

    expect(novo).toBe('B')
    expect(container.authenticator.refreshToken).not.toHaveBeenCalled()
    expect(result.current.accessToken).toBe('B')
  })
})

describe('2. o 401 renova, uma vez, e só sai quando a renovação é negada', () => {
  it('três pedidos com 401 ao mesmo tempo fazem uma renovação só', async () => {
    montar(token('A'))
    let soltar: (t: any) => void = () => {}
    container.authenticator.refreshToken.mockReturnValue(new Promise((r) => (soltar = r)))

    const pedidos = [1, 2, 3].map(() => getArchbaseTokenRenewer()!('A'))
    await act(async () => soltar(token('C')))

    expect(await Promise.all(pedidos)).toEqual(['C', 'C', 'C'])
    expect(container.authenticator.refreshToken).toHaveBeenCalledTimes(1)
    expect(container.authenticator.refreshToken).toHaveBeenCalledWith('refresh-A')
    expect(guardado.access_token).toBe('C')
  })

  it('renovação negada: sai, limpa o armazenamento e diz que a sessão foi encerrada', async () => {
    const { result } = montar(token('A'))
    container.authenticator.refreshToken.mockRejectedValue(new Error('refresh revogado'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const novo = await act(() => getArchbaseTokenRenewer()!('A'))

    expect(novo).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(guardado).toBeNull()
    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBe(SESSAO_ENCERRADA)
  })

  it('renovação negada porque outra aba renovou antes: adota o token dela e NÃO apaga o armazenamento', async () => {
    const { result } = montar(token('A'))
    container.authenticator.refreshToken.mockImplementation(async () => {
      guardado = token('D') // a outra aba ganhou a corrida pelo mesmo refresh
      throw new Error('refresh já rotacionado')
    })

    const novo = await act(() => getArchbaseTokenRenewer()!('A'))

    expect(novo).toBe('D')
    expect(guardado.access_token).toBe('D')
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.accessToken).toBe('D')
  })
})

describe('3. um login por vez', () => {
  it('dois envios do formulário antes da resposta mandam um login só', async () => {
    const { result } = montar(null)
    let soltar: (t: any) => void = () => {}
    container.authenticator.loginWithContext.mockReturnValue(new Promise((r) => (soltar = r)))
    const pedido = { email: 'a@b.c', password: 'x', context: 'WEB_ADMIN' } as any

    let primeiro: Promise<void>, segundo: Promise<void>
    act(() => {
      primeiro = result.current.loginWithContext!(pedido)
      segundo = result.current.loginWithContext!(pedido)
    })
    await act(async () => {
      soltar({ ...token('E'), context: null, user: {} })
      await Promise.all([primeiro!, segundo!])
    })

    expect(container.authenticator.loginWithContext).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(result.current.accessToken).toBe('E'))
  })

  it('terminado o primeiro, um login novo vai ao servidor normalmente', async () => {
    const { result } = montar(null)
    container.authenticator.loginWithContext.mockResolvedValue({ ...token('F'), context: null, user: {} })
    const pedido = { email: 'a@b.c', password: 'x', context: 'WEB_ADMIN' } as any

    await act(() => result.current.loginWithContext!(pedido))
    await act(() => result.current.loginWithContext!(pedido))

    expect(container.authenticator.loginWithContext).toHaveBeenCalledTimes(2)
  })
})
