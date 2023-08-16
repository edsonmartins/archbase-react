import React, { ReactNode, useMemo, useRef, useState } from 'react';
import type { ArchbaseDataSource } from '../datasource';
import { uniqueId } from 'lodash';
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions,
  getDefaultEmptyFilter,
} from '@components/querybuilder';
import { ArchbaseAlert } from '@components/notification';
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react';
import { t } from 'i18next';
import useComponentSize from '@rehooks/component-size';
import { Box, Button, Flex, Grid, MantineNumberSize, Pagination, Paper, ScrollArea } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { ArchbaseMasonry, ArchbaseMasonryResponsive, ComponentDefinition } from '@components/masonry/index';
import { ArchbaseMasonryProvider } from '@components/masonry/ArchbaseMasonry.context';


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
  customUserActions?: ReactNode | undefined;
  positionCustomUserActions?: 'before' | 'after';
}

const defaultUserActions: UserActionsOptions = {
  visible: true,
  labelAdd: t('Add'),
  labelEdit: t('Edit'),
  labelRemove: t('Remove'),
  labelView: t('View'),
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
}

export interface ArchbaseMasonryTemplateProps<T, ID> {
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
  radius?: MantineNumberSize;
  columnsCountBreakPoints?: Record<number, number>;
  columnsCount?: number;
  gutter?: string;
  /** Definições do componente customizado a ser renderizado para um Item da lista */
  component?: ComponentDefinition;
  id?: string;
  activeIndex?: number;
  /** Cor de fundo do item ativo */
  activeBackgroundColor?: string;
  /** Cor do item ativo */
  activeColor?: string;
  /** Evento gerado quando o mouse está sobre um item */
  onItemEnter?: (event: React.MouseEvent, data: any) => void;
  /** Evento gerado quando o mouse sai de um item */
  onItemLeave?: (event: React.MouseEvent, data: any) => void;
}

export function ArchbaseMasonryTemplate<T extends object, ID>({
  //title,
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
  radius,
  userActions = defaultUserActions,
  columnsCountBreakPoints,
  columnsCount,
  gutter,
  component,
  activeIndex,
  activeBackgroundColor,
  activeColor,
  onItemEnter,
  onItemLeave,
  id = uniqueId('masonry'),
}: ArchbaseMasonryTemplateProps<T, ID>) {
  const [idMasonry] = useState(id);
  const innerComponentRef = innerRef || useRef<any>();
  const filterRef = useRef<any>();
  const [activeIndexValue, setActiveIndexValue] = useState(
    activeIndex ? activeIndex : dataSource && dataSource.getTotalRecords() > 0 ? 0 : -1,
  );
  let size = useComponentSize(innerComponentRef);
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });

  const userActionsBuilded: ReactNode = useMemo(() => {
    const userActionsEnd = { ...defaultUserActions, ...userActions };
    return (
      <Flex gap="8px" rowGap="8px" direction="row" justify={'flex-start'} align={'center'}>
        {userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'before'
          ? userActionsEnd.customUserActions
          : null}
        {userActionsEnd.allowAdd ? (
          <Button
            leftIcon={<IconPlus />}
            color="green"
            variant="filled"
            onClick={() => userActionsEnd && userActionsEnd!.onAddExecute}
          >
            {userActionsEnd.labelAdd ? userActionsEnd.labelAdd : t('New')}
          </Button>
        ) : null}
        {userActionsEnd.allowAdd ? (
          <Button
            leftIcon={<IconEdit />}
            color="blue"
            variant="filled"
            onClick={() => userActionsEnd && userActionsEnd!.onEditExecute}
          >
            {userActionsEnd.labelEdit ? userActionsEnd.labelEdit : t('Edit')}
          </Button>
        ) : null}
        {userActionsEnd.allowAdd ? (
          <Button
            leftIcon={<IconTrash />}
            color="red"
            variant="filled"
            onClick={() => userActionsEnd && userActionsEnd!.onEditExecute}
          >
            {userActionsEnd.labelRemove ? userActionsEnd.labelRemove : t('Remove')}
          </Button>
        ) : null}
        {userActionsEnd.allowView ? (
          <Button
            leftIcon={<IconEye />}
            variant="filled"
            onClick={() => userActionsEnd && userActionsEnd!.onEditExecute}
          >
            {userActionsEnd.labelView ? userActionsEnd.labelView : t('View')}
          </Button>
        ) : null}
        {userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'after'
          ? userActionsEnd.customUserActions
          : null}
      </Flex>
    );
  }, [userActions]);

  const cards: ReactNode[] = useMemo(() => {
    if (component) {
      let DynamicComponent = component.type;
      let compProps = {};
      if (component.props) {
        compProps = component.props;
      }

      return dataSource.browseRecords().map((record: any, index: number) => {
        const newKey = `${idMasonry}_${index}`;
        const newId = `${idMasonry}_${index}`;
        let active = record.active === undefined ? false : record.active;
        if (activeIndexValue >= 0) {
          active = false;
          if (activeIndexValue === index) {
            active = true;
          }
        }
        return (
          <DynamicComponent
            key={newKey}
            id={newId}
            active={active}
            index={index}
            dataSource={dataSource}
            recordData={record}
            disabled={record.disabled}
            {...compProps}
          />
        );
      });
    }
    return [];
  }, [dataSource.browseRecords(), columnsCount, columnsCountBreakPoints, gutter]);

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

  const handleSelectItem = (index: number, data: T) => {
    setActiveIndexValue(index);
    if (dataSource) {
      dataSource.gotoRecordByData(data);
    }
  };

  return (
    <Paper
      ref={innerComponentRef}
      withBorder={withBorder}
      radius={radius}
      style={{ width: width, height: height, padding: 4 }}
    >
      <Box sx={{ height: 60 }}>
        <Grid gutter="xs" justify="center" align="center">
          <Grid.Col span="auto">{userActionsBuilded}</Grid.Col>
          <Grid.Col span="content">
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
          </Grid.Col>
        </Grid>
      </Box>
      <ScrollArea sx={{ height: size.height - 120 }}>
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
        <ArchbaseMasonryProvider
          value={{
            dataSource,
            ownerId: id,
            handleSelectItem,
            activeBackgroundColor,
            activeColor,
            onItemEnter,
            onItemLeave,
          }}
        >
          <ArchbaseMasonryResponsive columnsCountBreakPoints={columnsCountBreakPoints}>
            <ArchbaseMasonry gutter={gutter} columnsCount={columnsCount}>
              {cards}
            </ArchbaseMasonry>
          </ArchbaseMasonryResponsive>
        </ArchbaseMasonryProvider>
      </ScrollArea>
      <Grid
        sx={{ height: 60, position: 'relative', bottom: 0, left: 0, right: 0 }}
        gutter="xs"
        justify="center"
        align="center"
      >
        <Grid.Col span="auto"></Grid.Col>
        {withPagination ? (
          <Grid.Col span="content">
            <Pagination total={10} />
          </Grid.Col>
        ) : null}
      </Grid>
    </Paper>
  );
}
