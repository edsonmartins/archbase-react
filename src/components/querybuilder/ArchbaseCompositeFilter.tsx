import React, { CSSProperties, Component, Fragment, ReactNode } from 'react';
import { ArchbaseAdvancedFilter } from './ArchbaseAdvancedFilter';
import {ArchbaseSaveFilter} from './ArchbaseSaveFilter';
import Modal from 'react-modal';
import { uniqueId } from 'lodash';
import {
  convertQueryFields,
  getFields,
  getQuickFields,
  defaultOperators,
  QUICK_FILTER_INDEX,
  ADVANCED,
  NORMAL,
  NEW_FILTER_INDEX,
  ArchbaseQueryFilter,
  Field,
  FilterType,
  ArchbaseQueryFilterDelegator,
} from './ArchbaseFilterCommons';
import { ArchbaseSimpleFilter } from './ArchbaseSimpleFilter';
import shallowCompare from 'react-addons-shallow-compare';
import { Badge, Button, Group, Menu, Radio, Text, Tooltip } from '@mantine/core';
import { ArchbaseDataSource } from '@components/datasource';
import { ArchbaseList } from '@components/list';
import { IconDeviceFloppy, IconDoorExit, IconFilter, IconPlus, IconTrash } from '@tabler/icons-react';

interface ArchbaseCompositeFilterProps {
  id: string;
  key: string;
  isOpen: boolean;
  activeFilterIndex: number;
  currentFilter: ArchbaseQueryFilter;
  left?: string | number | undefined;
  top?: string | number | undefined;
  width?: string | number | undefined;
  height?: string | number | undefined;
  persistenceDelegator: ArchbaseQueryFilterDelegator;
  update?: number;
  children?: ReactNode | ReactNode[];
  onSaveFilter?: (itemId: string) => void;
  onChangeFilterType?: (index: number) => void;
  onChangeSelectedFilter?: (filter: ArchbaseQueryFilter, index: number) => void;
  onFilterChanged: (currentFilter: ArchbaseQueryFilter, activeFilterIndex: number) => void;
  onSearchButtonClick?: (field: string, event?: any, handleOnChange?: any, operator?: any, searchField?: any) => void;
  onActionClick?: (event: React.MouseEvent, action: string) => void;
}

interface ArchbaseCompositeFilterState {
  modalOpen: string;
  activeFilterIndex: number;
  fields: Field[];
  showEditor: boolean;
  expandedFilter: boolean;
}

class ArchbaseCompositeFilter extends Component<ArchbaseCompositeFilterProps, ArchbaseCompositeFilterState> {
  constructor(props: ArchbaseCompositeFilterProps) {
    super(props);
    this.state = {
      modalOpen: '',
      activeFilterIndex: props.activeFilterIndex,
      fields: getFields(props),
      showEditor: false,
      expandedFilter: false,
    };
  }

  shouldComponentUpdate = (nextProps: ArchbaseCompositeFilterProps, nextState: ArchbaseCompositeFilterState) => {
    return shallowCompare(this, nextProps, nextState);
  };

  componentWillReceiveProps = (nextProps: ArchbaseCompositeFilterProps) => {
    this.setState({
      ...this.state,
      fields: getFields(nextProps),
      activeFilterIndex: nextProps.activeFilterIndex,
    });
  };

  onSelectMenuItem = (itemId: string) => {
    this.props.onSaveFilter && this.props.onSaveFilter(itemId);
  };

  onChangeFilterType = (index: number) => {
    this.props.onChangeFilterType && this.props.onChangeFilterType(index);
  };

  onSelectItem = (index: number, data: any) => {
    if (this.props.onChangeSelectedFilter && data && data.filter) {
      let filter = JSON.parse(atob(data.filter));
      filter.id = data.idFilter;
      filter.name = data.filterName;
      filter.formName = data.formName;
      this.props.onChangeSelectedFilter(filter, index);
    }
  };

