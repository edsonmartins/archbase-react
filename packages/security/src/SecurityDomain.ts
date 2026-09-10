import { v4 as uuidv4 } from 'uuid'
import { SecurityType } from './SecurityType';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from '@archbase/core';

export enum TipoRecurso {
  VIEW = 'VIEW',
  API = 'API'
}

export class AccessScheduleDto {
  id: string;
  code: string;
  version: number;
  createEntityDate: string;
  updateEntityDate: string;
  createdByUser: string;
  lastModifiedByUser: string;

  @IsNotEmpty({
    message: 'archbase:Informe a descrição do cronograma de acesso'
  })
  description: string;

  intervals: AccessIntervalDto[];

  constructor(data: any) {
    this.id = data.id || '';
    this.code = data.code || '';
    this.version = data.version || 0;
    this.createEntityDate = data.createEntityDate || '';
    this.updateEntityDate = data.updateEntityDate || '';
    this.createdByUser = data.createdByUser || '';
    this.lastModifiedByUser = data.lastModifiedByUser || '';
    this.description = data.description || '';
    this.intervals = data.intervals ? data.intervals.map((interval: any) => new AccessIntervalDto(interval)) : [];
  }

  static newInstance = () => {
    return new AccessScheduleDto({
      id: uuidv4(),
      intervals: [],
    });
  }
}

export class AccessIntervalDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string

  @IsOptional()
  accessSchedule?: AccessScheduleDto

  dayOfWeek: number

  @IsNotEmpty({
    message: 'archbase:Informe a hora de início'
  })
  startTime: string

  @IsNotEmpty({
    message: 'archbase:Informe a hora de término'
  })
  endTime: string

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || new Date().toISOString()
    this.updateEntityDate = data.updateEntityDate || new Date().toISOString()
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.accessSchedule = data.accessSchedule ? new AccessScheduleDto(data.accessSchedule) : undefined
    this.dayOfWeek = data.dayOfWeek || 0
    this.startTime = data.startTime || ''
    this.endTime = data.endTime || ''
  }

  static newInstance = () => {
    return new AccessIntervalDto({
      id: uuidv4(),
      dayOfWeek: new Date().getDay(),
      startTime: '08:00',
      endTime: '17:00'
    })
  }
}

export abstract class SecurityDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string

  @IsNotEmpty({
    message: 'archbase:Informe o nome'
  })
  name: string

  @IsNotEmpty({
    message: 'archbase:Informe a descrição'
  })
  description: string

  @IsOptional()
  actions: ActionDto[]

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || ''
    this.updateEntityDate = data.updateEntityDate || ''
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.name = data.name || ''
    this.description = data.description || ''
    this.actions = data.actions || []
  }
}

export class ActionDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string

  @IsNotEmpty({
    message: 'archbase:Informe o nome para a ação'
  })
  name: string

  @IsNotEmpty({
    message: 'archbase:Informe a descrição para a ação'
  })
  description: string

  @IsOptional()
  resource?: ResourceDto

  @IsNotEmpty({
    message: 'archbase:Informe a categoria para a ação'
  })
  category: string

  @IsBoolean()
  active: boolean

  actionVersion: string

  isNewAction: boolean

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || new Date().toISOString()
    this.updateEntityDate = data.updateEntityDate || new Date().toISOString()
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.name = data.name || ''
    this.description = data.description || ''
    this.resource = data.resource ? new ResourceDto(data.resource) : undefined
    this.category = data.category || ''
    this.active = data.active || false
    this.actionVersion = data.actionVersion || ''
    this.isNewAction = data.isNewAction || false
  }

  static newInstance = () => {
    return new ActionDto({
      id: uuidv4(),
      active: true,
      isNewAction: true
    })
  }
}

export class ProfileDto extends SecurityDto {
  type: string
  isNewProfile: boolean

  constructor(data: any) {
    super(data)
    this.type = SecurityType.PROFILE;
    this.isNewProfile = data.isNewProfile || false
  }

  static newInstance = () => {
    return new ProfileDto({
      id: uuidv4(),
      isNewProfile: true
    })
  }
}

export class UserGroupDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string
  group?: GroupDto;

  constructor(data: any) {
    this.id = data.id;
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || new Date().toISOString()
    this.updateEntityDate = data.updateEntityDate || new Date().toISOString()
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.group = data.group ? new GroupDto(data.group) : undefined
  }

  static newInstance = (group: GroupDto) => {
    return new UserGroupDto({
      id: uuidv4(),
      group: group
    })
  }
}

export class GroupDto extends SecurityDto {
  type: string
  isNewGroup: boolean

  constructor(data: any) {
    super(data)
    this.type = SecurityType.GROUP;
    this.isNewGroup = data.isNewGroup || false
  }

