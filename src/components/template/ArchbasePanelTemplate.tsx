import React, { ReactNode, useRef, useState } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import { ArchbaseQueryBuilder, ArchbaseQueryFilter, ArchbaseQueryFilterDelegator, ArchbaseQueryFilterState, FilterOptions, getDefaultEmptyFilter } from '@components/querybuilder';
import { ArchbaseAlert } from '@components/notification';
import { IconBug } from '@tabler/icons-react';
import { t } from 'i18next';
import { Box, Pagination, Paper, Stack } from '@mantine/core';


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

export interface ArchbasePanelTemplateProps<T, ID> {
  title: string;
  dataSource: ArchbaseDataSource<T, ID>;
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
  filterOptions: FilterOptions;
  pageSize?: number;
  filterFields: ReactNode | undefined;
  filterPersistenceDelegator: ArchbaseQueryFilterDelegator;
  userActions?: UserActionsOptions;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  isLoading?: boolean;
  isError?: boolean;
  error?: string | undefined;
  clearError?: () => void;
  width?: number | string | undefined;
  height?: number | string | undefined;
  withBorder?: boolean;
  withPagination?: boolean;
}

export function ArchbasePanelTemplate<T extends object, ID>({
  title,
  dataSource,
  //  dataSourceEdition,
  filterOptions,
  pageSize,
  filterFields,
  userActions,
  innerRef,
  isLoading = false,
  isError = false,
  error = '',
  clearError = () => {},
  width = '100%',
  height = '100%',
  withBorder = true,
  filterPersistenceDelegator,
  withPagination = true
}: ArchbasePanelTemplateProps<T, ID>) {
  const innerComponentRef = innerRef || useRef<any>();
  const filterRef = useRef<any>();
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });


  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded });
  };

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleSearchByFilter = () => {};

  return (
    <Paper withBorder ref={innerComponentRef} style={{ width, height }}>
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
      <Stack>
      <Box style={{ width: '100%', height: '50px' }}>
        <ArchbaseQueryBuilder
          id={filterOptions.componentName}
          viewName={filterOptions.viewName}
          apiVersion={filterOptions.apiVersion}
          ref={filterRef}
          expandedFilter={filterState.expandedFilter}
          persistenceDelegator={filterPersistenceDelegator}
          currentFilter={filterState.currentFilter}
          activeFilterIndex={filterState.activeFilterIndex}
          onSelectedFilter={handleSelectedFilter}
          onFilterChanged={handleFilterChanged}
          onSearchByFilter={handleSearchByFilter}
          onToggleExpandedFilter={handleToggleExpandedFilter}
          width={'660px'}
          height="170px"
        >
          {filterFields}
        </ArchbaseQueryBuilder>
      </Box>
      <Box>
      <Pagination total={10} />
      </Box>
      </Stack>
      
    </Paper>
  );
}
