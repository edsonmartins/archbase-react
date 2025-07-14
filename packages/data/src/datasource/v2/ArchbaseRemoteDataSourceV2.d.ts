import { Draft } from 'immer';
import { ArchbaseQueryFilter } from '@archbase/core';
import { DataSourceListener, IDataSourceValidator } from '../ArchbaseDataSource';
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
export declare class ArchbaseRemoteDataSourceV2<T> {
    private name;
    private label;
    private service;
    private records;
    private filteredRecords;
    private currentIndex;
    private state;
    private listeners;
    private originalRecord;
    private validator?;
    private lastDataChangedAt;
    private lastDataBrowsingOn;
    private grandTotalRecords;
    private defaultSortFields;
    private pageSize;
    private active;
    private onStateChange?;
    private onFieldError?;
    private onError?;
    constructor(config: ArchbaseRemoteDataSourceV2Config<T>);
    getName(): string;
    getLabel(): string;
    isActive(): boolean;
    close(): void;
    getCurrentRecord(): T | undefined;
    getCurrentIndex(): number;
    getTotalRecords(): number;
    isEmpty(): boolean;
    first(): void;
    last(): void;
    next(): void;
    prior(): void;
    goToRecord(index: number): void;
    isFirst(): boolean;
    isLast(): boolean;
    isBOF(): boolean;
    isEOF(): boolean;
    isBrowsing(): boolean;
    isEditing(): boolean;
    isInserting(): boolean;
    edit(): void;
    cancel(): void;
    insert(record: T): void;
    save(callback?: Function): Promise<T>;
    remove(callback?: Function): Promise<T | undefined>;
    setFieldValue(fieldName: string, value: any): void;
    getFieldValue(fieldName: string): any;
    appendToFieldArray<K extends keyof T>(fieldName: K, item: T[K] extends Array<infer U> ? U : never): void;
    updateFieldArrayItem<K extends keyof T>(fieldName: K, index: number, updater: (draft: T[K] extends Array<infer U> ? Draft<U> : never) => void): void;
    removeFromFieldArray<K extends keyof T>(fieldName: K, index: number): void;
    insertIntoFieldArray<K extends keyof T>(fieldName: K, index: number, item: T[K] extends Array<infer U> ? U : never): void;
    getFieldArray<K extends keyof T>(fieldName: K): T[K] extends Array<infer U> ? U[] : never;
    isFieldArray<K extends keyof T>(fieldName: K): boolean;
    applyRemoteFilter(filter: ArchbaseQueryFilter, page: number, callback?: (() => void) | undefined): void;
    addListener(listener: DataSourceListener<T>): void;
    removeListener(listener: DataSourceListener<T>): void;
    private emit;
    getGrandTotalRecords(): number;
    getPageSize(): number;
    setPageSize(pageSize: number): void;
    getRecords(): T[];
    setRecords(records: T[]): void;
    getDebugSnapshot(): {
        name: string;
        label: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: DataSourceState;
        listeners: number;
        totalRecords: number;
        pageSize: number;
    };
    private validateDataSourceActive;
    private publishEventError;
    private publishEventErrors;
    private handleSaveError;
    private notifyStateChange;
    private setNestedValue;
    private getNestedValue;
    private getDataWithFilter;
    private getDataWithoutFilter;
    private getDataWithQuickFilter;
    private getSortFields;
    private handleRemoteError;
}
export {};
//# sourceMappingURL=ArchbaseRemoteDataSourceV2.d.ts.map