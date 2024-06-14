/* eslint-disable */
import {
  ActionIcon,
  Card,
  Checkbox,
  Grid,
  Group,
  MantineColorScheme,
  MantineTheme,
  MultiSelect,
  rem,
  Space,
  Switch,
  Text,
  Tooltip
} from '@mantine/core'
import { DatePickerInput, DatesRangeValue, DateValue, TimeInput } from '@mantine/dates'
import { IconArrowDown, IconArrowUp, IconChevronDown, IconSearch } from '@tabler/icons-react'
import { IconFilterSearch } from '@tabler/icons-react'
import { IconChevronUp } from '@tabler/icons-react'
import React, { Component, CSSProperties, Fragment, ReactNode } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemState
} from 'react-accessible-accordion'
import shallowCompare from 'react-addons-shallow-compare'
import { CustomSortItem } from './ArchbaseAdvancedFilter'
import {
  ArchbaseQueryFilter,
  Condition,
  DataType,
  defaultConditions,
  defaultOperators,
  Field,
  getDefaultEmptyFilter,
  getSortString,
  Operator,
  SelectedSort
} from './ArchbaseFilterCommons'
import { t } from 'i18next'
import { DebouncedTextInput } from './ArchbaseQueryBuilder'
import { ArchbaseAppContext, ltrim } from '@components/core'
import { ArchbaseList } from '@components/list'
import { ArchbaseDataSource } from '@components/datasource'
import { ArchbaseDateTimePickerEdit, ArchbaseDateTimePickerRange, ArchbaseSelect, ArchbaseSelectItem } from '@components/editors'

const rnd = (() => {
  const gen = (min: number, max: number) =>
    max++ && [...Array(max - min)].map((_s, i) => String.fromCharCode(min + i))

  const sets = {
    num: gen(48, 57),
    alphaLower: gen(97, 122),
    alphaUpper: gen(65, 90),
    special: [...`~!@#$%^&*()_+-=[]{}|;:'",./<>?`]
  }

  function* iter(len: number, set: string | any[]) {
    if (set.length < 1) set = Object.values(sets).flat()
    for (let i = 0; i < len; i++) yield set[(Math.random() * set.length) | 0]
  }

  return Object.assign((len: any, ...set: any[]) => [...iter(len, set.flat())].join(''), sets)
})()

interface Schema {
  fields: Field[]
  conditions: Condition[]
  operators: Operator[]
  onPropChange: (prop: any, value: any, ruleId: any) => void
  getLevel: (id: any) => number
  isRuleGroup: (rule: any) => boolean
  getOperators: (...args: any) => Operator[]
}

export interface ArchbaseSimpleFilterProps {
  currentFilter?: any
  operators: any[]
  onFilterChanged?: (filter: any, index: number) => void
  onError?: (error: any) => void
  fields: any[]
  conditions: any[]
  activeFilterIndex?: number
  allowSort?: boolean
  sortFocused?: boolean
  onSearchButtonClick?: (
    field: string,
    event?: any,
    handleOnChange?: any,
    operator?: any,
    searchField?: any
  ) => void
  update?: number
  theme?: MantineTheme | null
  colorScheme?: MantineColorScheme | null
}

export interface ArchbaseSimpleFilterState {
  currentFilter: any
  update: number
  activeFilterIndex?: number
  simpleFields: ReactNode[]
  schema: Schema
}

class ArchbaseSimpleFilter extends Component<ArchbaseSimpleFilterProps, ArchbaseSimpleFilterState> {
  static defaultProps = {
    operators: defaultOperators(),
    conditions: defaultConditions(),
    onFilterChanged: null,
    onError: null
  }
  private prefixId: string
  // declare context: React.ContextType<typeof ArchbaseAppContext>
  constructor(props: ArchbaseSimpleFilterProps) {
    super(props)
    this.prefixId = rnd(12, rnd.alphaLower)
    const schema = this.createSchema()
    const currentFilter = props.currentFilter ? props.currentFilter : getDefaultEmptyFilter()
    const activeFilterIndex = props.currentFilter ? props.activeFilterIndex : 0

    const simpleFields = this.createFilterFields(props, schema, currentFilter)
    this.state = {
      simpleFields,
      currentFilter,
      schema,
      update: Math.random(),
      activeFilterIndex
    }
  }

  shouldComponentUpdate = (
    nextProps: ArchbaseSimpleFilterProps,
    nextState: ArchbaseSimpleFilterState
  ) => {
    return shallowCompare(this, nextProps, nextState)
  }

