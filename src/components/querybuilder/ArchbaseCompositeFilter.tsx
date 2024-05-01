/* eslint-disable */
import {
  Accordion,
  Badge,
  Button,
  ButtonVariant,
  Group,
  Menu,
  Radio,
  rem,
  ScrollArea,
  Text,
  Tooltip,
} from '@mantine/core'
import {
  IconDeviceFloppy,
  IconDoorExit,
  IconFilter,
  IconPlus,
  IconTrash
} from '@tabler/icons-react'
import { IconFilterSearch } from '@tabler/icons-react'
import { IconRefresh } from '@tabler/icons-react'
import { t } from 'i18next'
import { uniqueId } from 'lodash'
import React, { Component, CSSProperties, ReactNode } from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import Modal from 'react-modal'
import { ArchbaseAdvancedFilter } from './ArchbaseAdvancedFilter'
import {
  ADVANCED,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  convertQueryFields,
  defaultOperators,
  Field,
  FilterType,
  getFields,
  getQuickFields,
  NEW_FILTER_INDEX,
  NORMAL,
  QUICK_FILTER_INDEX
} from './ArchbaseFilterCommons'
import { ArchbaseSaveFilter } from './ArchbaseSaveFilter'
import { ArchbaseSimpleFilter } from './ArchbaseSimpleFilter'
import { ArchbaseDataSource } from '@components/datasource'
import { ArchbaseAppContext } from '@components/core'
import { ArchbaseList } from '@components/list'

interface ArchbaseCompositeFilterProps {
  variant?: ButtonVariant
  activeFilterIndex: number
  currentFilter: ArchbaseQueryFilter
  width?: string | number | undefined
  height?: string | number | undefined
  persistenceDelegator: ArchbaseQueryFilterDelegator
  update?: number
  children?: ReactNode | ReactNode[]
  onSaveFilter?: (itemId: string) => void
  onChangeFilterType?: (index: number) => void
  onChangeSelectedFilter?: (filter: ArchbaseQueryFilter, index: number) => void
  onFilterChanged: (currentFilter: ArchbaseQueryFilter, activeFilterIndex: number) => void
  onSearchButtonClick?: (
    field: string,
    event?: any,
    handleOnChange?: any,
    operator?: any,
    searchField?: any
  ) => void
  onActionClick?: (action: string) => void
  toggleFilterButtonRef?: any
}

interface ArchbaseCompositeFilterState {
  modalOpen: string
  activeFilterIndex: number
  fields: Field[]
  showEditor: boolean
  expandedFilter: boolean
  dataSource: ArchbaseDataSource<any,any>;
}

class ArchbaseCompositeFilter extends Component<
  ArchbaseCompositeFilterProps,
  ArchbaseCompositeFilterState
