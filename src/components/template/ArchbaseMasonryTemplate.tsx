import { MantineNumberSize, Pagination, Variants } from '@mantine/core'
import useComponentSize from '@rehooks/component-size'
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react'
import { t } from 'i18next'
import { uniqueId } from 'lodash'
import React, { CSSProperties, ReactNode, useMemo, useRef, useState } from 'react'
import { useArchbaseAppContext } from '../core'
import type { ArchbaseDataSource } from '../datasource'
import {
  ArchbaseMasonry,
  ArchbaseMasonryProvider,
  ArchbaseMasonryResponsive,
  ComponentDefinition
} from '../masonry'
import {
  ArchbaseQueryBuilder,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  FilterOptions
} from '../querybuilder'
import { ArchbaseSpaceTemplate, ArchbaseSpaceTemplateOptions } from './ArchbaseSpaceTemplate'
import { ArchbaseAction, ArchbaseActionButtons, ArchbaseActionButtonsOptions } from '../buttons'

export interface UserActionsOptions {
  visible?: boolean
  labelAdd?: string | undefined | null
  labelEdit?: string | undefined | null
  labelRemove?: string | undefined | null
  labelView?: string | undefined | null
  allowAdd?: boolean
  allowEdit?: boolean
  allowView?: boolean
  allowRemove?: boolean
  onAddExecute?: () => void
  onEditExecute?: () => void
  onRemoveExecute?: () => void
  onViewExecute?: () => void
  customUserActions?: ArchbaseAction[]
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
}

export interface ArchbaseMasonryTemplateProps<T, ID> {
  title: string
  dataSource: ArchbaseDataSource<T, ID>
  dataSourceEdition?: ArchbaseDataSource<T, ID> | undefined
  filterOptions: FilterOptions
  pageSize?: number
  filterFields: ReactNode | undefined
  filterPersistenceDelegator: ArchbaseQueryFilterDelegator
  userActions?: UserActionsOptions
  variant?: Variants<'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle' | 'gradient'>
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined
  isLoading?: boolean
  debug?: boolean
  isError?: boolean
  error?: string | undefined
  clearError?: () => void
  width?: number | string | undefined
  height?: number | string | undefined
  withBorder?: boolean
  withPagination?: boolean
  radius?: MantineNumberSize
  columnsCountBreakPoints?: Record<number, number>
  columnsCount?: number
  gutter?: string
  /** Definições do componente customizado a ser renderizado para um Item da lista */
  component?: ComponentDefinition
  id?: string
  activeIndex?: number
  /** Cor de fundo do item ativo */
  activeBackgroundColor?: string
  /** Cor do item ativo */
  activeColor?: string
  /** Evento gerado quando o mouse está sobre um item */
  onItemEnter?: (event: React.MouseEvent, data: any) => void
  /** Evento gerado quando o mouse sai de um item */
  onItemLeave?: (event: React.MouseEvent, data: any) => void
  style?: CSSProperties
  actionsButtonsOptions?: ArchbaseActionButtonsOptions
  spaceOptions?: ArchbaseSpaceTemplateOptions
}

