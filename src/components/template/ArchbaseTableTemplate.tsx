import React, { Fragment, ReactNode, useRef, useState } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter,
} from '@components/querybuilder';
import { ArchbaseAlert } from '@components/notification';
import { IconBug } from '@tabler/icons-react';
import { t } from 'i18next';
import { ArchbaseDataTable, ToolBarActions } from '@components/datatable';
import { Button, Flex, Paper } from '@mantine/core';
// import "../../styles/template.scss";

export interface UserActionsOptions {
  visible?: boolean;
  labelAdd?: string;
  labelEdit?: string;
  labelRemove?: string;
  labelView?: string;
  allowRemove?: boolean;
  onAddExecute?: () => void;
  onEditExecute?: () => void;
  onRemoveExecute?: () => void;
  onView?: () => void;
}

export interface UserRowActionsOptions<T> {
  actions?: any;
  onAddRow?: (row: T) => void;
  onEditRow?: (row: T) => void;
  onRemoveRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
}

export interface ArchbaseTableTemplateProps<T, ID> {
  title: string;
  printTitle?: string;
  logoPrint?: string;
  dataSource: ArchbaseDataSource<T, ID>;
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
  filterType: 'none' | 'normal' | 'advanced';
  filterOptions?: FilterOptions;
  filterPersistenceDelegator: ArchbaseQueryFilterDelegator;
  pageSize?: number;
  columns: ReactNode;
  filterFields?: ReactNode | undefined;
  userActions?: UserActionsOptions;
  userRowActions?: UserRowActionsOptions<T>;
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  width?: number | string | undefined;
  height?: number | string | undefined;
  onSearchByFilter?: () => void;
}

export function ArchbaseTableTemplate<T extends object, ID>({
  title,
  printTitle,
  dataSource,
  //  dataSourceEdition,
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
  error = '',
  clearError = () => {},
  filterType = 'normal',
  width = '100%',
  height = '100%',
  onSearchByFilter = () => {},
  filterPersistenceDelegator,
}: ArchbaseTableTemplateProps<T, ID>) {
  const innerComponentRef = innerRef || useRef<any>();
  const filterRef = useRef<any>();
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });

  const buildRowActions = ({ row }): ReactNode | undefined => {
    if (!userRowActions && !userRowActions!.actions) {
      return;
    }
    const Comp: any = userRowActions!.actions;

    return (
      <Comp
        onEditRow={userRowActions!.onEditRow}
        onRemoveRow={userRowActions!.onRemoveRow}
        onViewRow={userRowActions!.onViewRow}
        row={row}
      />
    );
  };

  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded });
  };

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const buildFilter = () => {
    return (
      <ArchbaseQueryBuilder
        id={filterOptions?.componentName!}
        viewName={filterOptions?.viewName!}
        apiVersion={filterOptions?.apiVersion!}
        ref={filterRef}
        expandedFilter={filterState.expandedFilter}
        persistenceDelegator={filterPersistenceDelegator}
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
    );
  };

  return (
    <Paper ref={innerComponentRef} style={{ overflow: 'none', height: '100%' }}>
      {isError ? (
        <ArchbaseAlert
          autoClose={20000}
          withCloseButton={true}
          withBorder={true}
          icon={<IconBug size="1.4rem" />}
          title={t('WARNING')}
          titleColor="rgb(250, 82, 82)"
          variant="filled"
          onClose={() => clearError && clearError()}
        >
          <span>{error}</span>
        </ArchbaseAlert>
      ) : null}
      <ArchbaseDataTable<T, ID>
        printTitle={printTitle ? printTitle : title}
        logoPrint={logoPrint}
        width={width}
        height={height}
        dataSource={dataSource}
        withColumnBorders={true}
        striped={true}
        isLoading={isLoading}
        pageSize={pageSize}
        isError={isError}
        enableGlobalFilter={filterType === 'normal'}
        renderToolbarInternalActions={filterType === 'advanced' ? buildFilter : undefined}
        renderRowActions={buildRowActions}
        error={<span>{error}</span>}
      >
        {columns}
        <ToolBarActions>
          <Fragment>
            <h3 className="only-print">{printTitle ? printTitle : title}</h3>
            <div className="no-print">
              <Flex gap="8px" rowGap="8px">
                <Button color="green" variant="filled" onClick={() => userActions && userActions!.onAddExecute}>
                  {t('New')}
                </Button>
                <Button color="blue" variant="filled" onClick={() => userActions && userActions!.onEditExecute}>
                  {t('Edit')}
                </Button>
                <Button color="red" variant="filled" onClick={() => userActions && userActions!.onEditExecute}>
                  {t('Remove')}
                </Button>
              </Flex>
            </div>
          </Fragment>
        </ToolBarActions>
      </ArchbaseDataTable>
    </Paper>
  );
}
