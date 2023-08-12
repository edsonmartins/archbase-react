/* eslint-disable no-lone-blocks */
import React, { Component, Fragment, ReactNode } from 'react';
import { CustomSortItem } from './ArchbaseAdvancedFilter';
import {
  getDefaultEmptyFilter,
  defaultConditions,
  defaultOperators,
  DataType,
  Operator,
  Field,
  SelectedSort,
} from './ArchbaseFilterCommons';
import shallowCompare from 'react-addons-shallow-compare';

import { ltrim } from '@components/core/utils';
import { ArchbaseCheckbox, ArchbaseEdit, ArchbaseSelect, ArchbaseSelectItem } from '@components/editors';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { ArchbaseList } from '@components/list';
import { ArchbaseDataSource } from '@components/datasource';
import { DatePickerInput, DateValue, DatesRangeValue, TimeInput } from '@mantine/dates';
import { Accordion, ActionIcon, MultiSelect, Switch, Text, Tooltip } from '@mantine/core';
import { ArchbaseCol, ArchbaseRow } from '@components/containers/gridLayout';
import { ArchbaseDateTimerPickerRange } from '@components/editors/ArchbaseDateTimePickerRange';
import { ArchbaseDateTimePickerEdit } from '@components/editors/ArchbaseDateTimePickerEdit';

const rnd = (() => {
  const gen = (min: number, max: number) => max++ && [...Array(max - min)].map((_s, i) => String.fromCharCode(min + i));

  const sets = {
    num: gen(48, 57),
    alphaLower: gen(97, 122),
    alphaUpper: gen(65, 90),
    special: [...`~!@#$%^&*()_+-=[]\{}|;:'",./<>?`],
  };

  function* iter(len: number, set: string | any[]) {
    if (set.length < 1) set = Object.values(sets).flat();
    for (let i = 0; i < len; i++) yield set[(Math.random() * set.length) | 0];
  }

  return Object.assign((len: any, ...set: any[]) => [...iter(len, set.flat())].join(''), sets);
})();

export interface Condition {
  name: string;
  label: string;
}

export interface Schema {
  fields: Field[];
  conditions: Condition[];
  operators: Operator[];
  onPropChange: (prop: any, value: any, ruleId: any) => void;
  getLevel: (id: any) => number;
  isRuleGroup: (rule: any) => boolean;
  getOperators: (...args: any) => Operator[];
}

export interface ArchbaseSimpleFilterProps {
  currentFilter?: any;
  operators: any[];
  onFilterChanged?: (filter: any, index: number) => void;
  onError?: (error: any) => void;
  fields: any[];
  conditions: any[];
  activeFilterIndex?: number;
  allowSort?: boolean;
  sortFocused?: boolean;
  onSearchButtonClick?: (field: string, event?: any, handleOnChange?: any, operator?: any, searchField?: any) => void;
  update?: number;
}

export interface ArchbaseSimpleFilterState {
  currentFilter: any;
  update: number;
  activeFilterIndex?: number;
  simpleFields: ReactNode[];
  schema: Schema;
}

class ArchbaseSimpleFilter extends Component<ArchbaseSimpleFilterProps, ArchbaseSimpleFilterState> {
  static defaultProps = {
    operators: defaultOperators(),
    conditions: defaultConditions(),
    onFilterChanged: null,
    onError: null,
  };

  private prefixId: string;
  constructor(props: ArchbaseSimpleFilterProps) {
    super(props);
    this.prefixId = rnd(12, rnd.alphaLower);
    let schema = this.createSchema();
    let currentFilter = props.currentFilter ? props.currentFilter : getDefaultEmptyFilter();
    let activeFilterIndex = props.currentFilter ? props.activeFilterIndex : 0;

    let simpleFields = this.createFilterFields(props, schema, currentFilter);
    this.state = {
      simpleFields,
      currentFilter,
      schema,
      update: Math.random(),
      activeFilterIndex,
    };
  }

