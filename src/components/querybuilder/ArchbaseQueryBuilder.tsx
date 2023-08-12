import React, { Component, ReactNode, RefObject } from 'react';
import DateObject from 'react-date-object';
import shallowCompare from 'react-addons-shallow-compare';
import ArchbaseCompositeFilter from './ArchbaseCompositeFilter';
import { uniqueId } from 'lodash';
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
} from './ArchbaseFilterCommons';
import { endOfMonth } from 'date-fns';
import { processErrorMessage } from '@components/core/exceptions';
import { ArchbaseDialog } from '@components/notification';
import { Button, Tooltip } from '@mantine/core';
import { IconCalendar, IconClearFormatting, IconFilter, IconSubtask } from '@tabler/icons-react';
import { ArchbaseEdit } from '@components/editors';
import { IconCalendarDue } from '@tabler/icons-react';
import { ArchbaseFilterSelectFields } from './ArchbaseFilterSelectFields';
import { ArchbaseFilterSelectRange } from './ArchbaseFilterSelectRange';

export interface ArchbaseQueryBuilderProps {
  persistenceDelegator: ArchbaseQueryFilterDelegator;
  showClearButton?: boolean;
  showToggleButton?: boolean;
  onClearFilter?: (self: any) => {};
  viewName: string;
  id: string;
  apiVersion: string;
  width?: string;
  height?: string;
  placeholder?: string;
  detailsHeight?: string;
  currentFilter: ArchbaseQueryFilter;
  expandedFilter?: boolean;
  activeFilterIndex: number;
  onToggleExpandedFilter?: (value: boolean) => void;
  onFilterChanged?: (currentFilter: ArchbaseQueryFilter, index: number, callback?: () => void) => void;
  onSearchByFilter?: () => void;
  onSelectedFilter?: (filter: ArchbaseQueryFilter, index: number) => void;
  userName?: any;
  children?: ReactNode | ReactNode[];
}

export interface ArchbaseQueryBuilderState {
  currentFilter: ArchbaseQueryFilter;
  modalOpen: string;
  expandedFilter: boolean;
  activeFilterIndex: number;
  isOpenSelectRange: boolean;
  isOpenSelectFields: boolean;
  detailsTop?: string | number | undefined;
  detailsLeft?: string | number | undefined;
  detailsHeight?: string | number | undefined;
  selectRangeType?: RangeType | undefined;
  modalOperator?: string | undefined;
  modalSearchField: string;
  children?: React.ReactNode | React.ReactNode[];
  update: number;
  modalHandleOnChange?: (value: string) => void;
}

export class ArchbaseQueryBuilder extends Component<ArchbaseQueryBuilderProps, ArchbaseQueryBuilderState> {
  static defaultProps = {
    showClearButton: true,
    showToggleButton: true,
    expandedFilter: false,
    width: '50px',
    height: '500px',
  };
  private timeout: any;
  private divMain: any;
  private refEdit: RefObject<HTMLInputElement>;
  private inputValue: any;
  constructor(props: ArchbaseQueryBuilderProps) {
    super(props);
    this.refEdit = React.createRef();
    this.state = {
      currentFilter: this.props.currentFilter ? this.props.currentFilter : getDefaultFilter(props, QUICK),
      modalOpen: '',
      modalSearchField: '',
      isOpenSelectRange: false,
      isOpenSelectFields: false,
      expandedFilter: this.props.expandedFilter!,
      update: Math.random(),
      activeFilterIndex: this.props.currentFilter ? this.props.activeFilterIndex! : QUICK_FILTER_INDEX,
    };
  }

  shouldComponentUpdate = (nextProps: ArchbaseQueryBuilderProps, nextState: ArchbaseQueryBuilderState) => {
    return shallowCompare(this, nextProps, nextState);
  };

