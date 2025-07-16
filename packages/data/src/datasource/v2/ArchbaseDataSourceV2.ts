import { produce, Draft } from 'immer';
import {
  DataSourceEventNames,
  DataSourceEvent,
  DataSourceListener,
  IDataSourceValidator,
  IDataSource,
  DataSourceOptions,
  FilterFn
} from '../ArchbaseDataSource';

/**
 * Estados possíveis do DataSource
 */
type DataSourceState = 'browse' | 'edit' | 'insert';

/**
 * Configuração para ArchbaseDataSourceV2
 */
export interface ArchbaseDataSourceV2Config<T> {
  name: string;
  label?: string;
  records?: T[];
  validator?: IDataSourceValidator;
  onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
  onFieldError?: (fieldName: string, error: string) => void;
  onError?: (error: string, originalError?: any) => void;
}

/**
 * ArchbaseDataSourceV2 - Versão V2 com Immer
 * 
 * Esta implementação:
 * - Garante imutabilidade completa com Immer
 * - Interface simplificada focada em funcionalidade V2
 * - Suporte a operações em arrays com type safety
 * - Event system compatível com V1
 */
export class ArchbaseDataSourceV2<T> implements IDataSource<T> {
  private name: string;
  private label: string;
  private records: T[] = [];
  private currentIndex: number = -1;
  private state: DataSourceState = 'browse';
  private listeners = new Set<DataSourceListener<T>>();
  private originalRecord: T | null = null;
  private validator?: IDataSourceValidator;
  private lastDataChangedAt: number = 0;
  private active: boolean = true;
  
  // Callbacks V2
  private onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
  private onFieldError?: (fieldName: string, error: string) => void;
  private onError?: (error: string, originalError?: any) => void;

