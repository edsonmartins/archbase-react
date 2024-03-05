import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import { IconBug, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { t } from 'i18next'
import { MRT_Row } from 'mantine-react-table'
import { Button, Flex, Paper, Variants } from '@mantine/core'
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  buildFrom,
  getDefaultEmptyFilter
} from '../querybuilder'
import '../../styles/template.scss'
import { IconPlus } from '@tabler/icons-react'
import { v4 as uuidv4 } from "uuid";
import { ArchbaseDataSource } from 'components/datasource'
import { ArchbaseStateValues } from './ArchbaseStateValues'
import { emit, useArchbaseAppContext } from 'components/core'
import { useArchbaseElementSizeArea, useArchbaseTheme } from 'components/hooks'
import { ArchbaseAlert } from 'components/notification'
import { ArchbaseDataTable, ToolBarActions } from 'components/datatable'

export interface UserActionsOptions {
  visible: boolean
  labelAdd?: string
  labelEdit?: string
  labelRemove?: string
  labelView?: string
  allowRemove: boolean
  customUserActions?: ReactNode
  customUserActionsPosition?: 'left'|'right'
  onAddExecute?: () => void
  onEditExecute?: () => void
  onRemoveExecute?: () => void
  onViewExecute?: () => void
}

export interface UserRowActionsOptions<T extends Object> {
  actions?: any
  onAddRow?: (row: MRT_Row<T>) => void
  onEditRow?: (row: MRT_Row<T>) => void
  onRemoveRow?: (row: MRT_Row<T>) => void
  onViewRow?: (row: MRT_Row<T>) => void
}

export interface ArchbaseTableTemplateProps<T extends Object, ID> {
  id?: string
  title: string
  printTitle?: string
  logoPrint?: string
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
  dataSource: ArchbaseDataSource<T, ID>
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined
  store?: ArchbaseStateValues | undefined
  filterType: 'none' | 'normal' | 'advanced'
  filterOptions?: FilterOptions
  filterPersistenceDelegator?: ArchbaseQueryFilterDelegator
  pageSize?: number
  columns: ReactNode
  filterFields?: ReactNode | undefined
  userActions?: UserActionsOptions
  userRowActions?: UserRowActionsOptions<T>
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  isLoading?: boolean
  isLoadingFilter?: boolean
  isError?: boolean
  error?: string | undefined
  clearError?: () => void
  width?: number | string | undefined
  height?: number | string | undefined
  onSearchByFilter?: () => void
  withBorder?: boolean;
  enableTopToolbar?: boolean
}

const getFilter = (filterOptions? : FilterOptions, store?: ArchbaseStateValues | undefined, filterPersistenceDelegator?: ArchbaseQueryFilterDelegator) => {
  if (!filterOptions || !store || !store.existsValue(`${filterOptions.viewName}_${filterOptions.componentName}`)){
    let index = -1
    let currentFilter : ArchbaseQueryFilter|undefined = undefined;
    if (filterPersistenceDelegator && filterPersistenceDelegator.getFilters().length>0){
      index = 0
      currentFilter = JSON.parse(filterPersistenceDelegator.getFirstFilter()?.filter)
    }
    return {
      activeFilterIndex: index,
      expandedFilter: false,
      currentFilter
    }
  }
  return store.getValue(`${filterOptions.viewName}_${filterOptions.componentName}`)
}

