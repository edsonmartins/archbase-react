import { ARCHBASE_IOC_API_TYPE, IOCContainer, processErrorMessage } from '@components/core';
import { ArchbaseResourceService } from './ArchbaseResourceService';
import { ResourcePermissionsDto, SimpleActionDto, SimpleResourceDto } from './SecurityDomain';


export interface ISecurityManager {
  registerAction(actionName: string, actionDescription: string): void
}

export class ArchbaseSecurityManager implements ISecurityManager {
  protected resourceService: ArchbaseResourceService
  protected resource: SimpleResourceDto
  protected actions: Map<string, SimpleActionDto>
  protected permissions: string[]
  protected alreadyApplied: boolean
  protected error: string
  protected isAdmin: boolean

  constructor(resourceName: string, resourceDescription: string, isAdmin: boolean) {
    this.resourceService = IOCContainer.getContainer().get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
    this.resource = { resourceName, resourceDescription }
    this.alreadyApplied = false
    this.actions = new Map()
    this.permissions = []
    this.error = ""
    this.isAdmin = isAdmin
  }

  public registerAction(actionName: string, actionDescription: string) {
    if (!this.alreadyApplied) {
      if (!this.actions.has(actionName)) {
        this.actions.set(actionName, { actionName, actionDescription });
      }
    }
  }

  public async apply(callback?: Function) {
    if (!this.alreadyApplied) {
      try {
        const actionsArray = Array.from(this.actions.values());
        const resourcePermissions: ResourcePermissionsDto = await this.resourceService.registerResource({ resource: this.resource, actions: actionsArray })
        this.permissions = resourcePermissions.permissions;
        this.alreadyApplied = true;
        this.error = "";
        if (callback) {
          callback();
        }
      } catch (error) {
        this.error = processErrorMessage(error)
      }
    }
  }

  public hasPermission(actionName: string) {
    return this.permissions.includes(actionName) || this.isAdmin
  }

  public isError() {
    return !!this.error
  }

  public getError() {
    return this.error
  }
}
