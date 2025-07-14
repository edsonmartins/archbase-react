import { ArchbaseRemoteDataSourceV2, ArchbaseRemoteDataSourceV2Config } from './ArchbaseRemoteDataSourceV2';
import { ArchbaseQueryFilter } from '@archbase/core';
/**
 * Hook para usar ArchbaseRemoteDataSourceV2 de forma reativa no React
 *
 * Este hook provê:
 * - Gerenciamento automático do ciclo de vida do RemoteDataSource
 * - Estado reativo baseado em eventos
 * - Cleanup automático no unmount
 * - Type safety completa
 * - Performance otimizada com callbacks memoizados
 * - Operações remotas (CRUD, filtragem, paginação)
 */
export declare function useArchbaseRemoteDataSourceV2<T, ID = any>(config: ArchbaseRemoteDataSourceV2Config<T>): {
    dataSource: ArchbaseRemoteDataSourceV2<T>;
    currentRecord: T;
    currentIndex: number;
    totalRecords: number;
    grandTotalRecords: number;
    isLoading: boolean;
    error: string;
    canNext: boolean;
    canPrior: boolean;
    isEmpty: boolean;
    isFirst: boolean;
    isLast: boolean;
    isBrowsing: boolean;
    isEditing: boolean;
    isInserting: boolean;
    setFieldValue: (fieldName: string, value: any) => void;
    getFieldValue: (fieldName: string) => any;
    edit: () => void;
    save: () => Promise<T>;
    cancel: () => void;
    insert: (record: T) => void;
    remove: (callback?: Function) => Promise<T>;
    first: () => void;
    last: () => void;
    next: () => void;
    prior: () => void;
    goToRecord: (index: number) => void;
    appendToFieldArray: <K extends keyof T>(fieldName: K, item: T[K] extends Array<infer U> ? U : never) => void;
    updateFieldArrayItem: <K extends keyof T>(fieldName: K, index: number, updater: (draft: any) => void) => void;
    removeFromFieldArray: <K extends keyof T>(fieldName: K, index: number) => void;
    insertIntoFieldArray: <K extends keyof T>(fieldName: K, index: number, item: T[K] extends Array<infer U> ? U : never) => void;
    getFieldArray: <K extends keyof T>(fieldName: K) => T[K] extends (infer U)[] ? U[] : never;
    isFieldArray: <K extends keyof T>(fieldName: K) => boolean;
    applyRemoteFilter: (filter: ArchbaseQueryFilter, page: number, callback?: (() => void) | undefined) => void;
    refreshData: () => Promise<void>;
    setPageSize: (pageSize: number) => void;
    getPageSize: () => number;
    getDebugInfo: () => {
        hookState: {
            currentRecord: T;
            currentIndex: number;
            totalRecords: number;
            grandTotalRecords: number;
            isBrowsing: boolean;
            isEditing: boolean;
            isInserting: boolean;
            isLoading: boolean;
            error: string;
        };
        name: string;
        label: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: "insert" | "edit" | "browse";
        listeners: number;
        totalRecords: number;
        pageSize: number;
    };
};
/**
 * Tipo para o retorno do hook useArchbaseRemoteDataSourceV2
 */
export type UseArchbaseRemoteDataSourceV2Return<T> = ReturnType<typeof useArchbaseRemoteDataSourceV2<T, any>>;
/**
 * Hook customizado para componentes que precisam apenas de leitura
 * Otimizado para performance - não re-renderiza em mudanças de campo
 */
export declare function useArchbaseRemoteDataSourceV2ReadOnly<T, ID = any>(config: ArchbaseRemoteDataSourceV2Config<T>): {
    dataSource: ArchbaseRemoteDataSourceV2<T>;
    currentRecord: T;
    currentIndex: number;
    totalRecords: number;
    grandTotalRecords: number;
    isLoading: boolean;
    error: string;
    canNext: boolean;
    canPrior: boolean;
    isEmpty: boolean;
    isFirst: boolean;
    isLast: boolean;
    isBrowsing: boolean;
    first: () => void;
    last: () => void;
    next: () => void;
    prior: () => void;
    goToRecord: (index: number) => void;
    getFieldValue: (fieldName: string) => any;
    getFieldArray: <K extends keyof T>(fieldName: K) => T[K] extends (infer U)[] ? U[] : never;
    isFieldArray: <K extends keyof T>(fieldName: K) => boolean;
    applyRemoteFilter: (filter: ArchbaseQueryFilter, page: number, callback?: () => void) => void;
    refreshData: () => Promise<void>;
    getPageSize: () => number;
    getDebugInfo: () => {
        hookState: {
            currentRecord: T;
            currentIndex: number;
            totalRecords: number;
            grandTotalRecords: number;
            isBrowsing: boolean;
            isEditing: boolean;
            isInserting: boolean;
            isLoading: boolean;
            error: string;
        };
        name: string;
        label: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: "insert" | "edit" | "browse";
        listeners: number;
        totalRecords: number;
        pageSize: number;
    };
};
/**
 * Hook customizado para componentes de edição
 * Inclui todas as operações de modificação
 */
export declare function useArchbaseRemoteDataSourceV2Editor<T, ID = any>(config: ArchbaseRemoteDataSourceV2Config<T>): {
    dataSource: ArchbaseRemoteDataSourceV2<T>;
    currentRecord: T;
    currentIndex: number;
    totalRecords: number;
    grandTotalRecords: number;
    isLoading: boolean;
    error: string;
    canNext: boolean;
    canPrior: boolean;
    isEmpty: boolean;
    isFirst: boolean;
    isLast: boolean;
    isBrowsing: boolean;
    isEditing: boolean;
    isInserting: boolean;
    setFieldValue: (fieldName: string, value: any) => void;
    getFieldValue: (fieldName: string) => any;
    edit: () => void;
    save: () => Promise<T>;
    cancel: () => void;
    insert: (record: T) => void;
    remove: (callback?: Function) => Promise<T>;
    first: () => void;
    last: () => void;
    next: () => void;
    prior: () => void;
    goToRecord: (index: number) => void;
    appendToFieldArray: <K extends keyof T>(fieldName: K, item: T[K] extends (infer U)[] ? U : never) => void;
    updateFieldArrayItem: <K extends keyof T>(fieldName: K, index: number, updater: (draft: any) => void) => void;
    removeFromFieldArray: <K extends keyof T>(fieldName: K, index: number) => void;
    insertIntoFieldArray: <K extends keyof T>(fieldName: K, index: number, item: T[K] extends (infer U)[] ? U : never) => void;
    getFieldArray: <K extends keyof T>(fieldName: K) => T[K] extends (infer U)[] ? U[] : never;
    isFieldArray: <K extends keyof T>(fieldName: K) => boolean;
    applyRemoteFilter: (filter: ArchbaseQueryFilter, page: number, callback?: () => void) => void;
    refreshData: () => Promise<void>;
    setPageSize: (pageSize: number) => void;
    getPageSize: () => number;
    getDebugInfo: () => {
        hookState: {
            currentRecord: T;
            currentIndex: number;
            totalRecords: number;
            grandTotalRecords: number;
            isBrowsing: boolean;
            isEditing: boolean;
            isInserting: boolean;
            isLoading: boolean;
            error: string;
        };
        name: string;
        label: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: "insert" | "edit" | "browse";
        listeners: number;
        totalRecords: number;
        pageSize: number;
    };
};
//# sourceMappingURL=useArchbaseRemoteDataSourceV2.d.ts.map