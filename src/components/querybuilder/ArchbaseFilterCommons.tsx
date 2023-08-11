import React, { Component, ReactNode } from 'react';
import { FilterField, FilterFields, FilterFieldValue } from './ArchbaseAdvancedFilter';
import { ArchbaseError } from 'components/core';

const QUICK_FILTER_INDEX = -2;
const NEW_FILTER_INDEX = -1;
const NORMAL = 'normal';
const QUICK = 'quick';
const ADVANCED = 'advanced';
const OP_NULL = 'null';
const OP_NOT_NULL = 'notNull';
const OP_CONTAINS = 'contains';
const OP_STARTSWITH = 'startsWith';
const OP_ENDSWITH = 'endsWith';
const OP_EQUALS = '=';
const OP_NOT_EQUALS = '!=';
const OP_GREATER = '>';
const OP_LESS = '<';
const OP_GREATER_OR_EQUAL = '>=';
const OP_LESS_OR_EQUAL = '<=';
const OP_BETWEEN = 'between';
const OP_IN_LIST = 'inList';
const OP_NOT_IN_LIST = 'notInList';

type FilterType = 'quick' | 'normal' | 'advanced' | undefined;
type PositionType = 'filter' | 'fields' | 'range' | undefined;
type RangeType = 'month' | 'week' | 'range' | 'day' | undefined;
type DataType = 'string' | 'number' | 'date' | 'date_time' | 'time' | 'boolean';

interface Operator {
  name: string;
  label: string;
  dataTypes: DataType[];
}

interface SortField {
  name: string;
  selected: boolean;
  order: number;
  asc_desc: string;
  label: string;
}

interface FilterValue {
  label: string;
  value: string;
}

interface Field {
  name: string;
  label: string;
  dataType: DataType;
  operator: string;
  quickFilter: boolean;
  quickFilterSort: boolean;
  sortable: boolean;
  listValues: FilterValue[];
  searchComponent: ReactNode;
  searchField: any;
  nameSql?: string;
}

interface Filter {
  id: string;
  selectedFields: Field[];
  quickFilterText: string;
  quickFilterFieldsText: string;
  rules: Rule[];
  condition: string;
  filterType: FilterType;
}

interface Sort {
  quickFilterSort: string;
  sortFields: SortField[];
  activeIndex: number;
}

interface ArchbaseQueryFilter {
  id?: number;
  filter: Filter;
  sort: Sort;
  name?: string;
  viewName?: string;
  type?: FilterType;
  apiVersion?: string;
  selectedFields?: Field[];
}

interface ArchbaseQueryFilterState {
  currentFilter: ArchbaseQueryFilter;
  activeFilterIndex: number;
  expandedFilter: boolean;
}

interface Position {
  left?: string | number | undefined;
  top?: string | number | undefined;
  height?: string | number | undefined;
}

interface SelectedSort {
  name: string;
  asc_desc: string;
}

interface Rule {
  id: string;
  parentId?: string | null;
  field?: string | null;
  fieldSql?: string | null;
  dataType?: DataType;
  operator?: string | null;
  value?: string | null;
  value2?: string | null;
  disabled?: boolean;
  rules?: Rule[];
  condition?: string;
}

interface Condition {
  name: string;
  label: string;
}

interface IQueryFilterEntity {
  id?: any;
  companyId?: any;
  filter?: string;
  name?: string;
  viewName?: string;
  componentName?: string;
  userName?: string;
  shared?: boolean;
  code?: string;
  setId: (id: any) => void;
  setCompanyId: (companyId: any) => void;
  setFilter: (filter: string) => void;
  setName: (name: string) => void;
  setViewName: (viewName: string) => void;
  setComponentName: (componentName: string) => void;
  setUserName: (userName: string) => void;
  setShared: (shared: boolean) => void;
  setCode: (code: string) => void;
}

class QueryFilterEntity implements IQueryFilterEntity {
  private _id?: any;
  private _companyId?: any;
  private _filter?: string;
  private _name?: string;
  private _viewName?: string;
  private _componentName?: string;
  private _userName?: string;
  private _shared?: boolean;
  private _code?: string;

  constructor() {
    // Construtor vazio ou com inicializações adicionais
  }

  // Getters
  get id(): any {
    return this._id;
  }

  get companyId(): any {
    return this._companyId;
  }

  get filter(): string | undefined {
    return this._filter;
  }

  get name(): string | undefined {
    return this._name;
  }

  get viewName(): string | undefined {
    return this._viewName;
  }

  get componentName(): string | undefined {
    return this._componentName;
  }

  get userName(): string | undefined {
    return this._userName;
  }

  get isShared(): boolean | undefined {
    return this._shared;
  }

  get code(): string | undefined {
    return this._code;
  }

