import { produce, Draft, enableMapSet } from 'immer';
import { 
  IDataSource, 
  DataSourceOptions, 
  FilterFn,
  DataSourceEvent,
  DataSourceEventNames,
  DataSourceListener,
  IDataSourceValidator
} from '../ArchbaseDataSource';

// Habilitar suporte para Maps e Sets no Immer
enableMapSet();

/**
 * Estado interno do DataSource
 */
type DataSourceState = 'browse' | 'edit' | 'insert';

/**
 * Configuração para ArchbaseDataSourceV2
 */
export interface ArchbaseDataSourceV2Config<T> {
  /** Nome do DataSource */
  name: string;
  /** Label opcional */
  label?: string;
  /** Dados iniciais */
  records?: T[];
  /** Validador opcional */
  validator?: IDataSourceValidator;
  /** Função para obter ID do registro */
  getIdentity?: (record: T) => any;
  /** Callback de debug para mudanças */
  onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
}

/**
 * ArchbaseDataSourceV2 - Implementação moderna com Immer
 * 
 * Esta versão implementa a interface IDataSource<T> do zero,
 * garantindo imutabilidade através do Immer e melhor integração com React.
 */
export class ArchbaseDataSourceV2<T> implements IDataSource<T> {
  private name: string;
  private label: string;
  private records: T[] = [];
  private currentIndex: number = -1;
  private state: DataSourceState = 'browse';
  private listeners = new Set<DataSourceListener<T>>();
  private validator?: IDataSourceValidator;
  private getIdentity?: (record: T) => any;
  private onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
  
  // Backup para cancel
  private originalRecord?: T;
  
  constructor(config: ArchbaseDataSourceV2Config<T>) {
    this.name = config.name;
    this.label = config.label || config.name;
    this.records = config.records || [];
    this.validator = config.validator;
    this.getIdentity = config.getIdentity;
    this.onStateChange = config.onStateChange;
    
    // Se temos records, posicionar no primeiro
    if (this.records.length > 0) {
      this.currentIndex = 0;
    }
  }

  // ========== MÉTODOS DA INTERFACE IDataSource ==========

  open(options: DataSourceOptions<T>): void {
    this.setData(options);
  }

  close(): void {
    this.listeners.clear();
    this.records = [];
    this.currentIndex = -1;
    this.state = 'browse';
  }

