import { ArchbaseDataSource } from '@archbase/data';
/**
 * Hook para estabilizar o comportamento da Grid e evitar chamadas duplicadas à busca,
 * além de preservar o foco em inputs durante interações.
 */
export declare function useArchbaseDataGridStableRendering<T extends object, ID>({ dataSource, debounceTime }: {
    dataSource: ArchbaseDataSource<T, ID>;
    debounceTime?: number;
}): {
    rows: T[];
    totalRecords: number;
    isLoading: boolean;
    refreshData: () => void;
};
//# sourceMappingURL=use-grid-data-stable-rendering.d.ts.map