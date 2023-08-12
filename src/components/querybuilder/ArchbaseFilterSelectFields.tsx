import React, { Component } from 'react';
import Modal from 'react-modal';
import { CustomSortItem } from './ArchbaseAdvancedFilter';
import { cloneDeep } from 'lodash';
import { getQuickFieldsSort, getQuickFields, ArchbaseQueryFilter, Field, SortField } from './ArchbaseFilterCommons';
import { ArchbaseCheckbox } from '@components/editors';
import { ActionIcon, Box, Button, Paper, Text, Tooltip } from '@mantine/core';
import { ArchbaseDataSource } from '@components/datasource';
import { ArchbaseList } from '@components/list';
import { IconArrowDown } from '@tabler/icons-react';
import { IconArrowUp } from '@tabler/icons-react';
import { ArchbaseCol, ArchbaseRow } from '@components/containers/gridLayout';
import { ArchbaseForm } from '@components/containers/form';

interface ArchbaseFilterSelectFieldsProps {
  currentFilter: ArchbaseQueryFilter;
  fields: Field[];
  selectedOptions?: any;
  id: string;
  key: string;
  isOpen: boolean;
  left?: string | number | undefined;
  top?: string | number | undefined;
  width?: string | number | undefined;
  sortFocused?: boolean;
  onConfirmSelectFields?: (selectedFields: Field[], sortFields: SortField[], activeIndex: number) => void;
  onCancelSelectFields?: () => void;
}

interface ArchbaseFilterSelectFieldsState {
  selectedFields: Field[];
  sortFields: SortField[];
  allChecked: boolean;
  activeIndex: number;
  update: number;
}

class ArchbaseFilterSelectFields extends Component<ArchbaseFilterSelectFieldsProps, ArchbaseFilterSelectFieldsState> {
  constructor(props: ArchbaseFilterSelectFieldsProps) {
    super(props);
    let quickFields = cloneDeep(getQuickFields(props.fields));
    let sortFields = cloneDeep(getQuickFieldsSort(props.fields));
    this.state = {
      selectedFields: [...quickFields],
      sortFields: [...sortFields],
      allChecked: true,
      activeIndex: props.currentFilter.sort.activeIndex,
      update: Math.random(),
    };
  }

  onCheckboxChange = (_value, _checked: boolean, item) => {
    let selectedFields = [...this.state.selectedFields];
    if (_checked) {
      selectedFields.push(item.props.option);
    } else {
      selectedFields = this.state.selectedFields.filter((it) => it.name !== item.props.option.name);
    }
    this.setState({ ...this.state, selectedFields });
  };

  renderCheckboxFields = () => {
    const selectedOptions = this.props.selectedOptions;

    if (selectedOptions) {
      return selectedOptions.map((sl) => {
        let checked = false;
        this.state.selectedFields.forEach((element) => {
          if (sl.name === element.name) {
            checked = true;
          }
        });

        return (
          <ArchbaseCheckbox
            label={sl.label}
            isChecked={checked}
            //option={sl}
            trueValue={true}
            falseValue={false}
            onChangeValue={(value: any, _event: any) => this.onCheckboxChange(value, value === true, sl)}
          />
        );
      });
    }
  };

  getSortItem = (field: string): SortField | undefined => {
    let result: SortField | undefined;
    this.state.sortFields.forEach(function (item) {
      if (item.name === field) {
        result = item;
      }
    });
    return result;
  };

  onChangeSortItem = (field: string, selected: any, order: any, asc_desc: any): void => {
    let item: SortField | undefined = this.getSortItem(field);
    if (item) {
      Object.assign(item, {
        selected: selected,
        order: order,
        asc_desc: asc_desc,
        label: item.label,
      });
      let sortFields = this.state.sortFields;
      sortFields = sortFields.sort(function (a, b) {
        return a.order - b.order;
      });
      this.setState({
        ...this.state,
        update: Math.random(),
        sortFields,
      });
    }
  };

  getSortItemByOrder = (order: number): SortField | undefined => {
    let result: SortField | undefined;
    this.state.sortFields.forEach(function (item) {
      if (item.order === order) {
        result = item;
      }
    });
    return result;
  };

