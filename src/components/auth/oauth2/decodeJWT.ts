/* eslint-disable */
import { TTokenData } from './Types'

/**
 * Decodifica o JWT codificado em base64. Retorna um TToken.
 */
export const decodeJWT = (token: string): TTokenData => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error(e)
    throw Error(
      'Falha ao decodificar o token de acesso.\n\tÉ um JSON Web Token adequado?\n\t' +
        "Você pode desativar a decodificação JWT definindo o valor 'decodeToken' como 'falso' na configuração."
    )
  }
}
