/* eslint-disable import/no-duplicates */
/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
import { ActionIcon, Box, Chip, Flex, MantineTheme, Menu, Tooltip, useMantineTheme } from '@mantine/core';
import { parse as parseDate, formatISO, format } from 'date-fns';
import i18next from 'i18next';
import { DatePickerInput, DateValue, DatesRangeValue } from '@mantine/dates';
import { jsPDF as JsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { IconDownload, IconPrinter, IconRefresh } from '@tabler/icons-react';
import { ExportToCsv, Options } from 'export-to-csv';
import {
  MRT_Cell,
  MRT_Column,
  MRT_PaginationState,
  MRT_Row,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  MRT_TableInstance,
  MantineReactTable,
  MRT_ToggleGlobalFilterButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_Header,
  useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_EN } from 'mantine-react-table/locales/en';
import { MRT_Localization_ES } from 'mantine-react-table/locales/es';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR';
import React, { Fragment, isValidElement, useMemo, ReactNode, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { convertISOStringToDate, filter, isEmpty } from '../core/utils';
import { useArchbaseDataSourceListener } from '../hooks';
import builder from '../core/rsql/builder';
import { emit } from '../core/rsql/emitter';
import { ExpressionNode } from '../core/rsql/ast';
import { ArchbaseObjectHelper } from '../core/helper';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { t } from 'i18next';
import { useArchbaseAppContext } from '@components/core';
import { ArchbaseSwitch } from '@components/editors/ArchbaseSwitch';

interface JsPDFCustom extends JsPDF {
  autoTable: (options: UserOptions) => void;
}

const languages = {
  en: MRT_Localization_EN,
  es: MRT_Localization_ES,
  'pt-BR': MRT_Localization_PT_BR,
};

const convertHexToRGBA = (hexCode, opacity = 1) => {
  let hex = hexCode.replace('#', '');
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  let newOpacity = opacity;
  if (opacity > 1 && opacity <= 100) {
    newOpacity = opacity / 100;
  }

  return `rgba(${r},${g},${b},${newOpacity})`;
};

export interface ArchbaseDataTableProps<T extends object, ID> {
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  enableRowNumbers?: boolean;
  enableRowSelection?: boolean | ((row: MRT_Row<T>) => boolean);
  enableRowActions?: boolean;
  enableColumnFilterModes?: boolean;
  enableGrouping?: boolean;
  enableGlobalFilter?: boolean;
  enablePinning?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  getRowId?: (originalRow: T, index: number) => string;
  onCellDoubleClick?: (event) => void;
  allowColumnFilters?: boolean;
  allowExportData?: boolean;
  allowPrintData?: boolean;
  dataSource: ArchbaseDataSource<T, ID>;
  isLoading?: boolean;
  isError?: boolean;
  error?: ReactNode;
  showProgressBars?: boolean;
  children: ReactNode;
  withBorder?: boolean;
  withColumnBorders?: boolean;
  fontSize?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  highlightOnHover?: boolean;
  striped?: boolean;
  height?: number | string | undefined;
  width?: number | string | undefined;
  pageSize: number;
  pageIndex: 0;
  printTitle: string;
  logoPrint?: string;
  csvOptions?: Options;
  globalDateFormat?: string;
  renderRowActionMenuItems?: (props: { row: MRT_Row<T>; table: MRT_TableInstance<T> }) => ReactNode;
  renderRowActions?: (props: { cell: MRT_Cell<T>; row: MRT_Row<T>; table: MRT_TableInstance<T> }) => ReactNode;
  renderToolbarInternalActions?: (props: { table: MRT_TableInstance<T> }) => ReactNode | null;
  positionActionsColumn?: 'first' | 'last';
}

export interface ToolBarActionsProps {
  children: ReactNode;
}

export function ToolBarActions(props: ToolBarActionsProps) {
  return <Fragment>{props.children}</Fragment>;
}

export interface ColumnsProps {}

export function Columns(_props: ColumnsProps) {
  return null;
}

Columns.componentName = 'Columns';

export type ArchbaseDataTableCurrentCell = {
  rowIndex: number;
  columnName: string;
  rowData: any | undefined;
};

type GlobalFilterValue = {
  value: string;
  type: string | Date | number | boolean;
};

function isNumber(value: string) {
  return /\d/.test(value);
}

function isBoolean(value: string) {
  if (value && value.toLowerCase() === 'true') {
    return true;
  } else if (value && value.toLowerCase() === 'false') {
    return true;
  }

  return false;
}

const formatGlobalValueRSQL = (value: string, globalDateFormat): GlobalFilterValue => {
  const parsedDateValue = parseDate(value, globalDateFormat, 0);
  if (!Number.isNaN(parsedDateValue.getTime())) {
    return { value: formatISO(parsedDateValue), type: 'date' };
  } else if (isNumber(value)) {
    return { value, type: 'number' };
  } else if (isBoolean(value)) {
    return { value, type: 'boolean' };
  }

  return { value, type: 'string' };
};

const formatValueRSQL = (value: any) => {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value.toString();
  } else if (value === null) {
    return '';
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (Array.isArray(value)) {
    return value.map((item) => formatValueRSQL(item));
  } else if (typeof value === 'object') {
    return Object.keys(value)
      .map((key) => `${key}: ${formatValueRSQL(value[key])}`)
      .join(', ');
  }

  return '';
};

const STARTS_WITH = 'startsWith';
const CONTAINS = 'contains';
const ENDS_WITH = 'endsWith';
const EQUALS = 'equals';
const BETWEEN = 'between';
const NOT_BETWEEN = 'notBetween';
const EMPTY = 'empty';
const NOT_EMPTY = 'notEmpty';
const NOT_EQUALS = 'notEquals';
const GREATER_THAN = 'greaterThan';
const GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqualTo';
const LESS_THAN = 'lessThan';
const LESS_THAN_OR_EQUAL_TO = 'lessThanOrEqualTo';

function checkIfValidUUID(str) {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(str);
}

const getFilterFnByDataType = (dataType: string): string => {
  switch (dataType) {
    case 'text':
      return CONTAINS;
    case 'integer':
      return BETWEEN;
    case 'currency':
      return BETWEEN;
    case 'boolean':
      return EQUALS;
    case 'date':
      return BETWEEN;
    case 'datetime':
      return BETWEEN;
    case 'time':
      return BETWEEN;
    case 'enum':
      return EQUALS;
    case 'uuid':
      return EQUALS;
    default:
      return EQUALS;
  }
};

const getFilterModeByDataType = (dataType: FieldDataType): string[] => {
  switch (dataType) {
    case 'text':
      return [CONTAINS, STARTS_WITH, ENDS_WITH, EQUALS, EMPTY, NOT_EMPTY, NOT_EQUALS];
    case 'integer':
      return [
        BETWEEN,
        NOT_BETWEEN,
        EQUALS,
        GREATER_THAN,
        GREATER_THAN_OR_EQUAL_TO,
        LESS_THAN,
        LESS_THAN_OR_EQUAL_TO,
        EMPTY,
        NOT_EMPTY,
        NOT_EQUALS,
      ];
    case 'currency':
      return [
        BETWEEN,
        NOT_BETWEEN,
        EQUALS,
        GREATER_THAN,
        GREATER_THAN_OR_EQUAL_TO,
        LESS_THAN,
        LESS_THAN_OR_EQUAL_TO,
        EMPTY,
        NOT_EMPTY,
        NOT_EQUALS,
      ];
    case 'boolean':
      return [EQUALS];
    case 'date':
      return [
        BETWEEN,
        NOT_BETWEEN,
        EQUALS,
        GREATER_THAN,
        GREATER_THAN_OR_EQUAL_TO,
        LESS_THAN,
        LESS_THAN_OR_EQUAL_TO,
        EMPTY,
        NOT_EMPTY,
        NOT_EQUALS,
      ];
    case 'datetime':
      return [
        BETWEEN,
        NOT_BETWEEN,
        EQUALS,
        GREATER_THAN,
        GREATER_THAN_OR_EQUAL_TO,
        LESS_THAN,
        LESS_THAN_OR_EQUAL_TO,
        EMPTY,
        NOT_EMPTY,
        NOT_EQUALS,
      ];
    case 'time':
      return [
        BETWEEN,
        NOT_BETWEEN,
        EQUALS,
        GREATER_THAN,
        GREATER_THAN_OR_EQUAL_TO,
        LESS_THAN,
        LESS_THAN_OR_EQUAL_TO,
        EMPTY,
        NOT_EMPTY,
        NOT_EQUALS,
      ];
    case 'enum':
      return [EQUALS];
    case 'uuid':
      return [EQUALS];
    default:
      return [EQUALS];
  }
};

export interface FilterDatePickerProps {
  column: MRT_Column<any>;
  rangeFilterIndex: number;
  variant: 'date' | 'date-range';
  value: DatesRangeValue | DateValue | undefined;
  header: MRT_Header<any>;
  table: MRT_TableInstance<any>;
}
export function ArchbaseCustomFilterDatePicker(props: FilterDatePickerProps) {
  const {
    options: {
      columnFilterModeOptions,
      icons: { IconX },
      localization,
    },
    setColumnFilterFns,
  } = props.table;

  const { rangeFilterIndex, column, value, header } = props;
  const columnFilterValues = column.getFilterValue() as [Date | null, Date | null];

  const currentValue = useMemo<[Date | null, Date | null]>(() => {
    return [columnFilterValues?.[0] || null, columnFilterValues?.[1] || null];
  }, [columnFilterValues]);

  const currentFilterOption = column.columnDef._filterFn;
  const allowedColumnFilterOptions = column.columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;
  const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
    ? // @ts-ignore
      localization[`filter${currentFilterOption?.charAt?.(0)?.toUpperCase() + currentFilterOption?.slice(1)}`]
    : '';
  const isRangeFilter =
    column.columnDef.filterVariant === 'range' ||
    column.columnDef.filterVariant === 'date-range' ||
    rangeFilterIndex !== undefined;

  const commonProps = {
    disabled: !!filterChipLabel,
    sx: (theme: MantineTheme) => ({
      borderBottom: `2px solid ${theme.colors.gray[theme.colorScheme === 'dark' ? 7 : 3]}`,
      minWidth: isRangeFilter ? '80px' : !filterChipLabel ? '100px' : 'auto',
      width: '100%',
      '& .mantine-TextInput-input': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    }),
  } as const;

  const handleClearEmptyFilterChip = () => {
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const rangeIndex = rangeFilterIndex || 0;
  if (isRangeFilter) {
    return filterChipLabel ? (
      <Box sx={commonProps.sx}>
        <Chip onClick={handleClearEmptyFilterChip} sx={{ margin: '4px' }}>
          {filterChipLabel} <IconX size="12pt" style={{ transform: 'translate(6px, 3px)' }} />
        </Chip>
      </Box>
    ) : (
      <Box>
        <DatePickerInput
          variant="filled"
          sx={{ marginTop: '8px' }}
          placeholder={`${i18next.t('date')} ${rangeIndex === 0 ? 'inicio' : 'final'}`}
          value={value ? value[rangeIndex] : null}
          onChange={(newValue: Date) => {
            const newArray = [currentValue[0], currentValue[1]];
            newArray[rangeIndex] = newValue;
            column.setFilterValue(newArray);
          }}
        />
      </Box>
    );
  }

  return filterChipLabel ? (
    <Box sx={commonProps.sx}>
      <Chip onClick={handleClearEmptyFilterChip} sx={{ margin: '4px' }}>
        {filterChipLabel} <IconX size="12pt" style={{ transform: 'translate(6px, 3px)' }} />
      </Chip>
    </Box>
  ) : (
    <Box>
      <DatePickerInput
        variant="filled"
        sx={{ marginTop: '8px' }}
        placeholder={`${i18next.t('date')}`}
        value={value as DateValue}
        onChange={(newValue: Date) => {
          column.setFilterValue(newValue);
        }}
      />
    </Box>
  );
}

const buildGlobalFilterExpressionRSQL = (
  table,
  originColumns,
  globalFilterValue: string,
  globalDateFormat?: string,
): string | undefined => {
  if (originColumns && originColumns.length > 0) {
    const nodes: ExpressionNode[] = [];
    const globalValue = formatGlobalValueRSQL(globalFilterValue, globalDateFormat);
    if (globalValue.value) {
      originColumns.forEach((column) => {
        if (column.enableGlobalFilter) {
          const id = column.id;
          const index = table.getAllColumns().findIndex((col) => col.id === id);
          if (index && index >= 0) {
            if (globalValue.type === column.dataType) {
              nodes.push(builder.eq(id, `${globalValue.value}`));
            }
            if (column.dataType === 'uuid') {
              nodes.push(builder.eq(id, `${globalValue.value}`));
            } else if (column.dataType === 'text') {
              nodes.push(builder.eq(id, `^*${globalValue.value}*`));
            }
          }
        }
      });
    }
    if (nodes.length > 0) {
      return emit(builder.or(...nodes));
    }
  }
};

const buildExpressionNode = (
  column: MRT_Column<any> | undefined,
  originColumn: any,
  formatedValue: any,
): ExpressionNode | undefined => {
  if (column) {
    if (
      column.columnDef._filterFn === EQUALS &&
      originColumn.filterVariant &&
      originColumn.filterVariant === 'multi-select'
    ) {
      return builder.in(column.id, formatedValue);
    } else if (column.columnDef._filterFn === CONTAINS) {
      return builder.eq(column.id, `^*${formatedValue}*`);
    } else if (column.columnDef._filterFn === STARTS_WITH) {
      return builder.eq(column.id, `^${formatedValue}*`);
    } else if (column.columnDef._filterFn === ENDS_WITH) {
      return builder.eq(column.id, `^*${formatedValue}`);
    } else if (column.columnDef._filterFn === EQUALS) {
      if (originColumn.dataType === 'uuid') {
        if (!checkIfValidUUID(formatedValue)) {
          return;
        }
      }
      if (!isEmpty(formatedValue)) {
        return builder.eq(column.id, `${formatedValue}`);
      }
    } else if (column.columnDef._filterFn === NOT_EQUALS) {
      return builder.neq(column.id, `${formatedValue}`);
    } else if (column.columnDef._filterFn === GREATER_THAN) {
      return builder.gt(column.id, `${formatedValue}`);
    } else if (column.columnDef._filterFn === GREATER_THAN_OR_EQUAL_TO) {
      return builder.ge(column.id, `${formatedValue}`);
    } else if (column.columnDef._filterFn === LESS_THAN) {
      return builder.lt(column.id, `${formatedValue}`);
    } else if (column.columnDef._filterFn === LESS_THAN_OR_EQUAL_TO) {
      return builder.le(column.id, `${formatedValue}`);
    } else if (column.columnDef._filterFn === EMPTY) {
      return builder.eq(column.id, `null`);
    } else if (column.columnDef._filterFn === NOT_EMPTY) {
      return builder.neq(column.id, `null`);
    } else if (column.columnDef._filterFn === BETWEEN) {
      if (formatedValue[0] && formatedValue[1]) {
        return builder.bt(column.id, formatedValue[0], formatedValue[1]);
      }
    } else if (column.columnDef._filterFn === NOT_BETWEEN) {
      return builder.nb(column.id, formatedValue[0], formatedValue[1]);
    }
  }
};

const buildSortRSQL = (sorting: any[] | undefined): string[] | undefined => {
  if (sorting && sorting.length > 0) {
    const result: string[] = [];
    sorting.forEach((value) => {
      result.push(`${value.id}:${value.desc ? 'desc' : 'asc'}`);
    });
    if (result.length === 0) {
      return;
    }

    return result;
  }
};

const buildFilterExpressionRSQL = (columnFilters, table, originColumns): string | undefined => {
  if (columnFilters && columnFilters.length > 0) {
    const nodes: ExpressionNode[] = [];
    columnFilters.forEach((filter) => {
      const id = filter.id;
      const index = table.getAllColumns().findIndex((col) => col.id === id);
      if (index && index >= 0) {
        const column: MRT_Column<any> | undefined = table.getAllColumns()[index];
        const originColumn = originColumns.find((col) => col.id === id);
        const formatedValue = formatValueRSQL(column?.getFilterValue());
        const node = buildExpressionNode(column, originColumn, formatedValue);
        if (node) {
          nodes.push(node);
        }
      }
    });
    if (nodes.length > 0) {
      return emit(builder.and(...nodes));
    }
  }
};

const getToolBarCustomActions = (_table, props): ReactNode => {
  const actions: ReactNode[] = filter(
    props.children,
    (item: ReactNode) => isValidElement(item) && item.type === ToolBarActions,
  );
  if (actions && actions.length === 0) {
    return <div style={{ display: 'flex', gap: '8px' }}></div>;
  }

  return actions;
};

export function ArchbaseDataTable<T extends object, ID>(props: ArchbaseDataTableProps<T, ID>) {
  const { i18n } = useTranslation();
  const theme = useMantineTheme();
  const appContext = useArchbaseAppContext();
  const divTable = useRef<HTMLDivElement>(null);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: props.dataSource ? props.dataSource.getCurrentPage() : props.pageIndex,
    pageSize: props.dataSource ? props.dataSource.getPageSize() : props.pageSize,
  });
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    props.dataSource && props.dataSource.getOptions().originFilter ? props.dataSource.getOptions().originFilter : [],
  );
  const [globalFilter, setGlobalFilter] = useState(
    props.dataSource && props.dataSource.getOptions().originGlobalFilter
      ? props.dataSource.getOptions().originGlobalFilter
      : '',
  );
  const [stickyEnable, setStickyEnable] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>(
    props.dataSource && props.dataSource.getOptions().originSort ? props.dataSource.getOptions().originSort : [],
  );

  const [currentCell, setCurrentCell] = useState<ArchbaseDataTableCurrentCell>({
    rowIndex: 0,
    columnName: '',
    rowData: undefined,
  });

  const getCellBackgroundColor = (cell, table): any => {
    if (cell.row.index === currentCell.rowIndex && cell.column.id === currentCell.columnName) {
      return theme.colors.archbase[theme.colorScheme === 'dark' ? 5 : 5];
    }
    const result = table.getSelectedRowModel().flatRows.filter((row) => row.index === cell.row.index);
    if (result && result.length > 0) {
      return convertHexToRGBA(theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 4], 0.1);
    }

    return undefined;
  };

  const getCellColorFont = (cell): any => {
    if (cell.row.index === currentCell.rowIndex && cell.column.id === currentCell.columnName) {
      return 'white';
    }

    return undefined;
  };

  const renderInteger = (data: any): ReactNode => {
    return <span>{data.getValue()}</span>;
  };

  const renderCurrency = (data: any): ReactNode => {
    return <span>{data.getValue()}</span>;
  };

  const renderBoolean = (data: any): ReactNode => {
    const checked = data.getValue() === true ? true : false;

    return <ArchbaseSwitch isChecked={checked}></ArchbaseSwitch>;
  };

  const renderDate = (data: any): ReactNode => {
    try {
      if (!data.getValue() || data.getValue() === '') {
        return <span></span>;
      }
      const parsedDateValue = convertISOStringToDate(data.getValue());

      return <span>{format(parsedDateValue, appContext.dateFormat)}</span>;
    } catch (error) {
      return <span>Invalid Date</span>;
    }
  };

  const renderDateTime = (data: any): ReactNode => {
    try {
      if (!data.getValue() || data.getValue() === '') {
        return <span></span>;
      }
      const parsedDateValue = convertISOStringToDate(data.getValue());

      return <span>{format(parsedDateValue, appContext.dateTimeFormat)}</span>;
    } catch (error) {
      return <span>Invalid Datetime</span>;
    }
  };

  const renderTime = (data: any): ReactNode => {
    return <span>{data.getValue()}</span>;
  };

  const getRenderByDataType = (dataType: FieldDataType, render: (data: any) => ReactNode): any | undefined => {
    if (render) {
      return render;
    }
    switch (dataType) {
      case 'integer':
        return renderInteger;
      case 'currency':
        return renderCurrency;
      case 'boolean':
        return renderBoolean;
      case 'date':
        return renderDate;
      case 'datetime':
        return renderDateTime;
      case 'time':
        return renderTime;
      default:
        return;
    }
  };

  const originColumns = useMemo(() => {
    const result: any[] = [];

    const arrChildren = React.Children.toArray(props.children);
    arrChildren.forEach((child) => {
      if (isValidElement(child) && child.type === Columns) {
        const childrenWithProps = React.Children.toArray(child.props.children);
        childrenWithProps.forEach((col) => {
          if (isValidElement(col) && col.props.visible) {
            const render = getRenderByDataType(col.props.dataType, col.props.render);
            let element: any = {
              id: col.props.dataField,
              accessorKey: col.props.dataField,
              accessorFn: (originalRow) => ArchbaseObjectHelper.getNestedProperty(originalRow, col.props.dataField),
              header: col.props.header,
              dataType: col.props.dataType,
              enableColumnFilter: col.props.enableColumnFilter,
              enableGlobalFilter: col.props.enableGlobalFilter,
              enableClickToCopy: col.props.enableClickToCopy,
              enableSorting: col.props.enableSorting,
              filterFunctionName: getFilterFnByDataType(col.props.dataType),
              filterFn: getFilterFnByDataType(col.props.dataType),
              columnFilterModeOptions: getFilterModeByDataType(col.props.dataType),
              filterVariant: col.props.inputFilterType,
              mantineFilterSelectProps: { data: col.props.enumValues },
              mantineFilterMultiSelectProps: { data: col.props.enumValues },
              Cell: render ? ({ cell }) => render(cell) : undefined,
              Header: ({ column }) => (
                <i
                  style={{
                    color: theme.colors.archbase[theme.colorScheme === 'dark' ? 3 : 7],
                  }}
                >
                  {column.columnDef.header}
                </i>
              ),
              mantineTableBodyCellProps: ({ cell, table }) => ({
                sx: {
                  backgroundColor: `${getCellBackgroundColor(cell, table)}!important`,
                  color: `${getCellColorFont(cell)}!important`,
                },
              }),
            };

            if (
              ['date', 'date-range'].includes(col.props.inputFilterType) &&
              ['date', 'datetime'].includes(col.props.dataType)
            ) {
              element = {
                ...element,
                Filter: ({ column, header, rangeFilterIndex, table }) => (
                  <ArchbaseCustomFilterDatePicker
                    column={column}
                    table={table}
                    header={header}
                    rangeFilterIndex={rangeFilterIndex}
                    value={column.getFilterValue()}
                    variant={column.columnDef.filterVariant}
                  />
                ),
              };
            }

            result.push(element);
          }
        });
      }
    });

    return result;
  }, [props.children, theme.colorScheme, getCellBackgroundColor, getCellColorFont, theme.colors.Archbase]);

  const handleRefresh = () => {
    props.dataSource.refreshData();
  };

  const handlePrint = (table) => {
    const doc = new JsPDF('l', 'mm', [297, 210]) as JsPDFCustom;
    if (table) {
      const collection = table.refs.tableContainerRef.current.getElementsByClassName('mantine-Table-root');
      if (collection && collection.length > 0) {
        const tableColumns: any = [];
        const bodyValues: any = [];
        originColumns.forEach((col) => {
          tableColumns.push(col.header);
        });
        table.getRowModel().rows.forEach((row) => {
          const rowBody: any = [];
          row.getAllCells().forEach((cell) => {
            if (tableColumns.findIndex((coll) => coll === cell.column.columnDef.header) >= 0) {
              rowBody.push(cell.renderValue());
            }
          });
          bodyValues.push(rowBody);
        });
        const totalPagesExp = '{total_pages_count_string}';
        doc.autoTable({
          headStyles: {
            fillColor: theme.colors.archbase[8],
            textColor: 'white',
            fontSize: 10,
          },
          theme: 'grid',
          head: [tableColumns],
          body: bodyValues,
          styles: { cellPadding: 0.5, fontSize: 10 },
          didDrawPage: (data) => {
            doc.setFontSize(20);
            doc.setTextColor(40);
            if (props.logoPrint) {
              doc.addImage(props.logoPrint, 'PNG', data.settings.margin.left, 15, 10, 10);
              doc.text(props.printTitle, data.settings.margin.left + 15, 22);
            } else {
              doc.text(props.printTitle, data.settings.margin.left, 22);
            }

            const internal: any = doc.internal;
            let str = `${i18next.t('Page')} ${internal.getNumberOfPages()}`;
            if (typeof doc.putTotalPages === 'function') {
              str = `${str} de ${totalPagesExp}`;
            }
            doc.setFontSize(10);
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 10);
          },
          margin: { top: 30 },
        });
        if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
        }

        const blob = doc.output('blob');
        window.open(URL.createObjectURL(blob));
      }
    }
  };

  const handleExportRows = (rows: MRT_Row<any>[], originColumns) => {
    const csvExporter = new ExportToCsv({
      ...props.csvOptions,
      filename:
        props.csvOptions && props.csvOptions.filename
          ? props.csvOptions.filename
          : props.printTitle
          ? props.printTitle
          : 'data_table.csv',
      headers: originColumns.map((c) => c.header),
    });
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleOpenMenu = () => {
    setStickyEnable((_prev) => false);
  };

  const handleCloseMenu = () => {
    setStickyEnable((_prev) => true);
  };

  const handleCurrentCell = (selectedCell: { rowIndex: number; columnName: string; rowData: T }) => {
    setCurrentCell(selectedCell);
    if (props.dataSource) {
      props.dataSource.gotoRecordByData(selectedCell.rowData);
    }
  };

  const table = useMantineReactTable({
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    getRowId: props.getRowId,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableColumnFilterModes: props.enableColumnFilterModes,
    enableColumnOrdering: props.enableColumnOrdering,
    enableGrouping: props.enableGrouping,
    enablePinning: props.enablePinning,
    enableRowActions: props.enableRowActions,
    enableRowSelection: props.enableRowSelection,
    enableFilterMatchHighlighting: false,
    enableStickyHeader: stickyEnable,
    enableStickyFooter: stickyEnable,
    columns: originColumns,
    enableDensityToggle: false,
    positionToolbarAlertBanner: 'bottom',
    mantineFilterTextInputProps: {
      sx: { borderBottom: 'unset', marginTop: '8px' },
      variant: 'filled',
    },
    mantineFilterSelectProps: {
      sx: { borderBottom: 'unset', marginTop: '8px' },
      variant: 'filled',
    },
    positionActionsColumn: props.positionActionsColumn,
    renderRowActions: props.renderRowActions,
    renderRowActionMenuItems: props.renderRowActionMenuItems,
    renderToolbarInternalActions: props.renderToolbarInternalActions
      ? props.renderToolbarInternalActions
      : ({}) => (
          <Flex gap="xs" align="center" className="no-print">
            <MRT_ToggleGlobalFilterButton table={table} />
            <Tooltip withinPortal withArrow label={i18next.t('Refresh')}>
              <ActionIcon onClick={handleRefresh}>
                <IconRefresh />
              </ActionIcon>
            </Tooltip>
            {props.allowColumnFilters ? <MRT_ToggleFiltersButton table={table} /> : null}
            <MRT_ShowHideColumnsButton table={table} />
            <Menu position="top-start" width={200} onOpen={handleOpenMenu} onClose={handleCloseMenu}>
              <Menu.Target>
                <Tooltip withinPortal withArrow label={i18next.t('Export')}>
                  <ActionIcon>
                    <IconDownload />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  disabled={table.getRowModel().rows.length === 0}
                  onClick={() => handleExportRows(table.getRowModel().rows, originColumns)}
                >
                  {`${i18next.t('AllRows')}`}
                </Menu.Item>
                <Menu.Item
                  disabled={table.getSelectedRowModel().rows.length === 0}
                  onClick={() => handleExportRows(table.getSelectedRowModel().rows, originColumns)}
                >
                  {`${i18next.t('OnlySelectedRows')}`}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Tooltip withinPortal withArrow label={i18next.t('Print')}>
              <ActionIcon onClick={handlePrint}>
                <IconPrinter />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ),
    mantineToolbarAlertBannerProps: props.isError
      ? {
          color: 'error',
          children: props.error,
        }
      : undefined,
    initialState: {
      density: 'xs',
      showGlobalFilter: true,
    },
    state: {
      isLoading: props.isLoading,
      columnFilters,
      sorting,
      globalFilter,
      showProgressBars: props.isLoading,
      showSkeletons: props.isLoading,
      showAlertBanner: props.isError,
      pagination,
      showGlobalFilter: (!globalFilter || globalFilter !== '') && props.enableGlobalFilter,
    },
    mantineProgressProps: {
      striped: false,
      animate: true,
    },
    mantineTableContainerProps: {
      sx: { maxHeight: `calc(${props.height} - 120px)` },
    },
    mantineSelectCheckboxProps: {},
    mantineTableProps: {
      withColumnBorders: props.withColumnBorders,
      highlightOnHover: props.highlightOnHover,
      fontSize: props.fontSize,
      sx: {
        borderTop: `1px solid ${theme.colors.gray[theme.colorScheme === 'dark' ? 8 : 3]}`,
      },
    },
    mantinePaginationProps: {
      showRowsPerPage: false,
    },
    renderTopToolbarCustomActions: (table) => getToolBarCustomActions(table, props),
    localization: languages[i18n.language],
    data: props.dataSource.browseRecords(),
    rowCount: props.dataSource.getGrandTotalRecords(),
    pageCount: props.dataSource.getTotalPages(),
    mantineTableBodyCellProps: ({ cell }) => ({
      onDoubleClick: (event) => {
        console.info(event, cell.id);
      },
      onClick: (_event) => {
        const selectedCell = {
          rowIndex: cell.row.index,
          columnName: cell.column.id,
          rowData: cell.row.original,
        };
        handleCurrentCell(selectedCell);
      },
    }),
  });

  useArchbaseDataSourceListener<T, ID>({
    dataSource: props.dataSource,
    listener: (_event: DataSourceEvent<T>): void => {
      // console.log(event)
    },
  });

  useEffect(() => {
    const sortResult = buildSortRSQL(sorting);
    const filterResult = buildFilterExpressionRSQL(columnFilters, table, originColumns);
    const globalFilterResult = buildGlobalFilterExpressionRSQL(
      table,
      originColumns,
      globalFilter,
      props.globalDateFormat,
    );
    const options = props.dataSource.getOptions();
    const newFilter = filterResult || globalFilterResult;
    const needRefresh =
      props.dataSource.getCurrentPage() !== pagination.pageIndex ||
      (options && options.filter !== newFilter) ||
      (options && options.sort !== sortResult);
    options.filter = filterResult || globalFilterResult;
    options.currentPage = pagination.pageIndex;
    options.sort = sortResult;
    options.originFilter = columnFilters;
    options.originSort = sorting;
    options.originGlobalFilter = globalFilter;
    if (needRefresh) {
      props.dataSource.refreshData(options);
    }
  }, [pagination.pageIndex, pagination.pageSize, JSON.stringify(columnFilters), globalFilter, sorting]);

  return (
    <div ref={divTable}>
      <MantineReactTable table={table} />
    </div>
  );
}

