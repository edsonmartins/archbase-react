export class ResourcePermissionsDto {
    resourceName: string
    permissions: string[]
  
    constructor(data: any) {
      this.resourceName = data.resourceName || ''
      this.permissions = data.permissions || []
    }
  
    static newInstance = () => {
      return new ResourcePermissionsDto({})
    }
  }