  UNSAFE_componentWillReceiveProps = (nextProps: ArchbaseSimpleFilterProps) => {
    const schema = this.createSchema()
    const currentFilter = nextProps.currentFilter
      ? nextProps.currentFilter
      : getDefaultEmptyFilter()
    const activeFilterIndex = nextProps.currentFilter ? nextProps.activeFilterIndex : 0
    const simpleFields = this.createFilterFields(nextProps, schema, currentFilter)
    this.setState({
      ...this.state,
      simpleFields,
      currentFilter,
      activeFilterIndex,
      schema,
      update: Math.random()
    })
  }

  createSchema = (): Schema => {
    const { operators, conditions, fields } = this.props
    return {
      fields,
      operators,
      conditions,
      onPropChange: this.notifyQueryChange.bind(this, this.onPropChange),
      getLevel: this.getLevel.bind(this),
      isRuleGroup: this.isRuleGroup.bind(this),
      getOperators: (field) => this.getOperators(field)
    }
  }

  getDataType = (field: any, fields: string | any[]) => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].name === field) {
        return fields[i].dataType
      }
    }
  }

  getSelectedSort = (): SelectedSort[] => {
    const result: SelectedSort[] = []
    this.state.currentFilter.sort.sortFields.forEach(function (item: {
      selected: any
      name: any
      asc_desc: any
    }) {
      if (item.selected) {
        result.push({ name: item.name, asc_desc: item.asc_desc })
      }
    })
    return result
  }

  getSortItem = (field: any) => {
    let result: any
    this.state.currentFilter.sort.sortFields.forEach(function (item: { name: any }) {
      if (item.name === field) {
        result = item
      }
    })
    return result
  }

  getSortItemByOrder = (order: number) => {
    let result: any
    this.state.currentFilter.sort.sortFields.forEach(function (item: { order: any }) {
      if (item.order === order) {
        result = item
      }
    })
    return result
  }

  onChangeSortItem = (field: any, selected: any, order: any, asc_desc: any) => {
    const item = this.getSortItem(field)
    Object.assign(item, {
      selected,
      order,
      asc_desc,
      label: item.label
    })
    let sortFields = this.state.currentFilter.sort.sortFields
    sortFields = sortFields.sort(function (a: { order: number }, b: { order: number }) {
      return a.order - b.order
    })
    const currentFilter = this.state.currentFilter
    currentFilter.sort.sortFields = sortFields
    this.setState(
      {
        ...this.state,
        update: Math.random(),
        currentFilter
      },
      () => {
        this.propagateFilterChanged()
      }
    )
  }

  propagateFilterChanged = () => {
    const { onFilterChanged } = this.props
    if (onFilterChanged) {
      onFilterChanged(this.state.currentFilter, this.state.activeFilterIndex!)
    }
  }

  onSortDown = (_event: any) => {
    let activeIndex = this.state.currentFilter.sort.activeIndex
    if (activeIndex >= 0) {
      const item = this.state.currentFilter.sort.sortFields[activeIndex]
      if (item.order < this.state.currentFilter.sort.sortFields.length - 1) {
        activeIndex = item.order + 1
        const nextItem = this.getSortItemByOrder(item.order + 1)
        Object.assign(item, {
          order: item.order + 1
        })
        Object.assign(nextItem, {
          order: nextItem.order - 1
        })
      }
      let sortFields = this.state.currentFilter.sort.sortFields
      sortFields = sortFields.sort((a: { order: number }, b: { order: number }) => {
        return a.order - b.order
      })
      const currentFilter = this.state.currentFilter
      currentFilter.sort.sortFields = sortFields
      currentFilter.sort.activeIndex = activeIndex
      this.setState(
        {
          ...this.state,
          currentFilter
        },
        () => {
          this.propagateFilterChanged()
        }
      )
    }
  }

  onSortUp = (_event: any) => {
    const { currentFilter } = this.state
    let activeIndex = currentFilter.sort.activeIndex
    if (activeIndex >= 0) {
      const item = currentFilter.sort.sortFields[activeIndex]
      if (item.order > 0) {
        activeIndex = item.order - 1
        const previousItem = this.getSortItemByOrder(item.order - 1)
        Object.assign(item, {
          order: item.order - 1
        })
        Object.assign(previousItem, {
          order: previousItem.order + 1
        })
      }
      let sortFields = currentFilter.sort.sortFields
      sortFields = sortFields.sort((a: { order: number }, b: { order: number }) => {
        return a.order - b.order
      })
      currentFilter.sort.sortFields = sortFields
      currentFilter.sort.activeIndex = activeIndex
      this.setState(
        {
          ...this.state,
          currentFilter
        },
        () => {
          this.propagateFilterChanged()
        }
      )
    }
  }

  isRuleGroup = (rule: { condition: any; rules: any }) => {
    return !!(rule.condition && rule.rules)
  }

  getField = (name: string) => {
    let result: any
    this.props.fields.forEach((field) => {
      if (field.name === name) {
        result = field
      }
    }, this)
    return result
  }

  getOperators = (field: string): Operator[] => {
    const fld = this.getField(field)
    const oprs: Operator[] = []
    this.props.operators.forEach((op) => {
      if (op.dataTypes.indexOf(fld.dataType) >= 0) {
        oprs.push(op)
      }
    }, this)

    return oprs
  }

  onPropChange = (prop: string, value: any, ruleId: any) => {
    const currentFilter = this.state.currentFilter
    const rule = this.findRule(ruleId, currentFilter.filter)
    if (prop === 'not') {
      prop = 'condition'
      if (rule.condition.indexOf('and') >= 0) {
        value = ltrim(value + ' and')
      } else {
        value = ltrim(value + ' or')
      }
    } else if (prop === 'condition') {
      if (rule.condition.indexOf('not') >= 0) {
        value = 'not ' + value
      }
    }
    Object.assign(rule, { [prop]: value })
    this.setState({ ...this.state, currentFilter })
  }

  getLevel = (id: number) => {
    return this.getLevel2(id, 0, this.state.currentFilter.filter)
  }

  getLevel2 = (id: any, index: number, root: any) => {
    const { isRuleGroup } = this.state.schema

    var foundAtIndex = -1
    if (root.id === id) {
      foundAtIndex = index
    } else if (isRuleGroup(root)) {
      root.rules.forEach((rule: any) => {
        if (foundAtIndex === -1) {
          let indexForRule = index
          if (isRuleGroup(rule)) indexForRule++
          foundAtIndex = this.getLevel2(id, indexForRule, rule)
        }
      })
    }
    return foundAtIndex
  }

  findRule = (id: string, parent: { id: any; rules: any }) => {
    if (parent.id === id) {
      return parent
    }

    for (const rule of parent.rules) {
      if (rule.id === id) {
        return rule
      }
    }
  }

  notifyQueryChange = (fn: Function, ...args: any[]) => {
    if (fn) {
      fn.call(this, ...args)
    }
    const { onFilterChanged } = this.props
    if (onFilterChanged) {
      onFilterChanged(this.state.currentFilter, this.state.activeFilterIndex!)
    }
  }

  onSelectListItem = (index: any, _item: any) => {
    const currentFilter = this.state.currentFilter
    currentFilter.sort.activeIndex = index
    this.setState({ ...this.state, currentFilter })
    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(currentFilter, this.state.activeFilterIndex!)
    }
  }

  onOperatorChanged = (rule: { id: any }, value: any) => {
    this.onElementChanged('operator', value, rule.id)
    this.onElementChanged('value', '', rule.id)
    this.onElementChanged('value2', '', rule.id)
  }

  onDisabledChanged = (_value: any, checked: any, rule: { id: any }, id: string) => {
    this.onElementChanged('disabled', !checked, rule.id)
    const element: HTMLElement | null = document.getElementById(id)
  }

  onValueChanged = (
    rule: { id?: any; field?: any; operator?: any },
    value: any | { toString: () => any }[]
  ) => {
    const { field, operator } = rule
    const {
      schema: { fields }
    } = this.state
    const dt = this.getDataType(field, fields)
    if (operator === 'between' && (dt === 'date' || dt === 'date_time' || dt === 'time')) {
      if (value.length > 1) {
        this.onElementChanged('value', value[0].toString(), rule.id)
        this.onElementChanged('value2', value[1].toString(), rule.id)
      } else {
        this.onElementChanged('value', '', rule.id)
        this.onElementChanged('value2', '', rule.id)
      }
    } else if (
      (operator === 'inList' || operator === 'notInList') &&
      (dt === 'date' || dt === 'date_time' || dt === 'time')
    ) {
      if (!value) {
        value = ''
      }
      this.onElementChanged('value', value, rule.id)
    } else if (operator === 'inList' || operator === 'notInList') {
      if (!value) {
        value = ''
      }
      const values = value.split(',')
      if (values.length > 0) {
        let appendDelimiter = false
        let result = ''
        values.forEach((v: string) => {
          if (appendDelimiter) {
            result += ','
          }
          if (dt === 'number' || dt === 'integer') {
            result += v
          } else {
            result += "'" + v + "'"
          }
          appendDelimiter = true
        })
        this.onElementChanged('value', result, rule.id)
      }
    } else {
      this.onElementChanged('value', value, rule.id)
    }
  }

  onValue2Changed = (rule: { id: any }, value: any) => {
    this.onElementChanged('value2', value, rule.id)
  }

  onElementChanged = (property: string, value: string | boolean, id: any) => {
    const {
      schema: { onPropChange }
    } = this.state
    onPropChange(property, value, id)
  }

  getFieldValues = (field: any, fields: Field[] | any[]) => {
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].name === field) {
        return fields[i].listValues
      }
    }
    return []
  }

  getColor = (color: string) => {
    return this.props.theme!.colors[color][this.props.colorScheme === 'dark' ? 5 : 7]
  }

  createFilterFields = (props, schema: Schema, currentFilter: ArchbaseQueryFilter): ReactNode[] => {
    const { operators } = schema
    const result: ReactNode[] = []
    const arrChildren = props.fields
    arrChildren.forEach((child, index) => {
      const listValues = this.getFieldValues(child.name, props.fields)
      let rule = this.findRule(`r-${child.name}`, currentFilter.filter)
      if (!rule) {
        rule = {
          id: `r-${child.name}`,
          field: child.name,
          fieldSql: child.nameSql,
          dataType: child.dataType,
          expanded: false,
          value: '',
          value2: '',
          disabled: child.disabled,
          operator: child.operator ? child.operator : operators[0].name
        }
        currentFilter.filter.rules.push(rule)
      }
      let textValue = rule.value && rule.value !== '' ? rule.value : null
      textValue = rule.value2 && rule.value2 !== '' ? `${textValue} a ${rule.value2}` : textValue
      result.push(
        <AccordionItem
          uuid={this.prefixId + '_' + index}
          id={this.prefixId + '_' + index}
          key={'flk' + index}
          dangerouslySetExpanded={!rule.disabled}
        >
          <AccordionItemHeading
            className={rule.disabled === true ? 'simple-filter-disabled' : 'simple-filter-enabled'}
          >
            <AccordionItemButton
              className={
                rule.disabled === true
                  ? 'accordion__button simple-filter-disabled'
                  : 'accordion__button simple-filter-enabled'
              }
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={!rule.disabled}
                  width="24px"
                  style={{ margin: 0, cursor: 'pointer' }}
                  onChange={(event) =>
                    this.onDisabledChanged(
                      event.currentTarget.checked,
                      event.currentTarget.checked,
                      rule,
                      this.prefixId + '_' + index
                    )
                  }
                />
                <Space w={'sm'}></Space>
                <Text c={this.props.colorScheme === 'dark' ? 'white' : 'black'}>
                  {t(child.label)}
                </Text>
                <SimpleValueSelector
                  field={child.name}
                  options={this.getOperators(child.name)}
                  value={rule.operator}
                  className="custom-select-operator"
                  style={{
                    color: this.props.theme!.colors.blue[5],
                    backgroundColor: 'transparent'
                  }}
                  disabled={true}
                  handleOnChange={(value) => this.onOperatorChanged(rule, value)}
                  level={0}
                />
                <Text style={{ fontSize: '12px' }} c="blue">
                  {textValue}
                </Text>
              </div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel
            className={rule.disabled === true ? 'simple-filter-disabled' : 'simple-filter-enabled'}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <SimpleValueSelector
                field={child.name}
                options={this.getOperators(child.name)}
                value={rule.operator}
                className="custom-select-operator"
                style={{
                  color: this.props.colorScheme === 'dark' ? 'white' : 'black'
                }}
                disabled={child.disabled}
                handleOnChange={(value) => this.onOperatorChanged(rule, value)}
                level={0}
              />
              <SimpleValueEditor
                key={'svf1_' + index}
                field={child.name}
                dataType={child.dataType!}
                operator={rule.operator}
                value={rule.value}
                value2={rule.value2}
                listValues={listValues}
                searchField={child.searchField}
                disabled={rule.disabled}
                className="rule-value"
                handleOnChange={(value) => this.onValueChanged(rule, value)}
                onSearchButtonClick={props.onSearchButtonClick}
                searchComponent={child.searchComponent}
                level={0}
              />{' '}
              {rule.operator === 'between' &&
              rule.dataType !== 'date' &&
              rule.dataType !== 'date_time' &&
              rule.dataType !== 'time' ? (
                <SimpleValueEditor
                  key={'svf2_' + index}
                  field={child.name}
                  dataType={rule.dataType}
                  operator={rule.operator}
                  value={rule.value2}
                  listValues={listValues}
                  searchField={child.searchField}
                  disabled={rule.disabled}
                  className="rule-value"
                  handleOnChange={(value) => this.onValue2Changed(rule, value)}
                  onSearchButtonClick={props.onSearchButtonClick}
                  searchComponent={child.searchComponent}
                  level={0}
                />
              ) : (
                ''
              )}
            </div>
          </AccordionItemPanel>
        </AccordionItem>
      )
    })

    result.sort((a: any, b: any) => {
      if (a.props.disabled && b.props.disabled) {
        return 0
      } else if (a.props.disabled) {
        return -1
      }
      return 1
    })

    if (this.props.allowSort === true) {
      result.push(
        <AccordionItem uuid={this.prefixId + '_' + 9999} key={'flk' + 9999}>
          <AccordionItemHeading>
            <AccordionItemButton>
              <div
                style={{
                  fontWeight: 'bold',
                  color: '#3d3d69',
                  marginTop: '10px',
                  display: 'flex',
                  padding: '4px'
                }}
              >
                <IconFilterSearch size={30} color={this.getColor('green')} />
                <Space w="md" />
                {'Ordenação'}
                <Space w="md" />
                <Text
                  key={'txto_' + 9999}
                  truncate
                  c="blue"
                  style={{
                    wordBreak: 'break-word',
                    display: 'block',
                    wordWrap: 'break-word',
                    width: '100%',
                    whiteSpace: 'normal',
                    fontSize: '12px'
                  }}
                >
                  {getSortString(currentFilter)}
                </Text>
                <AccordionItemState>
                  {({ expanded }) => (expanded ? <IconChevronUp /> : <IconChevronDown />)}
                </AccordionItemState>
              </div>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Grid>
              <Grid.Col span={12} style={{ padding: 13 }}>
                <div
                  style={{
                    height: 'auto'
                  }}
                >
                  <Card withBorder shadow="sm" radius="md">
                    <Card.Section withBorder inheritPadding py="xs">
                      <Group>
                        <Tooltip withinPortal withArrow label="Para baixo">
                          <ActionIcon id="btnFilterSortDown" onClick={this.onSortDown}>
                            <IconArrowDown />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip withinPortal withArrow label="Para cima">
                          <ActionIcon id="btnFilterSortUp" onClick={this.onSortUp}>
                            <IconArrowUp />
                          </ActionIcon>
                        </Tooltip>
                        <Text>{'Ordenação'}</Text>
                      </Group>
                    </Card.Section>
                    <ArchbaseList
                      height="100%"
                      width="100%"
                      withBorder={false}
                      dataSource={
                        new ArchbaseDataSource('dsSortFields', {
                          records: currentFilter.sort.sortFields,
                          grandTotalRecords: currentFilter.sort.sortFields.length,
                          currentPage: 0,
                          totalPages: 0,
                          pageSize: 999999
                        })
                      }
                      dataFieldId="name"
                      dataFieldText="name"
                      activeIndex={currentFilter.sort.activeIndex}
                      component={{
                        type: CustomSortItem,
                        props: {
                          sortFocused: this.props.sortFocused,
                          onChangeSortItem: this.onChangeSortItem,
                          onSelectListItem: this.onSelectListItem
                        }
                      }}
                    />
                  </Card>
                </div>
              </Grid.Col>
            </Grid>
          </AccordionItemPanel>
        </AccordionItem>
      )
    }

    return result
  }

  render = () => {
    const items: ReactNode[] = []
    const preExpandedItems: string[] = []
    this.state.simpleFields.forEach((item: any) => {
      if (item.props.dangerouslySetExpanded && item.props.uuid !== this.prefixId + '_' + 9999) {
        items.push(item)
        preExpandedItems.push(item.props.uuid)
      }
    })
    this.state.simpleFields.forEach((item: any) => {
      if (item.props.uuid === this.prefixId + '_' + 9999) {
        items.push(item)
        preExpandedItems.push(item.props.uuid)
      }
    })
    this.state.simpleFields.forEach((item: any) => {
      if (!item.props.dangerouslySetExpanded && item.props.uuid !== this.prefixId + '_' + 9999) {
        items.push(item)
      }
    })

    return (
      <Fragment>
        <Accordion
          allowZeroExpanded={true}
          allowMultipleExpanded={true}
          preExpanded={preExpandedItems}
          id="acc1"
        >
          {items}
        </Accordion>
      </Fragment>
    )
  }
}

