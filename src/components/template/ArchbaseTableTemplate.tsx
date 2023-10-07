import React, { Fragment, ReactNode, useRef, useState } from 'react'
import { IconBug, IconEdit, IconEye, IconTrash } from '@tabler/icons-react'
import { t } from 'i18next'
import { MRT_Row } from 'mantine-react-table'
import { Button, Flex, Paper, Variants } from '@mantine/core'
import type { ArchbaseDataSource } from '../datasource'
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter
} from '../querybuilder'
import { ArchbaseAlert } from '../notification'
import { ArchbaseDataTable, ToolBarActions } from '../datatable'
import '../../styles/template.scss'
import { useArchbaseElementSizeArea, useArchbaseTheme } from '../hooks'
import { IconPlus } from '@tabler/icons-react'
import { useArchbaseAppContext } from '../core'


export interface UserActionsOptions {
  visible: boolean
  labelAdd?: string
  labelEdit?: string
  labelRemove?: string
  labelView?: string
  allowRemove: boolean
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
  title: string
  printTitle?: string
  logoPrint?: string
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
  dataSource: ArchbaseDataSource<T, ID>
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined
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
  isError?: boolean
  error?: string | undefined
  clearError?: () => void
  width?: number | string | undefined
  height?: number | string | undefined
  onSearchByFilter?: () => void
  withBorder?: boolean;
  enableTopToolbar?: boolean
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
  isError = false,
  enableTopToolbar= true,
  error = '',
  clearError = () => {},
  filterType = 'normal',
  width = '100%',
  height = '100%',
  onSearchByFilter = () => {},
  withBorder=true,
  filterPersistenceDelegator,
  variant
}: ArchbaseTableTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const filterRef = useRef<any>()
  const theme = useArchbaseTheme()
  const [innerComponentRef, { width: containerWidth, height: containerHeight }] = useArchbaseElementSizeArea()
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    activeFilterIndex: -1,
    expandedFilter: false
  })

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
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex })
  }

  const handleToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded })
  }

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex })
  }

  const getColor = (color: string) => {
    return theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7]
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
        onSearchByFilter={onSearchByFilter}
        onToggleExpandedFilter={handleToggleExpandedFilter}
        width={'560px'}
        height="170px"
      >
        {filterFields}
      </ArchbaseQueryBuilder>
    )
  }

  return (
    <Paper withBorder={withBorder} ref={innerRef||innerComponentRef} style={{ overflow: 'none', height: '100%' }}>
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
        width={containerWidth}
        height={containerHeight}
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
      >
        {columns}
        {userActions?.visible?<ToolBarActions>
          <Fragment>
            <h3 className="only-print">{printTitle || title}</h3>
            <div className="no-print">
              <Flex gap="8px" rowGap="8px">
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
              </Flex>
            </div>
          </Fragment>
        </ToolBarActions>:null}
      </ArchbaseDataTable>
    </Paper>
  )
}
