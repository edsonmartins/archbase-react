import { useCallback, useMemo } from 'react';
import { useArchbaseState } from './useArchbaseState';

/**
 * Estado completo de um DataGrid que deve persistir.
 */
export interface ArchbaseGridPersistedState {
  /** Pagina atual (0-indexed) */
  page: number;
  /** Registros por pagina */
  pageSize: number;
  /** Modelo de ordenacao */
  sortModel: Array<{ field: string; sort: 'asc' | 'desc' }>;
  /** Modelo de filtros por coluna */
  filterModel: Record<string, any>;
  /** IDs das linhas selecionadas/marcadas */
  selectedRowIds: string[];
  /** Larguras das colunas (colId -> width) */
  columnWidths: Record<string, number>;
  /** Ordem das colunas (array de colIds) */
  columnOrder: string[];
  /** Colunas ocultas (array de colIds) */
  hiddenColumns: string[];
  /** IDs das linhas expandidas (master-detail) */
  expandedRowIds: string[];
  /** Posicao do scroll */
  scrollPosition: { top: number; left: number };
}

const DEFAULT_GRID_STATE: ArchbaseGridPersistedState = {
  page: 0,
  pageSize: 25,
  sortModel: [],
  filterModel: {},
  selectedRowIds: [],
  columnWidths: {},
  columnOrder: [],
  hiddenColumns: [],
  expandedRowIds: [],
  scrollPosition: { top: 0, left: 0 },
};

/**
 * Hook para persistir estado completo de um DataGrid.
 * Pode ser usado diretamente ou integrado em componentes de Grid.
 *
 * @param gridId Identificador unico do grid na tela
 * @param initialState Estado inicial customizado (opcional)
 *
 * @example
 * ```tsx
 * // Uso direto
 * const grid = useArchbaseGridState('customersGrid');
 *
 * <ArchbaseDataGridAG
 *   pageIndex={grid.state.page}
 *   pageSize={grid.state.pageSize}
 *   sortModel={grid.state.sortModel}
 *   onPaginationChange={(page, pageSize) => grid.update({ page, pageSize })}
 *   onSortModelChange={(sortModel) => grid.update({ sortModel })}
 *   onSelectionChange={(ids) => grid.update({ selectedRowIds: ids })}
 * />
 *
 * // Ou o componente pode aceitar stateKey e fazer isso internamente
 * <ArchbaseDataGridAG stateKey="customersGrid" />
 * ```
 */
export function useArchbaseGridState(
  gridId: string,
  initialState?: Partial<ArchbaseGridPersistedState>
) {
  const fullInitialState = { ...DEFAULT_GRID_STATE, ...initialState };
  const [state, setState] = useArchbaseState<ArchbaseGridPersistedState>(
    `grid_${gridId}`,
    fullInitialState
  );

  // Atualizar campos especificos
  const update = useCallback((partial: Partial<ArchbaseGridPersistedState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, [setState]);

  // Helpers para operacoes comuns
  const setPage = useCallback((page: number) => update({ page }), [update]);
  const setPageSize = useCallback((pageSize: number) => update({ pageSize, page: 0 }), [update]);
  const setSortModel = useCallback((sortModel: ArchbaseGridPersistedState['sortModel']) => update({ sortModel }), [update]);
  const setFilterModel = useCallback((filterModel: ArchbaseGridPersistedState['filterModel']) => update({ filterModel, page: 0 }), [update]);
  const setSelectedRowIds = useCallback((selectedRowIds: string[]) => update({ selectedRowIds }), [update]);

  // Toggle selecao de linha
  const toggleRowSelection = useCallback((rowId: string) => {
    setState(prev => ({
      ...prev,
      selectedRowIds: prev.selectedRowIds.includes(rowId)
        ? prev.selectedRowIds.filter(id => id !== rowId)
        : [...prev.selectedRowIds, rowId]
    }));
  }, [setState]);

  // Selecionar/deselecionar todas
  const selectAllRows = useCallback((rowIds: string[]) => update({ selectedRowIds: rowIds }), [update]);
  const clearSelection = useCallback(() => update({ selectedRowIds: [] }), [update]);

  // Toggle expansao de linha
  const toggleRowExpansion = useCallback((rowId: string) => {
    setState(prev => ({
      ...prev,
      expandedRowIds: prev.expandedRowIds.includes(rowId)
        ? prev.expandedRowIds.filter(id => id !== rowId)
        : [...prev.expandedRowIds, rowId]
    }));
  }, [setState]);

  // Resetar para estado inicial
  const reset = useCallback(() => setState(fullInitialState), [setState, fullInitialState]);

  // Verificar se linha esta selecionada
  const isRowSelected = useCallback((rowId: string) => state.selectedRowIds.includes(rowId), [state.selectedRowIds]);
  const isRowExpanded = useCallback((rowId: string) => state.expandedRowIds.includes(rowId), [state.expandedRowIds]);

  return {
    /** Estado completo do grid */
    state,
    /** Atualizar multiplos campos */
    update,
    /** Resetar para estado inicial */
    reset,

    // Paginacao
    setPage,
    setPageSize,

    // Ordenacao e Filtros
    setSortModel,
    setFilterModel,

    // Selecao
    setSelectedRowIds,
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    isRowSelected,
    /** Quantidade de linhas selecionadas */
    selectedCount: state.selectedRowIds.length,
    /** Se tem alguma linha selecionada */
    hasSelection: state.selectedRowIds.length > 0,

    // Expansao (master-detail)
    toggleRowExpansion,
    isRowExpanded,
  };
}
