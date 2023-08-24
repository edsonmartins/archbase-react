import { ArchbaseDataSource, DataSourceOptions } from './ArchbaseDataSource';
import {
  ArchbaseQueryFilterDelegator,
  DelegatorCallback,
  IQueryFilterEntity,
  QueryFilterEntity,
} from '../../components/querybuilder';


export class LocalFilter {
  id?: any;
  companyId?: any;
  filter?: string;
  name?: string;
  viewName?: string;
  componentName?: string;
  userName?: string;
  shared?: boolean;
  code?: string;

  constructor(data: Partial<LocalFilter> = {}) {
    Object.assign(this, data);
  }
}

export class ArchbaseLocalFilterDataSource
  extends ArchbaseDataSource<LocalFilter, number>
  implements ArchbaseQueryFilterDelegator
{
  constructor(name: string, options: DataSourceOptions<LocalFilter>) {
    super(name, options);
  }

  public getFilterById(id: any): IQueryFilterEntity | undefined {
    if (this.locate({ id })) {
      return this.convertCurrentRecordToFilter();
    }
    return;
  }

  protected convertCurrentRecordToFilter(): IQueryFilterEntity | undefined {
    return QueryFilterEntity.createInstanceWithValues({
      id: this.getFieldValue('id'),
      name: this.getFieldValue('name'),
      code: this.getFieldValue('code'),
      companyId: this.getFieldValue('companyId'),
      viewName: this.getFieldValue('viewName'),
      componentName: this.getFieldValue('componentName'),
      userName: this.getFieldValue('userName'),
      shared: this.getFieldValue('shared'),
      filter: atob(this.getFieldValue('filter')),
    });
  }

  public async addNewFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback){
    this.insert(new LocalFilter({
      id: filter.id,
      code: filter.code,
      name: filter.name,
      companyId: filter.companyId,
      componentName: filter.componentName,
      filter: btoa(JSON.stringify(filter.filter)),
      shared: filter.shared,
      viewName: filter.viewName,
      userName: filter.userName
    }));
    const result = await this.save();
    onResult(null, result.id);
  }

  public async saveFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback) {
    if (this.locate({ id: filter.id })) {
      this.edit();
      this.setFieldValue('filter', btoa(JSON.stringify(filter.filter)));
      const result = await this.save();
      onResult(null, result.id);
    } else {
      onResult('Filtro não encontrado.');
    }
  }

  public async removeFilterBy(filter: IQueryFilterEntity, onResult: DelegatorCallback) {
    if (this.locate({ id: filter.id })) {
      await this.remove();
      onResult(null, filter.id);
    } else {
      onResult('Filtro não encontrado.');
    }
  }

  public getFirstFilter(): IQueryFilterEntity | undefined {
    if (this.getTotalRecords() > 0) {
      this.first();
      return this.convertCurrentRecordToFilter();
    }
    return;
  }

  public getFilters(): IQueryFilterEntity[] {
    if (this.getTotalRecords() > 0) {
      return this.browseRecords().map((filter: LocalFilter) =>
        QueryFilterEntity.createInstanceWithValues({
          id: filter.id,
          name: filter.name,
          code: filter.code,
          companyId: filter.companyId,
          viewName: filter.viewName,
          componentName: filter.componentName,
          userName: filter.userName,
          shared: filter.shared,
          filter: atob(filter.filter || ''),
        }),
      );
    }
    return [];
  }
}
