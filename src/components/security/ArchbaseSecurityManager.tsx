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
  protected isAdmin: boolean

  constructor(resourceName: string, resourceDescription: string, isAdmin: boolean) {
    this.resourceService = IOCContainer.getContainer().get<ArchbaseResourceService>(ARCHBASE_IOC_API_TYPE.Resource);
    this.resource = { resourceName, resourceDescription }
    this.alreadyApplied = false
    this.actions = []
    this.permissions = []
    this.error = ""
    this.isAdmin = isAdmin
  }

  public registerAction(actionName: string, actionDescription: string) {
    if (!this.alreadyApplied && this.actions.findIndex(action => action.actionName === actionName) < 0) {
      this.actions.push({ actionName, actionDescription })
    }
  }

  public async apply(callback?: Function) {
    if (!this.alreadyApplied) {
      this.alreadyApplied = true;
      this.resourceService.registerResource({ resource: this.resource, actions: this.actions })
        .then((resourcePermissions) => {
          this.permissions = resourcePermissions.permissions;
          this.error = "";
          if (callback) {
            callback();
          }
        })
        .catch((error) => {
          this.alreadyApplied = false;
          this.error = processErrorMessage(error)
        })
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