  constructor(config: ArchbaseDataSourceV2Config<T>) {
    this.name = config.name;
    this.label = config.label || config.name;
    this.validator = config.validator;
    this.onStateChange = config.onStateChange;
    this.onFieldError = config.onFieldError;
    this.onError = config.onError;

    if (config.records) {
      this.records = [...config.records];
      if (this.records.length > 0) {
        this.currentIndex = 0;
      }
    }

    this.lastDataChangedAt = new Date().getTime();
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
    if (this.currentIndex >= 0 && this.currentIndex < this.records.length) {
      return this.records[this.currentIndex];
    }
    return undefined;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getTotalRecords(): number {
    return this.records.length;
  }

  isEmpty(): boolean {
    return this.records.length === 0;
  }

  // =================== Navigation ===================

  first(): this {
    if (this.records.length > 0) {
      this.currentIndex = 0;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
    return this;
  }

  last(): this {
    if (this.records.length > 0) {
      this.currentIndex = this.records.length - 1;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
    return this;
  }

  next(): this {
    if (this.currentIndex < this.records.length - 1) {
      this.currentIndex++;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
    }
    return this;
  }

  prior(): this {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
    }
    return this;
  }

  goToRecord(index: number): T | undefined {
    if (index >= 0 && index < this.records.length) {
      this.currentIndex = index;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
      return this.getCurrentRecord();
    }
    return undefined;
  }

  isFirst(): boolean {
    return this.currentIndex === 0;
  }

  isLast(): boolean {
    return this.currentIndex === this.records.length - 1;
  }

  isBOF(): boolean {
    return this.currentIndex < 0;
  }

  isEOF(): boolean {
    return this.currentIndex >= this.records.length;
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

  edit(): this {
    this.validateDataSourceActive('edit');
    if (this.isEmpty() || !this.getCurrentRecord()) {
      throw new Error(`No records to edit in DataSource ${this.name}`);
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
    return this;
  }

  cancel(): this {
    this.validateDataSourceActive('cancel');
    
    if (this.state === 'edit' && this.originalRecord) {
      // Restore original record with spread to avoid Draft type issues
      this.records = [...this.records];
      this.records[this.currentIndex] = { ...this.originalRecord! };
    } else if (this.state === 'insert') {
      // Remove inserted record
      this.records = this.records.slice(0, -1);
      
      if (this.records.length > 0) {
        this.currentIndex = Math.min(this.currentIndex, this.records.length - 1);
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
    return this;
  }

  insert(record: T): this {
    this.validateDataSourceActive('insert');
    
    this.state = 'insert';
    
    this.emit({
      type: DataSourceEventNames.beforeInsert
    });

    this.records = [...this.records, record];
    this.currentIndex = this.records.length - 1;

    this.notifyStateChange();

    this.emit({
      type: DataSourceEventNames.afterInsert,
      record,
      index: this.currentIndex
    });
    return this;
  }

  async save(callback?: Function): Promise<T> {
    this.validateDataSourceActive('save');
    if (!this.isInserting() && !this.isEditing()) {
      throw new Error(`Save not allowed in current state for DataSource ${this.name}`);
    }
    if (!this.getCurrentRecord()) {
      throw new Error(`No record to save in DataSource ${this.name}`);
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
        throw new Error(errors[0].errorMessage);
      }
    }

    this.state = 'browse';
    this.originalRecord = null;
    this.lastDataChangedAt = new Date().getTime();

    this.notifyStateChange();

    this.emit({
      type: DataSourceEventNames.afterSave,
      record: currentRecord,
      index: this.getCurrentIndex()
    });

    if (callback) {
      callback();
    }

    return currentRecord;
  }

  async remove(callback?: Function): Promise<T | undefined> {
    this.validateDataSourceActive('remove');
    if (this.isInserting() || this.isEditing()) {
      throw new Error(`Remove not allowed in current state for DataSource ${this.name}`);
    }
    if (this.isEmpty() || !this.getCurrentRecord()) {
      throw new Error(`No records to remove in DataSource ${this.name}`);
    }

    const recordToDelete = this.getCurrentRecord()!;
    const deletedIndex = this.currentIndex;

    this.emit({
      type: DataSourceEventNames.beforeRemove,
      record: recordToDelete,
      index: deletedIndex
    });

    // Remove with immutability
    this.records = this.records.filter((_, idx) => idx !== this.currentIndex);

    // Adjust current index
    if (this.records.length === 0) {
      this.currentIndex = -1;
    } else {
      if (this.currentIndex >= this.records.length) {
        this.currentIndex = this.records.length - 1;
      }
    }

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
  }

  // =================== Field Operations ===================

  setFieldValue(fieldName: string, value: any): this {
    this.validateDataSourceActive('setFieldValue');
    if (!this.getCurrentRecord()) {
      return this;
    }

    const oldValue = this.getFieldValue(fieldName);
    if (oldValue === value) {
      return this;
    }

    const prevRecords = [...this.records];
    
    this.records = produce(this.records, draft => {
      const record = draft[this.currentIndex];
      if (record) {
        this.setNestedValue(record as Draft<T>, fieldName, value);
      }
    });

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
      data: this.records
    });
    return this;
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

    const prevRecords = [...this.records];
    
    this.records = produce(this.records, draft => {
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
      // Silent fail for non-array fields
      return;
    }
    if (index < 0 || index >= currentArray.length) {
      return; // Silent fail for invalid index
    }

    const prevRecords = [...this.records];
    
    this.records = produce(this.records, draft => {
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

    const prevRecords = [...this.records];
    
    this.records = produce(this.records, draft => {
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

    const prevRecords = [...this.records];
    
    this.records = produce(this.records, draft => {
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

  // =================== Interface Compatibility Methods ===================
  
  open(options: DataSourceOptions<T>): void {
    this.setData(options);
  }


  clear(): void {
    this.records = [];
    this.currentIndex = -1;
    this.state = 'browse';
    this.originalRecord = null;
    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.records
    });
  }

  setData(options: DataSourceOptions<T>): void {
    this.records = [...(options.records || [])];
    this.currentIndex = this.records.length > 0 ? 0 : -1;
    this.state = 'browse';
    this.originalRecord = null;
    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.records
    });
  }

  getOptions(): DataSourceOptions<T> {
    return {
      records: [...this.records],
      grandTotalRecords: this.records.length,
      currentPage: 0,
      totalPages: 1,
      pageSize: this.records.length || 10
    };
  }

  refreshData(options?: DataSourceOptions<T>): void {
    if (options) {
      this.setData(options);
    }
  }

  browseRecords(): T[] {
    return [...this.records];
  }

  getGrandTotalRecords(): number {
    return this.records.length;
  }

  getCurrentPage(): number {
    return 0;
  }

  getTotalPages(): number {
    return 1;
  }

  isEmptyField(fieldName: string): boolean {
    const value = this.getFieldValue(fieldName);
    return value === null || value === undefined || value === '';
  }



  goToPage(pageNumber: number): this {
    // V2 doesn't support pagination, so this is a no-op
    return this;
  }

  gotoRecordByData(record: T): boolean {
    const index = this.records.findIndex(r => r === record);
    if (index >= 0) {
      this.currentIndex = index;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
      return true;
    }
    return false;
  }

  disabledAllListeners(): this {
    // V2 doesn't support disabling listeners - always active
    return this;
  }

  enableAllListeners(): this {
    // V2 doesn't support disabling listeners - always active
    return this;
  }

  addFieldChangeListener(
    fieldName: string,
    listener: (fieldName: string, oldValue: any, newValue: any) => void
  ): this {
    // V2 handles this through main listener system
    const wrappedListener = (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.fieldChanged && 
          'fieldName' in event && event.fieldName === fieldName) {
        listener(fieldName, (event as any).oldValue, (event as any).newValue);
      }
    };
    this.addListener(wrappedListener);
    return this;
  }

  removeFieldChangeListener(
    fieldName: string,
    listener: (fieldName: string, oldValue: any, newValue: any) => void
  ): this {
    // V2 simplification - would need to track wrapped listeners for exact removal
    return this;
  }

  addFilter(filterFn: FilterFn<T>): this {
    // V2 doesn't support runtime filters yet - could be added in future
    return this;
  }

  removeFilter(filterFn: FilterFn<T>): this {
    // V2 doesn't support runtime filters yet
    return this;
  }

  clearFilters(): this {
    // V2 doesn't support runtime filters yet
    return this;
  }

  locate(values: any): boolean {
    // V2 simplification - locate by field value matching
    for (let i = 0; i < this.records.length; i++) {
      const record = this.records[i];
      let matches = true;
      for (const [field, value] of Object.entries(values)) {
        if (this.getNestedValue(record, field) !== value) {
          matches = false;
          break;
        }
      }
      if (matches) {
        this.currentIndex = i;
        this.emit({
          type: DataSourceEventNames.recordChanged,
          record: this.getCurrentRecord(),
          index: this.currentIndex
        });
        return true;
      }
    }
    return false;
  }

  locateByFilter(filterFn: (record: T) => boolean): boolean {
    for (let i = 0; i < this.records.length; i++) {
      if (filterFn(this.records[i])) {
        this.currentIndex = i;
        this.emit({
          type: DataSourceEventNames.recordChanged,
          record: this.getCurrentRecord(),
          index: this.currentIndex
        });
        return true;
      }
    }
    return false;
  }

  validate(): boolean {
    // V2 validation will be enhanced in future - basic implementation
    return true;
  }

  // =================== Event Management ===================

  addListener(...listeners: DataSourceListener<T>[]): this {
    listeners.forEach(listener => this.listeners.add(listener));
    return this;
  }

  removeListener(...listeners: DataSourceListener<T>[]): this {
    listeners.forEach(listener => this.listeners.delete(listener));
    return this;
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

  getRecords(): T[] {
    return [...this.records];
  }

  setRecords(records: T[]): void {
    const prevRecords = [...this.records];
    this.records = [...records];
    
    if (records.length > 0) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = -1;
    }

    this.lastDataChangedAt = new Date().getTime();
    this.notifyStateChange(prevRecords);

    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.records
    });
  }

  // =================== Debug Support ===================

  getDebugSnapshot() {
    return {
      name: this.name,
      recordCount: this.records.length,
      currentIndex: this.currentIndex,
      currentRecord: this.getCurrentRecord(),
      state: this.state,
      listeners: this.listeners.size
    };
  }

  // =================== Private Helper Methods ===================

  private validateDataSourceActive(operation: string): void {
    if (!this.active) {
      throw new Error(`DataSource ${this.name} is not active. Cannot perform ${operation}`);
    }
  }

  private notifyStateChange(prevRecords?: T[]): void {
    if (this.onStateChange && prevRecords) {
      this.onStateChange(prevRecords, [...this.records]);
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
}