  static newInstance = () => {
    return new GroupDto({
      id: uuidv4(),
      isNewGroup: true
    })
  }
}

export class ResourceDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string

  @IsNotEmpty({
    message: 'archbase:Informe o nome para o recurso'
  })
  name: string

  @IsNotEmpty({
    message: 'archbase:Informe a descrição para o recurso'
  })
  description: string

  actions: ActionDto[]

  @IsBoolean()
  active: boolean

  type: TipoRecurso

  isNewResource: boolean

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || ''
    this.updateEntityDate = data.updateEntityDate || ''
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.name = data.name || ''
    this.description = data.description || ''
    this.actions = data.actions || []
    this.active = data.active || false
    this.type = data.type || TipoRecurso.VIEW
    this.isNewResource = data.isNewResource || false
  }

  static newInstance = () => {
    return new ResourceDto({
      id: uuidv4(),
      actions: [],
      active: true,
      isNewResource: true
    })
  }
}

export class UserDto extends SecurityDto {
  @IsNotEmpty({
    message: 'archbase:Informe o nome de usuário'
  })
  userName: string

  password: string

  @IsBoolean()
  changePasswordOnNextLogin: boolean

  @IsBoolean()
  allowPasswordChange: boolean

  @IsBoolean()
  allowMultipleLogins: boolean

  @IsBoolean()
  passwordNeverExpires: boolean

  /**
   * Data da última troca de senha, preenchida pelo backend. Base de cálculo da expiração
   * periódica quando `archbase.security.password.expiration-days` está configurado.
   * Somente leitura — o backend a atualiza sozinho a cada troca de senha.
   */
  @IsOptional()
  passwordChangedAt?: string

  @IsBoolean()
  accountDeactivated: boolean

  @IsBoolean()
  accountLocked: boolean

  @IsBoolean()
  unlimitedAccessHours: boolean

  @IsBoolean()
  isAdministrator: boolean

  @IsOptional()
  accessSchedule?: AccessScheduleDto

  @IsOptional()
  groups: UserGroupDto[]

  @IsOptional()
  profile?: ProfileDto

  avatar?: string

  nickname: string

  @IsEmail(
    {},
    {
      message: 'archbase:Informe um email válido'
    }
  )
  email?: string

  type: string

  isNewUser: boolean

  /**
   * Matrícula do funcionário na empresa: o número pelo qual o RH e a folha identificam a pessoa,
   * e que costuma ser o elo com ponto, crachá e folha de pagamento.
   *
   * Opcional de propósito — contas de serviço e usuários que não são funcionários não têm uma.
   * Não é única: bases herdadas de sistemas antigos costumam ter matrícula repetida, e quem
   * precisar exigir unicidade cria o índice decidindo o escopo (global ou por tenant).
   *
   * Não confundir com {@link externalId}, que identifica a conta num provedor de identidade
   * (Keycloak, LDAP). Uma é o vínculo empregatício, a outra é a credencial — convivem.
   *
   * Requer archbase-security 3.1.20 ou superior no backend.
   */
  @IsOptional()
  employeeId?: string

  /**
   * ID da conta num provedor de identidade externo (Keycloak, LDAP e afins).
   *
   * Existe no backend desde antes da matrícula, mas nunca esteve neste DTO — então a tela lia e
   * devolvia o usuário sem ele. Declarado aqui para que o valor sobreviva a uma edição, junto com
   * a correção do lado do servidor que passou a gravá-lo.
   */
  @IsOptional()
  externalId?: string

  constructor(data: any) {
    super(data)
    this.type = SecurityType.USER;
    this.userName = data.userName || ''
    this.password = data.password || ''
    this.changePasswordOnNextLogin = data.changePasswordOnNextLogin || false
    this.allowPasswordChange = data.allowPasswordChange || false
    this.allowMultipleLogins = data.allowMultipleLogins || false
    this.passwordNeverExpires = data.passwordNeverExpires || false
    this.passwordChangedAt = data.passwordChangedAt || undefined
    this.accountDeactivated = data.accountDeactivated || false
    this.accountLocked = data.accountLocked || false
    this.unlimitedAccessHours = data.unlimitedAccessHours || false
    this.isAdministrator = data.isAdministrator || false
    this.accessSchedule = data.accessSchedule ? new AccessScheduleDto(data.accessSchedule) : undefined
    this.groups = data.groups ? data.groups.map((group: any) => new UserGroupDto(group)) : []
    this.profile = data.profile ? new ProfileDto(data.profile) : undefined
    this.email = data.email || ''
    this.avatar = data.avatar || undefined
    this.isNewUser = data.isNewUser || false
    this.nickname = data.nickname
    // `undefined` e não '': o backend distingue "sem matrícula" de "matrícula vazia", e mandar
    // string vazia gravaria um valor em branco onde deveria ficar nulo.
    this.employeeId = data.employeeId || undefined
    this.externalId = data.externalId || undefined
  }