// ArchbaseSimpleFilter.contextType = ArchbaseAppContext

interface SimpleValueEditorProps {
  field: string
  operator: string
  value: string
  value2?: string
  handleOnChange: (value: any) => void
  searchField?: string
  twoFields?: boolean
  disabled?: boolean
  dataType?: DataType
  listValues?: string[]
  className?: string
  searchComponent?: ReactNode
  level?: number
  onSearchButtonClick?: (
    field: string,
    event: React.MouseEvent | undefined | null,
    handleOnChange: (value: any) => void,
    operator: string,
    searchField?: string
  ) => void
}

class SimpleValueEditor extends React.Component<SimpleValueEditorProps> {
  constructor(props: SimpleValueEditorProps) {
    super(props)
  }

  static get componentName() {
    return 'ValueEditor'
  }

  onButtonClick = (event?: React.MouseEvent<Element, MouseEvent>) => {
    if (this.props.onSearchButtonClick) {
      this.props.onSearchButtonClick(
        this.props.field,
        event,
        this.props.handleOnChange,
        this.props.operator,
        this.props.searchField
      )
    }
  }

  convertValueCombobox = (value: string, dataType: string): any => {
    if (!value || value.length === 0) {
      return value
    }
    if (dataType === 'string') {
      const result: any[] = value.split(',')
      const _value: string[] = []
      if (result.length > 0) {
        result.forEach((item) => {
          return _value.push(item.replaceAll("'", ''))
        })
        return _value
      }
    } else {
      return value.split(',')
    }
    return value
  }