ArchbaseDataTable.defaultProps = {
  enableColumnResizing: true,
  enableColumnOrdering: true,
  enableRowNumbers: true,
  enableRowSelection: true,
  enableRowActions: true,
  positionActionsColumn: 'first',
  enableColumnFilterModes: true,
  enableGlobalFilter: true,
  enableGrouping: false,
  enablePinning: true,
  allowColumnFilters: true,
  allowExportData: true,
  allowPrintData: true,
  isLoading: false,
  showProgressBars: true,
  withColumnBorders: true,
  highlightOnHover: true,
  striped: false,
  withBorder: true,
  width: '100%',
  pageSize: 25,
  pageIndex: 0,
  globalDateFormat: 'dd/MM/yyyy',
  csvOptions: {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: [],
  },
};

export type EnumValuesColumnFilter = {
  label: string;
  value: string;
};

export type FieldDataType =
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

type AlignType = 'left' | 'center' | 'right';

export interface ArchbaseDataTableColumnProps<T> {
  header: string;
  footer?: string;
  dataField: string;
  enableColumnFilter?: boolean;
  enableGlobalFilter?: boolean;
  dataFieldAcessorFn?: (originalRow: T) => any;
  dataType?: FieldDataType;
  inputFilterType?: InputFieldType;
  enumValues?: EnumValuesColumnFilter[];
  minSize?: number;
  maxSize?: number;
  render?: (data: any) => ReactNode;
  visible: boolean;
  size: number;
  enableClickToCopy: boolean;
  enableSorting: boolean;
  align?: AlignType;
  headerAlign?: AlignType;
  footerAlign?: AlignType;
}

