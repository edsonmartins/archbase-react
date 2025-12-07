import { archbaseI18next } from '@archbase/core';
import { 
  ArchbaseDataSourceError, 
  processErrorMessage,
  ArchbaseQueryFilter,
  ADVANCED,
  NORMAL,
  QUICK,
  ArchbaseFilterDSL
} from '@archbase/core'
import {
  DataSourceEventNames,
  DataSourceOptions,
  ArchbaseDataSource,
  IDataSource
} from './ArchbaseDataSource'
// ArchbaseFilterDSL now imported from @archbase/core
import { ArchbaseRemoteApiService } from '../service/ArchbaseRemoteApiService'

export interface IRemoteDataSource<T> extends IDataSource<T> {
  applyRemoteFilter: (
    filter: ArchbaseQueryFilter,
    page: number,
    callback?: (() => void) | undefined
  ) => void
}

export class ArchbaseRemoteDataSource<T, ID>
  extends ArchbaseDataSource<T, ID>
  implements IRemoteDataSource<T>
{
  protected service: ArchbaseRemoteApiService<T, ID>

  constructor(
    service: ArchbaseRemoteApiService<T, ID>,
    name: string,
    options: DataSourceOptions<T>,
    label?: string
  ) {
    super(name, options, label)
    this.service = service
  }

  public async save(callback?: Function): Promise<T> {
    this.validateDataSourceActive('save')
    if (!this.inserting && !this.editing) {
      const msg = archbaseI18next.t('archbase:saveRecordIsNotAllowed', { dataSourceName: this.name })
      this.publishEventError(msg,{})
      throw new ArchbaseDataSourceError(msg)
    }
    if (!this.currentRecord) {
      const msg = archbaseI18next.t('archbase:noRecordToSave', { dataSourceName: this.name })
      this.publishEventError(msg,{})
      throw new ArchbaseDataSourceError(msg)
    }

    this.emitter.emit('beforeSave', this.currentRecord)
    this.emit({
      type: DataSourceEventNames.beforeSave,
      record: this.currentRecord,
      index: this.getCurrentIndex()
    })

    if (this.validator){
      const errors = this.validator.validateEntity<T>(this.currentRecord);
      if (errors && errors.length>0){
        this.publishEventErrors(errors);
        if (!errors[0].fieldName) {
          throw new ArchbaseDataSourceError(errors[0].errorMessage)
        } else {
          const msg = archbaseI18next.t('archbase:errorSavingRecord', { dataSourceName: this.label })
          throw new ArchbaseDataSourceError(msg)
        }
      }
    }

    try {
      let index = -1
      this.records.forEach((item, idx) => {
        const recordIdentity = this.getIdentity ? this.getIdentity(item) : item["id"];
        const currentRecordIdentity = this.getIdentity ? this.getIdentity(this.currentRecord) : this.currentRecord["id"];
        
        if (item === this.currentRecord || (recordIdentity !== undefined && recordIdentity === currentRecordIdentity)) {
            index = idx;
        }
      })
      this.currentRecord = await this.service.save<T>(this.currentRecord)
      // Cópias com spread para evitar problemas com Object.freeze
      if (this.editing) {
        this.filteredRecords = [...this.filteredRecords];
        this.filteredRecords[this.getCurrentIndex()] = this.currentRecord!
      }
      this.records = [...this.records];
      if (index >= 0) {
        this.records[index] = this.currentRecord!
      } else {
        this.records.push(this.currentRecord!)
      }
      this.editing = false
      this.inserting = false

      this.lastDataChangedAt = new Date().getTime()

      this.emitter.emit('afterSave', this.currentRecord)
      this.emit({
        type: DataSourceEventNames.afterSave,
        record: this.currentRecord,
        index: this.getCurrentIndex()
      })

      if (callback) {
        callback()
      }
    } catch (error:any) {
      if (error.response && error.response.data && error.response.data.apierror) {
        if (error.response.data.apierror.subErrors) {
          error.response.data.apierror.subErrors.forEach((element: any) => {
            if (element.field){
              // Tenta traduzir a mensagem (se for chave i18n) ou usa a mensagem original
              const translatedMessage = archbaseI18next.t(element.message, { defaultValue: element.message })
              this.emitter.emit("onFieldError",element.field, translatedMessage)
              this.emit({
                type: DataSourceEventNames.onFieldError,
                fieldName: element.field,
                error: translatedMessage,
                originalError: element.message
              })
            }
          })
        }
      }
      const userError = processErrorMessage(error)
      this.emitter.emit('onError', userError, error)
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error
      })
      if (callback) {
        callback(userError)
      }
      throw new ArchbaseDataSourceError(userError)
    }

    return this.currentRecord!
  }

  public async remove(callback?: Function): Promise<T | undefined> {
    this.validateDataSourceActive('remove')
    if (this.inserting || this.editing) {
      const msg = archbaseI18next.t('archbase:removingRecordIsNotAllowed', { dataSourceName: this.name })
      this.publishEventError(msg,{})
      throw new ArchbaseDataSourceError(
        msg
      )
    }
    if (this.isEmpty() || !this.currentRecord) {
      const msg = archbaseI18next.t('archbase:noRecordsToEdit', { dataSourceName: this.name })
      this.publishEventError(msg,{})
      throw new ArchbaseDataSourceError(msg)
    }
    if (this.isBOF()) {
      const msg = archbaseI18next.t('archbase:BOFDataSource', { dataSourceName: this.name })
      this.publishEventError(msg,{})
      throw new ArchbaseDataSourceError(msg)
    }
    if (this.isEOF()) {
      const msg = archbaseI18next.t('archbase:EOFDataSource', { dataSourceName: this.name })
      this.publishEventError(msg,{})
      throw new ArchbaseDataSourceError(msg)
    }

    this.emitter.emit('beforeRemove', this.currentRecord, this.currentRecordIndex)
    this.emit({
      type: DataSourceEventNames.beforeRemove,
      record: this.currentRecord,
      index: this.getCurrentIndex()
    })

    try {
      await this.service.delete<T>(this.service.getId(this.currentRecord))

      let index = -1
      const deletedRecord = this.currentRecord
      const deletedIndex = this.currentRecordIndex

      // Copiamos as coleções para evitar problemas com arrays congelados/imutos
      this.records = [...this.records]
      this.filteredRecords = [...this.filteredRecords]

      this.records.forEach((item, idx) => {
        if (this.currentRecord === item) {
          index = idx
        }
      })
      if (index >= 0) {
        this.records.splice(index, 1)
      }
      if (this.records !== this.filteredRecords) {
        this.filteredRecords.splice(this.getCurrentIndex(), 1)
      }
      this.grandTotalRecords--
      if (this.filteredRecords.length === 0) {
        this.currentRecord = undefined
        this.currentRecordIndex = -1
      } else {
        if (this.currentRecordIndex>this.filteredRecords.length-1){
          this.currentRecordIndex-- 
        }
        this.currentRecord = this.filteredRecords[this.currentRecordIndex]
      }
      this.editing = false
      this.inserting = false

      this.emitter.emit('afterScroll')
      this.emit({ type: DataSourceEventNames.afterScroll })
      this.emitter.emit('afterRemove', deletedRecord, deletedIndex)
      this.emit({
        type: DataSourceEventNames.afterRemove,
        record: deletedRecord,
        index: deletedIndex
      })

      this.lastDataBrowsingOn = new Date().getTime()
      this.lastDataChangedAt = new Date().getTime()

      if (callback) {
        callback()
      }

      return deletedRecord
    } catch (error : any) {     

      const userError = processErrorMessage(error)
      this.emitter.emit('onError', userError, error)
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error
      })
      if (callback) {
        callback(userError)
      }
      throw new ArchbaseDataSourceError(userError)
    }
  }

  public applyRemoteFilter(
    filter: ArchbaseQueryFilter,
    page: number,
    _callback?: (() => void) | undefined
  ) {
    if (
      filter &&
      filter.filter.filterType === QUICK &&
      filter.filter.quickFilterText &&
      filter.filter.quickFilterText !== ''
    ) {
      return this.getDataWithQuickFilter(filter, page)
    }
    if (filter && (filter.filter.filterType === NORMAL || filter.filter.filterType === ADVANCED)) {
      return this.getDataWithFilter(filter, page)
    }

    return this.getDataWithoutFilter(page)
  }

  protected async getDataWithFilter(
    currentFilter: ArchbaseQueryFilter,
    page: number
  ): Promise<any> {
    const filter = new ArchbaseFilterDSL()
    filter.buildFrom(currentFilter.filter, currentFilter.sort)
    const filterStr = filter.toJSON()
    let result: any
    if (filterStr) {
      result = await this.service.findAllWithFilter(filterStr, page, this.getPageSize())
    } else {
      result = this.getDataWithoutFilter(page)
    }

    return result
  }

  protected getDataWithoutFilter(page: number): any {
    let result: any
    if (this.defaultSortFields.length > 0)
      result = this.service.findAllWithSort(page, this.getPageSize(), this.defaultSortFields)
    else result = this.service.findAll(page, this.getPageSize())

    return result
  }

  protected getDataWithQuickFilter(currentFilter: ArchbaseQueryFilter, page: number) {
    return this.service.findAllMultipleFields(
      currentFilter.filter.quickFilterText,
      currentFilter.filter.quickFilterFieldsText,
      page,
      this.getPageSize(),
      this.getSortFields(currentFilter)
    )
  }

  protected getSortFields(currentFilter: ArchbaseQueryFilter): any {
    if (currentFilter && currentFilter.sort) {
      return currentFilter.sort.quickFilterSort
    }

    return this.defaultSortFields
  }
}
