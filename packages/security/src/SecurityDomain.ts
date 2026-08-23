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
  permissionId?: string
  actionId: string
  actionDescription: string
  types?: string[]
}

export interface ResoucePermissionsWithTypeDto {
  resourceId: string
  resourceDescription: string
  permissions: PermissionWithTypesDto[]
}

export interface ResouceActionPermissionDto {
  resourceId: string
  resourceDescription: string
  permissionId: string
  actionId: string
  actionDescription: string
}

export interface SimpleActionDto {
  actionName: string
  actionDescription: string
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