  shouldComponentUpdate = (nextProps: ArchbaseSimpleFilterProps, nextState: ArchbaseSimpleFilterState) => {
    return shallowCompare(this, nextProps, nextState);
  };

  componentWillReceiveProps = (nextProps: ArchbaseSimpleFilterProps) => {
    let schema = this.createSchema();
    let currentFilter = nextProps.currentFilter ? nextProps.currentFilter : getDefaultEmptyFilter();
    let activeFilterIndex = nextProps.currentFilter ? nextProps.activeFilterIndex : 0;
    let simpleFields = this.createFilterFields(nextProps, schema, currentFilter);
    this.setState({
      ...this.state,
      simpleFields,
      currentFilter,
      activeFilterIndex,
      schema,
      update: Math.random(),
    });
  };

  createSchema = (): Schema => {
    const { operators, conditions, fields } = this.props;
    return {
      fields: fields,
      operators,
      conditions,
      onPropChange: this._notifyQueryChange.bind(this, this.onPropChange),
      getLevel: this.getLevel.bind(this),
      isRuleGroup: this.isRuleGroup.bind(this),
      getOperators: (...args) => this.getOperators(args),
    };
  };

  getDataType = (field: any, fields: string | any[]) => {
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].name === field) {
        return fields[i].dataType;
      }
    }
  };

  getSelectedSort = (): SelectedSort[] => {
    let result: SelectedSort[] = [];
    this.state.currentFilter.sort.sortFields.forEach(function (item: { selected: any; name: any; asc_desc: any }) {
      if (item.selected) {
        result.push({ name: item.name, asc_desc: item.asc_desc });
      }
    });
    return result;
  };

  getSortItem = (field: any) => {
    let result: any;
    this.state.currentFilter.sort.sortFields.forEach(function (item: { name: any }) {
      if (item.name === field) {
        result = item;
      }
    });
    return result;
  };

  getSortItemByOrder = (order: number) => {
    let result: any;
    this.state.currentFilter.sort.sortFields.forEach(function (item: { order: any }) {
      if (item.order === order) {
        result = item;
      }
    });
    return result;
  };

  onChangeSortItem = (field: any, selected: any, order: any, asc_desc: any) => {
    let item = this.getSortItem(field);
    Object.assign(item, {
      selected: selected,
      order: order,
      asc_desc: asc_desc,
      label: item.label,
    });
    let sortFields = this.state.currentFilter.sort.sortFields;
    sortFields = sortFields.sort(function (a: { order: number }, b: { order: number }) {
      return a.order - b.order;
    });
    let currentFilter = this.state.currentFilter;
    currentFilter.sort.sortFields = sortFields;
    this.setState(
      {
        ...this.state,
        update: Math.random(),
        currentFilter,
      },
      () => {
        this.propagateFilterChanged();
      },
    );
  };

  propagateFilterChanged = () => {
    const { onFilterChanged } = this.props;
    if (onFilterChanged) {
      onFilterChanged(this.state.currentFilter, this.state.activeFilterIndex!);
    }
  };

  onSortDown = (_event: any) => {
    let _this = this;
    let activeIndex = this.state.currentFilter.sort.activeIndex;
    if (activeIndex >= 0) {
      let item = this.state.currentFilter.sort.sortFields[activeIndex];
      if (item.order < this.state.currentFilter.sort.sortFields.length - 1) {
        activeIndex = item.order + 1;
        let nextItem = this.getSortItemByOrder(item.order + 1);
        Object.assign(item, {
          order: item.order + 1,
        });
        Object.assign(nextItem, {
          order: nextItem.order - 1,
        });
      }
      let sortFields = this.state.currentFilter.sort.sortFields;
      sortFields = sortFields.sort(function (a: { order: number }, b: { order: number }) {
        return a.order - b.order;
      });
      let currentFilter = this.state.currentFilter;
      currentFilter.sort.sortFields = sortFields;
      currentFilter.sort.activeIndex = activeIndex;
      this.setState(
        {
          ...this.state,
          currentFilter,
        },
        () => {
          _this.propagateFilterChanged();
        },
      );
    }
  };

  onSortUp = (_event: any) => {
    let _this = this;
    let { currentFilter } = this.state;
    let activeIndex = currentFilter.sort.activeIndex;
    if (activeIndex >= 0) {
      let item = currentFilter.sort.sortFields[activeIndex];
      if (item.order > 0) {
        activeIndex = item.order - 1;
        let previousItem = this.getSortItemByOrder(item.order - 1);
        Object.assign(item, {
          order: item.order - 1,
        });
        Object.assign(previousItem, {
          order: previousItem.order + 1,
        });
      }
      let sortFields = currentFilter.sort.sortFields;
      sortFields = sortFields.sort(function (a: { order: number }, b: { order: number }) {
        return a.order - b.order;
      });
      currentFilter.sort.sortFields = sortFields;
      currentFilter.sort.activeIndex = activeIndex;
      this.setState(
        {
          ...this.state,
          currentFilter,
        },
        () => {
          _this.propagateFilterChanged();
        },
      );
    }
  };

  isRuleGroup = (rule: { condition: any; rules: any }) => {
    return !!(rule.condition && rule.rules);
  };

  getField = (name: string) => {
    let result: any;
    this.props.fields.forEach((field) => {
      if (field.name === name) {
        result = field;
      }
    }, this);
    return result;
  };

  getOperators = (field: string): Operator[] => {
    let fld = this.getField(field);
    let oprs: Operator[] = [];
    this.props.operators.forEach((op) => {
      if (op.dataTypes.indexOf(fld.dataType) >= 0) {
        oprs.push(op);
      }
    }, this);

    return oprs;
  };

  onPropChange = (prop: string, value: any, ruleId: any) => {
    let currentFilter = this.state.currentFilter;
    const rule = this._findRule(ruleId, currentFilter.filter);
    if (prop === 'not') {
      prop = 'condition';
      if (rule.condition.indexOf('and') >= 0) {
        value = ltrim(value + ' and');
      } else {
        value = ltrim(value + ' or');
      }
    } else if (prop === 'condition') {
      if (rule.condition.indexOf('not') >= 0) {
        value = 'not ' + value;
      }
    }
    Object.assign(rule, { [prop]: value });
    this.setState({ ...this.state, currentFilter });
  };

  getLevel = (id: number) => {
    return this._getLevel(id, 0, this.state.currentFilter.filter);
  };

  _getLevel = (id: any, index: number, root: any) => {
    const { isRuleGroup } = this.state.schema;

    var foundAtIndex = -1;
    if (root.id === id) {
      foundAtIndex = index;
    } else if (isRuleGroup(root)) {
      root.rules.forEach((rule: any) => {
        if (foundAtIndex === -1) {
          var indexForRule = index;
          if (isRuleGroup(rule)) indexForRule++;
          foundAtIndex = this._getLevel(id, indexForRule, rule);
        }
      });
    }
    return foundAtIndex;
  };

  _findRule = (id: string, parent: { id: any; rules: any }) => {
    if (parent.id === id) {
      return parent;
    }

    for (const rule of parent.rules) {
      if (rule.id === id) {
        return rule;
      }
    }
  };

  _notifyQueryChange = (fn: Function, ...args: any[]) => {
    if (fn) {
      fn.call(this, ...args);
    }
    const { onFilterChanged } = this.props;
    if (onFilterChanged) {
      onFilterChanged(this.state.currentFilter, this.state.activeFilterIndex!);
    }
  };

  onSelectListItem = (index: any, _item: any) => {
    let currentFilter = this.state.currentFilter;
    currentFilter.sort.activeIndex = index;
    this.setState({ ...this.state, currentFilter });
    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(currentFilter, this.state.activeFilterIndex!);
    }
  };

  onOperatorChanged = (rule: { id: any }, value: any) => {
    this.onElementChanged('operator', value, rule.id);
    this.onElementChanged('value', '', rule.id);
    this.onElementChanged('value2', '', rule.id);
  };

  onDisabledChanged = (_value: any, checked: any, rule: { id: any }, id: string) => {
    this.onElementChanged('disabled', !checked, rule.id);
    const element: HTMLElement | null = document.getElementById(id);
    if (element) {
      //VER AQUI DEPOIS window.$(`#${id}`).collapse();
    }
  };

  onValueChanged = (rule: { id?: any; field?: any; operator?: any }, value: any | { toString: () => any }[]) => {
    const { field, operator } = rule;
    const {
      schema: { fields },
    } = this.state;
    let dt = this.getDataType(field, fields);
    if (operator === 'between' && (dt === 'date' || dt === 'date_time' || dt === 'time')) {
      if (value.length > 1) {
        this.onElementChanged('value', value[0].toString(), rule.id);
        this.onElementChanged('value2', value[1].toString(), rule.id);
      } else {
        this.onElementChanged('value', '', rule.id);
        this.onElementChanged('value2', '', rule.id);
      }
    } else if (
      (operator === 'inList' || operator === 'notInList') &&
      (dt === 'date' || dt === 'date_time' || dt === 'time')
    ) {
      if (!value) {
        value = '';
      }
      this.onElementChanged('value', value, rule.id);
    } else if (operator === 'inList' || operator === 'notInList') {
      if (!value) {
        value = '';
      }
      let values = value.split(',');
      if (values.length > 0) {
        let appendDelimiter = false;
        let result = '';
        values.forEach((v: string) => {
          if (appendDelimiter) {
            result += ',';
          }
          if (dt === 'number' || dt === 'integer') {
            result += v;
          } else {
            result += "'" + v + "'";
          }
          appendDelimiter = true;
        });
        this.onElementChanged('value', result, rule.id);
      }
    } else {
      this.onElementChanged('value', value, rule.id);
    }
  };

  onValue2Changed = (rule: { id: any }, value: any) => {
    this.onElementChanged('value2', value, rule.id);
  };

  onElementChanged = (property: string, value: string | boolean, id: any) => {
    const {
      schema: { onPropChange },
    } = this.state;
    onPropChange(property, value, id);
  };

  getFieldValues = (field: any, fields: Field[] | any[]) => {
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].name === field) {
        return fields[i].listValues;
      }
    }
    return [];
  };

  getSortString = (currentFilter: { sort: { sortFields: any[] } }): string | undefined => {
    let result: string = '';
    let appendDelimiter = false;
    currentFilter.sort.sortFields.forEach((field: { selected: any; label: string | number; asc_desc: string }) => {
      if (field.selected) {
        if (appendDelimiter) {
          result += ', ';
        }
        result = result + field.label + '(' + (field.asc_desc === 'asc' ? 'A' : 'D') + ')';
        appendDelimiter = true;
      }
    });
    return result;
  };

  createFilterFields = (props, schema: Schema, currentFilter): ReactNode[] => {
    const { operators } = schema;
    let _this = this;
    let result: ReactNode[] = [];
    let arrChildren = props.fields;
    arrChildren.forEach((child, index) => {
      let listValues = _this.getFieldValues(child.name, props.fields);
      let rule = _this._findRule(`r-${child.name}`, currentFilter.filter);
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
          operator: child.operator ? child.operator : operators[0].name,
        };
        currentFilter.filter.rules.push(rule);
      }
      let textValue = rule.value && rule.value !== '' ? rule.value : null;
      textValue = rule.value2 && rule.value2 !== '' ? `${textValue} a ${rule.value2}` : textValue;
      result.push(
        <Accordion.Item
          value={_this.prefixId + '_' + index}
          key={'flk' + index}
          //VER AQUI DEPOIS disabled={rule.disabled!}
        >
          <Accordion.Control className={rule.disabled === true ? 'simple-filter-disabled' : 'simple-filter-enabled'}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ArchbaseCheckbox
                isChecked={!rule.disabled}
                width="24px"
                style={{ margin: 0 }}
                onChangeValue={(value: any, _event: any) =>
                  _this.onDisabledChanged(value, value === true, rule, _this.prefixId + '_' + index)
                }
              />
              {child.label}
              <SimpleValueSelector
                field={child.name}
                options={_this.getOperators(child.name)}
                value={rule.operator}
                className="custom-select-operator"
                disabled={true}
                handleOnChange={(value) => _this.onOperatorChanged(rule, value)}
                level={0}
              />
              <Text style={{ fontSize: '12px' }} color="blue">
                {textValue}
              </Text>
            </div>
          </Accordion.Control>
          <Accordion.Panel className={rule.disabled === true ? 'simple-filter-disabled' : 'simple-filter-enabled'}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <SimpleValueSelector
                field={child.name}
                options={_this.getOperators(child.name)}
                value={rule.operator}
                className="custom-select-operator"
                disabled={child.disabled}
                handleOnChange={(value) => _this.onOperatorChanged(rule, value)}
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
                handleOnChange={(value) => _this.onValueChanged(rule, value)}
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
                  handleOnChange={(value) => _this.onValue2Changed(rule, value)}
                  onSearchButtonClick={props.onSearchButtonClick}
                  searchComponent={child.searchComponent}
                  level={0}
                />
              ) : (
                ''
              )}
            </div>
          </Accordion.Panel>
        </Accordion.Item>,
      );
    });

    result.sort((a: any, b: any) => {
      if (a.props.disabled && b.props.disabled) {
        return 0;
      } else if (a.props.disabled) {
        return -1;
      }
      return 1;
    });

    if (this.props.allowSort === true) {
      result.push(
        <Accordion.Item
          value={_this.prefixId + '_' + 9999}
          key={'flk' + 9999}
          //VER DEPOIS label="Ordenação"
          // blockStyle={{ padding: '4px', overflow: 'hidden' }}
          // headerStyle={{ paddingRight: '10px', minHeight: '20px!important' }}
        >
          <Accordion.Control>
            <div style={{ fontWeight: 'bold', color: '#3d3d69' }}>
              {'Ordenação  '}
              <Text
                key={'txto_' + 9999}
                truncate
                color="blue"
                style={{
                  wordBreak: 'break-word',
                  display: 'block',
                  wordWrap: 'break-word',
                  width: '100%',
                  whiteSpace: 'normal',
                  fontSize: '12px',
                }}
              >
                {this.getSortString(currentFilter)}
              </Text>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <ArchbaseRow>
              <ArchbaseCol style={{ padding: 13 }}>
                <div
                  className="sort-group-container"
                  style={{
                    height: 'auto',
                  }}
                >
                  <div className="sort-header">
                    <div>
                      <Tooltip label="Para baixo">
                        <ActionIcon id="btnFilterSortDown" onClick={this.onSortDown}>
                          <IconArrowDown />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Para cima">
                        <ActionIcon id="btnFilterSortUp" onClick={this.onSortUp}>
                          <IconArrowUp />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                    <Text>{'Ordenação'}</Text>
                  </div>
                  <div className="sort-body">
                    <ArchbaseList
                      height="100%"
                      width="100%"
                      dataSource={
                        new ArchbaseDataSource('dsSortFields', {
                          records: this.state.currentFilter.sort.sortFields,
                          grandTotalRecords: this.state.currentFilter.sort.sortFields.length,
                          currentPage: 0,
                          totalPages: 0,
                          pageSize: 999999,
                        })
                      }
                      dataFieldId="name"
                      dataFieldText="name"
                      activeIndex={this.props.currentFilter.sort.activeIndex}
                      component={{
                        type: CustomSortItem,
                        props: {
                          sortFocused: this.props.sortFocused,
                          onChangeSortItem: this.onChangeSortItem,
                          onSelectListItem: this.onSelectListItem,
                        },
                      }}
                    />
                  </div>
                </div>
              </ArchbaseCol>
            </ArchbaseRow>
          </Accordion.Panel>
        </Accordion.Item>,
      );
    }

    return result;
  };

  render = () => {
    let items: ReactNode[] = [];
    let preExpandedItems: string[] = [];
    {
      this.state.simpleFields.forEach((item: any) => {
        if (!item.props.disabled && item.props.label !== 'Ordenação') {
          items.push(item);
          preExpandedItems.push(item.props.value);
        }
      });
    }
    {
      this.state.simpleFields.forEach((item: any) => {
        if (item.props.label === 'Ordenação') {
          items.push(item);
        }
      });
    }
    {
      this.state.simpleFields.forEach((item: any) => {
        if (item.props.disabled && item.props.label !== 'Ordenação') {
          items.push(item);
        }
      });
    }

    return (
      <Fragment>
        <Accordion  multiple={true} value={preExpandedItems} id="acc1">
          {items}
        </Accordion>
      </Fragment>
    );
  };
}