  clear(): void {
    const prevRecords = this.records;
    this.records = [];
    this.currentIndex = -1;
    this.state = 'browse';
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.records
    });
  }

  setData(options: DataSourceOptions<T>): void {
    const prevRecords = this.records;
    this.records = options.records || [];
    this.currentIndex = this.records.length > 0 ? 0 : -1;
    this.state = 'browse';
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.refreshData,
      options
    });
  }

  insert(record: T): this {
    if (this.state !== 'browse') {
      throw new Error(`Cannot insert while ${this.state}ing`);
    }
    
    const prevRecords = this.records;
    
    // Adicionar registro de forma imutável
    this.records = [...this.records, record];
    
    this.currentIndex = this.records.length - 1;
    this.state = 'insert';
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.afterInsert,
      record: this.getCurrentRecord()!,
      index: this.currentIndex
    });
    
    return this;
  }

  edit(): this {
    if (this.state !== 'browse' || this.isEmpty()) {
      throw new Error('Cannot edit in current state');
    }
    
    // Backup do registro original
    this.originalRecord = produce(this.getCurrentRecord()!, draft => draft);
    this.state = 'edit';
    
    this.emit({
      type: DataSourceEventNames.afterEdit,
      record: this.getCurrentRecord()!,
      index: this.currentIndex
    });
    
    return this;
  }

  async remove(callback?: Function): Promise<T | undefined> {
    if (this.state !== 'browse' || this.isEmpty()) {
      throw new Error('Cannot remove in current state');
    }
    
    const removedRecord = this.getCurrentRecord()!;
    const removedIndex = this.currentIndex;
    const prevRecords = this.records;
    
    this.emit({
      type: DataSourceEventNames.beforeRemove,
      record: removedRecord,
      index: removedIndex
    });
    
    // Usar Immer para remover
    this.records = produce(this.records, draft => {
      draft.splice(removedIndex, 1);
    });
    
    // Ajustar índice
    if (this.records.length === 0) {
      this.currentIndex = -1;
    } else if (this.currentIndex >= this.records.length) {
      this.currentIndex = this.records.length - 1;
    }
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.afterRemove,
      record: removedRecord,
      index: removedIndex
    });
    
    if (callback) {
      callback();
    }
    
    return removedRecord;
  }

  async save(callback?: Function): Promise<T | undefined> {
    if (this.state === 'browse') {
      return this.getCurrentRecord();
    }
    
    const savedRecord = this.getCurrentRecord()!;
    this.state = 'browse';
    this.originalRecord = undefined;
    
    this.emit({
      type: DataSourceEventNames.afterSave,
      record: savedRecord,
      index: this.currentIndex
    });
    
    if (callback) {
      callback();
    }
    
    return savedRecord;
  }

  cancel(): this {
    if (this.state === 'edit' && this.originalRecord) {
      // Restaurar registro original
      const prevRecords = this.records;
      this.records = [...this.records];
      this.records[this.currentIndex] = this.originalRecord!;
      
      if (this.onStateChange) {
        this.onStateChange(prevRecords, this.records);
      }
    } else if (this.state === 'insert') {
      // Remover registro inserido
      const prevRecords = this.records;
      this.records = produce(this.records, draft => {
        draft.pop();
      });
      
      this.currentIndex = Math.max(0, this.records.length - 1);
      
      if (this.onStateChange) {
        this.onStateChange(prevRecords, this.records);
      }
    }
    
    this.state = 'browse';
    this.originalRecord = undefined;
    
    this.emit({
      type: DataSourceEventNames.afterCancel,
      record: this.getCurrentRecord(),
      index: this.currentIndex
    });
    
    return this;
  }

  getName(): string {
    return this.name;
  }

  getOptions(): DataSourceOptions<T> {
    return {
      records: this.records,
      grandTotalRecords: this.records.length,
      currentPage: 0,
      totalPages: 1,
      pageSize: this.records.length
    };
  }

  refreshData(options?: DataSourceOptions<T>): void {
    if (options) {
      this.setData(options);
    } else {
      this.emit({
        type: DataSourceEventNames.refreshData,
        options: this.getOptions()
      });
    }
  }

  browseRecords(): T[] {
    return this.records;
  }

  getCurrentRecord(): T | undefined {
    return this.records[this.currentIndex];
  }

  getTotalRecords(): number {
    return this.records.length;
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

  setFieldValue(fieldName: string, value: any): this {
    if (this.isEmpty() || !this.getCurrentRecord()) {
      return this;
    }
    
    const oldValue = this.getFieldValue(fieldName);
    if (oldValue === value) {
      return this;
    }
    
    const prevRecords = this.records;
    
    // Usar Immer para atualizar campo
    this.records = produce(this.records, draft => {
      const record = draft[this.currentIndex] as any;
      
      // Suporte para campos aninhados (dot notation)
      const fields = fieldName.split('.');
      let current = record;
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      
      current[fields[fields.length - 1]] = value;
    });
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.fieldChanged,
      record: this.getCurrentRecord()!,
      index: this.currentIndex,
      fieldName,
      oldValue,
      newValue: value
    });
    
    this.emit({
      type: DataSourceEventNames.dataChanged,
      data: this.records
    });
    
    return this;
  }

  getFieldValue(fieldName: string, defaultValue?: any): any {
    const record = this.getCurrentRecord();
    if (!record) {
      return defaultValue;
    }
    
    // Suporte para campos aninhados
    const fields = fieldName.split('.');
    let value: any = record;
    
    for (const field of fields) {
      value = value?.[field];
      if (value === undefined) {
        return defaultValue;
      }
    }
    
    return value;
  }

  isEmptyField(fieldName: string): boolean {
    const value = this.getFieldValue(fieldName);
    return value === null || value === undefined || value === '';
  }

  // ========== MÉTODOS DE NAVEGAÇÃO ==========

  isBOF(): boolean {
    return this.currentIndex <= 0;
  }

  isEOF(): boolean {
    return this.currentIndex >= this.records.length - 1;
  }

  isEmpty(): boolean {
    return this.records.length === 0;
  }

  isFirst(): boolean {
    return this.currentIndex === 0;
  }

  isLast(): boolean {
    return this.currentIndex === this.records.length - 1;
  }

  isInserting(): boolean {
    return this.state === 'insert';
  }

  isEditing(): boolean {
    return this.state === 'edit';
  }

  isBrowsing(): boolean {
    return this.state === 'browse';
  }

  isActive(): boolean {
    return true;
  }

  first(): this {
    if (!this.isEmpty()) {
      this.goToRecord(0);
    }
    return this;
  }

  prior(): this {
    if (this.currentIndex > 0) {
      this.goToRecord(this.currentIndex - 1);
    }
    return this;
  }

  next(): this {
    if (this.currentIndex < this.records.length - 1) {
      this.goToRecord(this.currentIndex + 1);
    }
    return this;
  }

  last(): this {
    if (!this.isEmpty()) {
      this.goToRecord(this.records.length - 1);
    }
    return this;
  }

  goToRecord(index: number): T | undefined {
    if (index >= 0 && index < this.records.length) {
      this.currentIndex = index;
      
      this.emit({
        type: DataSourceEventNames.recordChanged,
        record: this.getCurrentRecord()!,
        index: this.currentIndex
      });
      
      return this.getCurrentRecord();
    }
    return undefined;
  }

  goToPage(_pageNumber: number): this {
    // DataSource V2 não usa paginação interna
    return this;
  }

  // ========== MÉTODOS DE EVENTOS ==========

  addListener(listener: DataSourceListener<T>): this {
    this.listeners.add(listener);
    return this;
  }

  removeListener(listener: DataSourceListener<T>): this {
    this.listeners.delete(listener);
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

  // ========== MÉTODOS ADICIONAIS V2 ==========

  /**
   * Adicionar item ao final de um campo array
   */
  appendToFieldArray<K extends keyof T>(fieldName: K, item: any): void {
    const prevRecords = this.records;
    
    this.records = produce(this.records, draft => {
      const record = draft[this.currentIndex] as any;
      const array = record[fieldName];
      
      if (Array.isArray(array)) {
        array.push(item);
      } else {
        record[fieldName] = [item];
      }
    });
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.fieldChanged,
      record: this.getCurrentRecord()!,
      index: this.currentIndex,
      fieldName: String(fieldName),
      oldValue: prevRecords[this.currentIndex],
      newValue: this.getCurrentRecord()
    });
  }

  /**
   * Atualizar item específico em um campo array
   */
  updateFieldArrayItem<K extends keyof T>(
    fieldName: K,
    itemIndex: number,
    updater: (draft: any) => void
  ): void {
    const prevRecords = this.records;
    
    this.records = produce(this.records, draft => {
      const record = draft[this.currentIndex] as any;
      const array = record[fieldName];
      
      if (Array.isArray(array) && array[itemIndex] !== undefined) {
        updater(array[itemIndex]);
      }
    });
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.fieldChanged,
      record: this.getCurrentRecord()!,
      index: this.currentIndex,
      fieldName: String(fieldName),
      oldValue: prevRecords[this.currentIndex],
      newValue: this.getCurrentRecord()
    });
  }

  /**
   * Remover item de um campo array
   */
  removeFromFieldArray<K extends keyof T>(fieldName: K, itemIndex: number): void {
    const prevRecords = this.records;
    
    this.records = produce(this.records, draft => {
      const record = draft[this.currentIndex] as any;
      const array = record[fieldName];
      
      if (Array.isArray(array) && itemIndex >= 0 && itemIndex < array.length) {
        array.splice(itemIndex, 1);
      }
    });
    
    if (this.onStateChange) {
      this.onStateChange(prevRecords, this.records);
    }
    
    this.emit({
      type: DataSourceEventNames.fieldChanged,
      record: this.getCurrentRecord()!,
      index: this.currentIndex,
      fieldName: String(fieldName),
      oldValue: prevRecords[this.currentIndex],
      newValue: this.getCurrentRecord()
    });
  }

  /**
   * Obter snapshot para debug
   */
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

  // ========== MÉTODOS NÃO IMPLEMENTADOS (COMPATIBILIDADE) ==========

  locate(_values: any): boolean {
    // TODO: Implementar busca
    return false;
  }

  locateByFilter(_filterFn: (record: T) => boolean): boolean {
    // TODO: Implementar busca por filtro
    return false;
  }

  disabledAllListeners(): this {
    // TODO: Implementar
    return this;
  }

  enableAllListeners(): this {
    // TODO: Implementar
    return this;
  }

  addFieldChangeListener(
    _fieldName: string,
    _listener: (fieldName: string, oldValue: any, newValue: any) => void
  ): this {
    // TODO: Implementar listeners por campo
    return this;
  }

  removeFieldChangeListener(
    _fieldName: string,
    _listener: (fieldName: string, oldValue: any, newValue: any) => void
  ): this {
    // TODO: Implementar
    return this;
  }

  addFilter(_filterFn: FilterFn<T>): this {
    // TODO: Implementar filtros
    return this;
  }

  removeFilter(_filterFn: FilterFn<T>): this {
    // TODO: Implementar
    return this;
  }

  clearFilters(): this {
    // TODO: Implementar
    return this;
  }

  append(): this {
    // Alias para insert com registro vazio
    return this.insert({} as T);
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  gotoRecordByData(data: T): boolean {
    const index = this.records.findIndex(record => {
      if (this.getIdentity) {
        return this.getIdentity(record) === this.getIdentity(data);
      }
      return record === data;
    });
    
    if (index >= 0) {
      this.goToRecord(index);
      return true;
    }
    
    return false;
  }

  validate(): boolean {
    if (!this.validator) {
      return true;
    }
    
    const record = this.getCurrentRecord();
    if (!record) {
      return true;
    }
    
    const errors = this.validator.validateEntity(record);
    return errors.length === 0;
  }
}