export function ArchbaseMasonryTemplate<T extends object, ID>({
  title,
  dataSource,
  //  dataSourceEdition,
  filterOptions,
  //pageSize,
  filterFields,
  innerRef,
  //isLoading = false,
  debug = false,
  isError = false,
  error = '',
  clearError = () => {},
  width = '100%',
  height = '100%',
  withBorder = true,
  filterPersistenceDelegator,
  withPagination = true,
  radius,
  userActions,
  columnsCountBreakPoints,
  columnsCount,
  gutter,
  component,
  activeIndex,
  activeBackgroundColor,
  activeColor,
  onItemEnter,
  onItemLeave,
  style,
  actionsButtonsOptions,
  spaceOptions,
  variant,
  id = uniqueId('masonry')
}: ArchbaseMasonryTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext()
  const [idMasonry] = useState(id)
  const innerComponentRef = innerRef || useRef<any>()
  const filterRef = useRef<any>()
  const [activeIndexValue, setActiveIndexValue] = useState(
    activeIndex ? activeIndex : dataSource && dataSource.getTotalRecords() > 0 ? 0 : -1
  )
  let size = useComponentSize(innerComponentRef)
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    activeFilterIndex: -1,
    expandedFilter: false
  })

  const userActionsBuilded: ArchbaseAction[] = useMemo(() => {
    const userActionsEnd = { ...defaultUserActions, ...userActions }
    const defaultActions: ArchbaseAction[] = []
    if (userActionsEnd.allowAdd) {
      defaultActions.push({
        id: 'actAdd',
        icon: <IconPlus />,
        color: 'green',
        label: userActionsEnd.labelAdd ? userActionsEnd.labelAdd : t('archbase:New'),
        executeAction: () => {
          if (userActionsEnd && userActionsEnd.onAddExecute) {
            userActionsEnd.onAddExecute()
          }
        },
        enabled: true,
        hint:`${t('archbase:Clique para criar um novo registro')}`
      })
    }
    if (userActionsEnd.allowEdit) {
      defaultActions.push({
        id: 'actEdit',
        icon: <IconEdit />,
        color: 'blue',
        label: userActionsEnd.labelEdit ? userActionsEnd.labelEdit : t('archbase:Edit'),
        executeAction: () => {
          if (userActionsEnd && userActionsEnd.onEditExecute) {
            userActionsEnd.onEditExecute()
          }
        },
        enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
        hint: `${t('archbase:Clique para editar o registro')}`
      })
    }
    if (userActionsEnd.allowRemove) {
      defaultActions.push({
        id: 'actRemove',
        icon: <IconTrash />,
        color: 'red',
        label: userActionsEnd.labelRemove ? userActionsEnd.labelRemove : t('archbase:Remove'),
        executeAction: () => {
          if (userActionsEnd && userActionsEnd.onRemoveExecute) {
            userActionsEnd.onRemoveExecute()
          }
        },
        enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
        hint: `${t('archbase:Clique para remover o registro')}`
      })
    }

    if (userActionsEnd.allowView) {
      defaultActions.push({
        id: 'actView',
        icon: <IconEye />,
        color: 'green',
        label: userActionsEnd.labelView ? userActionsEnd.labelView : t('archbase:View'),
        executeAction: () => {
          if (userActionsEnd && userActionsEnd.onViewExecute) {
              userActionsEnd.onViewExecute()
          }
        },
        enabled: !dataSource.isEmpty() && dataSource.isBrowsing(),
        hint: `${t('archbase:Clique para visualizar o registro')}`
      })
    }

    if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'before') {
      return [...userActionsEnd.customUserActions, ...defaultActions]
    }

    if (userActionsEnd.customUserActions && userActionsEnd.positionCustomUserActions === 'after') {
      return [...defaultActions, ...userActionsEnd.customUserActions]
    }

    return defaultActions
  }, [userActions, dataSource])

  const cards: ReactNode[] = useMemo(() => {
    if (component) {
      let DynamicComponent = component.type
      let compProps = {}
      if (component.props) {
        compProps = component.props
      }

      return dataSource.browseRecords().map((record: any, index: number) => {
        const newKey = `${idMasonry}_${index}`
        const newId = `${idMasonry}_${index}`
        let active = record.active === undefined ? false : record.active
        if (activeIndexValue >= 0) {
          active = false
          if (activeIndexValue === index) {
            active = true
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
        )
      })
    }

    return []
  }, [activeIndexValue, component, idMasonry, dataSource])

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

  const handleSelectItem = (index: number, data: T) => {
    setActiveIndexValue(index)
    if (dataSource) {
      dataSource.gotoRecordByData(data)
    }
  }

  const defaultActionsButtonsOptions: ArchbaseActionButtonsOptions = {
    menuButtonColor: 'blue.5',
    menuPosition: 'left'
  }

  const defaultSpaceTemplateOptions: ArchbaseSpaceTemplateOptions = {
    headerFlexGrow: 'left',
    footerGridColumns: {}
  }

  const _actionsButtonsOptions = { ...defaultActionsButtonsOptions, ...actionsButtonsOptions }
  const _spaceTemplateOptions = { ...defaultSpaceTemplateOptions, ...spaceOptions }

  return (
    <ArchbaseSpaceTemplate
      innerRef={innerComponentRef}
      width={width}
      height={height}
      radius={radius}
      withBorder={withBorder}
      isError={isError}
      error={error}
      clearError={clearError}
      title={title}
      debug={debug}
      style={style}
      options={_spaceTemplateOptions}
      headerLeft={
        <ArchbaseActionButtons actions={userActionsBuilded} options={_actionsButtonsOptions} />
      }
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
      <ArchbaseMasonryProvider
        value={{
          dataSource,
          ownerId: id,
          handleSelectItem,
          activeBackgroundColor,
          activeColor,
          onItemEnter,
          onItemLeave
        }}
      >
        <ArchbaseMasonryResponsive columnsCountBreakPoints={columnsCountBreakPoints}>
          <ArchbaseMasonry gutter={gutter} columnsCount={columnsCount}>
            {cards}
          </ArchbaseMasonry>
        </ArchbaseMasonryResponsive>
      </ArchbaseMasonryProvider>
    </ArchbaseSpaceTemplate>
  )
}
