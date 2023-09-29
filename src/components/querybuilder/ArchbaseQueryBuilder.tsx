import React, { Component, ReactNode, RefObject } from 'react'
import DateObject from 'react-date-object'
import shallowCompare from 'react-addons-shallow-compare'
import { uniqueId } from 'lodash'
import { endOfMonth } from 'date-fns'
import { ActionIcon, Menu, Tooltip } from '@mantine/core'
import { IconCalendar, IconFilter, IconSubtask, IconCalendarDue, IconFilterOff, IconRefresh } from '@tabler/icons-react'
import {
  getDefaultFilter,
  getQuickFilterFields,
  getFields,
  getQuickFields,
  QUICK_FILTER_INDEX,
  NEW_FILTER_INDEX,
  NORMAL,
  QUICK,
  ADVANCED,
  PositionType,
  RangeType,
  Position,
  Field,
  SortField,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  QueryFilterEntity,
  IQueryFilterEntity,
  getDefaultEmptyFilter,
  ArchbaseQueryBuilderProps
} from './ArchbaseFilterCommons'
import { ArchbaseCompositeFilter } from './ArchbaseCompositeFilter'
import { processDetailErrorMessage, processErrorMessage } from '../core/exceptions'
import { ArchbaseDialog } from '../notification'
import { ArchbaseEdit } from '../editors'
import { ArchbaseFilterSelectFields } from './ArchbaseFilterSelectFields'
import { ArchbaseFilterSelectRange } from './ArchbaseFilterSelectRange'
import { ArchbaseAppContext } from '../core'
import { t } from 'i18next'

export interface ArchbaseQueryBuilderState {
  currentFilter: ArchbaseQueryFilter
  modalOpen: string
  expandedFilter: boolean
  activeFilterIndex: number
  isOpenSelectRange: boolean
  isOpenSelectFields: boolean
  detailsTop?: string | number | undefined
  detailsLeft?: string | number | undefined
  detailsHeight?: string | number | undefined
  selectRangeType?: RangeType | undefined
  detailsAlign?: "left"|"right"
  modalOperator?: string | undefined
  modalSearchField: string
  children?: React.ReactNode | React.ReactNode[]
  update: number
  modalHandleOnChange?: (value: string) => void
}

export class ArchbaseQueryBuilder extends Component<
  ArchbaseQueryBuilderProps,
  ArchbaseQueryBuilderState
