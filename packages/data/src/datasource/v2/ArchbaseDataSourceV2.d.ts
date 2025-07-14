import { Draft } from 'immer';
import { DataSourceListener, IDataSourceValidator, IDataSource, DataSourceOptions, FilterFn } from '../ArchbaseDataSource';
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
export declare class ArchbaseDataSourceV2<T> implements IDataSource<T> {
    private name;
    private label;
    private records;
    private currentIndex;
    private state;
    private listeners;
    private originalRecord;
    private validator?;
    private lastDataChangedAt;
    private active;
    private onStateChange?;
    private onFieldError?;
    private onError?;
    constructor(config: ArchbaseDataSourceV2Config<T>);
    getName(): string;
    getLabel(): string;
    isActive(): boolean;
    close(): void;
    getCurrentRecord(): T | undefined;
    getCurrentIndex(): number;
    getTotalRecords(): number;
    isEmpty(): boolean;
    first(): this;
    last(): this;
    next(): this;
    prior(): this;
    goToRecord(index: number): T | undefined;
    isFirst(): boolean;
    isLast(): boolean;
    isBOF(): boolean;
    isEOF(): boolean;
    isBrowsing(): boolean;
    isEditing(): boolean;
    isInserting(): boolean;
    edit(): this;
    cancel(): this;
    insert(record: T): this;
    save(callback?: Function): Promise<T>;
    remove(callback?: Function): Promise<T | undefined>;
    setFieldValue(fieldName: string, value: any): this;
    getFieldValue(fieldName: string): any;
    appendToFieldArray<K extends keyof T>(fieldName: K, item: T[K] extends Array<infer U> ? U : never): void;
    updateFieldArrayItem<K extends keyof T>(fieldName: K, index: number, updater: (draft: T[K] extends Array<infer U> ? Draft<U> : never) => void): void;
    removeFromFieldArray<K extends keyof T>(fieldName: K, index: number): void;
    insertIntoFieldArray<K extends keyof T>(fieldName: K, index: number, item: T[K] extends Array<infer U> ? U : never): void;
    getFieldArray<K extends keyof T>(fieldName: K): T[K] extends Array<infer U> ? U[] : never;
    isFieldArray<K extends keyof T>(fieldName: K): boolean;
    open(options: DataSourceOptions<T>): void;
    clear(): void;
    setData(options: DataSourceOptions<T>): void;
    getOptions(): DataSourceOptions<T>;
    refreshData(options?: DataSourceOptions<T>): void;
    browseRecords(): T[];
    getGrandTotalRecords(): number;
    getCurrentPage(): number;
    getTotalPages(): number;
    isEmptyField(fieldName: string): boolean;
    goToPage(pageNumber: number): this;
    gotoRecordByData(record: T): boolean;
    disabledAllListeners(): this;
    enableAllListeners(): this;
    addFieldChangeListener(fieldName: string, listener: (fieldName: string, oldValue: any, newValue: any) => void): this;
    removeFieldChangeListener(fieldName: string, listener: (fieldName: string, oldValue: any, newValue: any) => void): this;
    addFilter(filterFn: FilterFn<T>): this;
    removeFilter(filterFn: FilterFn<T>): this;
    clearFilters(): this;
    locate(values: any): boolean;
    locateByFilter(filterFn: (record: T) => boolean): boolean;
    validate(): boolean;
    addListener(...listeners: DataSourceListener<T>[]): this;
    removeListener(...listeners: DataSourceListener<T>[]): this;
    private emit;
    getRecords(): T[];
    setRecords(records: T[]): void;
    getDebugSnapshot(): {
        name: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: DataSourceState;
        listeners: number;
    };
    private validateDataSourceActive;
    private notifyStateChange;
    private setNestedValue;
    private getNestedValue;
}
export {};
//# sourceMappingURL=ArchbaseDataSourceV2.d.ts.map