interface SimpleValueEditorProps {
  field: string;
  operator: string;
  value: string;
  value2?: string;
  handleOnChange: (value: any) => void;
  searchField?: string;
  twoFields?: boolean;
  disabled?: boolean;
  dataType?: DataType;
  listValues?: string[];
  className?: string;
  searchComponent?: ReactNode;
  level?: number;
  onSearchButtonClick?: (
    field: string,
    event: React.MouseEvent | undefined | null,
    handleOnChange: (value: any) => void,
    operator: string,
    searchField?: string,
  ) => void;
}

class SimpleValueEditor extends React.Component<SimpleValueEditorProps> {
  constructor(props: SimpleValueEditorProps) {
    super(props);
  }

  static get componentName() {
    return 'ValueEditor';
  }

  onButtonClick = (event?: React.MouseEvent<Element, MouseEvent>) => {
    if (this.props.onSearchButtonClick) {
      this.props.onSearchButtonClick(
        this.props.field,
        event,
        this.props.handleOnChange,
        this.props.operator,
        this.props.searchField,
      );
    }
  };

  convertValueCombobox = (value: string, dataType: string): any => {
    if (!value || value.length === 0) {
      return value;
    }
    if (dataType === 'string') {
      let result: any[] = value.split(',');
      let _value: string[] = [];
      if (result.length > 0) {
        result.forEach((item) => {
          return _value.push(item.replaceAll("'", ''));
        });
        return _value;
      }
    } else {
      return value.split(',');
    }
    return value;
  };