  render = () => {
    const {
      disabled,
      dataType,
      operator,
      value,
      value2,
      listValues,
      searchComponent,
      handleOnChange
    } = this.props
    let newValue: any = value === null || value === undefined ? '' : value
    let newValue2: any = value2 === null || value === undefined ? '' : value2

    if (operator === 'null' || operator === 'notNull') {
      return null
    }

    if (dataType) {
      if (dataType === 'date') {
        if (operator === 'between') {
          if (newValue === '' && newValue2 === '') newValue = ''
          else newValue = [newValue, newValue2]
          return (
            <DatePickerInput
              type="range"
              disabled={disabled}
              value={newValue}
              style={{ width: '100%' }}
              onChange={(value: DatesRangeValue) => handleOnChange(value)}
            />
          )
        } else if (operator === 'notInList' || operator === 'inList') {
          return (
            <DatePickerInput
              type="multiple"
              disabled={disabled}
              value={newValue}
              style={{ width: '100%' }}
              onChange={(value: DateValue[]) => handleOnChange(value)}
            />
          )
        } else {
          return (
            <DatePickerInput
              disabled={disabled}
              value={newValue}
              style={{ width: '100%' }}
              onChange={(value: DateValue) => handleOnChange(value)}
            />
          )
        }
      } else if (dataType === 'date_time') {
        if (operator === 'between') {
          if (newValue === '' && newValue2 === '') newValue = ''
          else newValue = [newValue, newValue2]
          return (
            <ArchbaseDateTimePickerRange
              disabled={disabled}
              value={newValue}
              width="100%"
              onSelectDateRange={(value: DateValue[]) => handleOnChange(value)}
            />
          )
        } else {
          return (
            <ArchbaseDateTimePickerEdit
              disabled={disabled}
              value={newValue}
              width="100%"
              onChange={(value: any) => handleOnChange(value)}
            />
          )
        }
      } else if (dataType === 'time') {
        if (newValue === '' && newValue2 === '') newValue = ''
        else newValue = newValue + ' - ' + newValue2
        return (
          <TimeInput
            disabled={disabled}
            style={{ width: '100%' }}
            value={newValue}
            onChange={(value: any) => handleOnChange(value)}
          />
        )
      } else if (dataType === 'boolean') {
        return (
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Switch
              checked={newValue}
              onChange={(event) => handleOnChange(event.currentTarget.checked)}
            />
          </div>
        )
      } else {
        if (
          listValues &&
          listValues.length > 0 &&
          (operator === 'notInList' || operator === 'inList')
        ) {
          const _value = this.convertValueCombobox(newValue, dataType)
          return (
            <MultiSelect
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={(value: string[]) => handleOnChange(value)}
              value={_value}
              data={listValues}
            />
          )
        } else if (listValues && listValues.length > 0) {
          return (
            <ArchbaseSelect
              disabled={disabled}
              width={'100%'}
              value={newValue}
              onSelectValue={(value: any) => handleOnChange(value)}
              getOptionLabel={(option) => option}
              getOptionValue={(option) => option}
            >
              {listValues.map((v: any) => {
                return (
                  <ArchbaseSelectItem
                    label={v.label}
                    value={v.value}
                    key={v.value}
                    disabled={false}
                  />
                )
              })}
            </ArchbaseSelect>
          )
        } else {
          return (
            <DebouncedTextInput
              onChange={(value) => handleOnChange(value)}
              disabled={disabled}
              initialValue={newValue}
              icon={searchComponent ? searchComponent : <IconSearch size="1rem" />}
              onActionSearchExecute={() => this.onButtonClick()}
              style={{
                height: '36px',
                width: '100%',
                paddingLeft: '3px'
              }}
              label={undefined}
              error={undefined}
              keyProp={undefined}
              readOnly={false}
              placeholder={undefined}
              innerRef={undefined}
              onFocus={undefined}
              onKeyDown={undefined}
            />
          )
        }
      }
    } else {
      return (
        <DebouncedTextInput
			onChange={(value) => handleOnChange(value)}
			disabled={disabled}
			initialValue={newValue}
			style={{
				height: '36px',
				width: '100%',
				paddingLeft: '3px'
			}}
			label={undefined}
			error={undefined}
			keyProp={undefined}
			readOnly={false}
			placeholder={undefined}
			innerRef={undefined}
			onFocus={undefined}
			onKeyDown={undefined} 
			onActionSearchExecute={undefined} 
			icon={undefined}/>
      )
    }
  }
}