  static newInstance = () => {
    return new UserDto({
      id: uuidv4(),
      userName: '',
      password: '',
      groups: [],
      avatar: null,
      isAdministrator: false,
      allowPasswordChange: true,
      passwordNeverExpires: true,
      isNewUser: true
    })
  }
}

export class PermissionDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string

  @IsOptional()
  security?: SecurityDto

  @IsOptional()
  action?: ActionDto

  tenantId: string
  companyId: string
  projectId: string

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || ''
    this.updateEntityDate = data.updateEntityDate || ''
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.security = data.security ? PermissionDto.createDtoFromJson(data.security) : undefined
    this.action = data.action ? new ActionDto(data.action) : undefined
    this.tenantId = data.tenantId || ''
    this.companyId = data.companyId || ''
    this.projectId = data.projectId || ''
  }

  static createDtoFromJson(data: any): SecurityDto {
    switch (data.type) {
      case 'profile':
        return new ProfileDto(data)
      case 'group':
        return new GroupDto(data)
      case 'user':
        return new UserDto(data)
      default:
        throw new Error('Unknown DTO type')
    }
  }

  static newInstance = () => {
    return new PermissionDto({
      id: uuidv4(),
      tenantId: '',
      companyId: '',
      projectId: ''
    })
  }
}


export class ApiTokenDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string
  tenantId: string

  name: string
  description: string
  token: string
  user: UserDto
  expirationDate: string
  revoked: boolean
  activated: boolean
  isNovoToken: boolean

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || ''
    this.updateEntityDate = data.updateEntityDate || ''
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.tenantId = data.tenantId || ''
    this.user = data.user ? new UserDto(data.user) : undefined
    this.name = data.name || ''
    this.description = data.description || ''
    this.token = data.token || ''
    this.expirationDate = data.expirationDate
    this.revoked = data.revoked
    this.activated = data.activated || false
  }

  static newInstance = () => {
    return new ApiTokenDto({
      id: uuidv4(),
    })
  }
}


export class AccessTokenDto {
  id: string
  code: string
  version: number
  createEntityDate: string
  updateEntityDate: string
  createdByUser: string
  lastModifiedByUser: string
  token: string
  tokenType: string
  revoked: boolean
  expired: boolean
  expirationTime: number
  expirationDate: string
  user: UserDto
  isNewAccessToken: boolean

  constructor(data: any) {
    this.id = data.id || ''
    this.code = data.code || ''
    this.version = data.version || 0
    this.createEntityDate = data.createEntityDate || new Date().toISOString()
    this.updateEntityDate = data.updateEntityDate || new Date().toISOString()
    this.createdByUser = data.createdByUser || ''
    this.lastModifiedByUser = data.lastModifiedByUser || ''
    this.token = data.token || ''
    this.tokenType = data.tokenType || undefined
    this.user = data.user ? new UserDto(data.user) : undefined
    this.revoked = data.revoked || false
    this.expired = data.expired || false
    this.expirationTime = data.expirationTime || 0
    this.expirationDate = data.expirationDate || ""
    this.isNewAccessToken = data.isNewAccessToken || false
  }

  static newInstance = () => {
    return new AccessTokenDto({
      id: uuidv4(),
      active: true,
      isNewAccessToken: true
    })
  }
}

export interface GrantPermissionDto {
  securityId: string
  actionId: string
  type: string
}

export interface PermissionWithTypesDto {
  /**
   * A concessão a remover — **ausente quando a capacidade chega por herança**.
   *
   * Sem ela não há o que apagar: a permissão é do grupo ou do perfil, e removê-la a partir da tela
   * de uma pessoa tiraria o acesso de todo mundo. A interface precisa **dizer isso**; apenas
   * desabilitar o botão faz quem administra clicar sem entender por que nada acontece.
   */
  permissionId?: string
  actionId: string
  /**
   * O identificador estável da capacidade — `aprovar_custo`.
   *
   * Opcional porque backends anteriores a 3.4 não o enviam. Quando faltar, só a descrição está
   * disponível, e é ela que a tela mostra — o comportamento de antes.
   */
  actionName?: string
  /**
   * O rótulo curto — "Aprovar custo".
   *
   * Ausente quando a capacidade não tem rótulo, que é o caso de todo catálogo existente. A tela
   * mostra `actionLabel ?? actionDescription`: enquanto ninguém declarar rótulo, ela exibe
   * exatamente o que exibe hoje.
   */
  actionLabel?: string
  actionDescription: string
  /**
   * O agrupamento dentro do recurso — "Custos".
   *
   * Substitui o `->` que era embutido na descrição e que o cliente quebrava na exibição para
   * simular hierarquia. Ausente quando não há.
   */
  actionCategory?: string
  types?: string[]
  /**
   * As capacidades que esta declara precisar — **apenas as diretas**, em texto `recurso:acao`.
   *
   * Vêm junto do catálogo porque a tela precisa delas no momento da concessão: é o que permite
   * oferecer as dependências junto e avisar ao revogar. O fecho transitivo não vem aqui — para ele
   * existe `getCapabilityDependencies`.
   *
   * Ausente quando não há nenhuma, e em backends anteriores a 3.4.
   */
  requires?: string[]
}