  render = () => {
    const { disabled, dataType, operator, value, value2, listValues, searchComponent, handleOnChange } = this.props;
    let newValue: any = value === null || value === undefined ? '' : value;
    let newValue2: any = value2 === null || value === undefined ? '' : value2;

    if (operator === 'null' || operator === 'notNull') {
      return null;
    }

    if (dataType) {
      if (dataType === 'date') {
        if (operator === 'between') {
          if (newValue === '' && newValue2 === '') newValue = '';
          else newValue = [newValue, newValue2];
          return (
            <DatePickerInput
              type="range"
              disabled={disabled}
              value={newValue}
              style={{ width: '100%' }}
              onChange={(value: DatesRangeValue) => handleOnChange(value)}
            />
          );
        } else if (operator === 'notInList' || operator === 'inList') {
          return (
            <DatePickerInput
              type="multiple"
              disabled={disabled}
              value={newValue}
              style={{ width: '100%' }}
              onChange={(value: DateValue[]) => handleOnChange(value)}
            />
          );
        } else {
          return (
            <DatePickerInput
              disabled={disabled}
              value={newValue}
              style={{ width: '100%' }}
              onChange={(value: DateValue) => handleOnChange(value)}
            />
          );
        }
      } else if (dataType === 'date_time') {
        if (operator === 'between') {
          if (newValue === '' && newValue2 === '') newValue = '';
          else newValue = [newValue, newValue2];
          return (
            <ArchbaseDateTimerPickerRange
              disabled={disabled}
              value={newValue}
              width="100%"
              onSelectDateRange={(value: DateValue[]) => handleOnChange(value)}
            />
          );
        } else {
          return (
            <ArchbaseDateTimePickerEdit
              disabled={disabled}
              value={newValue}
              width="100%"
              onChange={(value: any) => handleOnChange(value)}
            />
          );
        }
      } else if (dataType === 'time') {
        if (newValue === '' && newValue2 === '') newValue = '';
        else newValue = newValue + ' - ' + newValue2;
        return (
          <TimeInput
            disabled={disabled}
            style={{ width: '100%' }}
            value={newValue}
            onChange={(value: any) => handleOnChange(value)}
          />
        );
      } else if (dataType === 'boolean') {
        return (
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Switch checked={newValue} onChange={(event) => handleOnChange(event.currentTarget.checked)} />
          </div>
        );
      } else {
        if (listValues && listValues.length > 0 && (operator === 'notInList' || operator === 'inList')) {
          let _value = this.convertValueCombobox(newValue, dataType);
          return (
            <MultiSelect
              disabled={disabled}
              style={{ width: '100%' }}
              onChange={(value: string[]) => handleOnChange(value)}
              value={_value}
              data={listValues}
            />
          );
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
                return <ArchbaseSelectItem label={v.label} value={v.value} key={v.value} disabled={false} />;
              })}
            </ArchbaseSelect>
          );
        } else {
          return (
            <ArchbaseEdit
              disabled={disabled}
              width={'100%'}
              icon={searchComponent ? searchComponent : null}
              onActionSearchExecute={() => this.onButtonClick()}
              value={newValue}
              onChangeValue={(value: any, _event: any) => handleOnChange(value)}
            />
          );
        }
      }
    } else {
      return (
        <input
          type="text"
          width={this.props.twoFields ? '128px' : '260px'}
          value={newValue}
          onChange={(e) => handleOnChange(e.target.value)}
        />
      );
    }
  };
}

