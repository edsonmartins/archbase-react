import { archbaseI18next } from '@archbase/core';
import { produce, Draft } from 'immer';
import { ArchbaseDataSourceError, processErrorMessage, ArchbaseQueryFilter, ADVANCED, NORMAL, QUICK, ArchbaseFilterDSL } from '@archbase/core';
import {
  DataSourceEventNames,
  DataSourceEvent,
  DataSourceListener,
  IDataSourceValidator
} from '../ArchbaseDataSource';
import { ArchbaseRemoteApiService } from '../../service/ArchbaseRemoteApiService';

/**
 * Estados possíveis do DataSource
 */
type DataSourceState = 'browse' | 'edit' | 'insert';

/**
 * Configuração para ArchbaseRemoteDataSourceV2
 * Suporta configuração inicial com registros ou carregamento remoto
 */
export interface ArchbaseRemoteDataSourceV2Config<T> {
  name: string;
  label?: string;
  service: ArchbaseRemoteApiService<T, any>;
  records?: T[];
  validator?: IDataSourceValidator;
  defaultSortFields?: string[];
  pageSize?: number;
  onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
  onFieldError?: (fieldName: string, error: string) => void;
  onError?: (error: string, originalError?: any) => void;
}

/**
 * ArchbaseRemoteDataSourceV2 - Versão V2 com Immer e suporte a TanStack Query
 * 
 * Esta implementação:
 * - Garante imutabilidade completa com Immer
 * - Preparada para integração com TanStack Query
 * - Suporte para operações CRUD remotas
 * - Gestão de cache e sincronização otimizada
 * - Interface simplificada focada em funcionalidade V2
 */
export class ArchbaseRemoteDataSourceV2<T> {
  private name: string;
  private label: string;
  private service: ArchbaseRemoteApiService<T, any>;
  private records: T[] = [];
  private filteredRecords: T[] = [];
  private currentIndex: number = -1;
  private state: DataSourceState = 'browse';
  private listeners = new Set<DataSourceListener<T>>();
  private originalRecord: T | null = null;
  private validator?: IDataSourceValidator;
  private lastDataChangedAt: number = 0;
  private lastDataBrowsingOn: number = 0;
  private grandTotalRecords: number = 0;
  private defaultSortFields: string[] = [];
  private pageSize: number = 20;
  private active: boolean = true;
  
  // Callbacks V2
  private onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
  private onFieldError?: (fieldName: string, error: string) => void;
  private onError?: (error: string, originalError?: any) => void;

  constructor(config: ArchbaseRemoteDataSourceV2Config<T>) {
    this.name = config.name;
    this.label = config.label || config.name;
    this.service = config.service;
    this.validator = config.validator;
    this.defaultSortFields = config.defaultSortFields || [];
    this.pageSize = config.pageSize || 20;
    this.onStateChange = config.onStateChange;
    this.onFieldError = config.onFieldError;
    this.onError = config.onError;

    if (config.records) {
      this.records = [...config.records];
      this.filteredRecords = [...this.records];
      this.grandTotalRecords = this.records.length;
      if (this.records.length > 0) {
        this.currentIndex = 0;
      }
    }

    this.lastDataChangedAt = new Date().getTime();
    this.lastDataBrowsingOn = new Date().getTime();
  }

  // =================== Basic Properties ===================

  getName(): string {
    return this.name;
  }

  getLabel(): string {
    return this.label;
  }

  isActive(): boolean {
    return this.active;
  }

  close(): void {
    this.active = false;
    this.listeners.clear();
  }

  // =================== Record Management ===================

