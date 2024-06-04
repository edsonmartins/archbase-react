import { v4 as uuidv4 } from 'uuid'
import { SecurityType } from './SecurityType';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from '@components/validator';

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
        intervals: []
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

  @IsEmail(
    {},
    {
      message: 'archbase:Informe um email válido'
    }
  )
  email?: string

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
    this.email = data.email || ''
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
  }

  static newInstance = () => {
    return new ActionDto({
      id: uuidv4(),
      active: true
    })
  }
}

export class ProfileDto extends SecurityDto {
  type: string

  constructor(data: any) {
    super(data)
    this.type = SecurityType.PROFILE;
  }

  static newInstance = () => {
    return new ProfileDto({
      id: uuidv4()
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

  static newInstance = (group :GroupDto) => {
    return new UserGroupDto({
      id: uuidv4(),
      group: group
    })
  }
}

export class GroupDto extends SecurityDto {
  type: string

  constructor(data: any) {
    super(data)
    this.type = SecurityType.GROUP;
  }

  static newInstance = () => {
    return new GroupDto({
      id: uuidv4()
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
  }

  static newInstance = () => {
    return new ResourceDto({
      id: uuidv4(),
      actions: [],
      active: true
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

  type: string

  constructor(data: any) {
    super(data)
    this.type = SecurityType.USER;
    this.userName = data.userName || ''
    this.password = data.password || ''
    this.changePasswordOnNextLogin = data.changePasswordOnNextLogin || false
    this.allowPasswordChange = data.allowPasswordChange || false
    this.allowMultipleLogins = data.allowMultipleLogins || false
    this.passwordNeverExpires = data.passwordNeverExpires || false
    this.accountDeactivated = data.accountDeactivated || false
    this.accountLocked = data.accountLocked || false
    this.unlimitedAccessHours = data.unlimitedAccessHours || false
    this.isAdministrator = data.isAdministrator || false
    this.accessSchedule = data.accessSchedule ? new AccessScheduleDto(data.accessSchedule) : undefined
    this.groups = data.groups ? data.groups.map((group: any) => new UserGroupDto(group)) : []
    this.profile = data.profile ? new ProfileDto(data.profile) : undefined
    this.avatar = data.avatar || undefined
  }

  static newInstance = () => {
    return new UserDto({
      id: uuidv4(),
      userName: '',
      password: '',
      groups: [],
      avatar: null,
      isAdministrator: false
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