interface OptionItem {
  name: string;
  label: string;
}

interface SimpleValueSelectorProps {
  value: string;
  field: string;
  options: OptionItem[];
  className?: string;
  handleOnChange: (value: any) => void;
  width?: string;
  disabled?: boolean;
  level: number;
}

interface SimpleValueEditorState {
  width?: string;
  value?: string;
}

class SimpleValueSelector extends React.Component<SimpleValueSelectorProps, SimpleValueEditorState> {
  static get componentName() {
    return 'ValueSelector';
  }

  constructor(props: SimpleValueSelectorProps) {
    super(props);
    let wdt =
      props.options && props.options.length > 0 && props.options[0]
        ? this.getTextWidth(props.options[0].name)
        : '100px';
    this.state = { width: wdt, value: undefined };
  }

  getLabelByName = (name: string) => {
    return this.props.options.map((opt: OptionItem) => {
      if (opt.name === name) {
        return opt.label;
      }
      return undefined;
    });
  };

  getTextWidth = (txt: string) => {
    let text: any = document.createElement('span');
    document.body.appendChild(text);

    text.className = this.props.className;
    text.innerHTML = this.getLabelByName(txt);

    let width = Math.ceil(text.offsetWidth) + 4;
    let formattedWidth = width + 'px';

    document.body.removeChild(text);

    return formattedWidth;
  };

  handleOnChange = (event: { target: { value: string } }) => {
    if (this.props.handleOnChange) {
      this.props.handleOnChange(event.target.value);
    }
    let width = this.getTextWidth(event.target.value);
    this.setState({ ...this.state, value: event.target.value, width });
  };

  render() {
    const { value, options, className, disabled } = this.props;

    return (
      <select
        className={className}
        disabled={disabled}
        value={value}
        tabIndex={-1}
        style={{ width: this.state.width }}
        onChange={this.handleOnChange}
      >
        {options.map((option) => {
          return (
            <option key={option.name} value={option.name}>
              {option.label}
            </option>
          );
        })}
      </select>
    );
  }
}

export { ArchbaseSimpleFilter };
