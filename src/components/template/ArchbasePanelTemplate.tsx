import React, { Fragment, ReactNode, useMemo, useRef, useState } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter,
} from '../querybuilder';
import { ArchbaseAlert } from '../notification';
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react';
import { t } from 'i18next';
import useComponentSize from '@rehooks/component-size';
import {
  Box,
  Button,
  Flex,
  Grid,
  MantineNumberSize,
  Pagination,
  Paper,
  ScrollArea,
  Text,
  Variants,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { useArchbaseAppContext } from '../core';
import { ArchbaseSpaceTemplate, ArchbaseSpaceTemplateOptions } from './ArchbaseSpaceTemplate';
import {
  ArchbaseAction,
  ArchbaseActionButtons,
  ArchbaseActionButtonsOptions,
} from '@components/buttons/ArchbaseActionButtons';

export interface UserActionsOptions {
  visible?: boolean;
  labelAdd?: string;
  labelEdit?: string;
  labelRemove?: string;
  labelView?: string;
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowView?: boolean;
  allowRemove?: boolean;
  onAddExecute?: () => void;
  onEditExecute?: () => void;
  onRemoveExecute?: () => void;
  onView?: () => void;
  customUserActions?: ArchbaseAction[];
  positionCustomUserActions?: 'before' | 'after';
}

const defaultUserActions: UserActionsOptions = {
  visible: true,
  allowAdd: true,
  allowEdit: true,
  allowView: true,
  allowRemove: true,
  positionCustomUserActions: 'after',
};

export interface UserRowActionsOptions<T> {
  actions?: any;
  onAddRow?: (row: T) => void;
  onEditRow?: (row: T) => void;
  onRemoveRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
}

export interface ArchbasePanelTemplateProps<T, ID> {
  title: string;
  dataSource: ArchbaseDataSource<T, ID>;
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined;
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>;
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
  children?: React.ReactNode;
  radius?: MantineNumberSize;
  debug?: boolean;
  actionsButtonsOptions?: ArchbaseActionButtonsOptions;
  spaceOptions?: ArchbaseSpaceTemplateOptions;
}

export function ArchbasePanelTemplate<T extends object, ID>({
  title,
  dataSource,
  //  dataSourceEdition,
  filterOptions,
  //pageSize,
  filterFields,
  innerRef,
  //isLoading = false,
  isError = false,
  error = '',
  clearError = () => {},
  width = '100%',
  height = '100%',
  withBorder = true,
  filterPersistenceDelegator,
  withPagination = true,
  children,
  radius,
  userActions,
  debug = false,
  variant,
  actionsButtonsOptions,
  spaceOptions,
}: ArchbasePanelTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>();
  const filterRef = useRef<any>();
  let size = useComponentSize(innerComponentRef);
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    activeFilterIndex: -1,
    expandedFilter: false,
  });
  const userActionsBuilded: ArchbaseAction[] = useMemo(() => {
    let resultActions: ArchbaseAction[] = [];
    const userActionsEnd = { ...defaultUserActions, ...userActions };

    const defaultActions: ArchbaseAction[] = [
      userActionsEnd.allowAdd
        ? {
            id: '1',
            icon: <IconPlus />,
            color: 'green',
            label: userActionsEnd.labelAdd ? userActionsEnd.labelAdd : t('archbase:New'),
            executeAction: () => userActionsEnd && userActionsEnd!.onAddExecute,
            enabled: true,
            hint: 'Clique para criar.',
          }
        : undefined,
      userActionsEnd.allowEdit
        ? {
            id: '2',
            icon: <IconEdit />,
            color: 'blue',
            label: userActionsEnd.labelEdit ? userActionsEnd.labelEdit : t('archbase:Edit'),
            executeAction: () => userActionsEnd && userActionsEnd!.onEditExecute,
            enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
            hint: 'Clique para editar.',
          }
        : undefined,
      userActionsEnd.allowRemove
        ? {
            id: '3',
            icon: <IconTrash />,
            color: 'red',
            label: userActionsEnd.labelRemove ? userActionsEnd.labelRemove : t('archbase:Remove'),
            executeAction: () => userActionsEnd && userActionsEnd!.onRemoveExecute,
            enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
            hint: 'Clique para remover.',
          }
        : undefined,
      userActionsEnd.allowView
        ? {
            id: '4',
            icon: <IconEye />,
            color: 'green',
            label: userActionsEnd.labelView ? userActionsEnd.labelView : t('archbase:View'),
            executeAction: () => userActionsEnd && userActionsEnd!.onView,
            enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
            hint: 'Clique para visualizar.',
          }
        : undefined,
    ];

    if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'before') {
      return [...userActionsEnd.customUserActions, ...defaultActions];
    }

    if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'after') {
      return [...defaultActions, ...userActionsEnd.customUserActions];
    }

    return defaultActions;
  }, [userActions, dataSource]);

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
  const defaultActionsButtonsOptions: ArchbaseActionButtonsOptions = {
    menuButtonColor: 'blue.5',
    menuPosition: 'left',
  };

  const defaultSpaceTemplateOptions: ArchbaseSpaceTemplateOptions = {
    headerFlexGrow: 'left',
    footerGridColumns: {},
  };

  const _actionsButtonsOptions = { ...defaultActionsButtonsOptions, ...actionsButtonsOptions };
  const _spaceTemplateOptions = { ...defaultSpaceTemplateOptions, ...spaceOptions };

  return (
    <ArchbaseSpaceTemplate
      title={title}
      debug={debug}
      options={_spaceTemplateOptions}
      headerLeft={<ArchbaseActionButtons actions={userActionsBuilded} options={_actionsButtonsOptions} />}
      headerRight={
        <ArchbaseQueryBuilder
          id={filterOptions.componentName}
          viewName={filterOptions.viewName}
          apiVersion={filterOptions.apiVersion}
          ref={filterRef}
          variant={variant ?? appContext.variant}
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
      }
      footerRight={withPagination ? <Pagination total={10} /> : undefined}
    >
      {children}
    </ArchbaseSpaceTemplate>
  );
}