  onSortDown = (_event: React.MouseEvent) => {
    let activeIndex = this.state.activeIndex;
    if (activeIndex >= 0) {
      let item = this.state.sortFields[activeIndex];
      if (item.order < this.state.sortFields.length - 1) {
        activeIndex = item.order + 1;
        let nextItem: SortField | undefined = this.getSortItemByOrder(item.order + 1);
        if (nextItem) {
          Object.assign(item, {
            order: item.order + 1,
          });
          Object.assign(nextItem, {
            order: nextItem.order - 1,
          });
        }
      }
      let sortFields = this.state.sortFields;
      sortFields = sortFields.sort(function (a, b) {
        return a.order - b.order;
      });
      this.setState({
        ...this.state,
        sortFields,
        activeIndex,
      });
    }
  };

  onSortUp = (_event: React.MouseEvent) => {
    let activeIndex = this.state.activeIndex;
    if (activeIndex >= 0) {
      let item = this.state.sortFields[activeIndex];
      if (item.order > 0) {
        activeIndex = item.order - 1;
        let previousItem: SortField | undefined = this.getSortItemByOrder(item.order - 1);
        if (previousItem) {
          Object.assign(item, {
            order: item.order - 1,
          });
          Object.assign(previousItem, {
            order: previousItem.order + 1,
          });
        }
      }
      let sortFields = this.state.sortFields;
      sortFields = sortFields.sort(function (a, b) {
        return a.order - b.order;
      });
      this.setState({
        ...this.state,
        sortFields,
        activeIndex,
      });
    }
  };

  onSelectListItem = (index: number, _item) => {
    this.setState({ ...this.state, activeIndex: index });
  };

  selectAllFields = (checked: boolean) => {
    let quickFields = cloneDeep(getQuickFields(this.props.fields));
    let selectedFields = checked ? quickFields : [];
    this.setState({ ...this.state, selectedFields, allChecked: checked });
  };

  render = () => {
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
            height: '570px',
            zIndex: 600,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
          },
          content: {
            inset: 0,
            padding: '16px',
            position: 'absolute',
            border: '1px solid silver',
            background: 'rgb(255, 255, 255)',
            borderRadius: '4px',
            outline: 'none',
          },
        }}
        centered={true}
      >
        <ArchbaseForm>
          <ArchbaseRow
            style={{
              paddingBottom: '10px',
              overflowY: 'auto',
              display: 'block',
              overflowX: 'hidden',
            }}
          >
            <Paper
              style={{
                padding: '10px',
                width: '100%',
              }}
            >
              <Text style={{ fontWeight: '700' }}>{'Selecione os campos p/ o filtro rápido:'}</Text>
              <ArchbaseCheckbox
                isChecked={this.state.allChecked}
                trueValue={true}
                falseValue={false}
                onChangeValue={(value: any, _event: any) => {
                  this.selectAllFields(value === true);
                }}
                label="Selecionar todos ?"
              />
            </Paper>
            <ArchbaseCol
              style={{
                height: '128px',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              <Box>{this.renderCheckboxFields()}</Box>
            </ArchbaseCol>
          </ArchbaseRow>
          <ArchbaseRow>
            <ArchbaseCol style={{ padding: 13 }}>
              <div
                className="sort-group-container"
                style={{
                  height: '200px',
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
                  <Text>Ordenação</Text>
                </div>
                <div className="sort-body">
                  <ArchbaseList<any, any>
                    height="100%"
                    width="100%"
                    dataSource={
                      new ArchbaseDataSource('dsSortFields', {
                        records: this.state.sortFields,
                        grandTotalRecords: this.state.sortFields.length,
                        currentPage: 0,
                        totalPages: 0,
                        pageSize: 999999,
                      })
                    }
                    dataFieldId="name"
                    dataFieldText="name"
                    activeIndex={this.state.activeIndex}
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
        </ArchbaseForm>
        <Paper
          style={{
            display: 'flex',
            justifyContent: 'end',
            width: '100%',
            height: '40px',
            marginTop: '10px',
          }}
        >
          <Button
            onClick={() =>
              this.props.onConfirmSelectFields &&
              this.props.onConfirmSelectFields(this.state.selectedFields, this.state.sortFields, this.state.activeIndex)
            }
          >
            Aplicar
          </Button>
          <Button color="red" onClick={this.props.onCancelSelectFields}>
            Cancela
          </Button>
        </Paper>
      </Modal>
    );
  };
}

export { ArchbaseFilterSelectFields };
