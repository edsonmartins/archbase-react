import { describe, expect, it, vi } from 'vitest'

vi.mock('i18next', () => ({ t: (chave: string) => chave }))

import { processErrorMessage } from './ArchbaseErrorHelper'

/**
 * 401 de sessão encerrada: o archbase-security devolve {"error":"SESSAO_ENCERRADA"} quando o token
 * foi revogado (logout, ou outro login do mesmo usuário de sessão única). A tela não pode culpar a
 * senha nesse caso.
 */
describe('processErrorMessage — 401', () => {
  it('sessão encerrada por outro login não vira "usuário/senha"', () => {
    const erro = { response: { status: 401, data: { status: 401, error: 'SESSAO_ENCERRADA', message: 'x' } } }
    expect(processErrorMessage(erro)).toBe('archbase:sessao_encerrada')
  })

  it('o 401 sem motivo continua genérico', () => {
    expect(processErrorMessage({ response: { status: 401, data: '' } }))
      .toBe('archbase:Usuário/senha não encontrados. Não autorizado.')
    expect(processErrorMessage({ status: 401 }))
      .toBe('archbase:Usuário/senha não encontrados. Não autorizado.')
  })
})
