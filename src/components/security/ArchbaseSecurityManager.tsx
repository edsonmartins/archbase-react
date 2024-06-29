import { ARCHBASE_IOC_API_TYPE, IOCContainer } from '@components/core';
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

  constructor(resourceName: string, resourceDescription: string) {
    this.resourceService = IOCContainer.getContainer().get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
    this.resource = {resourceName, resourceDescription}
    this.alreadyApplied = false
    this.actions = []
  }

  public registerAction(actionName: string, actionDescription: string) {
    if (!this.alreadyApplied) {
      this.actions.push({actionName, actionDescription})
    }
  }

  public async apply() {
    if (!this.alreadyApplied) {
      const resourcePermissions: ResourcePermissionsDto = await this.resourceService.registerResource({resource: this.resource, actions: this.actions})
      this.permissions = resourcePermissions.permissions;
      this.alreadyApplied = true
    }
  }

  public hasPermission(actionName: string) {
    this.permissions.includes(actionName)
  }
}
