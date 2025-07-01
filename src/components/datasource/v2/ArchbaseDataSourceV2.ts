import { produce, Draft } from 'immer';
import {
  DataSourceEventNames,
  DataSourceEvent,
  DataSourceListener,
  IDataSourceValidator
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
export class ArchbaseDataSourceV2<T> {
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

  first(): void {
    if (this.records.length > 0) {
      this.currentIndex = 0;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  last(): void {
    if (this.records.length > 0) {
      this.currentIndex = this.records.length - 1;
      this.emit({
        type: DataSourceEventNames.afterScroll
      });
    }
  }

  next(): void {
    if (this.currentIndex < this.records.length - 1) {
      this.currentIndex++;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
    }
  }

  prior(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
    }
  }

  goToRecord(index: number): void {
    if (index >= 0 && index < this.records.length) {
      this.currentIndex = index;
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord(),
        index: this.currentIndex
      });
    }
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

  edit(): void {
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
  }

  cancel(): void {
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
  }

  insert(record: T): void {
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

  setFieldValue(fieldName: string, value: any): void {
    this.validateDataSourceActive('setFieldValue');
    if (!this.getCurrentRecord()) {
      return;
    }

    const oldValue = this.getFieldValue(fieldName);
    if (oldValue === value) {
      return;
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