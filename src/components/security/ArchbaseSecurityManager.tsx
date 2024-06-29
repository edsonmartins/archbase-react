import { ARCHBASE_IOC_API_TYPE, IOCContainer, processErrorMessage } from '@components/core';
import { ArchbaseResourceService } from './ArchbaseResourceService';
import { ResourcePermissionsDto, SimpleActionDto, SimpleResourceDto } from './SecurityDomain';


export interface ISecurityManager {
  registerAction(actionName: string, actionDescription: string): void
}

export class ArchbaseSecurityManager implements ISecurityManager {
  protected resourceService: ArchbaseResourceService
  protected resource: SimpleResourceDto
  protected actions: SimpleActionDto[]
  protected permissions: string[]
  protected alreadyApplied: boolean
  protected error: string

  constructor(resourceName: string, resourceDescription: string) {
    this.resourceService = IOCContainer.getContainer().get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
    this.resource = { resourceName, resourceDescription }
    this.alreadyApplied = false
    this.actions = []
    this.permissions = []
    this.error = ""
  }

  public registerAction(actionName: string, actionDescription: string) {
    if (!this.alreadyApplied) {
      this.actions.push({ actionName, actionDescription })
    }
  }

  public async apply() {
    if (!this.alreadyApplied) {
      try {
        const resourcePermissions: ResourcePermissionsDto = await this.resourceService.registerResource({ resource: this.resource, actions: this.actions })
        this.permissions = resourcePermissions.permissions;
        this.alreadyApplied = true
        this.error = ""
      } catch (error) {
        this.error = processErrorMessage(error)
      }
    }
  }

  public hasPermission(actionName: string) {
    return this.permissions.includes(actionName)
  }

  public isError() {
    return !!this.error
  }

  public getError() {
    return this.error
  }
}