> {
  declare context: React.ContextType<typeof ArchbaseAppContext>
  constructor(props: ArchbaseCompositeFilterProps) {
    super(props)
    this.state = {
      modalOpen: '',
      activeFilterIndex: props.activeFilterIndex,
      fields: getFields(props),
      showEditor: false,
      expandedFilter: false,
	  dataSource: new ArchbaseDataSource('dsSortFields', {
		records: this.props.persistenceDelegator.getFilters(),
		grandTotalRecords: this.props.persistenceDelegator.getFilters().length,
		currentPage: 0,
		totalPages: 0,
		pageSize: 999999
	  })
    }
  }

  shouldComponentUpdate = (
    nextProps: ArchbaseCompositeFilterProps,
    nextState: ArchbaseCompositeFilterState
  ) => {
    return shallowCompare(this, nextProps, nextState)
  }

  UNSAFE_componentWillReceiveProps = (nextProps: ArchbaseCompositeFilterProps) => {
    this.setState({
      ...this.state,
      fields: getFields(nextProps),
      activeFilterIndex: nextProps.activeFilterIndex,
	  dataSource: new ArchbaseDataSource('dsSortFields', {
		records: this.props.persistenceDelegator.getFilters(),
		grandTotalRecords: this.props.persistenceDelegator.getFilters().length,
		currentPage: 0,
		totalPages: 0,
		pageSize: 999999
	  })
    })
  }

  onSelectMenuItem = (itemId: string) => {
    this.props.onSaveFilter && this.props.onSaveFilter(itemId)
  }

  onChangeFilterType = (index: number) => {
    this.props.onChangeFilterType && this.props.onChangeFilterType(index)
  }

  onSelectItem = (index: number, data: any) => {
    if (this.props.onChangeSelectedFilter && data && data.filter) {
      const filter = JSON.parse(data.filter)
      this.props.onChangeSelectedFilter(filter, index)
    }
  }

  getColor = (color: string) => {
    return this.context.theme!.colors[color][this.context.colorScheme === 'dark' ? 5 : 7]
  }

  render = () => {
    let filterType: FilterType = 'normal'
    if (this.props.currentFilter) {
      filterType = this.props.currentFilter.filter.filterType
    }

    return (
      <ScrollArea h={this.props.height} w={this.props.width}>
		<div style={{width:"98%"}}>
        <Accordion variant="contained" multiple={false} defaultValue={'filters'}>
          <Accordion.Item value="filters">
            <Accordion.Control
              icon={<IconFilterSearch size={24} color={this.getColor('red')} />}
            >
              <Text style={{ fontWeight: 'bold' }}>{`${t('archbase:Filtros salvos')}`}</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <ArchbaseList
                height="105px"
                activeIndex={this.state.activeFilterIndex}
                dataSource={this.state.dataSource}
                onSelectListItem={this.onSelectItem}
                style={{ borderRadius: '6px', marginBottom: '4px', padding: '10px' }}
                component={{ type: FilterItem, props: {} }}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <div className="filter-apply">
          <Group gap="xs">
            <Tooltip withinPortal withArrow label={`${t('archbase:Novo filtro')}`}>
              <Button
                id="btnNew"
                variant={this.props.variant}
                leftSection={<IconPlus />}
                onClick={(event) => this.props.onActionClick && this.props.onActionClick('new')}
              >
                {t('archbase:New')}
              </Button>
            </Tooltip>
            <Tooltip withinPortal withArrow label={`${t('archbase:Remover filtro')}`}>
              <Button
                id="btnRemove"
                color="red"
                variant={this.props.variant}
                disabled={
                  this.props.currentFilter &&
                  (!this.props.currentFilter.id || this.props.currentFilter.id <= 0)
                }
                leftSection={<IconTrash />}
                onClick={(event) => this.props.onActionClick && this.props.onActionClick('remove')}
              >
                {t('archbase:Remover')}
              </Button>
            </Tooltip>
          </Group>
          <Group gap="xs">
            <Menu
              shadow="md"
              width={200}
              withinPortal
              disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
            >
              <Menu.Target>
                <Button variant={this.props.variant} leftSection={<IconDeviceFloppy />}>
                  {`${t('archbase:Save')}`}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{`${t('archbase:Filter')}`}</Menu.Label>
                <Menu.Item
                  onClick={() => this.onSelectMenuItem('mnuItemSalvar')}
                  disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
                  leftSection={<IconDeviceFloppy size={14} />}
                >
                  {`${t('archbase:Save')}`}
                </Menu.Item>
                <Menu.Item
                  onClick={() => this.onSelectMenuItem('mnuItemSalvarComo')}
                  disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
                  leftSection={<IconDeviceFloppy size={14} />}
                >
                  {`${t('archbase:Salvar como...')}`}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Tooltip withinPortal withArrow label={`${t('archbase:Aplicar filtro')}`}>
              <Button
                id="btnApply"
                variant={this.props.variant}
                leftSection={<IconRefresh />}
                disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
                onClick={(event) => {
                  console.log(this.props.activeFilterIndex) 
                  if (this.props.onActionClick) 
                  this.props.onActionClick('apply')
                }}
              >
                {`${t('archbase:Aplicar')}`}
              </Button>
            </Tooltip>
            <Tooltip withinPortal withArrow label={`${t('archbase:Fechar filtro')}`}>
              <Button
                id="btnClose"
                variant={this.props.variant}
                color="green"
                leftSection={<IconDoorExit />}
                onClick={(event) => this.props.onActionClick && this.props.onActionClick('close')}
              >
                {`${t('archbase:Close')}`}
              </Button>
            </Tooltip>
          </Group>
        </div>
        {this.props.activeFilterIndex === NEW_FILTER_INDEX ? (
          <Radio.Group
            value={this.props.currentFilter.filter.filterType}
            name="filterType"
            label={`${t('archbase:Selecione o tipo do filtro')}`}
            withAsterisk
            onChange={(value: string) => this.onChangeFilterType(value === 'normal' ? 0 : 1)}
          >
            <Group mt="xs">
              <Radio value="normal" label={`${t('archbase:Simples')}`} />
              <Radio value="advanced" label={`${t('archbase:Avançado')}`} />
            </Group>
          </Radio.Group>
        ) : null}
        {filterType === NORMAL ? (
          <ArchbaseSimpleFilter
            allowSort={true}
            update={this.props.update}
            operators={defaultOperators()}
            currentFilter={this.props.currentFilter}
            activeFilterIndex={this.props.activeFilterIndex}
            onFilterChanged={this.props.onFilterChanged}
            onSearchButtonClick={this.props.onSearchButtonClick}
            fields={this.state.fields}
            theme={this.context.theme}
            colorScheme={this.context.colorScheme}
          />
        ) : null}
        {filterType === ADVANCED ? (
          <ArchbaseDetailedFilter
            isOpen={this.state.expandedFilter}
            update={this.props.update}
            width={'auto'}
            height={'100%'}
            selectedOptions={getQuickFields(this.state.fields)}
            onFilterChanged={this.props.onFilterChanged}
            onSearchButtonClick={this.props.onSearchButtonClick}
            currentFilter={this.props.currentFilter}
            activeFilterIndex={this.props.activeFilterIndex}
          >
            {convertQueryFields(this.props.children)}
          </ArchbaseDetailedFilter>
        ) : null}
		</div>
      </ScrollArea>
    )
  }
}

