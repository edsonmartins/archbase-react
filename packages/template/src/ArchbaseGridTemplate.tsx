import { AlertVariant, Box, Button, ButtonVariant, Flex, Paper, useMantineColorScheme } from '@mantine/core';
import { IconBug, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { IconPlus } from '@tabler/icons-react';
import { getI18nextInstance, useArchbaseTranslation } from '@archbase/core';
import React, { Fragment, ReactNode, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  ArchbaseDataGrid,
  ArchbaseDataGridRef,
  Columns,
  GridToolBarActions,
  CellClickEvent
} from '@archbase/components';
import { ArchbaseStateValues } from './ArchbaseStateValues';
import { ArchbaseQueryBuilder, ArchbaseQueryFilter, ArchbaseQueryFilterDelegator, ArchbaseQueryFilterState, FilterOptions, buildFrom } from '@archbase/advanced';
import { ArchbaseDataSource } from '@archbase/data';
import { useArchbaseTheme } from '@archbase/core';
import { emit, useArchbaseAppContext } from '@archbase/core';
import { ArchbaseAlert } from '@archbase/components';
import { useArchbaseV1V2Compatibility } from '@archbase/data';

export interface UserActionsOptions {
  visible: boolean;
  labelAdd?: string;
  labelEdit?: string;
  labelRemove?: string;
  labelView?: string;
  allowRemove: boolean;
  customUserActions?: ReactNode;
  customUserActionsPosition?: 'left' | 'right';
  onAddExecute?: () => void;
  onEditExecute?: () => void;
  onRemoveExecute?: () => void;
  onViewExecute?: () => void;
}

export interface UserRowActionsOptions<T extends Object> {
  actions?: any;
  onAddRow?: (row: T) => void;
  onEditRow?: (row: T) => void;
  onRemoveRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
}

export interface ArchbaseGridTemplateProps<T extends Object, ID> {
  id?: string;
  title: string;
  printTitle?: string;
  logoPrint?: string;
  variant?: AlertVariant | ButtonVariant;
  dataSource: ArchbaseDataSource<T, ID>;
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
  store?: ArchbaseStateValues | undefined;
  filterType: 'none' | 'normal' | 'advanced';
  filterOptions?: FilterOptions;
  filterPersistenceDelegator?: ArchbaseQueryFilterDelegator;
  pageSize?: number;
  pageIndex?: number;
  columns: ReactNode;
  filterFields?: ReactNode | undefined;
  userActions?: UserActionsOptions;
  userRowActions?: UserRowActionsOptions<T>;
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  isLoading?: boolean;
  isLoadingFilter?: boolean;
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  width?: number | string | undefined;
  height?: number | string | undefined;
  onSearchByFilter?: () => void;
  getRowId?: (row: T) => any
  withBorder?: boolean;
  enableTopToolbar?: boolean;
  enableTopToolbarActions?: boolean;
  cellPadding?: string | number;
  bottomToolbarMinHeight?: string | number;
  /** Habilitar seleção de linhas */
  enableRowSelection?: boolean;
  /** Habilitar números de linha */
  enableRowNumbers?: boolean;
  /** Habilitar ações nas linhas */
  enableRowActions?: boolean;
  /** Posição da coluna de ações */
  positionActionsColumn: 'first' | 'last';
  /** Padding da célula do cabeçalho da tabela */
  tableHeadCellPadding?: string;
  /** Função para renderizar o painel de detalhes */
  renderDetailPanel?: (props: { row: T }) => ReactNode;
  /** Função para renderizar a barra de ferramentas superior */
  renderTopToolbar?: ReactNode;
  /** Alinhamento da toolbar */
  toolbarAlignment?: 'left' | 'right';
  /** Conteúdo da esquerda da toolbar */
  toolbarLeftContent?: ReactNode;
  /** Função chamada quando as linhas selecionadas mudam */
  onSelectedRowsChanged?: (rows: T[]) => void;
  /** Função chamada quando ocorre duplo clique em uma célula */
  onCellDoubleClick?: (event: CellClickEvent) => void;
  /** Labels para paginação */
  paginationLabels?: {
    totalRecords?: string;
    pageSize?: string;
    currentPage?: string;
    of?: string;
  };
  customRenderRowActions?: (row: T) => ReactNode
}

// Definimos a interface para os métodos públicos expostos via ref
export interface ArchbaseGridTemplateRef {
  refreshData: () => void;
  getSelectedRows: () => any[];
  clearSelection: () => void;
  exportData: () => void;
  printData: () => void;
  getDataGridRef: () => React.RefObject<ArchbaseDataGridRef>;
}

const getFilter = (
  filterOptions?: FilterOptions,
  store?: ArchbaseStateValues | undefined,
  filterPersistenceDelegator?: ArchbaseQueryFilterDelegator,
) => {
  if (!filterOptions || !store || !store.existsValue(`${filterOptions.viewName}_${filterOptions.componentName}`)) {
    let index = -1;
    let currentFilter: ArchbaseQueryFilter | undefined = undefined;
    if (filterPersistenceDelegator && filterPersistenceDelegator.getFilters().length > 0) {
      index = 0;
      currentFilter = JSON.parse(filterPersistenceDelegator.getFirstFilter()?.filter);
    }
    return {
      activeFilterIndex: index,
      expandedFilter: false,
      currentFilter,
    };
  }
  return store.getValue(`${filterOptions.viewName}_${filterOptions.componentName}`);
};

// Utilizamos forwardRef com a especificação correta dos tipos genéricos
function ArchbaseGridTemplateImpl<T extends object, ID>(
  props: ArchbaseGridTemplateProps<T, ID>,
  ref: React.ForwardedRef<ArchbaseGridTemplateRef>
) {
  const {
    title,
    printTitle,
    dataSource,
    filterOptions,
    pageSize = 15,
    pageIndex = 0,
    columns,
    filterFields,
    logoPrint,
    userActions,
    userRowActions,
    customRenderRowActions,
    innerRef,
    isLoading = false,
    isLoadingFilter = false,
    isError = false,
    enableTopToolbar = true,
    enableTopToolbarActions = true,
    error = '',
    clearError = () => {},
    filterType,
    width = '100%',
    height = '100%',
    onSearchByFilter,
    getRowId,
    withBorder = true,
    filterPersistenceDelegator,
    variant,
    store,
    cellPadding,
    bottomToolbarMinHeight,
    enableRowSelection = true,
    enableRowNumbers = true,
    enableRowActions = true,
    positionActionsColumn = 'first',
    tableHeadCellPadding,
    renderDetailPanel,
    renderTopToolbar,
    toolbarAlignment = 'right',
    toolbarLeftContent,
    onSelectedRowsChanged,
    onCellDoubleClick,
    paginationLabels,
  } = props;

  const filterRef = useRef<any>(null);
  const gridRef = useRef<ArchbaseDataGridRef>(null);
  const theme = useArchbaseTheme();
  const { colorScheme } = useMantineColorScheme();

  // 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
  const v1v2Compatibility = useArchbaseV1V2Compatibility<T>(
    'ArchbaseGridTemplate',
    dataSource,
    undefined,
    undefined
  );

  // Expondo métodos para a ref externa
  useImperativeHandle(ref, () => ({
    refreshData: () => {
      if (gridRef.current) {
        gridRef.current.refreshData();
      }
    },
    getSelectedRows: () => {
      return gridRef.current ? gridRef.current.getSelectedRows() : [];
    },
    clearSelection: () => {
      if (gridRef.current) {
        gridRef.current.clearSelection();
      }
    },
    exportData: () => {
      if (gridRef.current) {
        gridRef.current.exportData();
      }
    },
    printData: () => {
      if (gridRef.current) {
        gridRef.current.printData();
      }
    },
    getDataGridRef: () => gridRef
  }), [gridRef]);

  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    activeFilterIndex: -1,
    currentFilter: undefined,
    expandedFilter: false,
  });

  useEffect(() => {
    const state = getFilter(filterOptions, store, filterPersistenceDelegator);
    setFilterState(state);
  }, [isLoadingFilter]);

  // Função para renderizar ações na linha
  const getRenderRowActions = (row: any) => {
    if (customRenderRowActions) {
      return customRenderRowActions(row)
    }
    if (!userRowActions || !userRowActions.actions) {
      return undefined;
    }

    const Comp = userRowActions.actions;
    return (
      <Comp
        onEditRow={userRowActions.onEditRow ?
          (rowData: any) => userRowActions.onEditRow && userRowActions.onEditRow(rowData as T) : undefined}
        onRemoveRow={userRowActions.onRemoveRow ?
          (rowData: any) => userRowActions.onRemoveRow && userRowActions.onRemoveRow(rowData as T) : undefined}
        onViewRow={userRowActions.onViewRow ?
          (rowData: any) => userRowActions.onViewRow && userRowActions.onViewRow(rowData as T) : undefined}
        row={row as T}
        variant={variant ?? appContext.variant}
      />
    );
  };

  const appContext = useArchbaseAppContext();

  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    const newState = { ...filterState, currentFilter: filter, activeFilterIndex };
    setFilterState(newState);

    if (store && filterOptions) {
      store?.setValue(`${filterOptions.viewName}_${filterOptions.componentName}`, newState);
    }
  };

  const handleToggleExpandedFilter = (expanded: boolean) => {
    const newState = { ...filterState, expandedFilter: expanded };
    setFilterState(newState);
    if (store && filterOptions) {
      store?.setValue(`${filterOptions.viewName}_${filterOptions.componentName}`, newState);
    }
  };

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    const newState = { ...filterState, currentFilter: filter, activeFilterIndex };
    setFilterState(newState);
    if (store && filterOptions) {
      store?.setValue(`${filterOptions.viewName}_${filterOptions.componentName}`, newState);
    }
  };

  const handleSearchByFilter = () => {
    if (filterState.currentFilter) {
      if (onSearchByFilter) {
        onSearchByFilter();
      } else {
        if (filterState.currentFilter.filter.filterType === 'quick') {
          const options = dataSource.getOptions();
          if (
            filterState.currentFilter.filter.quickFilterText &&
            filterState.currentFilter.filter.quickFilterText !== ''
          ) {
            options.filter = JSON.stringify({
              search: filterState.currentFilter.filter.quickFilterText,
              fields: filterState.currentFilter.filter.quickFilterFieldsText,
            });
            options.sort = filterState.currentFilter.sort.quickFilterSort
              ? filterState.currentFilter.sort.quickFilterSort.split(',')
              : [];
          } else {
            options.filter = undefined;
            options.sort = undefined;
          }
          dataSource.refreshData(options);
          
          // 🔄 MIGRAÇÃO V1/V2: ForceUpdate apenas para V1
          if (!v1v2Compatibility.isDataSourceV2) {
            v1v2Compatibility.v1State.forceUpdate();
          }
        } else {
          const result = buildFrom(filterState.currentFilter);
          if (result && result.expressionNode) {
            const filter = emit(result.expressionNode);
            const options = dataSource.getOptions();
            options.filter = filter;
            options.sort = result?.sortStrings;
            dataSource.refreshData(options);
          
          // 🔄 MIGRAÇÃO V1/V2: ForceUpdate apenas para V1
          if (!v1v2Compatibility.isDataSourceV2) {
            v1v2Compatibility.v1State.forceUpdate();
          }
          }
        }
      }
    }
  };

  let printFunc, exportFunc;

  const setPrintFunc = (func) => {
    printFunc = func;
  };

  const setExportFunc = (func) => {
    exportFunc = func;
  };

  const getColor = (color: string) => {
    return theme.colors[color][colorScheme === 'dark' ? 5 : 7];
  };

  const handleExport = () => {
    if (exportFunc) {
      exportFunc();
    }
  };

  const handlePrint = () => {
    if (printFunc) {
      printFunc();
    }
  };

  const buildInternalToolbarActionsFilter = () => {
    if (filterType === 'none'){
      return <div></div>
    }
    if (filterType === 'advanced') {
      return (
        <ArchbaseQueryBuilder
          id={filterOptions?.componentName!}
          viewName={filterOptions?.viewName!}
          apiVersion={filterOptions?.apiVersion!}
          ref={filterRef}
          variant={variant ?? (appContext.variant as ButtonVariant)}
          expandedFilter={filterState.expandedFilter}
          persistenceDelegator={filterPersistenceDelegator!}
          currentFilter={filterState.currentFilter}
          activeFilterIndex={filterState.activeFilterIndex}
          onSelectedFilter={handleSelectedFilter}
          onFilterChanged={handleFilterChanged}
          onSearchByFilter={handleSearchByFilter}
          onToggleExpandedFilter={handleToggleExpandedFilter}
          onExport={handleExport}
          onPrint={handlePrint}
          showExportButton={true}
          showPrintButton={true}
          width={'560px'}
          height="170px"
        >
          {filterFields}
        </ArchbaseQueryBuilder>
      );
    }

    // Se for filtro normal, retornar um componente vazio
    if (filterType === 'normal') {
      return <div></div>;
    }

    return <div></div>;
  };

  return (
    <Paper withBorder={withBorder} ref={innerRef} style={{ overflow: 'none', height: 'calc(100% - 4px)' }}>
      {isError ? (
        <ArchbaseAlert
          autoClose={20000}
          withCloseButton={true}
          withBorder={true}
          icon={<IconBug size="1.4rem" />}
          title={getI18nextInstance().t('archbase:WARNING')}
          titleColor="rgb(250, 82, 82)"
          variant={variant ?? appContext.variant}
          onClose={() => clearError && clearError()}
        >
          <span>{error}</span>
        </ArchbaseAlert>
      ) : null}
      <ArchbaseDataGrid<T, ID>
        gridRef={gridRef}
        printTitle={printTitle || title}
        logoPrint={logoPrint}
        width={width}
        height={height}
        withBorder={withBorder}
        dataSource={dataSource}
        enableColumnResizing={true}
        enableRowNumbers={enableRowNumbers}
        enableRowSelection={enableRowSelection}
        enableRowActions={enableRowActions}
        enableTopToolbar={enableTopToolbar}
        enableTopToolbarActions={enableTopToolbarActions}
        manualPagination={true}
        manualSorting={true}
        isLoading={isLoading}
        pageSize={pageSize}
        pageIndex={pageIndex}
        allowColumnFilters={filterType !== 'none'}
        enableGlobalFilter={filterType !== 'none'}
        renderToolbarInternalActions={filterType == 'none' ? ()=><div></div>:undefined}
        allowExportData={true}
        allowPrintData={true}
        onSelectedRowsChanged={onSelectedRowsChanged}
        onCellDoubleClick={onCellDoubleClick}
        renderRowActions={enableRowActions ? getRenderRowActions : undefined}
        positionActionsColumn={positionActionsColumn}
        toolbarAlignment={toolbarAlignment}
        toolbarLeftContent={toolbarLeftContent}
        renderToolbarActions={filterType === 'advanced' || filterType === 'none' ? buildInternalToolbarActionsFilter : undefined}
        paginationLabels={paginationLabels}
        cellPadding={cellPadding}
        bottomToolbarMinHeight={bottomToolbarMinHeight}
        tableHeadCellPadding={tableHeadCellPadding}
        getRowId={getRowId}
        renderDetailPanel={renderDetailPanel ?
          ({ row }) => renderDetailPanel({ row: row as unknown as T }) : undefined
        }
        renderTopToolbar={renderTopToolbar}
        onExport={setExportFunc}
        onPrint={setPrintFunc}
        variant={variant as any}
      >
        {columns}
        {userActions?.visible ? (
          <GridToolBarActions>
            <>
              <h3 className="only-print">{printTitle || title}</h3>
              <div className="no-print">
                <Flex gap="8px" rowGap="8px">
                  {userActions.customUserActions && userActions.customUserActionsPosition === 'left'
                    ? userActions.customUserActions
                    : null}
                  {userActions.onAddExecute ? (
                    <Button
                      color={'green'}
                      variant={variant ?? appContext.variant}
                      leftSection={<IconPlus />}
                      onClick={() => userActions && userActions.onAddExecute && userActions.onAddExecute()}
                    >
                      {userActions.labelAdd || getI18nextInstance().t('archbase:New')}
                    </Button>
                  ) : null}
                  {userActions.onEditExecute ? (
                    <Button
                      color="blue"
                      leftSection={<IconEdit />}
                      disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
                      variant={variant ?? appContext.variant}
                      onClick={() => userActions && userActions.onEditExecute && userActions.onEditExecute()}
                    >
                      {userActions.labelEdit || getI18nextInstance().t('archbase:Edit')}
                    </Button>
                  ) : null}
                  {userActions.onRemoveExecute ? (
                    <Button
                      color="red"
                      leftSection={<IconTrash />}
                      disabled={!userActions?.allowRemove || !dataSource.isBrowsing() || dataSource.isEmpty()}
                      variant={variant ?? appContext.variant}
                      onClick={() => userActions && userActions.onRemoveExecute && userActions.onRemoveExecute()}
                    >
                      {userActions.labelRemove || getI18nextInstance().t('archbase:Remove')}
                    </Button>
                  ) : null}
                  {userActions.onViewExecute ? (
                    <Button
                      color="gray.7"
                      leftSection={<IconEye />}
                      disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
                      variant={variant ?? appContext.variant}
                      onClick={() => userActions && userActions.onViewExecute && userActions.onViewExecute()}
                    >
                      {userActions.labelView || getI18nextInstance().t('archbase:View')}
                    </Button>
                  ) : null}
                  {userActions.customUserActions && userActions.customUserActionsPosition === 'right'
                    ? userActions.customUserActions
                    : null}
                </Flex>
              </div>
            </>
          </GridToolBarActions>
        ) : null}
      </ArchbaseDataGrid>
    </Paper>
  );
}

// Criamos uma versão genérica do forwardRef para trabalhar com componentes genéricos
export const ArchbaseGridTemplate = forwardRef(ArchbaseGridTemplateImpl) as <T extends object, ID>(
  props: ArchbaseGridTemplateProps<T, ID> & { ref?: React.ForwardedRef<ArchbaseGridTemplateRef> }
) => ReturnType<typeof ArchbaseGridTemplateImpl>;