export function ArchbaseTableTemplate<T extends object, ID>({
  title,
  printTitle,
  dataSource,
  filterOptions,
  pageSize,
  columns,
  filterFields,
  logoPrint,
  userActions,
  userRowActions,
  innerRef,
  isLoading = false,
  isLoadingFilter = false,
  isError = false,
  enableTopToolbar= true,
  error = '',
  clearError = () => {},
  filterType = 'normal',
  width = '100%',
  height = '100%',
  onSearchByFilter,
  withBorder=true,
  filterPersistenceDelegator,
  variant,
  store
}: ArchbaseTableTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const filterRef = useRef<any>()
  const table = useRef<any>();
  const theme = useArchbaseTheme()
  const [innerComponentRef, { width: containerWidth, height: containerHeight }] = useArchbaseElementSizeArea()
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({activeFilterIndex:-1, currentFilter: undefined, expandedFilter: false})


  useEffect(()=>{
    const state = getFilter(filterOptions,store, filterPersistenceDelegator)
    setFilterState(state)
  },[isLoadingFilter])

  const buildRowActions = ({ row }): ReactNode | undefined => {
    if (!userRowActions && !userRowActions!.actions) {
      return
    }
    const Comp: any = userRowActions!.actions
    return (
      <Comp
        onEditRow={userRowActions!.onEditRow}
        onRemoveRow={userRowActions!.onRemoveRow}
        onViewRow={userRowActions!.onViewRow}
        row={row}
        variant={variant??appContext.variant}
      />
    )
  }

  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    const newState = { ...filterState, currentFilter: filter, activeFilterIndex }
    setFilterState(newState) 
    console.log(newState)   
    if (store && filterOptions){
      store?.setValue(`${filterOptions.viewName}_${filterOptions.componentName}`,newState)
    }
  }

  const handleToggleExpandedFilter = (expanded: boolean) => {
    const newState = { ...filterState, expandedFilter: expanded }
    setFilterState(newState)
    if (store && filterOptions){
      store?.setValue(`${filterOptions.viewName}_${filterOptions.componentName}`,newState)
    }
  }

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    const newState = { ...filterState, currentFilter: filter, activeFilterIndex }
    setFilterState(newState)
    if (store && filterOptions){
      store?.setValue(`${filterOptions.viewName}_${filterOptions.componentName}`,newState)
    }
  }

  const handleSearchByFilter = () => {
    if (filterState.currentFilter){
      if (onSearchByFilter){
          onSearchByFilter()
      } else {
        if (filterState.currentFilter.filter.filterType==='quick'){
          const options = dataSource.getOptions();
          if (filterState.currentFilter.filter.quickFilterText && filterState.currentFilter.filter.quickFilterText !== ''){
            options.filter = JSON.stringify({search:filterState.currentFilter.filter.quickFilterText, fields:filterState.currentFilter.filter.quickFilterFieldsText});
            options.sort = filterState.currentFilter.sort.quickFilterSort?filterState.currentFilter.sort.quickFilterSort.split(','):[]
          } else {
            options.filter = undefined;
            options.sort = undefined;
          }
          dataSource.refreshData(options);
        } else {
          const result = buildFrom(filterState.currentFilter)
          if (result && result.expressionNode){
            const filter = emit(result.expressionNode)
            const options = dataSource.getOptions();
            options.filter = filter;
            options.sort = result?.sortStrings
            dataSource.refreshData(options);
          }
        }
      }
    }
  }

  let printFunc, exportFunc;

  const setPrintFunc = (func) => {
    printFunc = func;
  };

  const setExportFunc = (func) => {
    exportFunc = func;
  };

  const getColor = (color: string) => {
    return theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7]
  }
  const handleExport = () => {
    if (exportFunc){
      exportFunc()
    }
  }
  const handlePrint = () => {
    if (printFunc){
      printFunc()
    }
  }

  const buildFilter = () => {
    return (
      <ArchbaseQueryBuilder
        id={filterOptions?.componentName!}
        viewName={filterOptions?.viewName!}
        apiVersion={filterOptions?.apiVersion!}
        ref={filterRef}
        variant={variant??appContext.variant}
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
    )
  }
  
  return (
    <Paper withBorder={withBorder} ref={innerRef||innerComponentRef} style={{ overflow: 'none', height: 'calc(100% - 4px)' }}>
      {isError ? (
        <ArchbaseAlert
          autoClose={20000}
          withCloseButton={true}
          withBorder={true}
          icon={<IconBug size="1.4rem" />}
          title={t('archbase:WARNING')}
          titleColor="rgb(250, 82, 82)"
          variant={variant??appContext.variant}
          onClose={() => clearError && clearError()}
        >
          <span>{error}</span>
        </ArchbaseAlert>
      ) : null}
      <ArchbaseDataTable<T, ID>
        printTitle={printTitle || title}
        logoPrint={logoPrint}
        width={containerWidth+""}
        height={containerHeight+""}
        withBorder={withBorder}
        dataSource={dataSource}
        withColumnBorders={true}
        variant={variant??appContext.variant}
        striped={true}
        isLoading={isLoading}
        enableTopToolbar={enableTopToolbar}
        pageSize={pageSize}
        isError={isError}
        enableGlobalFilter={filterType === 'normal'}
        renderToolbarInternalActions={filterType === 'advanced' ? buildFilter : undefined}
        renderRowActions={buildRowActions}
        error={<span>{error}</span>}
        onExport={setExportFunc} 
        onPrint={setPrintFunc}
      >
        {columns}
        {userActions?.visible?<ToolBarActions>
          <Fragment>
            <h3 className="only-print">{printTitle || title}</h3>
            <div className="no-print">
              <Flex gap="8px" rowGap="8px">
                {userActions.customUserActions && userActions.customUserActionsPosition==='left'?userActions.customUserActions:null}
                {userActions.onAddExecute?<Button
                  color={"green"}
                  variant={variant??appContext.variant}
                  leftIcon={<IconPlus />}
                  onClick={() => userActions && userActions.onAddExecute && userActions!.onAddExecute()}
                >
                  {t('archbase:New')}
                </Button>:null}
                {userActions.onEditExecute?<Button
                  color="blue"
                  leftIcon={<IconEdit/>}
                  disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
                  variant={variant??appContext.variant}
                  onClick={() => userActions && userActions.onEditExecute && userActions!.onEditExecute()}
                >
                  {t('archbase:Edit')}
                </Button>:null}
                {userActions.onRemoveExecute?<Button
                  color="red"
                  leftIcon={<IconTrash/>}
                  disabled={!userActions?.allowRemove || !dataSource.isBrowsing() || dataSource.isEmpty()}
                  variant={variant??appContext.variant}
                  onClick={() => userActions && userActions.onRemoveExecute && userActions!.onRemoveExecute()}
                >
                  {t('archbase:Remove')}
                </Button>:null}
                {userActions.onViewExecute?<Button
                  color="silver"
                  leftIcon={<IconEye/>}
                  disabled={!dataSource.isBrowsing() || dataSource.isEmpty()}
                  variant={variant??appContext.variant}
                  onClick={() => userActions && userActions.onViewExecute && userActions!.onViewExecute()}
                >
                  {t('archbase:View')}
                </Button>:null}
                {userActions.customUserActions && userActions.customUserActionsPosition==='right'?userActions.customUserActions:null}
              </Flex>
            </div>
          </Fragment>
        </ToolBarActions>:null}
      </ArchbaseDataTable>
    </Paper>
  )
}