  setId(id: any): void {
    this._id = id;
  }

  setCompanyId(companyId: any): void {
    this._companyId = companyId;
  }

  setFilter(filter: string): void {
    this._filter = filter;
  }

  setName(name: string): void {
    this._name = name;
  }

  setViewName(viewName: string): void {
    this._viewName = viewName;
  }

  setComponentName(componentName: string): void {
    this._componentName = componentName;
  }

  setUserName(userName: string): void {
    this._userName = userName;
  }

  setShared(shared: boolean): void {
    this._shared = shared;
  }

  setCode(code: string): void {
    this._code = code;
  }

  static createInstance(): QueryFilterEntity {
    return new QueryFilterEntity();
  }

  static createInstanceWithValues(values: Partial<IQueryFilterEntity>): IQueryFilterEntity {
    const instance = new QueryFilterEntity();

    if (values.id !== undefined) {
      instance.setId(values.id);
    }
    if (values.companyId !== undefined) {
      instance.setCompanyId(values.companyId);
    }
    if (typeof values.filter === 'string') {
      instance.setFilter(values.filter);
    }
    if (typeof values.name === 'string') {
      instance.setName(values.name);
    }
    if (typeof values.viewName === 'string') {
      instance.setViewName(values.viewName);
    }
    if (typeof values.componentName === 'string') {
      instance.setComponentName(values.componentName);
    }
    if (typeof values.userName === 'string') {
      instance.setUserName(values.userName);
    }
    if (typeof values.shared === 'boolean') {
      instance.setShared(values.shared);
    }
    if (typeof values.code === 'string') {
      instance.setCode(values.code);
    }

    return instance;
  }
}

type DelegatorCallback = (error: any, id?: any) => void;
interface ArchbaseQueryFilterDelegator {
  getFilterById: (id: any) => IQueryFilterEntity|undefined;
  addNewFilter: (filter: IQueryFilterEntity, onResult: DelegatorCallback) => void;
  saveFilter: (filter: IQueryFilterEntity, onResult: DelegatorCallback) => void;
  removeFilterBy: (filter: IQueryFilterEntity, onResult: DelegatorCallback) => void;
  getFirstFilter: () => IQueryFilterEntity|undefined;
  getFilters: () => IQueryFilterEntity[];
}

interface Schema {
  fields: Field[];
  operators: Operator[];
  conditions: Condition[];
  createRule: () => Rule;
  createRuleGroup: () => Rule;
  onRuleAdd: (rule: any, parentId: any) => void;
  onGroupAdd: (group: any, parentId: any) => void;
  onRuleRemove: (ruleId: any, parentId: any) => void;
  onGroupRemove: (groupId: any, parentId: any) => void;
  onPropChange: (prop: any, value: any, ruleId: any) => void;
  getLevel: (id: any) => number;
  isRuleGroup: (rule: any) => boolean;
  getOperators: (...args: any) => Operator[];
}

const convertQueryFields = (children: React.ReactNode): React.ReactNode => {
  let result: React.ReactNode[] = [];
  let arrChildren = React.Children.toArray(children);
  arrChildren.forEach(function (child) {
    if (child && (child as any).type && (child as any).type.componentName === 'QueryFields') {
      if ((child as any).props.children) {
        let arrChild = React.Children.toArray((child as any).props.children);
        arrChild.forEach(function (chd, index) {
          let childs: React.ReactNode[] = [];
          let arrChildren2 = React.Children.toArray((chd as any).props.children);
          arrChildren2.forEach(function (child2) {
            childs.push(<FilterFieldValue key={'fld' + index} {...(child2 as any).props} />);
          });
          result.push(
            <FilterField key={'fld' + index} {...(chd as any).props}>
              {childs}
            </FilterField>,
          );
        });
      }
    }
  });
  return <FilterFields>{result}</FilterFields>;
};

const getFields = (props): Field[] => {
  let result: Field[] = [];
  let children = convertQueryFields(props.children);
  if (children) {
    let arrChildren = React.Children.toArray(children);
    arrChildren.forEach((child: any) => {
      if (child.type && child.type.componentName === 'FilterFields') {
        if (child.props.children) {
          let arrChild = React.Children.toArray(child.props.children);
          arrChild.forEach((chd: any) => {
            if (chd.type && chd.type.componentName !== 'FilterField') {
              throw new ArchbaseError('Somente filhos do tipo FilterField podem ser usados com FilterFields.');
            }
            let values: FilterValue[] = [];
            let chld = React.Children.toArray(chd.props.children);
            chld.forEach((val: any) => {
              if (val.type && val.type.componentName !== 'FilterFieldValue') {
                throw new ArchbaseError('Somente filhos do tipo FilterFieldValue podem ser usados com FilterFields');
              }
              values.push({ label: val.props.label, value: val.props.value });
            });
            result.push({
              name: chd.props.name,
              label: chd.props.label,
              dataType: chd.props.dataType,
              operator: chd.props.operator,
              quickFilter: chd.props.quickFilter,
              quickFilterSort: chd.props.quickFilterSort,
              sortable: chd.props.sortable,
              listValues: values,
              searchComponent: chd.props.searchComponent,
              searchField: chd.props.searchField,
            });
          });
        }
      }
    });
  }
  return result;
};

