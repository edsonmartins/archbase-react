/* eslint-disable */
import { TTokenResponse } from './Types'
export const FALLBACK_EXPIRE_TIME = 600 // 10minutes

// Retorna o tempo da época (em segundos) para quando o token expirará
export const epochAtSecondsFromNow = (secondsFromNow: number) =>
  Math.round(Date.now() / 1000 + secondsFromNow)

/**
 * Verifique se o token de acesso expirou.
 * Retornará True se o token expirou OU falta menos de 30 segundos para expirar.
 */
export function epochTimeIsPast(timestamp: number): boolean {
  const now = Math.round(Date.now()) / 1000
  const nowWithBuffer = now + 30
  return nowWithBuffer >= timestamp
}

const refreshExpireKeys = [
  'refresh_expires_in', // KeyCloak
  'refresh_token_expires_in' // Azure AD
] as const

export function getRefreshExpiresIn(tokenExpiresIn: number, response: TTokenResponse): number {
  for (const key of refreshExpireKeys) {
    if (key in response) return response[key] as number
  }
  // Se a resposta tiver um refresh_token, mas nenhum expire_time. Suponha que seja pelo menos 10m a mais do que a expiração do access_token
  if (response.refresh_token) return tokenExpiresIn + FALLBACK_EXPIRE_TIME
  // A resposta do token não tinha refresh_token. Defina refresh_expire igual a access_token expire
  return tokenExpiresIn
}
