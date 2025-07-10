/* eslint-disable */
import { TArchbaseAuthConfig, TInternalConfig } from './Types'

function stringIsUnset(value: any) {
  const unset = ['', undefined, null]
  return unset.includes(value)
}

export function createInternalConfig(passedConfig: TArchbaseAuthConfig): TInternalConfig {
  // Set default values for internal config object
  const {
    autoLogin = true,
    clearURL = true,
    decodeToken = true,
    scope = undefined,
    preLogin = () => null,
    postLogin = () => null,
    onRefreshTokenExpire = undefined,
    storage = 'local'
  }: TArchbaseAuthConfig = passedConfig

  const config: TInternalConfig = {
    ...passedConfig,
    autoLogin: autoLogin,
    clearURL: clearURL,
    decodeToken: decodeToken,
    scope: scope,
    preLogin: preLogin,
    postLogin: postLogin,
    onRefreshTokenExpire: onRefreshTokenExpire,
    storage: storage
  }
  validateConfig(config)
  return config
}

export function validateConfig(config: TInternalConfig) {
  if (stringIsUnset(config?.clientId))
    throw Error(
      "'clientId' deve ser definido no objeto 'ArchbaseAuthConfig' passado para ArchbaseAuthProvider"
    )
  if (stringIsUnset(config?.authorizationEndpoint))
    throw Error(
      "'authorizationEndpoint' deve ser definido no objeto 'ArchbaseAuthConfig' passado para ArchbaseAuthProvider"
    )
  if (stringIsUnset(config?.tokenEndpoint))
    throw Error(
      "'tokenEndpoint' deve ser definido no objeto 'ArchbaseAuthConfig' passado para ArchbaseAuthProvider"
    )
  if (stringIsUnset(config?.redirectUri))
    throw Error(
      "'redirectUri' deve ser definido no objeto 'ArchbaseAuthConfig' passado para ArchbaseAuthProvider"
    )
  if (!['session', 'local'].includes(config.storage))
    throw Error("'storage' deve ser um dos ('session', 'local')")
  if (config?.extraAuthParams)
    console.warn(
      "O parâmetro de configuração 'extraAuthParams' é obsoleto. Você deveria usar " +
        "'extraTokenParameters' em vez de 'extraAuthParams'."
    )
  if (config?.extraAuthParams && config?.extraTokenParameters)
    console.warn(
      "Usar 'extraAuthParams' e 'extraTokenParameters' não é recomendado. " +
        "Eles fazem a mesma coisa e você deve usar apenas 'extraTokenParameters'"
    )
}