const getFieldSql = (field: any, fields: string | any[]) => {
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].name === field) {
      return fields[i].nameSql;
    }
  }
};

const getFieldValues = (field: any, fields: string | any[]) => {
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].name === field) {
      return fields[i].listValues;
    }
  }
};

const getQuickFields = (fields: Field[]) => {
  let result: Field[] = [];
  if (fields) {
    fields.forEach((field: any) => {
      if (field.quickFilter === true) {
        result.push({
          name: field.name,
          label: field.label,
          dataType: 'string',
          operator: '',
          quickFilter: false,
          quickFilterSort: false,
          sortable: false,
          listValues: [],
          searchComponent: undefined,
          searchField: undefined,
        });
      }
    }, this);
  }
  return result;
};

const getQuickFieldsSort = (fields: Field[]): SortField[] => {
  let result: SortField[] = [];
  if (fields) {
    fields.forEach((field, index) => {
      if (field.quickFilterSort === true) {
        result.push({
          name: field.name,
          label: field.label,
          selected: false,
          order: index,
          asc_desc: 'asc',
        });
      }
    }, this);
  }
  return result;
};

const getQuickFilterSort = (fields: any[]): string => {
  let result: string = '';
  let appendDelimiter = false;
  fields.forEach(function (field) {
    if (field.quickFilterSort === true) {
      if (appendDelimiter) {
        result += ',';
      }
      result += field.name;
      appendDelimiter = true;
    }
  });
  return result;
};

const getQuickFilterSortBySelectedFields = (fields: any[]): string => {
  let result: string = '';
  let appendDelimiter = false;
  fields.forEach((field: any) => {
    if (field.selected) {
      if (appendDelimiter) {
        result += ',';
      }
    }
    result += field.name;
    appendDelimiter = true;
  });
  return result;
};

const mergeSortWithFields = (sort: any[], fields: any[]): SortField[] => {
  let result: SortField[] = [];
  if (fields) {
    fields.forEach(function (field, index) {
      let selected = false;
      let asc_desc = 'asc';
      let order = index;
      if (sort) {
        sort.forEach(function (item) {
          if (item.name === field.name) {
            selected = item.selected;
            asc_desc = item.asc_desc;
            order = item.order;
          }
        });
      }
      result.push({
        name: field.name,
        selected: selected,
        order: order,
        asc_desc: !asc_desc ? 'asc' : asc_desc,
        label: field.label,
      });
    });
    result = result.sort(function (a, b) {
      return a.order - b.order;
    });
  }
  return result;
};

const getQuickFilterFields = (currentFilter: ArchbaseQueryFilter | null, fields: any[]) => {
  let result = '';
  let appendDelimiter = false;
  if (currentFilter && currentFilter.filter) {
    if (!currentFilter.filter.selectedFields || currentFilter.filter.selectedFields.length === 0) {
      fields.forEach((item: any) => {
        if (item.quickFilter === true) {
          if (appendDelimiter) {
            result = result + ',';
          }
          result = result + item.name;
        }
        appendDelimiter = true;
      }, this);
    } else {
      currentFilter.filter.selectedFields.forEach((item: any) => {
        if (appendDelimiter) {
          result = result + ',';
        }
        result = result + item.name;
        appendDelimiter = true;
      }, this);
    }
  }

  return result;
};

const getDefaultEmptyFilter = (): ArchbaseQueryFilter => {
  return {
    id: 0,
    name: '',
    viewName: '',
    apiVersion: '',
    filter: {
      id: 'root',
      selectedFields: [],
      quickFilterText: '',
      rules: [],
      condition: '',
      filterType: 'normal',
      quickFilterFieldsText: '',
    },
    sort: {
      quickFilterSort: '',
      sortFields: [],
      activeIndex: -1,
    },
  };
};

