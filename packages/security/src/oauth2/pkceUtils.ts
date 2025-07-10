/* eslint-disable */
export function getRandomInteger(range: number): number {
  const max_range = 256 // Maior número possível em Uint8

  // Crie uma matriz de bytes e preencha com 1 número aleatório
  const byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray) // Esta é a API nova e mais segura do que Math.Random()

  // Se o número gerado estiver fora do intervalo, tente novamente
  if (byteArray[0] >= Math.floor(max_range / range) * range) return getRandomInteger(range)
  return byteArray[0] % range
}

export function generateRandomString(length: number): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(getRandomInteger(possible.length - 1))
  }
  return text
}
/**
 *  PKCE Code Challenge = base64url(hash(codeVerifier))
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  if (!window.crypto.subtle?.digest) {
    throw new Error(
      "The context/environment is not secure, and does not support the 'crypto.subtle' module. See: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle for details"
    )
  }
  const encoder = new TextEncoder()
  const bytes: Uint8Array = encoder.encode(codeVerifier) // Codifique o verificador para um byteArray
  const hash: ArrayBuffer = await window.crypto.subtle.digest('SHA-256', bytes) // sha256 hash it
  const hashString: string = String.fromCharCode(...new Uint8Array(hash))
  const base64 = btoa(hashString) // Base64 codifica o hash do verificador
  return base64 // Base64Url codifica a string codificada em base64, tornando-a segura como um parâmetro de consulta
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
