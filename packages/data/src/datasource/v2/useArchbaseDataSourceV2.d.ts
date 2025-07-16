import { ArchbaseDataSourceV2, ArchbaseDataSourceV2Config } from './ArchbaseDataSourceV2';
/**
 * Hook para usar ArchbaseDataSourceV2 de forma reativa no React
 *
 * Este hook provê:
 * - Gerenciamento automático do ciclo de vida do DataSource
 * - Estado reativo baseado em eventos
 * - Cleanup automático no unmount
 * - Type safety completa
 * - Performance otimizada com callbacks memoizados
 */
export declare function useArchbaseDataSourceV2<T, ID = any>(config: ArchbaseDataSourceV2Config<T>): {
    dataSource: ArchbaseDataSourceV2<T>;
    currentRecord: T;
    currentIndex: number;
    totalRecords: number;
    isLoading: boolean;
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
    getFieldArray: <K extends keyof T>(fieldName: K) => any[];
    isFieldArray: <K extends keyof T>(fieldName: K) => boolean;
    getDebugInfo: () => {
        hookState: {
            currentRecord: T;
            currentIndex: number;
            totalRecords: number;
            isBrowsing: boolean;
            isEditing: boolean;
            isInserting: boolean;
            isLoading: boolean;
        };
        name: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: "insert" | "edit" | "browse";
        listeners: number;
    };
};
/**
 * Tipo para o retorno do hook useArchbaseDataSourceV2
 */
export type UseArchbaseDataSourceV2Return<T> = ReturnType<typeof useArchbaseDataSourceV2<T, any>>;
/**
 * Hook customizado para componentes que precisam apenas de leitura
 * Otimizado para performance - não re-renderiza em mudanças de campo
 */
export declare function useArchbaseDataSourceV2ReadOnly<T, ID = any>(config: ArchbaseDataSourceV2Config<T>): {
    dataSource: ArchbaseDataSourceV2<T>;
    currentRecord: T;
    currentIndex: number;
    totalRecords: number;
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
    getFieldArray: <K extends keyof T>(fieldName: K) => any[];
    isFieldArray: <K extends keyof T>(fieldName: K) => boolean;
};
/**
 * Hook customizado para componentes de edição
 * Inclui todas as operações de modificação
 */
export declare function useArchbaseDataSourceV2Editor<T, ID = any>(config: ArchbaseDataSourceV2Config<T>): {
    dataSource: ArchbaseDataSourceV2<T>;
    currentRecord: T;
    currentIndex: number;
    totalRecords: number;
    isLoading: boolean;
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
    getFieldArray: <K extends keyof T>(fieldName: K) => any[];
    isFieldArray: <K extends keyof T>(fieldName: K) => boolean;
    getDebugInfo: () => {
        hookState: {
            currentRecord: T;
            currentIndex: number;
            totalRecords: number;
            isBrowsing: boolean;
            isEditing: boolean;
            isInserting: boolean;
            isLoading: boolean;
        };
        name: string;
        recordCount: number;
        currentIndex: number;
        currentRecord: T;
        state: "insert" | "edit" | "browse";
        listeners: number;
    };
};
//# sourceMappingURL=useArchbaseDataSourceV2.d.ts.map