  render = () => {
    let filterType: FilterType = 'normal';
    if (this.props.currentFilter) {
      filterType = this.props.currentFilter.filter.filterType;
    }

    return (
      <Modal
        id={this.props.id}
        key={this.props.key}
        isOpen={this.props.isOpen}
        style={{
          overlay: {
            position: 'fixed',
            left: this.props.left,
            top: this.props.top,
            width: this.props.width,
            height: this.props.height,
            zIndex: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
          },
          content: {
            inset: 0,
            padding: 0,
            position: 'absolute',
            border: '1px solid rgb(204, 204, 204)',
            background: 'rgb(255, 255, 255)',
            borderRadius: '4px',
            outline: 'none',
          },
        }}
        centered={true}
      >
        <div style={{ padding: '10px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: 'bold' }}>{'Filtros salvos'}</Text>
          </div>
          <ArchbaseList
            height="105px"
            activeIndex={this.state.activeFilterIndex}
            dataSource={
              new ArchbaseDataSource('dsSortFields', {
                records: this.props.persistenceDelegator.getFilters(),
                grandTotalRecords: this.props.persistenceDelegator.getFilters().length,
                currentPage: 0,
                totalPages: 0,
                pageSize: 999999,
              })
            }
            onSelectListItem={this.onSelectItem}
            style={{ borderRadius: '6px', marginBottom: '4px' }}
            component={{ type: FilterItem, props: {} }}
          />
          <div className="filter-apply">
            <Fragment>
              <Tooltip label="Novo filtro">
                <Button
                  id="btnNew"
                  leftIcon={<IconPlus />}
                  onClick={(event) => this.props.onActionClick && this.props.onActionClick(event, 'new')}
                />
              </Tooltip>
              <Tooltip label="Remover filtro">
                <Button
                  id="btnRemove"
                  color="red"
                  disabled={
                    this.props.currentFilter && (!this.props.currentFilter.id || this.props.currentFilter.id <= 0)
                  }
                  leftIcon={<IconTrash />}
                  onClick={(event) => this.props.onActionClick && this.props.onActionClick(event, 'remove')}
                />
              </Tooltip>
              <Menu shadow="md" width={200} disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}>
                <Menu.Target>
                  <Button>Salvar</Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Filtro</Menu.Label>
                  <Menu.Item
                    onClick={() => this.onSelectMenuItem('mnuItemSalvar')}
                    disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
                    icon={<IconDeviceFloppy size={14} />}
                  >
                    Salvar
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => this.onSelectMenuItem('mnuItemSalvarComo')}
                    disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
                    icon={<IconDeviceFloppy size={14} />}
                  >
                    Salvar como...
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Fragment>
            <Tooltip label="Aplicar filtro">
              <Button
                id="btnApply"
                leftIcon={<IconFilter />}
                disabled={this.props.activeFilterIndex === QUICK_FILTER_INDEX}
                onClick={(event) => this.props.onActionClick && this.props.onActionClick(event, 'apply')}
              >
                {'Aplicar'}
              </Button>
            </Tooltip>
            <Tooltip label="Fechar filtro">
              <Button
                id="btnClose"
                color="red"
                leftIcon={<IconDoorExit />}
                onClick={(event) => this.props.onActionClick && this.props.onActionClick(event, 'close')}
              >
                {'Fechar'}
              </Button>
            </Tooltip>
          </div>
          {this.props.activeFilterIndex === NEW_FILTER_INDEX ? (
            <Radio.Group
              name="filterType"
              label="Tipo filtro"
              description="Selecione o tipo do filtro"
              withAsterisk
              onChange={(value: string) => this.onChangeFilterType(value === 'normal' ? 0 : 1)}
            >
              <Group mt="xs">
                <Radio value="normal" label="Simples" />
                <Radio value="advanced" label="Avançado" />
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
            />
          ) : null}
          {filterType === ADVANCED ? (
            <ArchbaseDetailedFilter
              isOpen={this.state.expandedFilter}
              update={this.props.update}
              width={'100%'}
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
      </Modal>
    );
  };
}

interface ArchbaseDetailedFilterProps {
  currentFilter: ArchbaseQueryFilter;
  onChangeSelectedFilter?: (filter: ArchbaseQueryFilter, index: number) => void;
  onSaveFilter?: (item: string) => void;
  onFilterChanged: (currentFilter: ArchbaseQueryFilter, activeFilterIndex: number) => void;
  height?: string;
  width?: string;
  activeFilterIndex: number;
  children?: ReactNode | ReactNode[];
  onClickOkSaveFilter?: () => void;
  onClickCancelSaveFilter?: () => void;
  onSearchButtonClick?: (field: string) => void;
  isOpen?: boolean;
  update?: number;
  selectedOptions?: Field[];
}

interface ArchbaseAdvancedFilterState {
  modalOpen: string;
  update: number;
}

class ArchbaseDetailedFilter extends Component<ArchbaseDetailedFilterProps, ArchbaseAdvancedFilterState> {
  static defaultProps = {
    isOpen: false,
  };
  constructor(props: ArchbaseDetailedFilterProps) {
    super(props);
    this.state = { modalOpen: '', update: Math.random() };
  }
  onSelectMenuItem = (itemId: string) => {
    this.props.onSaveFilter && this.props.onSaveFilter(itemId);
  };

  onSelectItem = (index: number, data: any) => {
    if (this.props.onChangeSelectedFilter && data && data.filter) {
      let filter = JSON.parse(atob(data.filter));
      filter.id = data.idFilter;
      filter.name = data.filterName;
      filter.formName = data.formName;
      this.props.onChangeSelectedFilter(filter, index);
    }
    this.setState({ ...this.state, update: Math.random() });
  };

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
        >
          {this.props.children}
        </ArchbaseAdvancedFilter>
        <ArchbaseSaveFilter id="modalSaveFilter" title="Salvar filtro" modalOpen={this.state.modalOpen} />
      </div>
    );
  }
}