const defaultOperators = (): Operator[] => {
  return [
    {
      name: 'null',
      label: 'Em branco',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
    },
    {
      name: 'notNull',
      label: 'Preenchido',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
    },
    {
      name: 'contains',
      label: 'Contém',
      dataTypes: ['string'],
    },
    {
      name: 'startsWith',
      label: 'Iniciado com',
      dataTypes: ['string'],
    },
    {
      name: 'endsWith',
      label: 'Terminado com',
      dataTypes: ['string'],
    },
    {
      name: '=',
      label: 'Igual',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
    },
    {
      name: '!=',
      label: 'Diferente',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time', 'boolean'],
    },
    {
      name: '<',
      label: 'Menor',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
    },
    {
      name: '>',
      label: 'Maior',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
    },
    {
      name: '<=',
      label: 'Menor igual',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
    },
    {
      name: '>=',
      label: 'Maior igual',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
    },
    {
      name: 'between',
      label: 'Entre',
      dataTypes: ['string', 'number', 'date', 'date_time', 'time'],
    },
    {
      name: 'inList',
      label: 'Na lista',
      dataTypes: ['string', 'number', 'date', 'time'],
    },
    {
      name: 'notInList',
      label: 'Fora da lista',
      dataTypes: ['string', 'number', 'date', 'time'],
    },
  ];
};

const defaultConditions = (): Condition[] => {
  return [
    {
      name: 'and',
      label: 'E',
    },
    {
      name: 'or',
      label: 'Ou',
    },
  ];
};

const getDefaultFilter = (props, type): ArchbaseQueryFilter => {
  let fields = getFields(props);
  let result: ArchbaseQueryFilter = {
    id: 0,
    name: '',
    viewName: '',
    apiVersion: '',
    filter: {
      id: 'root',
      selectedFields: [],
      quickFilterText: '',
      quickFilterFieldsText: '',
      rules: [],
      condition: '',
      filterType: type,
    },
    sort: {
      quickFilterSort: '',
      sortFields: [],
      activeIndex: -1,
    },
  };
  result.filter.selectedFields = getQuickFields(fields);
  result.filter.quickFilterFieldsText = getQuickFilterFields(null, fields);
  result.sort.sortFields = mergeSortWithFields([], fields);
  result.sort.quickFilterSort = getQuickFilterSort(fields);
  return result;
};

interface QueryFieldProps {
  name: string;
  label: string;
  dataType: 'string' | 'number' | 'date' | 'date_time' | 'time' | 'boolean';
  operator:
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | '='
    | '!='
    | '<'
    | '>'
    | '<='
    | '>='
    | 'between'
    | 'inList'
    | 'notInList';
  sortable: boolean;
  quickFilter: boolean;
  quickFilterSort: boolean;
  searchComponent?: any;
  children?: ReactNode | ReactNode[] | undefined;
}

interface QueryFieldValueProps {
  label: string;
  value: string;
}

interface QueryFieldsProps {
  children: ReactNode | ReactNode[];
}

class QueryFields extends Component<QueryFieldsProps> {
  static get componentName() {
    return 'QueryFields';
  }

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

class QueryField extends React.Component<QueryFieldProps> {
  static get componentName() {
    return 'QueryField';
  }
  static defaultProps = {
    sortable: true,
    quickFilter: true,
    quickFilterSort: false,
    operator: '=',
  };
  render() {
    return null;
  }
}

interface QueryFieldValueProps {
  label: string;
  value: string;
}

class QueryFieldValue extends Component<QueryFieldValueProps> {
  static get componentName() {
    return 'QueryFieldValue';
  }
  render() {
    return null;
  }
}

export {
  QueryFieldValue,
  QueryField,
  QueryFields,
  QueryFilterEntity,
  getDefaultFilter,
  defaultConditions,
  defaultOperators,
  getDefaultEmptyFilter,
  getQuickFilterFields,
  mergeSortWithFields,
  getQuickFilterSort,
  getQuickFields,
  getFieldValues,
  getFieldSql,
  getFields,
  getQuickFieldsSort,
  getQuickFilterSortBySelectedFields,
  convertQueryFields,
  QUICK_FILTER_INDEX,
  NEW_FILTER_INDEX,
  NORMAL,
  QUICK,
  ADVANCED,
  OP_NULL,
  OP_NOT_NULL,
  OP_CONTAINS,
  OP_STARTSWITH,
  OP_ENDSWITH,
  OP_EQUALS,
  OP_NOT_EQUALS,
  OP_GREATER,
  OP_LESS,
  OP_GREATER_OR_EQUAL,
  OP_LESS_OR_EQUAL,
  OP_BETWEEN,
  OP_IN_LIST,
  OP_NOT_IN_LIST,
};

export type {
  Field,
  SortField,
  Filter,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterState,
  ArchbaseQueryFilterDelegator,
  PositionType,
  RangeType,
  Position,
  FilterType,
  DataType,
  FilterValue,
  SelectedSort,
  Operator,
  Rule,
  Condition,
  Schema,
  DelegatorCallback,
  IQueryFilterEntity
};