interface OptionItem {
  name: string
  label: string
}

interface SimpleValueSelectorProps {
  value: string
  field: string
  options: OptionItem[]
  className?: string
  handleOnChange: (value: any) => void
  width?: string
  disabled?: boolean
  level: number
  style?: CSSProperties
}

interface SimpleValueEditorState {
  width?: string
  value?: string
}

class SimpleValueSelector extends React.Component<
  SimpleValueSelectorProps,
  SimpleValueEditorState
> {
  static get componentName() {
    return 'ValueSelector'
  }

  constructor(props: SimpleValueSelectorProps) {
    super(props)
    const wdt =
      props.options && props.options.length > 0 && props.options[0]
        ? this.getTextWidth(props.options[0].name)
        : '100px'
    this.state = { width: wdt, value: undefined }
  }

  getLabelByName = (name: string) => {
    return this.props.options.map((opt: OptionItem) => {
      if (opt.name === name) {
        return opt.label
      }
      return undefined
    })
  }

  getTextWidth = (txt: string) => {
    const text: any = document.createElement('span')
    document.body.appendChild(text)

    text.className = this.props.className
    text.innerHTML = this.getLabelByName(txt)

    const width = Math.ceil(text.offsetWidth) + 4
    const formattedWidth = width + 'px'

    document.body.removeChild(text)

    return formattedWidth
  }

  handleOnChange = (event: { target: { value: string } }) => {
    if (this.props.handleOnChange) {
      this.props.handleOnChange(event.target.value)
    }
    const width = this.getTextWidth(event.target.value)
    this.setState({ ...this.state, value: event.target.value, width })
  }

  render = () => {
    const { value, options, className, disabled, style } = this.props

    return (
      <select
        className={className}
        disabled={disabled}
        value={value}
        tabIndex={-1}
        style={{ ...style, width: this.state.width }}
        onChange={this.handleOnChange}
      >
        {options.map((option) => {
          return (
            <option key={option.name} value={option.name}>
              {option.label}
            </option>
          )
        })}
      </select>
    )
  }
}

export { ArchbaseSimpleFilter }
