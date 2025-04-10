import { MaskOptions } from 'components/core';
import React, { ReactNode } from 'react';
import { ArchbaseDataGridColumnProps } from './archbase-data-grid-types';

export type GridFieldDataType =
  | 'text'
  | 'integer'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'enum'
  | 'image'
  | 'uuid';

export type InputFieldType = 'text' | 'select' | 'multi-select' | 'range' | 'checkbox' | 'date' | 'date-range';

export type AlignType = 'left' | 'center' | 'right';

export type EnumValuesColumnFilter = {
  label: string;
  value: string;
};

function ArchbaseDataGridColumn<T>(_props: ArchbaseDataGridColumnProps<T>) {
  // Este componente não renderiza nada diretamente - é apenas uma forma de definir as propriedades da coluna
  return null;
}

ArchbaseDataGridColumn.defaultProps = {
  visible: true,
  size: 100,
  align: 'left',
  enableColumnFilter: true,
  enableGlobalFilter: true,
  headerAlign: 'left',
  footerAlign: 'left',
  enableClickToCopy: false,
  enableSorting: true,
  dataType: 'text',
  inputFilterType: 'text',
  enumValues: [],
};

export default ArchbaseDataGridColumn;
