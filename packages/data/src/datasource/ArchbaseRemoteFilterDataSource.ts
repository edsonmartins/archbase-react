import { DataSourceOptions } from './ArchbaseDataSource'
import {
  ArchbaseQueryFilterDelegator,
  DelegatorCallback,
  IQueryFilterEntity,
  QueryFilterEntity
} from '@archbase/core'
import { ArchbaseRemoteDataSource } from './ArchbaseRemoteDataSource'

export class RemoteFilter {
  id?: any
  companyId?: any
  filter?: string
  name?: string
  description?: string
  viewName?: string
  componentName?: string
  componentId?: string
  userName?: string
  userOwner?: string
  shared?: boolean
  readOnly?: boolean
  code?: string
  isNewFilter?: boolean

  constructor(data: Partial<RemoteFilter> = {}) {
    Object.assign(this, data)
  }
}

export class ArchbaseRemoteFilterDataSource
  extends ArchbaseRemoteDataSource<RemoteFilter, number>
  implements ArchbaseQueryFilterDelegator
{
  public getFilterById(id: any): IQueryFilterEntity | undefined {
    if (this.locate({ id })) {
      return this.convertCurrentRecordToFilter()
    }
  }

  protected convertCurrentRecordToFilter(): IQueryFilterEntity | undefined {
    return new QueryFilterEntity({
      id: this.getFieldValue('id'),
      name: this.getFieldValue('name'),
      description: this.getFieldValue('description'),
      companyId: this.getFieldValue('companyId'),
      componentId: this.getFieldValue('componentId') || this.getFieldValue('componentName'),
      userOwner: this.getFieldValue('userOwner') || this.getFieldValue('userName'),
      shared: this.getFieldValue('shared'),
      readOnly: this.getFieldValue('readOnly'),
      filter: this.getFieldValue('filter') ? atob(this.getFieldValue('filter')) : undefined
    })
  }

  public async addNewFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback) {
    this.insert(
      new RemoteFilter({
        id: filter.id,
        name: filter.name,
        description: filter.description,
        companyId: filter.companyId,
        componentId: filter.componentId,
        componentName: filter.componentId,
        userOwner: filter.userOwner,
        userName: filter.userOwner,
        filter: filter.filter ? btoa(JSON.stringify(filter.filter)) : undefined,
        shared: filter.shared,
        readOnly: filter.readOnly
      })
    )
    const result = await this.save()
    onResult(null, result.id)
  }

  public async saveFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback) {
    if (this.locate({ id: filter.id })) {
      this.edit()
      this.setFieldValue('filter', btoa(JSON.stringify(filter.filter)))
      const result = await this.save((error)=>{
        onResult(error, result.id)
      })      
    } else {
      onResult('Filtro não encontrado.')
    }
  }

  public async removeFilterBy(filter: IQueryFilterEntity, onResult: DelegatorCallback) {
    if (this.locate({ id: filter.id })) {
      await this.remove((error)=>{
        onResult(error, filter.id)
      })
     
    } else {
      onResult('Filtro não encontrado.')
    }
  }

  public getFirstFilter(): IQueryFilterEntity | undefined {
    if (this.getTotalRecords() > 0) {
      this.first()
      return this.convertCurrentRecordToFilter()
    }
  }

  public getFilters(): IQueryFilterEntity[] {
    if (this.getTotalRecords() > 0) {
      return this.browseRecords().map((filter: RemoteFilter) =>
        new QueryFilterEntity({
          id: filter.id,
          name: filter.name,
          description: filter.description,
          companyId: filter.companyId,
          componentId: filter.componentId || filter.componentName,
          userOwner: filter.userOwner || filter.userName,
          shared: filter.shared,
          readOnly: filter.readOnly,
          filter: filter.filter ? atob(filter.filter) : undefined
        })
      )
    }
    return []
  }
}
