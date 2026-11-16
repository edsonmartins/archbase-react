/**
 * Quem renova a sessão quando um pedido recebe 401.
 *
 * O cliente HTTP ({@link ArchbaseAxiosRemoteApiClient}) não conhece o autenticador: o autenticador é que usa o
 * cliente. Quem sabe renovar é o `useArchbaseAuthenticationManager`, que se registra aqui ao montar. Sem
 * renovador registrado, o 401 volta como sempre voltou.
 *
 * O renovador recebe o access token que o servidor recusou e devolve o novo, ou `null` quando a sessão acabou (o
 * refresh também foi negado). Ele é responsável por fazer UMA renovação só para todos os pedidos que pedirem ao
 * mesmo tempo: com sessão única, duas renovações concorrentes revogam uma à outra.
 */
export type ArchbaseTokenRenewer = (accessTokenRecusado: string) => Promise<string | null>

let renovador: ArchbaseTokenRenewer | null = null

/** Registra o renovador e devolve a função que o desfaz (só desfaz se ainda for ele o registrado). */
export function registerArchbaseTokenRenewer(fn: ArchbaseTokenRenewer): () => void {
  renovador = fn
  return () => {
    if (renovador === fn) {
      renovador = null
    }
  }
}

export function getArchbaseTokenRenewer(): ArchbaseTokenRenewer | null {
  return renovador
}
