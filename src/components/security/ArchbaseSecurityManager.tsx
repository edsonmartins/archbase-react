import { ARCHBASE_IOC_API_TYPE, IOCContainer } from 'components/core';
import { ResourcePermissionsDto } from './ArchbaseResourcePermissions';
import { ArchbaseResourceService } from './ArchbaseResourceService';


export interface ISecurityManager {
  getPermissions: (resourceName: string) => Promise<ResourcePermissionsDto>;
}

export class ArchbaseSecurityManager implements ISecurityManager {
  protected resourceService: ArchbaseResourceService
  protected resourceName: string

  constructor(resourceName: string) {
    this.resourceName = resourceName;
    this.resourceService = IOCContainer.getContainer().get(ARCHBASE_IOC_API_TYPE.Resource);
  }

  public getPermissions() {
    return this.resourceService.getPermissions(this.resourceName)
  };
}
