import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * <b>O 401 tenta o token novo antes de desistir (VEN-1126).</b>
 *
 * <p>A renovação só acontecia por relógio, 5 minutos antes de vencer. O pedido que recebia 401 só mostrava o erro,
 * mesmo quando o armazenamento já tinha o token novo, gravado pelo login em outra aba, ou quando uma renovação
 * resolveria. Com sessão única do lado do servidor, isso derrubava o admin a cada login em outra aba.</p>
 */

const axiosMock = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), patch: vi.fn() }))
vi.mock('axios', () => ({ default: axiosMock }))

const { ArchbaseAxiosRemoteApiClient } = await import('../src/service/ArchbaseRemoteApiService')
const { registerArchbaseTokenRenewer } = await import('../src/service/ArchbaseTokenRenewal')

let guardado: string | null
const tokenManager: any = { getToken: () => (guardado ? { access_token: guardado } : null) }

const nao401 = () => Object.assign(new Error('500'), { response: { status: 500 } })
const recusa = () => Object.assign(new Error('401'), { response: { status: 401, data: { error: 'SESSAO_ENCERRADA' } } })
const usado = (i: number) => axiosMock.get.mock.calls[i][1].headers.Authorization

let desregistrar: () => void = () => {}

beforeEach(() => {
  Object.values(axiosMock).forEach((m) => m.mockReset())
  desregistrar()
  guardado = 'velho'
})

describe('comSessao — o 401 de um pedido com token', () => {
  it('outra aba já gravou o token novo: repete com ele, sem renovar', async () => {
    const renovador = vi.fn()
    desregistrar = registerArchbaseTokenRenewer(renovador)
    axiosMock.get.mockImplementationOnce(async () => {
      guardado = 'da-outra-aba'
      throw recusa()
    })
    axiosMock.get.mockResolvedValueOnce({ data: { ok: true } })

    const r = await new ArchbaseAxiosRemoteApiClient(tokenManager).get<any>('/x')

    expect(r).toEqual({ ok: true })
    expect(usado(0)).toBe('Bearer velho')
    expect(usado(1)).toBe('Bearer da-outra-aba')
    expect(renovador).not.toHaveBeenCalled()
  })

  it('o guardado é o mesmo que foi recusado: pede ao renovador e repete com o token renovado', async () => {
    const renovador = vi.fn().mockResolvedValue('renovado')
    desregistrar = registerArchbaseTokenRenewer(renovador)
    axiosMock.get.mockRejectedValueOnce(recusa()).mockResolvedValueOnce({ data: { ok: true } })

    await new ArchbaseAxiosRemoteApiClient(tokenManager).get<any>('/x')

    expect(renovador).toHaveBeenCalledWith('velho')
    expect(usado(1)).toBe('Bearer renovado')
  })

  it('renovação negada: o 401 original volta, e não há segunda tentativa', async () => {
    desregistrar = registerArchbaseTokenRenewer(vi.fn().mockResolvedValue(null))
    const erro = recusa()
    axiosMock.get.mockRejectedValueOnce(erro)

    await expect(new ArchbaseAxiosRemoteApiClient(tokenManager).get('/x')).rejects.toBe(erro)
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
  })

  it('tenta uma vez só: um segundo 401 com o token novo volta para quem chamou', async () => {
    desregistrar = registerArchbaseTokenRenewer(vi.fn().mockResolvedValue('renovado'))
    const segundo = recusa()
    axiosMock.get.mockRejectedValueOnce(recusa()).mockRejectedValueOnce(segundo)

    await expect(new ArchbaseAxiosRemoteApiClient(tokenManager).get('/x')).rejects.toBe(segundo)
    expect(axiosMock.get).toHaveBeenCalledTimes(2)
  })

  it('sem renovador registrado, o 401 volta como sempre voltou', async () => {
    const erro = recusa()
    axiosMock.get.mockRejectedValueOnce(erro)

    await expect(new ArchbaseAxiosRemoteApiClient(tokenManager).get('/x')).rejects.toBe(erro)
    expect(axiosMock.get).toHaveBeenCalledTimes(1)
  })

  it('pedido sem token (login, refresh) não entra na renovação', async () => {
    const renovador = vi.fn().mockResolvedValue('renovado')
    desregistrar = registerArchbaseTokenRenewer(renovador)
    const erro = recusa()
    axiosMock.post.mockRejectedValueOnce(erro)

    await expect(new ArchbaseAxiosRemoteApiClient(tokenManager).post('/auth/login', {}, {}, true)).rejects.toBe(erro)
    expect(renovador).not.toHaveBeenCalled()
    expect(axiosMock.post).toHaveBeenCalledTimes(1)
  })

  it('erro que não é 401 não é sessão: volta direto', async () => {
    const renovador = vi.fn()
    desregistrar = registerArchbaseTokenRenewer(renovador)
    const erro = nao401()
    axiosMock.get.mockRejectedValueOnce(erro)

    await expect(new ArchbaseAxiosRemoteApiClient(tokenManager).get('/x')).rejects.toBe(erro)
    expect(renovador).not.toHaveBeenCalled()
  })

  it('vale para os outros verbos: o PUT renovado repete com o mesmo corpo', async () => {
    desregistrar = registerArchbaseTokenRenewer(vi.fn().mockResolvedValue('renovado'))
    axiosMock.put.mockRejectedValueOnce(recusa()).mockResolvedValueOnce({ data: { ok: true } })

    await new ArchbaseAxiosRemoteApiClient(tokenManager).put('/x', { a: 1 })

    expect(axiosMock.put.mock.calls[1][1]).toEqual(axiosMock.put.mock.calls[0][1])
    expect(axiosMock.put.mock.calls[1][2].headers.Authorization).toBe('Bearer renovado')
  })
})