  getCurrentRecord(): T | undefined {
    if (this.currentIndex >= 0 && this.currentIndex < this.filteredRecords.length) {
      return this.filteredRecords[this.currentIndex];
    }
    return undefined;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getTotalRecords(): number {
    return this.filteredRecords.length;
  }

  isEmpty(): boolean {
    return this.filteredRecords.length === 0;
  }

  // =================== Navigation ===================

  first(): void {
    if (this.filteredRecords.length > 0) {
      this.currentIndex = 0;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  last(): void {
    if (this.filteredRecords.length > 0) {
      this.currentIndex = this.filteredRecords.length - 1;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  next(): void {
    if (this.currentIndex < this.filteredRecords.length - 1) {
      this.currentIndex++;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  prior(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  goToRecord(index: number): void {
    if (index >= 0 && index < this.filteredRecords.length) {
      this.currentIndex = index;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  isFirst(): boolean {
    return this.currentIndex === 0;
  }

  isLast(): boolean {
    return this.currentIndex === this.filteredRecords.length - 1;
  }

  isBOF(): boolean {
    return this.currentIndex < 0;
  }

  isEOF(): boolean {
    return this.currentIndex >= this.filteredRecords.length;
  }

  // =================== State Management ===================

  isBrowsing(): boolean {
    return this.state === 'browse';
  }

  isEditing(): boolean {
    return this.state === 'edit';
  }

  isInserting(): boolean {
    return this.state === 'insert';
  }

  edit(): void {
    this.validateDataSourceActive('edit');
    if (this.isEmpty() || !this.getCurrentRecord()) {
      const msg = archbaseI18next.t('archbase:noRecordsToEdit', { dataSourceName: this.name });
      this.publishEventError(msg, {});
      throw new ArchbaseDataSourceError(msg);
    }

    this.state = 'edit';
    this.originalRecord = JSON.parse(JSON.stringify(this.getCurrentRecord()));
    
    this.emit({
      type: DataSourceEventNames.beforeEdit,
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
    
    this.emit({
      type: DataSourceEventNames.afterEdit,
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
  }

  cancel(): void {
    this.validateDataSourceActive('cancel');
    
    if (this.state === 'edit' && this.originalRecord) {
      // Restore original record with spread to avoid Draft type issues
      this.filteredRecords = [...this.filteredRecords];
      this.filteredRecords[this.currentIndex] = { ...this.originalRecord! };
      
      // Update original records array too
      const recordId = this.service.getId(this.originalRecord);
      const originalIndex = this.records.findIndex(r => 
        this.service.getId(r) === recordId
      );
      if (originalIndex >= 0) {
        this.records = [...this.records];
        this.records[originalIndex] = { ...this.originalRecord! };
      }
    } else if (this.state === 'insert') {
      // Remove inserted record
      this.filteredRecords = this.filteredRecords.slice(0, -1);
      this.records = this.records.slice(0, -1);
      this.grandTotalRecords--;
      
      if (this.filteredRecords.length > 0) {
        this.currentIndex = Math.min(this.currentIndex, this.filteredRecords.length - 1);
      } else {
        this.currentIndex = -1;
      }
    }

    this.state = 'browse';
    this.originalRecord = null;

    this.emit({
      type: DataSourceEventNames.afterCancel,
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
  }

  insert(record: T): void {
    this.validateDataSourceActive('insert');
    
    this.state = 'insert';
    
    this.emit({
      type: DataSourceEventNames.beforeInsert
    });

    this.filteredRecords = [...this.filteredRecords, record];
    this.records = [...this.records, record];
    this.currentIndex = this.filteredRecords.length - 1;
    this.grandTotalRecords++;

    this.notifyStateChange();

    this.emit({
      type: DataSourceEventNames.afterInsert,
      record,
      index: this.currentIndex
    });
  }

  // =================== Remote CRUD Operations ===================

  async save(callback?: Function): Promise<T> {
    this.validateDataSourceActive('save');
    if (!this.isInserting() && !this.isEditing()) {
      const msg = archbaseI18next.t('archbase:saveRecordIsNotAllowed', { dataSourceName: this.name });
      this.publishEventError(msg, {});
      throw new ArchbaseDataSourceError(msg);
    }
    if (!this.getCurrentRecord()) {
      const msg = archbaseI18next.t('archbase:noRecordToSave', { dataSourceName: this.name });
      this.publishEventError(msg, {});
      throw new ArchbaseDataSourceError(msg);
    }

    const currentRecord = this.getCurrentRecord()!;

    this.emit({
      type: DataSourceEventNames.beforeSave,
      record: currentRecord,
      index: this.getCurrentIndex()
    });

    if (this.validator) {
      const errors = this.validator.validateEntity<T>(currentRecord);
      if (errors && errors.length > 0) {
        this.publishEventErrors(errors);
        if (!errors[0].fieldName) {
          throw new ArchbaseDataSourceError(errors[0].errorMessage);
        } else {
          const msg = archbaseI18next.t('archbase:errorSavingRecord', { dataSourceName: this.label });
          throw new ArchbaseDataSourceError(msg);
        }
      }
    }

    try {
      const savedRecord = await this.service.save<T>(currentRecord);
      
      // Update with immutability
      this.filteredRecords = produce(this.filteredRecords, draft => {
        draft[this.currentIndex] = savedRecord as Draft<T>;
      });

      // Update original records array
      let originalIndex = -1;
      this.records.forEach((item, idx) => {
        const recordIdentity = this.service.getId(item);
        const currentRecordIdentity = this.service.getId(currentRecord);
        
        if (item === currentRecord || (recordIdentity !== undefined && recordIdentity === currentRecordIdentity)) {
          originalIndex = idx;
        }
      });

      this.records = produce(this.records, draft => {
        if (originalIndex >= 0) {
          draft[originalIndex] = savedRecord as Draft<T>;
        } else {
          draft.push(savedRecord as Draft<T>);
        }
      });

      this.state = 'browse';
      this.originalRecord = null;
      this.lastDataChangedAt = new Date().getTime();

      this.notifyStateChange();

      this.emit({
        type: DataSourceEventNames.afterSave,
        record: savedRecord,
        index: this.getCurrentIndex()
      });

      if (callback) {
        callback();
      }

      return savedRecord;
    } catch (error: any) {
      this.handleSaveError(error, callback);
      throw new ArchbaseDataSourceError(processErrorMessage(error));
    }
  }

  async remove(callback?: Function): Promise<T | undefined> {
    this.validateDataSourceActive('remove');
    if (this.isInserting() || this.isEditing()) {
      const msg = archbaseI18next.t('archbase:removingRecordIsNotAllowed', { dataSourceName: this.name });
      this.publishEventError(msg, {});
      throw new ArchbaseDataSourceError(msg);
    }
    if (this.isEmpty() || !this.getCurrentRecord()) {
      const msg = archbaseI18next.t('archbase:noRecordsToEdit', { dataSourceName: this.name });
      this.publishEventError(msg, {});
      throw new ArchbaseDataSourceError(msg);
    }

    const recordToDelete = this.getCurrentRecord()!;
    const deletedIndex = this.currentIndex;

    this.emit({
      type: DataSourceEventNames.beforeRemove,
      record: recordToDelete,
      index: deletedIndex
    });

    try {
      await this.service.delete<T>(this.service.getId(recordToDelete));

      // Remove from both arrays with immutability
      this.filteredRecords = this.filteredRecords.filter((_, idx) => idx !== this.currentIndex);
      
      const originalIndex = this.records.findIndex(r => 
        this.service.getId(r) === this.service.getId(recordToDelete)
      );
      if (originalIndex >= 0) {
        this.records = this.records.filter((_, idx) => idx !== originalIndex);
      }

      this.grandTotalRecords--;

      // Adjust current index
      if (this.filteredRecords.length === 0) {
        this.currentIndex = -1;
      } else {
        if (this.currentIndex >= this.filteredRecords.length) {
          this.currentIndex = this.filteredRecords.length - 1;
        }
      }

      this.lastDataBrowsingOn = new Date().getTime();
      this.lastDataChangedAt = new Date().getTime();

      this.notifyStateChange();

      this.emit({ type: DataSourceEventNames.afterScroll });
      this.emit({
        type: DataSourceEventNames.afterRemove,
        record: recordToDelete,
        index: deletedIndex
      });

      if (callback) {
        callback();
      }

      return recordToDelete;
    } catch (error: any) {
      const userError = processErrorMessage(error);
      this.emit({
        type: DataSourceEventNames.onError,
        error: userError,
        originalError: error
      });
      if (callback) {
        callback(userError);
      }
      throw new ArchbaseDataSourceError(userError);
    }
  }

  // =================== Field Operations ===================

  setFieldValue(fieldName: string, value: any): void {
    this.validateDataSourceActive('setFieldValue');
    if (!this.getCurrentRecord()) {
      return;
    }

    const oldValue = this.getFieldValue(fieldName);
    if (oldValue === value) {
      return;
    }

    const prevRecords = [...this.filteredRecords];
    
    this.filteredRecords = produce(this.filteredRecords, draft => {
      const record = draft[this.currentIndex];
      if (record) {
        this.setNestedValue(record as Draft<T>, fieldName, value);
      }
    });

    // Update original records array if editing
    if (this.state === 'edit' || this.state === 'insert') {
      const recordId = this.getCurrentRecord() ? this.service.getId(this.getCurrentRecord()!) : null;
      if (recordId !== undefined) {
        const originalIndex = this.records.findIndex(r => 
          this.service.getId(r) === recordId
        );
        if (originalIndex >= 0) {
          this.records = produce(this.records, draft => {
            this.setNestedValue(draft[originalIndex] as Draft<T>, fieldName, value);
          });
        }
      }
    }

    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.fieldChanged,
      fieldName,
      oldValue,
      newValue: value,
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });

    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.filteredRecords
    });
  }

  getFieldValue(fieldName: string): any {
    const record = this.getCurrentRecord();
    if (!record) {
      return undefined;
    }
    return this.getNestedValue(record, fieldName);
  }

  // =================== Array Field Operations (V2) ===================

  appendToFieldArray<K extends keyof T>(
    fieldName: K,
    item: T[K] extends Array<infer U> ? U : never
  ): void {
    this.validateDataSourceActive('appendToFieldArray');
    if (!this.getCurrentRecord()) {
      return;
    }

    const currentArray = this.getFieldValue(fieldName as string);
    if (!Array.isArray(currentArray)) {
      throw new Error(`Field ${String(fieldName)} is not an array`);
    }

    const prevRecords = [...this.filteredRecords];
    
    this.filteredRecords = produce(this.filteredRecords, draft => {
      const record = draft[this.currentIndex];
      if (record) {
        const array = this.getNestedValue(record, fieldName as string) as any[];
        array.push(item);
      }
    });

    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.fieldChanged,
      fieldName: fieldName as string,
      oldValue: currentArray,
      newValue: [...currentArray, item],
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
  }

  updateFieldArrayItem<K extends keyof T>(
    fieldName: K,
    index: number,
    updater: (draft: T[K] extends Array<infer U> ? Draft<U> : never) => void
  ): void {
    this.validateDataSourceActive('updateFieldArrayItem');
    if (!this.getCurrentRecord()) {
      return;
    }

    const currentArray = this.getFieldValue(fieldName as string);
    if (!Array.isArray(currentArray)) {
      throw new Error(`Field ${String(fieldName)} is not an array`);
    }
    if (index < 0 || index >= currentArray.length) {
      return; // Silent fail for invalid index
    }

    const prevRecords = [...this.filteredRecords];
    
    this.filteredRecords = produce(this.filteredRecords, draft => {
      const record = draft[this.currentIndex];
      if (record) {
        const array = this.getNestedValue(record, fieldName as string) as any[];
        if (array[index] !== undefined) {
          updater(array[index]);
        }
      }
    });

    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.fieldChanged,
      fieldName: fieldName as string,
      oldValue: currentArray,
      newValue: this.getFieldValue(fieldName as string),
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
  }

  removeFromFieldArray<K extends keyof T>(fieldName: K, index: number): void {
    this.validateDataSourceActive('removeFromFieldArray');
    if (!this.getCurrentRecord()) {
      return;
    }

    const currentArray = this.getFieldValue(fieldName as string);
    if (!Array.isArray(currentArray)) {
      throw new Error(`Field ${String(fieldName)} is not an array`);
    }
    if (index < 0 || index >= currentArray.length) {
      return; // Silent fail for invalid index
    }

    const prevRecords = [...this.filteredRecords];
    
    this.filteredRecords = produce(this.filteredRecords, draft => {
      const record = draft[this.currentIndex];
      if (record) {
        const array = this.getNestedValue(record, fieldName as string) as any[];
        array.splice(index, 1);
      }
    });

    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.fieldChanged,
      fieldName: fieldName as string,
      oldValue: currentArray,
      newValue: this.getFieldValue(fieldName as string),
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
  }

  insertIntoFieldArray<K extends keyof T>(
    fieldName: K,
    index: number,
    item: T[K] extends Array<infer U> ? U : never
  ): void {
    this.validateDataSourceActive('insertIntoFieldArray');
    if (!this.getCurrentRecord()) {
      return;
    }

    const currentArray = this.getFieldValue(fieldName as string);
    if (!Array.isArray(currentArray)) {
      throw new Error(`Field ${String(fieldName)} is not an array`);
    }

    const prevRecords = [...this.filteredRecords];
    
    this.filteredRecords = produce(this.filteredRecords, draft => {
      const record = draft[this.currentIndex];
      if (record) {
        const array = this.getNestedValue(record, fieldName as string) as any[];
        array.splice(index, 0, item);
      }
    });

    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.fieldChanged,
      fieldName: fieldName as string,
      oldValue: currentArray,
      newValue: this.getFieldValue(fieldName as string),
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
  }

  getFieldArray<K extends keyof T>(fieldName: K): T[K] extends Array<infer U> ? U[] : never {
    const value = this.getFieldValue(fieldName as string);
    if (!Array.isArray(value)) {
      throw new Error(`Field ${String(fieldName)} is not an array`);
    }
    return value as T[K] extends Array<infer U> ? U[] : never;
  }

  isFieldArray<K extends keyof T>(fieldName: K): boolean {
    const value = this.getFieldValue(fieldName as string);
    return Array.isArray(value);
  }

  // =================== Remote Filter Operations ===================

  applyRemoteFilter(
    filter: ArchbaseQueryFilter,
    page: number,
    callback?: (() => void) | undefined
  ): void {
    if (
      filter &&
      filter.filter.filterType === QUICK &&
      filter.filter.quickFilterText &&
      filter.filter.quickFilterText !== ''
    ) {
      this.getDataWithQuickFilter(filter, page, callback);
    } else if (filter && (filter.filter.filterType === NORMAL || filter.filter.filterType === ADVANCED)) {
      this.getDataWithFilter(filter, page, callback);
    } else {
      this.getDataWithoutFilter(page, callback);
    }
  }

  // =================== Event Management ===================

  addListener(listener: DataSourceListener<T>): void {
    this.listeners.add(listener);
  }

  removeListener(listener: DataSourceListener<T>): void {
    this.listeners.delete(listener);
  }

  private emit(event: DataSourceEvent<T>): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in DataSource listener:', error);
      }
    });
  }

  // =================== Utility Methods ===================

  getGrandTotalRecords(): number {
    return this.grandTotalRecords;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  setPageSize(pageSize: number): void {
    this.pageSize = pageSize;
  }

  getRecords(): T[] {
    return [...this.filteredRecords];
  }

  setRecords(records: T[]): void {
    const prevRecords = [...this.filteredRecords];
    this.records = [...records];
    this.filteredRecords = [...records];
    this.grandTotalRecords = records.length;
    
    if (records.length > 0) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = -1;
    }

    this.lastDataChangedAt = new Date().getTime();
    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.filteredRecords
    });
  }

  // =================== Debug Support ===================

  getDebugSnapshot() {
    return {
      name: this.name,
      label: this.label,
      recordCount: this.filteredRecords.length,
      currentIndex: this.currentIndex,
      currentRecord: this.getCurrentRecord(),
      state: this.state,
      listeners: this.listeners.size,
      totalRecords: this.grandTotalRecords,
      pageSize: this.pageSize
    };
  }

  // =================== Private Helper Methods ===================

  private validateDataSourceActive(operation: string): void {
    if (!this.active) {
      throw new ArchbaseDataSourceError(`DataSource ${this.name} is not active. Cannot perform ${operation}`);
    }
  }

  private publishEventError(message: string, details: any): void {
    this.emit({
      type: DataSourceEventNames.onError,
      error: message,
      originalError: details
    });
    if (this.onError) {
      this.onError(message, details);
    }
  }

  private publishEventErrors(errors: any[]): void {
    errors.forEach(error => {
      if (error.fieldName) {
        this.emit({
          type: DataSourceEventNames.onFieldError,
          fieldName: error.fieldName,
          error: error.errorMessage,
          originalError: error
        });
        if (this.onFieldError) {
          this.onFieldError(error.fieldName, error.errorMessage);
        }
      }
    });
  }

  private handleSaveError(error: any, callback?: Function): void {
    if (error.response && error.response.data && error.response.data.apierror) {
      if (error.response.data.apierror.subErrors) {
        error.response.data.apierror.subErrors.forEach((element: any) => {
          if (element.field) {
            this.emit({
              type: DataSourceEventNames.onFieldError,
              fieldName: element.field,
              error: element.message,
              originalError: element.message
            });
            if (this.onFieldError) {
              this.onFieldError(element.field, element.message);
            }
          }
        });
      }
    }
    
    const userError = processErrorMessage(error);
    this.emit({
      type: DataSourceEventNames.onError,
      error: userError,
      originalError: error
    });
    
    if (this.onError) {
      this.onError(userError, error);
    }
    
    if (callback) {
      callback(userError);
    }
  }

  private notifyStateChange(prevRecords?: T[]): void {
    if (this.onStateChange && prevRecords) {
      this.onStateChange(prevRecords, [...this.filteredRecords]);
    }
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current == null) {
        return undefined;
      }
      current = current[key];
    }
    
    return current;
  }

  // =================== Remote Data Loading ===================

  private async getDataWithFilter(
    currentFilter: ArchbaseQueryFilter,
    page: number,
    callback?: (() => void) | undefined
  ): Promise<any> {
    try {
      const filter = new ArchbaseFilterDSL();
      filter.buildFrom(currentFilter.filter, currentFilter.sort);
      const filterStr = filter.toJSON();
      
      let result: any;
      if (filterStr) {
        result = await this.service.findAllWithFilter(filterStr, page, this.getPageSize());
      } else {
        result = await this.getDataWithoutFilter(page);
      }

      if (result && result.content) {
        this.setRecords(result.content);
        this.grandTotalRecords = result.totalElements || result.content.length;
      }

      if (callback) {
        callback();
      }

      return result;
    } catch (error) {
      this.handleRemoteError(error, callback);
      throw error;
    }
  }

  private async getDataWithoutFilter(page: number, callback?: (() => void) | undefined): Promise<any> {
    try {
      let result: any;
      if (this.defaultSortFields.length > 0) {
        result = await this.service.findAllWithSort(page, this.getPageSize(), this.defaultSortFields);
      } else {
        result = await this.service.findAll(page, this.getPageSize());
      }

      if (result && result.content) {
        this.setRecords(result.content);
        this.grandTotalRecords = result.totalElements || result.content.length;
      }

      if (callback) {
        callback();
      }

      return result;
    } catch (error) {
      this.handleRemoteError(error, callback);
      throw error;
    }
  }

  private async getDataWithQuickFilter(
    currentFilter: ArchbaseQueryFilter,
    page: number,
    callback?: (() => void) | undefined
  ): Promise<any> {
    try {
      const fieldsStr = Array.isArray(currentFilter.filter.quickFilterFieldsText) 
        ? currentFilter.filter.quickFilterFieldsText.join(',')
        : currentFilter.filter.quickFilterFieldsText;
      
      const sortStr = this.getSortFields(currentFilter).join(',');
      
      const result = await this.service.findAllMultipleFields(
        currentFilter.filter.quickFilterText,
        fieldsStr,
        page,
        this.getPageSize(),
        sortStr
      );

      if (result && result.content) {
        this.setRecords(result.content);
        this.grandTotalRecords = result.totalElements || result.content.length;
      }

      if (callback) {
        callback();
      }

      return result;
    } catch (error) {
      this.handleRemoteError(error, callback);
      throw error;
    }
  }

  private getSortFields(currentFilter: ArchbaseQueryFilter): string[] {
    if (currentFilter && currentFilter.sort) {
      const sortFields = currentFilter.sort.quickFilterSort;
      if (Array.isArray(sortFields)) {
        return sortFields;
      } else if (typeof sortFields === 'string') {
        return [sortFields];
      }
    }
    return this.defaultSortFields;
  }

  private handleRemoteError(error: any, callback?: (() => void) | undefined): void {
    const userError = processErrorMessage(error);
    this.emit({
      type: DataSourceEventNames.onError,
      error: userError,
      originalError: error
    });
    
    if (this.onError) {
      this.onError(userError, error);
    }
    
    if (callback) {
      callback();
    }
  }
}
