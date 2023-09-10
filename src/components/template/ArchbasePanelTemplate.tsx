import React, { Fragment, ReactNode, useMemo, useRef, useState } from 'react'
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
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react'
import { t } from 'i18next'
import useComponentSize from '@rehooks/component-size'
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
  Variants
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { IconTrash } from '@tabler/icons-react'
import { useArchbaseAppContext } from '../core'

export interface UserActionsOptions {
  visible?: boolean
  labelAdd?: string
  labelEdit?: string
  labelRemove?: string
  labelView?: string
  allowAdd?: boolean
  allowEdit?: boolean
  allowView?: boolean
  allowRemove?: boolean
  onAddExecute?: () => void
  onEditExecute?: () => void
  onRemoveExecute?: () => void
  onView?: () => void
  customUserActions?: ReactNode | undefined
  positionCustomUserActions?: 'before' | 'after'
}

const defaultUserActions: UserActionsOptions = {
  visible: true,
  allowAdd: true,
  allowEdit: true,
  allowView: true,
  allowRemove: true,
  positionCustomUserActions: 'after'
}

export interface UserRowActionsOptions<T> {
  actions?: any
  onAddRow?: (row: T) => void
  onEditRow?: (row: T) => void
  onRemoveRow?: (row: T) => void
  onViewRow?: (row: T) => void
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
}

export interface ArchbasePanelTemplateProps<T, ID> {
  title: string
  dataSource: ArchbaseDataSource<T, ID>
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
  filterOptions: FilterOptions
  pageSize?: number
  filterFields: ReactNode | undefined
  filterPersistenceDelegator: ArchbaseQueryFilterDelegator
  userActions?: UserActionsOptions
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  isLoading?: boolean
  isError?: boolean
  error?: string | undefined
  clearError?: () => void
  width?: number | string | undefined
  height?: number | string | undefined
  withBorder?: boolean
  withPagination?: boolean
  children?: React.ReactNode | React.ReactNode[]
  radius?: MantineNumberSize
  debug?: boolean
}

export function ArchbasePanelTemplate<T extends object, ID>({
  //title,
  //dataSource,
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
  userActions = defaultUserActions,
  debug = false,
  variant
}: ArchbasePanelTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext();
  const innerComponentRef = innerRef || useRef<any>()
  const filterRef = useRef<any>()
  let size = useComponentSize(innerComponentRef)
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    activeFilterIndex: -1,
    expandedFilter: false
  })

  const userActionsBuilded: ReactNode = useMemo(() => {
    const userActionsEnd = { ...defaultUserActions, ...userActions }
    return (
      <Flex gap="8px" rowGap="8px" direction="row" justify={'flex-start'} align={'center'}>
        {userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'before'
          ? userActionsEnd.customUserActions
          : null}
        {userActionsEnd.allowAdd ? (
          <Button
            leftIcon={<IconPlus />}
            color="green"
            variant={variant??appContext.variant}
            onClick={() => userActionsEnd && userActionsEnd!.onAddExecute}
          >
            {userActionsEnd.labelAdd ? userActionsEnd.labelAdd : t('archbase:New')}
          </Button>
        ) : null}
        {userActionsEnd.allowAdd ? (
          <Button
            leftIcon={<IconEdit />}
            color="blue"
            variant={variant??appContext.variant}
            onClick={() => userActionsEnd && userActionsEnd!.onEditExecute}
          >
            {userActionsEnd.labelEdit ? userActionsEnd.labelEdit : t('archbase:Edit')}
          </Button>
        ) : null}
        {userActionsEnd.allowAdd ? (
          <Button
            leftIcon={<IconTrash />}
            color="red"
            variant={variant??appContext.variant}
            onClick={() => userActionsEnd && userActionsEnd!.onEditExecute}
          >
            {userActionsEnd.labelRemove ? userActionsEnd.labelRemove : t('archbase:Remove')}
          </Button>
        ) : null}
        {userActionsEnd.allowView ? (
          <Button
            leftIcon={<IconEye />}
            variant={variant??appContext.variant}
            onClick={() => userActionsEnd && userActionsEnd!.onEditExecute}
          >
            {userActionsEnd.labelView ? userActionsEnd.labelView : t('archbase:View')}
          </Button>
        ) : null}
        {userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'after'
          ? userActionsEnd.customUserActions
          : null}
      </Flex>
    )
  }, [userActions])

  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex })
  }

  const handleToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded })
  }

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex })
  }

  const handleSearchByFilter = () => {}

  return (
    <Paper
      ref={innerComponentRef}
      withBorder={withBorder}
      radius={radius}
      style={{ width: width, height: height, padding: 4 }}
    >
      <Box sx={{ height: 60 }}>
        <Grid m={0} gutter="xs" justify="center" align="center">
          <Grid.Col sx={{ border: debug ? '1px dashed' : '' }} span="auto">
            {userActionsBuilded}
          </Grid.Col>
          <Grid.Col span="content">
            <ArchbaseQueryBuilder
              id={filterOptions.componentName}
              viewName={filterOptions.viewName}
              apiVersion={filterOptions.apiVersion}
              ref={filterRef}
              variant={variant??appContext.variant}
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
      <ScrollArea sx={{ border: debug ? '1px dashed' : '', height: size.height - 120 }}>
        {children ? (
          <Fragment>
            {isError ? (
              <ArchbaseAlert
                autoClose={20000}
                withCloseButton={true}
                withBorder={true}
                icon={<IconBug size="1.4rem" />}
                title={t('WARNING')}
                titleColor="rgb(250, 82, 82)"
                variant={variant??appContext.variant}
                onClose={() => clearError && clearError()}
              >
                <span>{error}</span>
              </ArchbaseAlert>
            ) : null}
            {children}
          </Fragment>
        ) : debug ? (
          <Flex
            style={{ height: '100%' }}
            gap="md"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Text size="lg">INSIRA O CONTEÚDO DO PAINEL AQUI.</Text>
          </Flex>
        ) : null}
      </ScrollArea>
      <Grid
        m={0}
        sx={{ height: 60, position: 'relative', bottom: 6, left: 0, right: 0 }}
        gutter="xs"
        justify="center"
        align="center"
      >
        <Grid.Col
          sx={{ border: debug ? '1px dashed' : '', height: debug ? '70%' : 'auto' }}
          span="auto"
        ></Grid.Col>
        {withPagination ? (
          <Grid.Col span="content">
            <Pagination total={10} />
          </Grid.Col>
        ) : null}
      </Grid>
    </Paper>
  )
}
