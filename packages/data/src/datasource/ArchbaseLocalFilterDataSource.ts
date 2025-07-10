import { ArchbaseDataSource, DataSourceOptions } from './ArchbaseDataSource'
import {
  ArchbaseQueryFilterDelegator,
  DelegatorCallback,
  IQueryFilterEntity,
  QueryFilterEntity
} from '@archbase/core'

export class LocalFilter {
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

  constructor(data: Partial<LocalFilter> = {}) {
    Object.assign(this, data)
  }
}

export class ArchbaseLocalFilterDataSource
  extends ArchbaseDataSource<LocalFilter, number>
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
      new LocalFilter({
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
      const result = await this.save()
      onResult(null, result.id)
    } else {
      onResult('Filtro não encontrado.')
    }
  }

  public async removeFilterBy(filter: IQueryFilterEntity, onResult: DelegatorCallback) {
    if (this.locate({ id: filter.id })) {
      await this.remove()
      onResult(null, filter.id)
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
      return this.browseRecords().map((filter: LocalFilter) =>
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