/** Uma capacidade alcançada pelo fecho de dependências, e por onde se chegou nela. */
export interface CapabilityDependencyNodeDto {
  capability: string
  /** Nulo quando a capacidade **não existe** no catálogo — estado legítimo, não erro. */
  actionId?: string | null
  resourceName?: string
  actionName?: string
  actionDescription?: string
  /** 1 para as diretas, 2 para as dependências das diretas, e assim por diante. */
  depth: number
  /** A capacidade do nível anterior — o caminho até aqui. */
  requiredBy?: string
  resolved: boolean
}

/** Tudo de que uma capacidade depende, direta e indiretamente. */
export interface CapabilityDependencyTreeDto {
  actionId: string
  capability: string
  dependencies: CapabilityDependencyNodeDto[]
  /** `true` quando o teto de profundidade foi atingido e há dependências não exploradas. */
  truncated: boolean
}

export interface ResoucePermissionsWithTypeDto {
  resourceId: string
  /** O identificador estável do recurso — `tms.ordemservico`. Ausente em backends < 3.4. */
  resourceName?: string
  resourceDescription: string
  /**
   * `VIEW` para recurso registrado por uma tela, `API` para o que a varredura do `@HasPermission`
   * cadastrou.
   *
   * Ausente em backends anteriores a 3.4, e **nulo** para recurso criado antes de a coluna
   * existir. Nos dois casos a tela agrupa como "sem classificação", em vez de empurrar para um dos
   * baldes e mentir sobre o que aquilo é.
   */
  resourceType?: TipoRecurso | null
  /**
   * Se o recurso está ativo.
   *
   * A lista **não** filtra por isto. Uma capacidade sobre ação ativa de recurso inativo é concedível
   * hoje e funciona hoje no `@HasPermission`, que não consulta `active` — e deixará de funcionar
   * quando `archbase.security.permission.require-active` for ligado. Escondê-la tiraria do admin a
   * chance de arrumar antes; então ela aparece, marcada.
   *
   * Ausente em backends que ainda não enviam o campo; a tela trata ausente como ativo.
   */
  resourceActive?: boolean
  permissions: PermissionWithTypesDto[]
}

export interface ResouceActionPermissionDto {
  resourceId: string
  resourceName?: string
  resourceDescription: string
  resourceType?: TipoRecurso | null
  permissionId: string
  actionId: string
  actionName?: string
  actionLabel?: string
  actionDescription: string
  actionCategory?: string
}

export interface SimpleActionDto {
  actionName: string
  actionDescription: string
  /**
   * O rótulo curto, distinto da descrição que explica a ação.
   *
   * Ausente significa "use a descrição" — o comportamento de todo cliente anterior. É semeado
   * apenas quando a capacidade ainda não tem rótulo: quem já tem não é sobrescrito, para o texto
   * não oscilar entre duas telas que registram a mesma ação.
   */
  actionLabel?: string
  /** O agrupamento dentro do recurso. Mesma regra de semeadura do rótulo. */
  actionCategory?: string
  requires?: string[]
}

export interface SimpleResourceDto {
  resourceName: string
  resourceDescription: string
}

export interface ResourceRegisterDto {
  resource: SimpleResourceDto
  actions: SimpleActionDto[]
}

export interface ResourcePermissionsDto {
  resourceName: string
  permissions: string[]
}

/**
 * Tudo que o usuário autenticado alcança, agrupado por recurso.
 *
 * Devolvido por `GET /api/v1/resource/my-permissions`, disponível a partir do
 * archbase-security 3.2.3. Em backend anterior o caminho não existe — ver
 * `ArchbaseResourceService.findLoggedUserPermissions`.
 */
export interface LoggedUserPermissionsDto {
  /** Administrador não depende do catálogo; sem este campo um mapa vazio seria lido como "não pode nada". */
  administrator: boolean
  /** Nome do recurso para os nomes das ações concedidas nele. */
  permissions: Record<string, string[]>
}