  componentWillReceiveProps = (nextProps: ArchbaseQueryBuilderProps) => {
    this.setState({
      ...this.state,
      currentFilter: nextProps.currentFilter ? nextProps.currentFilter : getDefaultFilter(nextProps, QUICK),
      modalOpen: '',
      expandedFilter: nextProps.expandedFilter ? nextProps.expandedFilter : false,
      activeFilterIndex: nextProps.currentFilter ? nextProps.activeFilterIndex : QUICK_FILTER_INDEX,
    });
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.onResize);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onResize);
  };

  toggleExpandedFilter = () => {
    let newExpandedFilter = !this.state.expandedFilter;
    let position = this.getPosition('filter');
    this.setState(
      {
        ...this.state,
        expandedFilter: newExpandedFilter,
        isOpenSelectRange: false,
        isOpenSelectFields: false,
        detailsTop: position.top,
        detailsLeft: position.left,
        detailsHeight: position.height,
      },
      () => {
        if (!this.state.currentFilter || this.state.currentFilter.filter.filterType === QUICK) {
          let firstFilter: IQueryFilterEntity | undefined = this.props.persistenceDelegator.getFirstFilter();
          if (firstFilter) {
            let currentFilter: ArchbaseQueryFilter = getDefaultEmptyFilter();
            currentFilter.id = firstFilter.id;
            currentFilter.name = firstFilter.name;
            currentFilter.viewName = firstFilter.viewName;
            currentFilter.filter = JSON.parse(atob(firstFilter.filter || ''));
            this.onChangeSelectedFilter(currentFilter, 0);
          } else {
            this.addNewFilter();
          }
        }
      },
    );
    if (this.props.onToggleExpandedFilter) {
      this.props.onToggleExpandedFilter(newExpandedFilter);
    }
  };

  clearFilter = () => {
    if (this.props.onToggleExpandedFilter) {
      this.props.onToggleExpandedFilter(false);
    }
    let currentFilter = getDefaultFilter(this.props, QUICK);
    this.setState(
      {
        ...this.state,
        currentFilter,
        expandedFilter: false,
        activeFilterIndex: QUICK_FILTER_INDEX,
      },
      () => {
        this.onFilterChanged(currentFilter, QUICK_FILTER_INDEX, () => {
          if (this.props.onClearFilter) {
            this.props.onClearFilter(this);
          }
          this.onSearchClick();
        });
      },
    );
  };

  onSearchClick = () => {
    if (this.props.onSearchByFilter) {
      this.props.onSearchByFilter();
    }
    this.onCloseFilterClick();
  };

  onChangeQuickFilter = (value: string, _event: React.MouseEvent) => {
    this.changeQuickFilter(value);
  };

  changeQuickFilter = (value: string) => {
    let currentFilter = this.state.currentFilter;
    if (this.state.currentFilter && this.state.currentFilter.type && this.state.currentFilter.type !== QUICK) {
      currentFilter = getDefaultFilter(this.props, QUICK);
    }

    currentFilter.filter.quickFilterText = value;
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(currentFilter, getFields(this.props));
    this.setState({
      ...this.state,
      currentFilter,
      expandedFilter: false,
      activeFilterIndex: QUICK_FILTER_INDEX,
    });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.props.onToggleExpandedFilter) {
        this.props.onToggleExpandedFilter(false);
      }
      if (this.props.onFilterChanged) {
        this.props.onFilterChanged(currentFilter, QUICK_FILTER_INDEX);
      }
    }, 200);
  };

  handleQuickFilter = (event) => {
    if (event.keyCode === 13) {
      this.onSearchClick();
    }
  };

  getQuickFilterText = () => {
    return this.state.currentFilter.filter.quickFilterText;
  };

  onFilterChanged = (currentFilter: ArchbaseQueryFilter, activeFilterIndex: number, callback: () => void) => {
    let result = [];
    if (currentFilter.id) {
      this.convertFilterToListValues('root', currentFilter.filter.rules, result);
      let filter = { filter: result, sort: currentFilter.sort.sortFields };
      localStorage.setItem('filter' + currentFilter.id, JSON.stringify(filter));
    }

    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(currentFilter, activeFilterIndex, () => {
        this.setState({ ...this.state, update: Math.random() }, callback);
      });
    } else {
      this.setState({ ...this.state, update: Math.random() }, callback);
    }
  };

  loadListValuesToFilter = (parent: string, rules: string | any[], values: any) => {
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];
      if (rule.rules) {
        this.loadListValuesToFilter(rule.id, rule.rules, values);
      } else {
        let vl = this.getItemListById(values, parent, rule.id);
        if (vl) {
          rule.value = vl.value;
          rule.value2 = vl.value2;
        }
      }
    }
  };

  getItemListById = (values: string | any[], parent: string, id: any) => {
    for (let i = 0; i < values.length; i++) {
      if (values[i].parent === parent && values[i].id === id) {
        return values[i];
      }
    }
  };

  convertFilterToListValues = (
    parent: string,
    rules: string | any[],
    result: { parent: any; id: any; value: any; value2: any }[],
  ) => {
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i];
      if (rule.rules) {
        this.convertFilterToListValues(rule.id, rule.rules, result);
      } else {
        result.push({
          parent: parent,
          id: rule.id,
          value: rule.value,
          value2: rule.value2,
        });
      }
    }
  };

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
          let currentFilter = this.state.currentFilter;
          currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(currentFilter, getFields(this.props));
          let filter: IQueryFilterEntity|undefined = this.props.persistenceDelegator.getFilterById(currentFilter.id);
          if (filter) {
            filter.setFilter(btoa(JSON.stringify(currentFilter)));
            this.props.persistenceDelegator.saveFilter(filter, (error: any) => {
              if (error) {
                ArchbaseDialog.showError(processErrorMessage(error));
              }
            });
          }
        },
        () => {},
      );
    } else if ((itemId === 'mnuItemSalvar' || itemId === 'mnuItemSalvarComo') && this.state.currentFilter) {
      this.inputValue = '';
      ArchbaseDialog.showInputDialog(
        'Salvar como...',
        'Informe um nome para o fitro...',
        'Confirme',
        (value: any) => (this.inputValue = value),
        () => {
          let currentFilter = this.state.currentFilter;
          currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(currentFilter, getFields(this.props));

          let newFilter: IQueryFilterEntity = QueryFilterEntity.createInstanceWithValues({
            filter: btoa(JSON.stringify(currentFilter)),
            id: this.props.id,
            name: this.inputValue,
            componentName: this.props.id,
            userName: this.props.userName,
            shared: true,
            viewName: this.props.viewName,
          });

          this.props.persistenceDelegator.saveFilter(newFilter, (error: any, id: any) => {
            if (error) {
              ArchbaseDialog.showError(processErrorMessage(error));
            } else {
              currentFilter.id = id;
              currentFilter.name = newFilter.name;
              this.setState({
                ...this.state,
                currentFilter,
                modalOpen: 'modalSaveFilter',
              });
            }
          });
        },
        () => {},
      );
    }
  };

  onChangeFilterType = (index: number) => {
    let currentFilter = this.state.currentFilter;
    currentFilter.filter.filterType = index === 0 ? NORMAL : ADVANCED;
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(currentFilter, getFields(this.props));
    this.setState({ ...this.state, currentFilter, update: Math.random() });
    if (this.props.onFilterChanged) {
      this.props.onFilterChanged(currentFilter, this.state.activeFilterIndex);
    }
  };

  onChangeSelectedFilter = (filter: ArchbaseQueryFilter, index: number) => {
    if (this.props.onSelectedFilter) {
      this.props.onSelectedFilter(filter, index);
    }
    let item = localStorage.getItem('filter' + filter.id);
    if (item && item !== null) {
      let _item = JSON.parse(item);
      this.loadListValuesToFilter('root', filter.filter.rules, _item.filter);
    }
    this.setState({
      ...this.state,
      currentFilter: filter,
      activeFilterIndex: index,
    });
  };

  addNewFilter = () => {
    let currentFilter = getDefaultFilter(this.props, NORMAL);
    this.setState({
      ...this.state,
      currentFilter,
      activeFilterIndex: NEW_FILTER_INDEX,
    });
    if (this.props.onSelectedFilter) {
      this.props.onSelectedFilter(currentFilter, NEW_FILTER_INDEX);
    }
  };

  onActionClick = (_event, action: string) => {
    if (action === 'new') {
      this.addNewFilter();
    } else if (action === 'remove') {
      this.removeFilter();
    } else if (action === 'apply') {
      this.onSearchClick();
    } else if (action === 'close') {
      this.onCloseFilterClick();
    }
  };

  removeFilter = () => {
    ArchbaseDialog.showConfirmDialogYesNo(
      'Confirme',
      'Deseja remover o Filtro ?',
      () => {
        let currentFilter = this.state.currentFilter;
        let filter: IQueryFilterEntity | undefined = this.props.persistenceDelegator.getFilterById(currentFilter.id);
        if (filter) {
          this.props.persistenceDelegator.removeFilterBy(filter.id, (error: any) => {
            if (error && error!==null) {
              ArchbaseDialog.showError(processErrorMessage(error));
            } else {
              let firstFilter = this.props.persistenceDelegator.getFirstFilter();
              if (firstFilter) {
                let currentFilter: ArchbaseQueryFilter = getDefaultEmptyFilter();
                currentFilter.id = firstFilter.id;
                currentFilter.name = firstFilter.name;
                currentFilter.viewName = firstFilter.viewName;
                currentFilter.filter = JSON.parse(atob(firstFilter.filter || ''));
                this.onChangeSelectedFilter(currentFilter, 0);
              } else {
                this.addNewFilter();
              }
            }
          });
        }
      },
      () => {},
    );
  };

  onCloseFilterClick = () => {
    this.setState({
      ...this.state,
      isOpenSelectRange: false,
      selectRangeType: undefined,
      expandedFilter: false,
      isOpenSelectFields: false,
    });
    if (this.props.onToggleExpandedFilter) {
      this.props.onToggleExpandedFilter(false);
    }
  };

  getPosition = (type: PositionType, rangeType?: RangeType): Position => {
    let width = parseFloat(this.props.width!.replace(/\D/g, '')) * 1;
    if (type === 'range') {
      if (rangeType === 'month') {
        width = 260;
      } else {
        width = 510;
      }
    } else if (type === 'fields') {
      width = 480;
    }
    let bb = this.divMain.getBoundingClientRect();
    const { innerHeight: height } = window;
    let left = bb.left;
    if (bb.left + width > window.innerWidth - 100) {
      left = bb.right - width;
    }
    return {
      left,
      top: bb.bottom + 2,
      height: this.props.detailsHeight ? this.props.detailsHeight : height - bb.bottom - 30,
    };
  };

  onResize = () => {
    let type: PositionType = 'filter';
    let rangeType: RangeType;
    if (this.state.isOpenSelectFields) {
      type = 'fields';
    } else if (this.state.isOpenSelectRange) {
      type = 'range';
      rangeType = this.state.selectRangeType;
    }
    let position = this.getPosition(type, rangeType);
    this.setState({
      ...this.state,
      detailsTop: position.top,
      detailsLeft: position.left,
      detailsHeight: position.height,
    });
  };

  onSelectRange = (rangeType: RangeType) => {
    if (this.state.isOpenSelectRange) {
      this.onCancelSelectRange();
    } else {
      let position = this.getPosition('range', rangeType);
      this.setState({
        ...this.state,
        detailsTop: position.top,
        detailsLeft: position.left,
        detailsHeight: position.height,
        isOpenSelectRange: true,
        selectRangeType: rangeType,
        expandedFilter: false,
        isOpenSelectFields: false,
      });
    }
  };

  onCancelSelectRange = () => {
    this.setState({
      ...this.state,
      isOpenSelectRange: false,
      selectRangeType: undefined,
      expandedFilter: false,
      isOpenSelectFields: false,
    });
  };

  onConfirmSelectRange = (values) => {
    let newValue;
    if (this.state.selectRangeType === 'month') {
      let first = values[0].toString();
      let last = new DateObject({
        date: endOfMonth(values[1].toDate()),
        format: 'DD/MM/YYYY',
      }).toString();
      newValue = `${first}:${last}`;
    } else if (this.state.selectRangeType === 'range' || this.state.selectRangeType === 'week') {
      let first = values[0].toString();
      let last = values[1].toString();
      newValue = `${first}:${last}`;
    } else if (this.state.selectRangeType === 'day') {
      let appendDelimiter = false;
      newValue = '';
      values.forEach((item) => {
        if (appendDelimiter) {
          newValue += ',';
        }
        newValue += item.toString();
        appendDelimiter = true;
      });
    }
    let currentFilter = this.state.currentFilter;
    if (this.state.currentFilter && this.state.currentFilter.type && this.state.currentFilter.type !== QUICK) {
      currentFilter = getDefaultFilter(this.props, QUICK);
    }
    currentFilter.filter.quickFilterText = newValue;
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(currentFilter, getFields(this.props));
    this.setState(
      {
        ...this.state,
        currentFilter,
        activeFilterIndex: QUICK_FILTER_INDEX,
        selectRangeType: undefined,
        isOpenSelectRange: false,
        isOpenSelectFields: false,
        expandedFilter: false,
      },
      () => {
        if (this.props.onFilterChanged) {
          this.props.onFilterChanged(currentFilter, QUICK_FILTER_INDEX);
        }
      },
    );
  };

  selectFields = () => {
    if (this.state.isOpenSelectFields) {
      this.onCancelSelectFields();
    } else {
      let position: Position = this.getPosition('fields');
      this.setState({
        ...this.state,
        detailsTop: position.top,
        detailsLeft: position.left,
        detailsHeight: position.height,
        isOpenSelectFields: true,
        isOpenSelectRange: false,
        expandedFilter: false,
      });
    }
  };

  onCancelSelectFields() {
    this.setState({
      ...this.state,
      isOpenSelectFields: false,
      isOpenSelectRange: false,
      expandedFilter: false,
    });
  }

  getSortString(currentFilter: ArchbaseQueryFilter): string {
    let result: string = '';
    let appendDelimiter = false;
    currentFilter.sort.sortFields.forEach((field) => {
      if (field.selected) {
        if (appendDelimiter) {
          result += ', ';
        }
        result = result + field.name + ':' + field.asc_desc;
        appendDelimiter = true;
      }
    });
    return result;
  }

  onConfirmSelectFields = (selectedFields: Field[], sortFields: SortField[], activeIndex: number) => {
    let currentFilter = this.state.currentFilter;
    if (this.state.currentFilter && this.state.currentFilter.type && this.state.currentFilter.type !== QUICK) {
      currentFilter = getDefaultFilter(this.props, QUICK);
    }
    currentFilter.filter.selectedFields = selectedFields;
    currentFilter.filter.quickFilterFieldsText = getQuickFilterFields(currentFilter, getFields(this.props));
    currentFilter.sort.sortFields = sortFields;
    currentFilter.sort.activeIndex = activeIndex;
    currentFilter.sort.quickFilterSort = this.getSortString(currentFilter);
    this.setState(
      {
        ...this.state,
        isOpenSelectFields: false,
        isOpenSelectRange: false,
        expandedFilter: false,
        currentFilter,
        activeFilterIndex: QUICK_FILTER_INDEX,
      },
      () => {
        if (this.props.onFilterChanged) {
          this.props.onFilterChanged(currentFilter, QUICK_FILTER_INDEX);
        }
      },
    );
  };

  onFocusEdit = () => {
    if (this.state.expandedFilter) {
      this.setState(
        {
          ...this.state,
          isOpenSelectFields: false,
          isOpenSelectRange: false,
          expandedFilter: false,
        },
        () => {
          this.refEdit.current!.focus();
        },
      );
    }
  };

  onClickOk = (_event, selectedRecords: any[]) => {
    if (selectedRecords && selectedRecords.length > 0) {
      let result = '';
      if (this.state.modalOperator === 'notInList' || this.state.modalOperator === 'inList') {
        let appendDelimiter = false;
        selectedRecords.forEach((record) => {
          if (appendDelimiter) {
            result += ',';
          }
          result += record[this.state.modalSearchField];
          appendDelimiter = true;
        });
      } else {
        result = selectedRecords[0][this.state.modalSearchField];
      }

      if (this.state.modalHandleOnChange) {
        this.state.modalHandleOnChange(result);
      }
    }
    this.setState({
      ...this.state,
      modalOpen: '',
      modalHandleOnChange: undefined,
      modalOperator: undefined,
      modalSearchField: '',
    });
  };

  onClickCancel = (_event) => {
    this.setState({
      ...this.state,
      modalOpen: '',
      modalHandleOnChange: undefined,
      modalOperator: undefined,
      modalSearchField: '',
    });
  };

  onSearchButtonClick = (field: string, _event: any, handleOnChange: any, operator: any, searchField: any) => {
    this.setState({
      ...this.state,
      modalOpen: 'modal' + field,
      modalHandleOnChange: handleOnChange,
      modalOperator: operator,
      modalSearchField: searchField,
    });
  };

  buildSearchModals = (): ReactNode[] => {
    let fields: Field[] = getFields(this.props);
    let result: ReactNode[] = [];
    fields.forEach((field: any) => {
      if (field.searchComponent && field.searchField) {
        let SearchComponent = field.searchComponent;
        result.push(
          <SearchComponent
            key={'modal' + field.name}
            isOpen={this.state.modalOpen && this.state.modalOpen === 'modal' + field.name}
            user={this.props.userName}
            onClickOk={this.onClickOk}
            onClickCancel={this.onClickCancel}
            selectedRecords={[]}
          />,
        );
      }
    });
    return result;
  };

  render = () => {
    let type = 'R';
    let backgroundColor = '#f0ad4e';
    if (this.state.currentFilter.filter.filterType === NORMAL) {
      type = 'S';
      backgroundColor = '#72ac18';
    } else if (this.state.currentFilter.filter.filterType === ADVANCED) {
      type = 'A';
      backgroundColor = '#007bff';
    }
    return (
      <div
        ref={(ref) => (this.divMain = ref)}
        style={{
          minWidth: this.props.width,
          maxWidth: this.props.width,
          height: '50px',
          backgroundColor: 'white',
          position: 'relative',
          display: 'flex',
          flexFlow: 'column nowrap',
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
            backgroundColor: 'white',
            position: 'relative',
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
                padding: '3px',
                border: '1px solid #ccd4db',
                borderRadius: '6px',
              }}
            />
            <span
              style={{
                position: 'relative',
                top: '8px',
                right: '25px',
                background: backgroundColor,
                color: 'white',
                border: '1px solid silver',
                width: '20px',
                height: '20px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50px',
              }}
            >
              {type}
            </span>
          </div>
          <Tooltip label="Filtrar">
            <Button
              leftIcon={<IconFilter />}
              style={{ width: '38px', height: '38px' }}
              onClick={() => {
                this.onSearchClick();
              }}
            />
          </Tooltip>
          {this.props.showClearButton ? (
            <Tooltip label="Filtrar">
              <Button
                leftIcon={<IconClearFormatting />}
                style={{ width: '38px', height: '38px' }}
                onClick={this.clearFilter}
              />
            </Tooltip>
          ) : null}
          <div
            style={{
              width: '38px',
              height: '38px',
              display: 'block',
              marginLeft: '4px',
            }}
          >
            <div style={{ width: '38px', height: '19px', display: 'flex' }}>
              <Tooltip label="Selecionar período">
                <Button
                  leftIcon={<IconCalendar />}
                  style={{
                    width: '18px',
                    height: '18px',
                    padding: 0,
                    margin: 0,
                    marginRight: 2,
                    marginBottom: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    this.onSelectRange('range');
                  }}
                />
              </Tooltip>
              <Tooltip label="Mês">
                <Button
                  leftIcon={<IconCalendar />}
                  style={{
                    width: '18px',
                    height: '18px',
                    padding: 0,
                    margin: 0,
                    marginRight: 0,
                    marginBottom: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    this.onSelectRange('month');
                  }}
                />
              </Tooltip>
            </div>
            <div style={{ width: '38px', height: '19px', display: 'flex' }}>
              <Tooltip label="Semana">
                <Button
                  leftIcon={<IconCalendarDue />}
                  style={{
                    width: '18px',
                    height: '18px',
                    padding: 0,
                    margin: 0,
                    marginRight: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    this.onSelectRange('week');
                  }}
                />
              </Tooltip>
              <Tooltip label="Dia">
                <Button
                  leftIcon={<IconCalendarDue />}
                  style={{
                    width: '18px',
                    height: '18px',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    this.onSelectRange('day');
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <Tooltip label="Selecionar campos filtro rápido">
            <Button leftIcon={<IconSubtask />} style={{ width: '38px', height: '38px' }} onClick={this.selectFields} />
          </Tooltip>
          {this.props.showToggleButton ? (
            <Tooltip label="Filtro avançado">
              <Button
                leftIcon={<IconFilter />}
                style={{ width: '38px', height: '38px' }}
                onClick={this.toggleExpandedFilter}
              />
            </Tooltip>
          ) : null}
        </div>
        <ArchbaseCompositeFilter
          id={`cf${uniqueId()}`}
          key={`cf${uniqueId()}`}
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
          width={this.props.width}
          height={this.state.detailsHeight}
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
        />

        <ArchbaseFilterSelectRange
          selectRangeType={this.state.selectRangeType}
          isOpen={this.state.isOpenSelectRange}
          left={this.state.detailsLeft}
          onConfirmSelectRange={this.onConfirmSelectRange}
          onCancelSelectRange={this.onCancelSelectRange}
          width={this.props.width}
          top={this.state.detailsTop}
        />
        {this.buildSearchModals()}
      </div>
    );
  };
}