> {
  static defaultProps = {
    showClearButton: true,
    showToggleButton: true,
    expandedFilter: false,
    width: '50px',
    height: '500px',
    detailsHeight: 580,
    detailsWidth: 768,
    detailsAlign: 'right'
  }
  private timeout: any
  private divMain: any
  private refEdit: RefObject<HTMLInputElement>
  private toggleFilterButtonRef: RefObject<any>
  private inputValue: any
  declare context: React.ContextType<typeof ArchbaseAppContext>
  constructor(props: ArchbaseQueryBuilderProps) {
    super(props)
    this.refEdit = React.createRef()
    this.toggleFilterButtonRef = React.createRef()
    this.state = {
      currentFilter: this.props.currentFilter
        ? this.props.currentFilter
        : getDefaultFilter(props, QUICK),
      modalOpen: '',
      modalSearchField: '',
      isOpenSelectRange: false,
      isOpenSelectFields: false,
      expandedFilter: this.props.expandedFilter!,
      update: Math.random(),
      activeFilterIndex: this.props.currentFilter
        ? this.props.activeFilterIndex!
        : QUICK_FILTER_INDEX
    }
  }

  shouldComponentUpdate = (
    nextProps: ArchbaseQueryBuilderProps,
    nextState: ArchbaseQueryBuilderState
  ) => {
    return shallowCompare(this, nextProps, nextState)
  }

  UNSAFE_componentWillReceiveProps = (nextProps: ArchbaseQueryBuilderProps) => {
    this.setState({
      ...this.state,
      currentFilter: nextProps.currentFilter
        ? nextProps.currentFilter
        : getDefaultFilter(nextProps, QUICK),
      modalOpen: '',
      expandedFilter: nextProps.expandedFilter ? nextProps.expandedFilter : false,
      activeFilterIndex: nextProps.currentFilter ? nextProps.activeFilterIndex : QUICK_FILTER_INDEX
    })
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize)
  }

  toggleExpandedFilter = () => {
    const newExpandedFilter = !this.state.expandedFilter
    const position = this.getPosition('filter')
    this.setState(
      {
        ...this.state,
        expandedFilter: newExpandedFilter,
        isOpenSelectRange: false,
        isOpenSelectFields: false,
        detailsTop: position.top,
        detailsLeft: position.left,
        detailsHeight: position.height
      },
      () => {
        if (!this.state.currentFilter || this.state.currentFilter.filter.filterType === QUICK) {
          const firstFilter: IQueryFilterEntity | undefined =
            this.props.persistenceDelegator.getFirstFilter()
          if (firstFilter) {
            const currentFilter: ArchbaseQueryFilter = getDefaultEmptyFilter()
            currentFilter.id = firstFilter.id
            currentFilter.name = firstFilter.name
            currentFilter.viewName = firstFilter.viewName
            currentFilter.filter = JSON.parse(atob(firstFilter.filter || ''))
            this.onChangeSelectedFilter(currentFilter, 0)
          } else {
            this.addNewFilter()
          }
        }
      }
    )
    if (this.props.onToggleExpandedFilter) {
      this.props.onToggleExpandedFilter(newExpandedFilter)
    }
  }

  clearFilter = () => {
    if (this.props.onToggleExpandedFilter) {
      this.props.onToggleExpandedFilter(false)
    }
    const currentFilter = getDefaultFilter(this.props, QUICK)
    this.setState(
      {
        ...this.state,
        currentFilter,
        expandedFilter: false,
        activeFilterIndex: QUICK_FILTER_INDEX
      },
      () => {
        this.onFilterChanged(currentFilter, QUICK_FILTER_INDEX, () => {
          if (this.props.onClearFilter) {
            this.props.onClearFilter(this)
          }
          this.onSearchClick()
        })
      }
    )
  }

  onSearchClick = () => {
    if (this.props.onSearchByFilter) {
      this.props.onSearchByFilter()
    }
    this.onCloseFilterClick()
  }

  onChangeQuickFilter = (value: string, _event: React.MouseEvent) => {
    this.changeQuickFilter(value)
  }

  changeQuickFilter = (value: string) => {
    let currentFilter = this.state.currentFilter
    if (
      this.state.currentFilter &&
      this.state.currentFilter.type &&
      this.state.currentFilter.type !== QUICK
    ) {
      currentFilter = getDefaultFilter(this.props, QUICK)
    }

    currentFilter.filter.quickFilterText = value
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(
      currentFilter,
      getFields(this.props)
    )
    this.setState({
      ...this.state,
      currentFilter,
      expandedFilter: false,
      activeFilterIndex: QUICK_FILTER_INDEX
    })
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      if (this.props.onToggleExpandedFilter) {
        this.props.onToggleExpandedFilter(false)
      }
      if (this.props.onFilterChanged) {
        this.props.onFilterChanged(currentFilter, QUICK_FILTER_INDEX)
      }
    }, 200)
  }

  handleQuickFilter = (event) => {
    if (event.keyCode === 13) {
      this.onSearchClick()
    }
  }

  getQuickFilterText = () => {
    return this.state.currentFilter.filter.quickFilterText
  }

  onFilterChanged = (
    currentFilter: ArchbaseQueryFilter,
    activeFilterIndex: number,
    callback: () => void
  ) => {
    const result = []
    if (currentFilter.id) {
      this.convertFilterToListValues('root', currentFilter.filter.rules, result)
      const filter = { filter: result, sort: currentFilter.sort.sortFields }
      localStorage.setItem(`filter${currentFilter.id}`, JSON.stringify(filter))
    }

    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(currentFilter, activeFilterIndex, () => {
        this.setState({ ...this.state, update: Math.random() }, callback)
      })
    } else {
      this.setState({ ...this.state, update: Math.random() }, callback)
    }
  }

  loadListValuesToFilter = (parent: string, rules: string | any[], values: any) => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      if (rule.rules) {
        this.loadListValuesToFilter(rule.id, rule.rules, values)
      } else {
        const vl = this.getItemListById(values, parent, rule.id)
        if (vl) {
          rule.value = vl.value
          rule.value2 = vl.value2
        }
      }
    }
  }

  getItemListById = (values: string | any[], parent: string, id: any) => {
    for (let i = 0; i < values.length; i++) {
      if (values[i].parent === parent && values[i].id === id) {
        return values[i]
      }
    }
  }

  convertFilterToListValues = (
    parent: string,
    rules: string | any[],
    result: { parent: any; id: any; value: any; value2: any }[]
  ) => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i]
      if (rule.rules) {
        this.convertFilterToListValues(rule.id, rule.rules, result)
      } else {
        result.push({
          parent,
          id: rule.id,
          value: rule.value,
          value2: rule.value2
        })
      }
    }
  }

  onSaveFilter = (itemId: string) => {
    if (
      itemId === 'mnuItemSalvar' &&
      this.state.currentFilter &&
      this.state.currentFilter.id &&
      this.state.currentFilter.id > 0
    ) {
      ArchbaseDialog.showConfirmDialogYesNo(
        'Confirme',
        'Deseja salvar o Filtro ?',
        () => {
          const currentFilter = this.state.currentFilter
          currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(
            currentFilter,
            getFields(this.props)
          )
          const filter: IQueryFilterEntity | undefined =
            this.props.persistenceDelegator.getFilterById(currentFilter.id)
          if (filter) {
            filter.setFilter(btoa(JSON.stringify(currentFilter)))
            this.props.persistenceDelegator.saveFilter(filter, (error: any) => {
              if (error) {
                ArchbaseDialog.showErrorWithDetails(`${t('archbase:Warning')}`,processErrorMessage(error), processDetailErrorMessage(error))              
              }
            })
          }
        },
        () => {}
      )
    } else if (
      (itemId === 'mnuItemSalvar' || itemId === 'mnuItemSalvarComo') &&
      this.state.currentFilter
    ) {
      this.inputValue = ''
      ArchbaseDialog.showInputDialog(
        'Salvar como...',
        'Informe um nome para o fitro...',
        'Confirme',
        (value: any) => (this.inputValue = value),
        () => {
          const currentFilter = this.state.currentFilter
          currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(
            currentFilter,
            getFields(this.props)
          )

          const newFilter: IQueryFilterEntity = QueryFilterEntity.createInstanceWithValues({
            filter: btoa(JSON.stringify(currentFilter)),
            id: this.props.id,
            name: this.inputValue,
            componentName: this.props.id,
            userName: this.props.userName,
            shared: true,
            viewName: this.props.viewName
          })

          this.props.persistenceDelegator.saveFilter(newFilter, (error: any, id: any) => {
            if (error) {
              ArchbaseDialog.showErrorWithDetails(`${t('archbase:Warning')}`,processErrorMessage(error), processDetailErrorMessage(error))              
            } else {
              currentFilter.id = id
              currentFilter.name = newFilter.name
              this.setState({
                ...this.state,
                currentFilter,
                modalOpen: 'modalSaveFilter'
              })
            }
          })
        },
        () => {}
      )
    }
  }

  onChangeFilterType = (index: number) => {
    const currentFilter = this.state.currentFilter
    currentFilter.filter.filterType = index === 0 ? NORMAL : ADVANCED
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(
      currentFilter,
      getFields(this.props)
    )
    this.setState({ ...this.state, currentFilter, update: Math.random() })
    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(currentFilter, this.state.activeFilterIndex)
    }
  }

  onChangeSelectedFilter = (filter: ArchbaseQueryFilter, index: number) => {
    if (this.props.onSelectedFilter) {
      this.props.onSelectedFilter(filter, index)
    }
    const item = localStorage.getItem(`filter${filter.id}`)
    if (item && item !== null) {
      const tmpItem = JSON.parse(item)
      this.loadListValuesToFilter('root', filter.filter.rules, tmpItem.filter)
    }
    this.setState({
      ...this.state,
      currentFilter: filter,
      activeFilterIndex: index
    })
  }

  addNewFilter = () => {
    const currentFilter = getDefaultFilter(this.props, NORMAL)
    this.setState({
      ...this.state,
      currentFilter,
      activeFilterIndex: NEW_FILTER_INDEX
    })
    if (this.props.onSelectedFilter) {
      this.props.onSelectedFilter(currentFilter, NEW_FILTER_INDEX)
    }
  }

  onActionClick = (action: string) => {
    if (action === 'new') {
      this.addNewFilter()
    } else if (action === 'remove') {
      this.removeFilter()
    } else if (action === 'apply') {
      this.onSearchClick()
    } else if (action === 'close') {
      this.onCloseFilterClick()
    }
  }

  removeFilter = () => {
    ArchbaseDialog.showConfirmDialogYesNo(
      'Confirme',
      'Deseja remover o Filtro ?',
      () => {
        const currentFilter = this.state.currentFilter
        const filter: IQueryFilterEntity | undefined = this.props.persistenceDelegator.getFilterById(
          currentFilter.id
        )
        if (filter) {
          this.props.persistenceDelegator.removeFilterBy(filter.id, (error: any) => {
            if (error && error !== null) {
              ArchbaseDialog.showErrorWithDetails(`${t('archbase:Warning')}`,processErrorMessage(error), processDetailErrorMessage(error))              
            } else {
              const firstFilter = this.props.persistenceDelegator.getFirstFilter()
              if (firstFilter) {
                const currentFilter: ArchbaseQueryFilter = getDefaultEmptyFilter()
                currentFilter.id = firstFilter.id
                currentFilter.name = firstFilter.name
                currentFilter.viewName = firstFilter.viewName
                currentFilter.filter = JSON.parse(atob(firstFilter.filter || ''))
                this.onChangeSelectedFilter(currentFilter, 0)
              } else {
                this.addNewFilter()
              }
            }
          })
        }
      },
      () => {}
    )
  }

  onCloseFilterClick = () => {
    this.setState({
      ...this.state,
      isOpenSelectRange: false,
      selectRangeType: undefined,
      expandedFilter: false,
      isOpenSelectFields: false
    })
    if (this.props.onToggleExpandedFilter) {
      this.props.onToggleExpandedFilter(false)
    }
  }

  getPosition = (type: PositionType, rangeType?: RangeType): Position => {
    let width = this.props.detailsWidth!
    if (type === 'range') {
      if (rangeType === 'month') {
        width = 260
      } else {
        width = 510
      }
    } else if (type === 'fields') {
      width = 480
    }
    const bb = this.divMain.getBoundingClientRect()
    const { innerHeight: height } = window

    let left = bb.left
    if ((this.state.detailsAlign === 'right' && type === 'filter') || (bb.left + width > window.innerWidth - 100)) {
      left = bb.right - width
    }

    return {
      left,
      top: bb.bottom + 2,
      height: this.props.detailsHeight ? this.props.detailsHeight : height - bb.bottom - 30
    }
  }

  onResize = () => {
    let type: PositionType = 'filter'
    let rangeType: RangeType
    if (this.state.isOpenSelectFields) {
      type = 'fields'
    } else if (this.state.isOpenSelectRange) {
      type = 'range'
      rangeType = this.state.selectRangeType
    }
    const position = this.getPosition(type, rangeType)
    this.setState({
      ...this.state,
      detailsTop: position.top,
      detailsLeft: position.left,
      detailsHeight: position.height
    })
  }

  onSelectRange = (rangeType: RangeType) => {
    if (this.state.isOpenSelectRange) {
      this.onCancelSelectRange()
    } else {
      const position = this.getPosition('range', rangeType)
      this.setState({
        ...this.state,
        detailsTop: position.top,
        detailsLeft: position.left,
        detailsHeight: position.height,
        isOpenSelectRange: true,
        selectRangeType: rangeType,
        expandedFilter: false,
        isOpenSelectFields: false
      })
    }
  }

  onCancelSelectRange = () => {
    this.setState({
      ...this.state,
      isOpenSelectRange: false,
      selectRangeType: undefined,
      expandedFilter: false,
      isOpenSelectFields: false
    })
  }

  onConfirmSelectRange = (values: any) => {
    let newValue: string = ''
    if (this.state.selectRangeType === 'month') {
      const first = values[0].toString()
      const last = new DateObject({
        date: endOfMonth(values[1].toDate()),
        format: 'DD/MM/YYYY'
      }).toString()
      newValue = `${first}:${last}`
    } else if (this.state.selectRangeType === 'range' || this.state.selectRangeType === 'week') {
      const first = values[0].toString()
      const last = values[1].toString()
      newValue = `${first}:${last}`
    } else if (this.state.selectRangeType === 'day') {
      let appendDelimiter = false
      newValue = ''
      values.forEach((item) => {
        if (appendDelimiter) {
          newValue += ','
        }
        newValue += item.toString()
        appendDelimiter = true
      })
    }
    let currentFilter = this.state.currentFilter
    if (
      this.state.currentFilter &&
      this.state.currentFilter.type &&
      this.state.currentFilter.type !== QUICK
    ) {
      currentFilter = getDefaultFilter(this.props, QUICK)
    }
    currentFilter.filter.quickFilterText = newValue
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(
      currentFilter,
      getFields(this.props)
    )
    this.setState(
      {
        ...this.state,
        currentFilter,
        activeFilterIndex: QUICK_FILTER_INDEX,
        selectRangeType: undefined,
        isOpenSelectRange: false,
        isOpenSelectFields: false,
        expandedFilter: false
      },
      () => {
        if (this.props.onFilterChanged) {
          this.props.onFilterChanged(currentFilter, QUICK_FILTER_INDEX)
        }
      }
    )
  }

  selectFields = () => {
    if (this.state.isOpenSelectFields) {
      this.onCancelSelectFields()
    } else {
      const position: Position = this.getPosition('fields')
      this.setState({
        ...this.state,
        detailsTop: position.top,
        detailsLeft: position.left,
        detailsHeight: position.height,
        isOpenSelectFields: true,
        isOpenSelectRange: false,
        expandedFilter: false
      })
    }
  }

  onCancelSelectFields() {
    this.setState({
      ...this.state,
      isOpenSelectFields: false,
      isOpenSelectRange: false,
      expandedFilter: false
    })
  }

  getSortString(currentFilter: ArchbaseQueryFilter): string {
    let result: string = ''
    let appendDelimiter = false
    currentFilter.sort.sortFields.forEach((field) => {
      if (field.selected) {
        if (appendDelimiter) {
          result += ', '
        }
        result += `${field.name}:${field.asc_desc}`
        appendDelimiter = true
      }
    })

    return result
  }

  onConfirmSelectFields = (
    selectedFields: Field[],
    sortFields: SortField[],
    activeIndex: number
  ) => {
    let currentFilter = this.state.currentFilter
    if (
      this.state.currentFilter &&
      this.state.currentFilter.type &&
      this.state.currentFilter.type !== QUICK
    ) {
      currentFilter = getDefaultFilter(this.props, QUICK)
    }
    currentFilter.filter.selectedFields = selectedFields
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(
      currentFilter,
      getFields(this.props)
    )
    currentFilter.sort.sortFields = sortFields
    currentFilter.sort.activeIndex = activeIndex
    currentFilter.sort.quickFilterSort = this.getSortString(currentFilter)
    this.setState(
      {
        ...this.state,
        isOpenSelectFields: false,
        isOpenSelectRange: false,
        expandedFilter: false,
        currentFilter,
        activeFilterIndex: QUICK_FILTER_INDEX
      },
      () => {
        if (this.props.onFilterChanged) {
          this.props.onFilterChanged(currentFilter, QUICK_FILTER_INDEX)
        }
      }
    )
  }

  onFocusEdit = () => {
    if (this.state.expandedFilter) {
      this.setState(
        {
          ...this.state,
          isOpenSelectFields: false,
          isOpenSelectRange: false,
          expandedFilter: false
        },
        () => {
          this.refEdit.current!.focus()
        }
      )
    }
  }

  onClickOk = (_event, selectedRecords: any[]) => {
    if (selectedRecords && selectedRecords.length > 0) {
      let result = ''
      if (this.state.modalOperator === 'notInList' || this.state.modalOperator === 'inList') {
        let appendDelimiter = false
        selectedRecords.forEach((record) => {
          if (appendDelimiter) {
            result += ','
          }
          result += record[this.state.modalSearchField]
          appendDelimiter = true
        })
      } else {
        result = selectedRecords[0][this.state.modalSearchField]
      }

      if (this.state.modalHandleOnChange) {
        this.state.modalHandleOnChange(result)
      }
    }
    this.setState({
      ...this.state,
      modalOpen: '',
      modalHandleOnChange: undefined,
      modalOperator: undefined,
      modalSearchField: ''
    })
  }

  onClickCancel = (_event) => {
    this.setState({
      ...this.state,
      modalOpen: '',
      modalHandleOnChange: undefined,
      modalOperator: undefined,
      modalSearchField: ''
    })
  }

  onSearchButtonClick = (
    field: string,
    _event: any,
    handleOnChange: any,
    operator: any,
    searchField: any
  ) => {
    this.setState({
      ...this.state,
      modalOpen: `modal${field}`,
      modalHandleOnChange: handleOnChange,
      modalOperator: operator,
      modalSearchField: searchField
    })
  }

  buildSearchModals = (): ReactNode[] => {
    const fields: Field[] = getFields(this.props)
    const result: ReactNode[] = []
    fields.forEach((field: any) => {
      if (field.searchComponent && field.searchField) {
        const SearchComponent = field.searchComponent
        result.push(
          <SearchComponent
            key={`modal${field.name}`}
            isOpen={this.state.modalOpen && this.state.modalOpen === `modal${field.name}`}
            user={this.props.userName}
            onClickOk={this.onClickOk}
            onClickCancel={this.onClickCancel}
            selectedRecords={[]}
          />
        )
      }
    })

    return result
  }

  render = () => {
    let type = 'R'
    let backgroundColor = '#f0ad4e'
    if (this.state.currentFilter.filter.filterType === NORMAL) {
      type = 'S'
      backgroundColor = '#72ac18'
    } else if (this.state.currentFilter.filter.filterType === ADVANCED) {
      type = 'A'
      backgroundColor = '#007bff'
    }

    return (
      <div
        ref={(ref) => (this.divMain = ref)}
        style={{
          minWidth: this.props.width,
          maxWidth: this.props.width,
          height: '50px',
          backgroundColor:
            this.context.theme!.colorScheme === 'dark'
              ? this.context.theme!.colors.dark[7]
              : this.context.theme!.colors.gray[0],
          position: 'relative',
          border: `1px solid ${
            this.context.theme!.colorScheme === 'dark'
              ? this.context.theme!.colors.gray[7]
              : this.context.theme!.colors.gray[2]
          }`,
          borderRadius: 4,
          display: 'flex',
          flexFlow: 'column nowrap'
        }}
      >
        <div
          style={{
            padding: 3,
            width: '100%',
            height: 50,
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', width: '100%' }}>
            <ArchbaseEdit
              onChangeValue={this.onChangeQuickFilter}
              innerRef={this.refEdit}
              width={'100%'}
              onFocusEnter={this.onFocusEdit}
              onKeyDown={this.handleQuickFilter}
              value={this.state.currentFilter.filter.quickFilterText}
              placeholder={this.props.placeholder}
              style={{
                height: '36px',
                paddingLeft: '3px'
              }}
            />
            <span
              style={{
                position: 'relative',
                top: '8px',
                right: '28px',
                background: backgroundColor,
                color: 'white',
                border: '1px solid silver',
                width: '20px',
                height: '20px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50px'
              }}
            >
              {type}
            </span>
          </div>
          <Tooltip withinPortal withArrow label="Filtrar">
            <ActionIcon
              variant={this.props.variant}
              size="lg"
              color="primary"
              sx={{ width: '36px', height: '36px', marginRight: 2 }}
              onClick={() => {
                this.onSearchClick()
              }}
            >
              <IconRefresh size="1.4rem" />
            </ActionIcon>
          </Tooltip>
          {this.props.showClearButton ? (
            <Tooltip withinPortal withArrow label="Limpar filtro">
              <ActionIcon
                variant={this.props.variant}
                size="lg"
                color="primary"
                sx={{ width: '36px', height: '36px', marginRight: 2 }}
                onClick={() => {
                  this.clearFilter()
                }}
              >
                <IconFilterOff size="1.4rem" />
              </ActionIcon>
            </Tooltip>
          ) : null}
          <Menu shadow="md" width={200} trigger="hover" openDelay={100} closeDelay={200}>
            <Menu.Target>
              <Tooltip withinPortal withArrow label="Selecionar período">
                <ActionIcon
                  variant={this.props.variant}
                  size="lg"
                  color="primary"
                  sx={{ width: '36px', height: '36px', marginRight: 2 }}
                >
                  <IconCalendar size="1.4rem" />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Período</Menu.Label>
              <Menu.Item
                onClick={() => this.onSelectRange('range')}
                icon={<IconCalendarDue size={16} />}
              >
                Intervalo
              </Menu.Item>
              <Menu.Item
                onClick={() => this.onSelectRange('month')}
                icon={<IconCalendarDue size={16} />}
              >
                Mês
              </Menu.Item>
              <Menu.Item
                onClick={() => this.onSelectRange('week')}
                icon={<IconCalendarDue size={16} />}
              >
                Semana
              </Menu.Item>
              <Menu.Item
                onClick={() => this.onSelectRange('day')}
                icon={<IconCalendarDue size={16} />}
              >
                Dia
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Tooltip withinPortal withArrow label="Selecionar campos filtro rápido">
            <ActionIcon
              variant={this.props.variant}
              size="lg"
              color="primary"
              sx={{ width: '36px', height: '36px', marginRight: 2 }}
              onClick={() => {
                this.selectFields()
              }}
            >
              <IconSubtask size="1.4rem" />
            </ActionIcon>
          </Tooltip>
          {this.props.showToggleButton ? (
            <Tooltip withinPortal withArrow label="Filtro avançado">
              <ActionIcon
                ref={this.toggleFilterButtonRef}
                variant={this.props.variant}
                size="lg"
                color="primary"
                sx={{ width: '36px', height: '36px', marginRight: 2 }}
                onClick={() => {
                  this.toggleExpandedFilter()
                }}
              >
                <IconFilter size="1.4rem" />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </div>
        <ArchbaseCompositeFilter
          update={this.state.update}
          isOpen={this.state.expandedFilter}
          currentFilter={this.state.currentFilter}
          activeFilterIndex={this.state.activeFilterIndex}
          persistenceDelegator={this.props.persistenceDelegator}
          onFilterChanged={(currentFilter: ArchbaseQueryFilter, activeFilterIndex: number) =>
            this.onFilterChanged(currentFilter, activeFilterIndex, () => {})
          }
          onSaveFilter={this.onSaveFilter}
          onActionClick={this.onActionClick}
          onChangeFilterType={this.onChangeFilterType}
          onChangeSelectedFilter={this.onChangeSelectedFilter}
          onSearchButtonClick={this.onSearchButtonClick}
          left={this.state.detailsLeft}
          top={this.state.detailsTop}
          width={this.props.detailsWidth}
          height={this.props.detailsHeight}
          toggleFilterButtonRef={this.toggleFilterButtonRef}
          variant={this.props.variant}
        >
          {this.props.children}
        </ArchbaseCompositeFilter>

        <ArchbaseFilterSelectFields
          id={`filrsep${uniqueId()}`}
          key={`kfilrsep${uniqueId()}`}
          isOpen={this.state.isOpenSelectFields}
          left={this.state.detailsLeft}
          currentFilter={this.state.currentFilter}
          selectedOptions={getQuickFields(getFields(this.props))}
          fields={getFields(this.props)}
          onConfirmSelectFields={this.onConfirmSelectFields}
          onCancelSelectFields={this.onCancelSelectFields}
          width={this.props.width}
          top={this.state.detailsTop}
          variant={this.props.variant}
        />

        <ArchbaseFilterSelectRange
          selectRangeType={this.state.selectRangeType}
          isOpen={this.state.isOpenSelectRange}
          left={this.state.detailsLeft}
          onConfirmSelectRange={this.onConfirmSelectRange}
          onCancelSelectRange={this.onCancelSelectRange}
          width={this.props.width}
          top={this.state.detailsTop}
          variant={this.props.variant}
        />
        {this.buildSearchModals()}
      </div>
    )
  }
}

ArchbaseQueryBuilder.contextType = ArchbaseAppContext
