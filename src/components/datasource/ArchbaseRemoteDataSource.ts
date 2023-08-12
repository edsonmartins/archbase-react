import i18next from 'i18next';
import { ArchbaseDataSourceError, processErrorMessage } from '../core/exceptions';
import type { ArchbaseRemoteApiService } from '../service';
import { DataSourceEventNames, DataSourceOptions, ArchbaseDataSource, IDataSource } from './ArchbaseDataSource';
import { ADVANCED, ArchbaseQueryFilter, NORMAL, QUICK } from '@components/querybuilder/ArchbaseFilterCommons';
import { ArchbaseFilterDSL } from '@components/querybuilder/ArchbaseFilterDSL';



export interface IRemoteDataSource<T> extends IDataSource<T> {
  applyRemoteFilter: (filter: ArchbaseQueryFilter, page: number, callback?: (() => void) | undefined) => void;
}

export class ArchbaseRemoteDataSource<T, ID> extends ArchbaseDataSource<T, ID> implements IRemoteDataSource<T> {
  protected service: ArchbaseRemoteApiService<T, ID>;

  constructor(service: ArchbaseRemoteApiService<T, ID>, name: string, options: DataSourceOptions<T>) {
    super(name, options);
    this.service = service;
  }

  public async save(callback?: Function): Promise<T> {
    this.validateDataSourceActive('save');
    if (!this.inserting || !this.editing) {
      throw new ArchbaseDataSourceError(i18next.t('saveRecordIsNotAllowed', { dataSourceName: this.name }));
    }
    if (!this.currentRecord) {
      throw new ArchbaseDataSourceError(i18next.t('noRecordToSave', { dataSourceName: this.name }));
    }

    this.emitter.emit('beforeSave', this.currentRecord);
    this.emit({
      type: DataSourceEventNames.beforeSave,
      record: this.currentRecord,
      index: this.getCurrentIndex(),
    });

    try {
      this.currentRecord = await this.service.save<T>(this.currentRecord);
      if (this.editing) {
        this.filteredRecords[this.getCurrentIndex()] = this.currentRecord!;
      }

      let index = -1;
      this.records.forEach((item, idx) => {
        if (item === this.currentRecord) {
          index = idx;
        }
      });
      if (index >= 0) {
        this.records[index] = this.currentRecord!;
      } else {
        this.records.push(this.currentRecord!);
      }
      this.editing = false;
      this.inserting = false;

      this.emitter.emit('afterSave', this.currentRecord);
      this.emit({
        type: DataSourceEventNames.afterSave,
        record: this.currentRecord,
        index: this.getCurrentIndex(),
      });

      if (callback) {
        callback();
      }
    } catch (error) {
      const userError = processErrorMessage(error);
      this.emitter.emit('onError', userError, error);
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error,
      });
      if (callback) {
        callback(error);
      }
    }

    return this.currentRecord!;
  }

  public async remove(callback?: Function): Promise<T | undefined> {
    this.validateDataSourceActive('remove');
    if (this.inserting || this.editing) {
      throw new ArchbaseDataSourceError(i18next.t('removingRecordIsNotAllowed', { dataSourceName: this.name }));
    }
    if (this.isEmpty() || !this.currentRecord) {
      throw new ArchbaseDataSourceError(i18next.t('noRecordsToEdit', { dataSourceName: this.name }));
    }
    if (this.isBOF()) {
      throw new ArchbaseDataSourceError(i18next.t('BOFDataSource', { dataSourceName: this.name }));
    }
    if (this.isEOF()) {
      throw new ArchbaseDataSourceError(i18next.t('EOFDataSource', { dataSourceName: this.name }));
    }

    this.emitter.emit('beforeRemove', this.currentRecord, this.currentRecordIndex);
    this.emit({
      type: DataSourceEventNames.beforeRemove,
      record: this.currentRecord,
      index: this.getCurrentIndex(),
    });

    try {
      await this.service.delete<T>(this.service.getId(this.currentRecord));

      let index = -1;
      const deletedRecord = this.currentRecord;
      const deletedIndex = this.currentRecordIndex;
      this.records.forEach((item, idx) => {
        if (this.currentRecord === item) {
          index = idx;
        }
      });
      if (index >= 0) {
        this.records.splice(index, 1);
      }
      this.filteredRecords.splice(this.getCurrentIndex(), 1);
      this.grandTotalRecords--;
      if (this.filteredRecords.length === 0) {
        this.currentRecord = undefined;
        this.currentRecordIndex = -1;
      } else {
        this.currentRecord = this.filteredRecords[this.currentRecordIndex];
      }
      this.editing = false;
      this.inserting = false;

      this.emitter.emit('afterScroll');
      this.emit({ type: DataSourceEventNames.afterScroll });
      this.emitter.emit('afterRemove', deletedRecord, deletedIndex);
      this.emit({
        type: DataSourceEventNames.afterRemove,
        record: deletedRecord,
        index: deletedIndex,
      });

      if (callback) {
        callback();
      }
      return deletedRecord;
    } catch (error) {
      const userError = processErrorMessage(error);
      this.emitter.emit('onError', userError, error);
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error,
      });
      if (callback) {
        callback(error);
      }
    }
  }

  public applyRemoteFilter(filter: ArchbaseQueryFilter, page: number, _callback?: (() => void) | undefined) {
    if (filter && filter.filter.filterType === QUICK && filter.filter.quickFilterText && filter.filter.quickFilterText !== '') {
      return this.getDataWithQuickFilter(filter, page);
    } else if (filter && (filter.filter.filterType === NORMAL || filter.filter.filterType === ADVANCED)) {
      return this.getDataWithFilter(filter, page);
    } else {
      return this.getDataWithoutFilter(page);
    }
  }

  protected async getDataWithFilter(currentFilter: ArchbaseQueryFilter, page: number): Promise<any> {
    var filter = new ArchbaseFilterDSL();
    filter.buildFrom(currentFilter.filter, currentFilter.sort);
    let filterStr = filter.toJSON();
    let result: any = undefined;
    if (filterStr) {
      result = await this.service.findAllWithFilter(filter.toJSON(), page, this.getPageSize());
    } else {
      result = this.getDataWithoutFilter(page);
    }
    return result;
  }

  protected getDataWithoutFilter(page: number): any {
    let result: any = undefined;
    if (this.defaultSortFields.length > 0) result = this.service.findAllWithSort(page, this.getPageSize(), this.defaultSortFields);
    else result = this.service.findAll(page, this.getPageSize());
    return result;
  }

  protected getDataWithQuickFilter(currentFilter: ArchbaseQueryFilter, page: number) {
    return this.service.findAllMultipleFields(
      currentFilter.filter.quickFilterText,
      currentFilter.filter.quickFilterFieldsText,
      page,
      this.getPageSize(),
      this.getSortFields(currentFilter),
    );
  }

  protected getSortFields(currentFilter: ArchbaseQueryFilter): any {
    if (currentFilter && currentFilter.sort) {
      return currentFilter.sort.quickFilterSort;
    }
    return this.defaultSortFields;
  }
}