interface FilterItemProps {
  disabled: boolean;
  active: boolean;
  index: number;
  recordData: any;
  handleSelectItem?: (index: number, recordData: any) => void;
  onSelectListItem?: (index: number, recordData: any) => void;
}

class FilterItem extends Component<FilterItemProps> {
  static defaultProps = {
    disabled: false,
    active: true,
  };
  constructor(props: FilterItemProps) {
    super(props);
    this.state = { update: Math.random() };
  }

  onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!this.props.disabled) {
      if (this.props.handleSelectItem) {
        event.preventDefault();
        this.props.handleSelectItem(this.props.index, this.props.recordData);
        event.preventDefault();
      }
      if (this.props.onSelectListItem) {
        this.props.onSelectListItem(this.props.index, this.props.recordData);
      }
    }
  };

  render = () => {
    let color = '#28C76F';
    // let backgroundColor = '#E7F8EE';
    let newData = 'Simples';
    if (this.props.recordData.filter) {
      let filter = JSON.parse(atob(this.props.recordData.filter));
      if (filter.filter.filterType === 'advanced') {
        //backgroundColor = '#d3dae6';
        color = '#437de0';
        newData = 'Avançado';
      }
    }
    let className = 'list-group-item list-group-item-action';
    let style: CSSProperties = {
      maxHeight: '24px',
      padding: '2px 2px 2px 8px',
      display: 'flex',
    };
    if (this.props.active) {
      className += ' active';
      style = { ...style, border: '1px dashed blue', fontWeight: 'bold' };
    }

    if (this.props.recordData.disabled) className += ' disabled';

    return (
      <div className={className} style={style} onClick={this.onClick}>
        <Text>{this.props.recordData.filterName}</Text>
        <Badge
          style={{ maxWidth: '60px', fontWeight: 'bold' }}
          color={color}
          // VER DEPOIS         backgroundColor={backgroundColor}
        >
          {newData}
        </Badge>
      </div>
    );
  };
}

export default ArchbaseCompositeFilter;