export function ArchbaseDataTableColumn<T>(_props: ArchbaseDataTableColumnProps<T>) {
  return null;
}

ArchbaseDataTableColumn.defaultProps = {
  visible: true,
  size: 100,
  align: 'left',
  enableColumnFilter: true,
  enableGlobalFilter: true,
  headerAlign: 'left',
  footerAlign: 'left',
  enableClickToCopy: false,
  enableSorting: true,
  manualFiltering: true,
  manualPagination: true,
  manualSorting: true,
  dataType: 'text',
  inputFilterType: 'text',
  enumValues: [],
};

export interface ArchbaseTableRowActionsProps<T> {
  onEditRow: (row: T) => void;
  onRemoveRow: (row: T) => void;
  onViewRow: (row: T) => void;
  row: T;
}

export function ArchbaseTableRowActions<T>({
  onEditRow,
  onRemoveRow,
  onViewRow,
  row,
}: ArchbaseTableRowActionsProps<T>) {
  const theme = useMantineTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <Tooltip withArrow position="left" label={t('Edit')}>
        <ActionIcon onClick={() => onEditRow(row)}>
          <IconEdit color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
        </ActionIcon>
      </Tooltip>
      <Tooltip withArrow position="right" label={t('Remove')}>
        <ActionIcon color="red" onClick={() => onRemoveRow(row)}>
          <IconTrash color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
        </ActionIcon>
      </Tooltip>
      <Tooltip withArrow position="right" label={t('View')}>
        <ActionIcon color="red" onClick={() => onViewRow(row)}>
          <IconEye color={theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.dark[4]} />
        </ActionIcon>
      </Tooltip>
    </Box>
  );
}