ArchbaseCompositeFilter.contextType = ArchbaseAppContext

interface ArchbaseDetailedFilterProps {
  currentFilter: ArchbaseQueryFilter
  onChangeSelectedFilter?: (filter: ArchbaseQueryFilter, index: number) => void
  onSaveFilter?: (item: string) => void
  onFilterChanged: (currentFilter: ArchbaseQueryFilter, activeFilterIndex: number) => void
  height?: string
  width?: string
  activeFilterIndex: number
  children?: ReactNode | ReactNode[]
  onClickOkSaveFilter?: () => void
  onClickCancelSaveFilter?: () => void
  onSearchButtonClick?: (field: string) => void
  isOpen?: boolean
  update?: number
  selectedOptions?: Field[]
  variant?: ButtonVariant
}

interface ArchbaseAdvancedFilterState {
  modalOpen: string
  update: number
}

class ArchbaseDetailedFilter extends Component<
  ArchbaseDetailedFilterProps,
  ArchbaseAdvancedFilterState
> {
  static defaultProps = {
    isOpen: false
  }
  constructor(props: ArchbaseDetailedFilterProps) {
    super(props)
    this.state = { modalOpen: '', update: Math.random() }
  }
  onSelectMenuItem = (itemId: string) => {
    this.props.onSaveFilter && this.props.onSaveFilter(itemId)
  }

  onSelectItem = (index: number, data: any) => {
    if (this.props.onChangeSelectedFilter && data && data.filter) {
      let filter = JSON.parse(data.filter)
      filter.id = data.id
      filter.name = data.name
      filter.formName = data.formName
      this.props.onChangeSelectedFilter(filter, index)
    }
    this.setState({ ...this.state, update: Math.random() })
  }

  render() {
    return (
      <div style={{ padding: '10px', width: this.props.width }}>
        <ArchbaseAdvancedFilter
          onFilterChanged={this.props.onFilterChanged}
          width={'100%'}
          horizontal={false}
          currentFilter={this.props.currentFilter}
          activeFilterIndex={this.props.activeFilterIndex}
          id={`advanced${uniqueId()}`}
          border={'none'}
          variant={this.props.variant}
        >
          {this.props.children}
        </ArchbaseAdvancedFilter>
        <ArchbaseSaveFilter
          id="modalSaveFilter"
          title={`${t('archbase:Salvar filtro')}`}
          modalOpen={this.state.modalOpen}
          variant={this.props.variant}
        />
      </div>
    )
  }
}

interface FilterItemProps {
  disabled: boolean
  active: boolean
  index: number
  recordData: any
  handleSelectItem?: (index: number, recordData: any) => void
  onSelectListItem?: (index: number, recordData: any) => void
}

class FilterItem extends Component<FilterItemProps> {
  static defaultProps = {
    disabled: false,
    active: true
  }
  constructor(props: FilterItemProps) {
    super(props)
    this.state = { update: Math.random() }
  }

  onClick = (event: React.MouseEvent) => {
    event.preventDefault()
    if (!this.props.disabled) {
      if (this.props.handleSelectItem) {
        event.preventDefault()
        this.props.handleSelectItem(this.props.index, this.props.recordData)
        event.preventDefault()
      }
      if (this.props.onSelectListItem) {
        this.props.onSelectListItem(this.props.index, this.props.recordData)
      }
    }
  }

  render = () => {
    let color = '#28C76F'
    let newData = `${t('archbase:Simples')}`
    if (this.props.recordData.filter) {
      let filter = JSON.parse(this.props.recordData.filter)
      if (filter.filter.filterType === 'advanced') {
        color = '#437de0'
        newData = `${t('archbase:Avançado')}`
      }
    }
    let className = 'list-group-item list-group-item-action'
    let style: CSSProperties = {
      maxHeight: '24px',
      padding: '2px 2px 2px 8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer'
    }
    if (this.props.active) {
      className += ' active'
      style = { ...style, border: '1px dashed blue', fontWeight: 'bold' }
    }

    if (this.props.recordData.disabled) className += ' disabled'

    return (
      <div className={className} style={style} onClick={this.onClick}>
        <Text style={{cursor: 'pointer'}}>{t(this.props.recordData.name)}</Text>
        <Badge style={{ cursor: 'pointer', maxWidth: '100px', fontWeight: 'bold' }} color={color}>
          {newData}
        </Badge>
      </div>
    )
  }
}

export { ArchbaseCompositeFilter, ArchbaseDetailedFilter }
