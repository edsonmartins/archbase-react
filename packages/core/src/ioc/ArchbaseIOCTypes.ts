export const ARCHBASE_IOC_API_TYPE = {
  Authenticator: Symbol.for('Authenticator'),
  TokenManager: Symbol.for('TokenManager'),
  ApiClient: Symbol.for('ApiClient'),
  User: Symbol.for('User'),
  Group: Symbol.for('Group'),
  Profile: Symbol.for('Profile'),
  Resource: Symbol.for('Resource'),
  ApiToken: Symbol.for('ApiToken'),
  AccessToken: Symbol.for('AccessToken'),
  /**
   * Leitura do diagnóstico de acesso — panorama, efetivo do usuário e simulação.
   * Serviço somente leitura; não é o CRUD de nenhuma entidade.
   */
  SecurityDiagnostics: Symbol.for('SecurityDiagnostics'),
}
