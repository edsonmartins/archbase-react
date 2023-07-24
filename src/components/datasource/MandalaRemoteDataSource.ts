import i18next from 'i18next'
import { MandalaDataSourceError, processErrorMessage } from '../common/exceptions'
import type { MandalaApiService } from '../service'
import { DataSourceEventNames, DataSourceOptions, MandalaDataSource } from './MandalaDataSource'

export class MandalaRemoteDataSource<T, ID> extends MandalaDataSource<T, ID> {
  private service: MandalaApiService<T, ID>

  constructor(service: MandalaApiService<T, ID>, name: string, options: DataSourceOptions<T>) {
    super(name, options)
    this.service = service
  }

  public async save(callback: Function): Promise<T> {
    this.validateDataSourceActive('save')
    if (!this.inserting || !this.editing) {
      throw new MandalaDataSourceError(
        i18next.t('saveRecordIsNotAllowed', { dataSourceName: this.name })
      )
    }
    if (!this.currentRecord) {
      throw new MandalaDataSourceError(i18next.t('noRecordToSave', { dataSourceName: this.name }))
    }

    this.emitter.emit('beforeSave', this.currentRecord)
    this.emit({
      type: DataSourceEventNames.beforeSave,
      record: this.currentRecord,
      index: this.getCurrentIndex()
    })

    try {
      this.currentRecord = await this.service.save<T>(this.currentRecord)
      if (this.editing) {
        this.filteredRecords[this.getCurrentIndex()] = this.currentRecord
      }

      let index = -1
      this.records.forEach((item, idx) => {
        if (item === this.currentRecord) {
          index = idx
        }
      })
      if (index >= 0) {
        this.records[index] = this.currentRecord
      } else {
        this.records.push(this.currentRecord)
      }
      this.editing = false
      this.inserting = false

      this.emitter.emit('afterSave', this.currentRecord)
      this.emit({
        type: DataSourceEventNames.afterSave,
        record: this.currentRecord,
        index: this.getCurrentIndex()
      })

      if (callback) {
        callback()
      }
    } catch (error) {
      const userError = processErrorMessage(error)
      this.emitter.emit('onError', userError, error)
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error
      })
      if (callback) {
        callback(error)
      }
    }

    return this.currentRecord
  }

  public async remove(callback: Function): Promise<T | undefined> {
    this.validateDataSourceActive('remove')
    if (this.inserting || this.editing) {
      throw new MandalaDataSourceError(
        i18next.t('removingRecordIsNotAllowed', { dataSourceName: this.name })
      )
    }
    if (this.isEmpty() || !this.currentRecord) {
      throw new MandalaDataSourceError(i18next.t('noRecordsToEdit', { dataSourceName: this.name }))
    }
    if (this.isBOF()) {
      throw new MandalaDataSourceError(i18next.t('BOFDataSource', { dataSourceName: this.name }))
    }
    if (this.isEOF()) {
      throw new MandalaDataSourceError(i18next.t('EOFDataSource', { dataSourceName: this.name }))
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
      this.records.forEach((item, idx) => {
        if (this.currentRecord === item) {
          index = idx
        }
      })
      if (index >= 0) {
        this.records.splice(index, 1)
      }
      this.filteredRecords.splice(this.getCurrentIndex(), 1)
      this.grandTotalRecords--
      if (this.filteredRecords.length === 0) {
        this.currentRecord = undefined
        this.currentRecordIndex = -1
      } else {
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

      if (callback) {
        callback()
      }
      return deletedRecord
    } catch (error) {
      const userError = processErrorMessage(error)
      this.emitter.emit('onError', userError, error)
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error
      })
      if (callback) {
        callback(error)
      }
    }
  }
}
