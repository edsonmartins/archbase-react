/* eslint-disable no-else-return */

/* eslint-disable no-nested-ternary */

/* eslint-disable no-unsafe-optional-chaining */

/* eslint-disable no-underscore-dangle */

/* eslint-disable no-use-before-define */
import {
	ActionIcon,
	type ActionIconProps,
	Box,
	Checkbox,
	Chip,
	Flex,
	MantineColorScheme,
	Menu,
	Tooltip,
	px,
} from '@mantine/core';
import { DatePickerInput, DatesRangeValue, DateValue } from '@mantine/dates';
import { IconDownload, IconPrinter, IconRefresh } from '@tabler/icons-react';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { format, formatISO, parse as parseDate } from 'date-fns';
import { ExportToCsv, Options } from 'export-to-csv';
import i18next from 'i18next';
import { t } from 'i18next';
import { jsPDF as JsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import {
	HTMLPropsRef,
	MantineReactTable,
	MRT_Cell,
	MRT_Column,
	MRT_ColumnFiltersState,
	MRT_Header,
	MRT_PaginationState,
	MRT_Row,
	MRT_RowSelectionState,
	MRT_ShowHideColumnsButton,
	MRT_ShowHideColumnsMenu,
	MRT_SortingState,
	MRT_TableInstance,
	MRT_ToggleFiltersButton,
	MRT_ToggleGlobalFilterButton,
	useMantineReactTable,
} from 'mantine-react-table';
import { MRT_Localization_EN } from 'mantine-react-table/locales/en/index.cjs';
import { MRT_Localization_ES } from 'mantine-react-table/locales/es/index.cjs';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR/index.cjs';
import React, { Fragment, isValidElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArchbaseMasker, builder, emit, ExpressionNode, MaskOptions } from '../core';
import { useArchbaseAppContext } from '../core';
import { ArchbaseObjectHelper } from '../core/helper';
import { convertISOStringToDate, filter, isEmpty } from '../core/utils';
import { type ArchbaseDataSource, type DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDataSourceListener, useArchbaseTheme } from '../hooks';
import classes from './ArchbaseDataTable.module.css';

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

export type Positions<T> = T | (string & {});

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
	enableTopToolbar?: boolean;
	manualFiltering?: boolean;
	manualPagination?: boolean;
	manualSorting?: boolean;
	variant?: string;
	getRowId?: (originalRow: T, index: number) => string;
	onCellDoubleClick?: (event) => void;
	onSelectedRowsChanged?: (rows: T[]) => void;
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
	pageIndex: number;
	printTitle: string;
	logoPrint?: string;
	csvOptions?: Options;
	globalDateFormat?: string;
	renderRowActionMenuItems?: (props: { row: MRT_Row<T>; table: MRT_TableInstance<T> }) => ReactNode;
	renderRowActions?: (props: { cell: MRT_Cell<T>; row: MRT_Row<T>; table: MRT_TableInstance<T> }) => ReactNode;
	renderToolbarInternalActions?: (props: { table: MRT_TableInstance<T> }) => ReactNode | null;
	renderDetailPanel?: (props: { row: MRT_Row<T>; table: MRT_TableInstance<T> }) => ReactNode;
	positionActionsColumn?: 'first' | 'last';
	onExport?: (exportFunc: () => void) => void;
	onPrint?: (printFunc: () => void) => void;
	cellPadding?: string | number;
	bottomToolbarMinHeight?: string | number;
	tableHeadCellPadding?: string | number;
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
	colorScheme: MantineColorScheme;
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
		minWidth: isRangeFilter ? '80px' : !filterChipLabel ? '100px' : 'auto',
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
			<Box className={classes.chipBox} style={commonProps}>
				<Chip onClick={handleClearEmptyFilterChip} style={{ margin: '4px' }}>
					{filterChipLabel} <IconX size="12pt" style={{ transform: 'translate(6px, 3px)' }} />
				</Chip>
			</Box>
		) : (
			<Box>
				<DatePickerInput
					variant="filled"
					style={{ marginTop: '8px' }}
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
		<Box className={classes.chipBox} style={commonProps}>
			<Chip onClick={handleClearEmptyFilterChip} style={{ margin: '4px' }}>
				{filterChipLabel} <IconX size="12pt" style={{ transform: 'translate(6px, 3px)' }} />
			</Chip>
		</Box>
	) : (
		<Box>
			<DatePickerInput
				variant="filled"
				style={{ marginTop: '8px' }}
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
			return builder.eq(column.id, `^${formatedValue}*`);
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
		(child: ReactNode, index?: number, children?: ReactNode[]) =>
			isValidElement(child) && child.type === ToolBarActions,
	);
	if (actions && actions.length === 0) {
		return <div style={{ display: 'flex', gap: '8px' }}></div>;
	}

	return actions;
};

//@ts-ignore
interface Props<TData extends Record<string, any> = {}> extends ActionIconProps, HTMLPropsRef<HTMLButtonElement> {
	table: MRT_TableInstance<TData>;
}

export const CustomToggleGlobalFilterButton = <TData extends Record<string, any> = {}>({
	table,
	variant,
	...rest
}: Props<TData>) => {
	const {
		getState,
		options: {
			icons: { IconSearch, IconSearchOff },

			localization,
		},
		refs: { searchInputRef },
		setShowGlobalFilter,
	} = table;
	const { globalFilter, showGlobalFilter } = getState();

	const handleToggleSearch = () => {
		setShowGlobalFilter(!showGlobalFilter);
		setTimeout(() => searchInputRef.current?.focus(), 100);
	};

	return (
		<Tooltip withinPortal withArrow label={rest?.title ?? localization.showHideSearch}>
			<ActionIcon
				variant={variant}
				size="lg"
				color="var(--mantine-primary-color-filled)"
				style={{ width: '36px', height: '36px', marginRight: 2 }}
				aria-label={rest?.title ?? localization.showHideSearch}
				disabled={!!globalFilter}
				onClick={handleToggleSearch}
				{...rest}
				title={undefined}
			>
				{showGlobalFilter ? <IconSearchOff size="1.4rem" /> : <IconSearch size="1.4rem" />}
			</ActionIcon>
		</Tooltip>
	);
};

export const CustomToggleFiltersButton = <TData extends Record<string, any> = {}>({
	table,
	variant,
	...rest
}: Props<TData>) => {
	const {
		getState,
		options: {
			icons: { IconFilter, IconFilterOff },
			localization,
		},
		setShowColumnFilters,
	} = table;
	const { showColumnFilters } = getState();

	const handleToggleShowFilters = () => {
		setShowColumnFilters(!showColumnFilters);
	};

	return (
		<Tooltip withinPortal withArrow label={rest?.title ?? localization.showHideFilters}>
			<ActionIcon
				variant={variant}
				size="lg"
				color="var(--mantine-primary-color-filled)"
				style={{ width: '36px', height: '36px', marginRight: 2 }}
				onClick={handleToggleShowFilters}
				{...rest}
				title={undefined}
			>
				{showColumnFilters ? <IconFilterOff size="1.4rem" /> : <IconFilter size="1.4rem" />}
			</ActionIcon>
		</Tooltip>
	);
};

export const CustomShowHideColumnsButton = <TData extends Record<string, any> = {}>({
	table,
	variant,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { IconColumns },
			localization,
		},
	} = table;

	return (
		<Menu closeOnItemClick={false} withinPortal>
			<Tooltip withinPortal withArrow label={rest?.title ?? localization.showHideColumns}>
				<Menu.Target>
					<ActionIcon
						variant={variant}
						color="var(--mantine-primary-color-filled)"
						style={{ width: '36px', height: '36px', marginRight: 2 }}
						aria-label={localization.showHideColumns}
						size="lg"
						{...rest}
						title={undefined}
					>
						<IconColumns size="1.4rem" />
					</ActionIcon>
				</Menu.Target>
			</Tooltip>
			<MRT_ShowHideColumnsMenu table={table} />
		</Menu>
	);
};

export function ArchbaseDataTable<T extends object, ID>(props: ArchbaseDataTableProps<T, ID>) {
	const { i18n } = useTranslation();
	const theme = useArchbaseTheme();
	const appContext = useArchbaseAppContext();
	const divTable = useRef<HTMLDivElement>(null);
	const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
	const [data, setData] = useState<any>(props.dataSource.browseRecords());
	const [isLoadingInternal, setLoadingInternal] = useState<boolean>(false);
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

	useEffect(() => {
		if (rowSelection && table && props.onSelectedRowsChanged) {
			const result: T[] = [];
			for (const [key, value] of Object.entries(rowSelection)) {
				if (rowSelection[key]) {
					result.push(table.getRow(key).original);
				}
			}
			props.onSelectedRowsChanged(result);
		}
	}, [rowSelection]);

	useEffect(() => {
		setData(props.dataSource.browseRecords());
		setPagination({
			pageIndex: props.dataSource ? props.dataSource.getCurrentPage() : props.pageIndex,
			pageSize: props.dataSource ? props.dataSource.getPageSize() : props.pageSize,
		});
		setLoadingInternal(false);
		setRowSelection({});
	}, [isLoadingInternal]);

	const getCellBackgroundColor = (cell, table): any => {
		if (cell.row.index === currentCell.rowIndex && cell.column.id === currentCell.columnName) {
			return theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 5];
		}
		const result = table.getSelectedRowModel().flatRows.filter((row) => row.index === cell.row.index);
		if (result && result.length > 0) {
			return convertHexToRGBA(theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 4], 0.1);
		}

		return ""
	};

	const getCellColorFont = (cell: any): any => {
		if (cell.row.index === currentCell.rowIndex && cell.column.id === currentCell.columnName) {
			return 'white';
		}

		return 'var(--mantine-color-text)';
	};

	const renderText = (data: any, maskOptions?: MaskOptions): ReactNode => {
		let dataValue = data.getValue();
		if (!dataValue) {
			return <span></span>;
		}
		if (maskOptions) {
			dataValue = ArchbaseMasker.toPattern(dataValue, maskOptions);
		}
		return <span>{dataValue}</span>;
	};

	const renderInteger = (data: any, maskOptions?: MaskOptions): ReactNode => {
		return <span>{data.getValue()}</span>;
	};

	const renderCurrency = (data: any, maskOptions?: MaskOptions): ReactNode => {
		return <span>{data.getValue()}</span>;
	};

	const renderBoolean = (data: any, maskOptions?: MaskOptions): ReactNode => {
		const checked = data.getValue();

		return <Checkbox readOnly={true} checked={checked} />;
	};

	const renderDate = (data: any, maskOptions?: MaskOptions): ReactNode => {
		try {
			if (!data.getValue() || data.getValue() === '') {
				return <span></span>;
			}
			const parsedDateValue = convertISOStringToDate(data.getValue());

			return <span>{format(parsedDateValue, appContext.dateFormat)}</span>;
		} catch (error) {
			return <span>{`${t('archbase:Invalid Date')}`}</span>;
		}
	};

	const renderDateTime = (data: any, maskOptions?: MaskOptions): ReactNode => {
		try {
			if (!data.getValue() || data.getValue() === '') {
				return <span></span>;
			}
			const parsedDateValue = convertISOStringToDate(data.getValue());

			return <span>{format(parsedDateValue, appContext.dateTimeFormat)}</span>;
		} catch (error) {
			return <span>{`${t('archbase:Invalid Datetime')}`}</span>;
		}
	};

	const renderTime = (data: any, maskOptions?: MaskOptions): ReactNode => {
		return <span>{data.getValue()}</span>;
	};

	const print = () => {
		handlePrint(table);
	};

	const exportData = () => {
		handleExportRows(table.getRowModel().rows, originColumns);
	};

	React.useEffect(() => {
		if (props.onExport) {
			props.onExport(exportData);
		}
		if (props.onPrint) {
			props.onPrint(print);
		}
	}, [props.onExport, props.onPrint]);

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
			case 'text':
				return renderText;
			default:
		}
	};

	const getAlignByDataType = (dataType: FieldDataType, align?: AlignType) => {
		if (align) {
			if (align === 'left') {
				return 'flex-start';
			} else if (align === 'center') {
				return 'center';
			} else {
				return 'flex-end';
			}
		}
		switch (dataType) {
			case 'integer':
				return 'flex-end';
			case 'currency':
				return 'flex-end';
			case 'boolean':
				return 'center';
			case 'date':
				return 'center';
			case 'datetime':
				return 'center';
			case 'time':
				return 'flex-start';
			default:
				return 'flex-start';
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
						const alignContent = getAlignByDataType(col.props.dataType, col.props.align);
						let element: any = {
							id: col.props.dataField,
							accessorKey: col.props.dataField,
							accessorFn: (originalRow) => ArchbaseObjectHelper.getNestedProperty(originalRow, col.props.dataField),
							header: col.props.header,
							dataType: col.props.dataType,
							size: col.props.size,
							maxSize: col.props.maxSize,
							minSize: col.props.minSize,
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
							Cell: render
								? ({ cell }) => (
										<div
											style={{ width: '100%', display: 'flex', justifyContent: alignContent, alignContent: 'center' }}
										>
											{render(cell, col.props.maskOptions)}
										</div>
								  )
								: undefined,
							Header: ({ column }) => (
								<i
									style={{
										color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
									}}
								>
									{column.columnDef.header}
								</i>
							),
							mantineTableBodyCellProps: ({ cell, table }) => ({
								bg: `${getCellBackgroundColor(cell, table)}`,
								c: `${getCellColorFont(cell)}`
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
										colorScheme={theme.colorScheme}
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
	}, [
		props.children,
		theme.colorScheme,
		getCellBackgroundColor,
		getCellColorFont,
		theme.colors[theme.primaryColor],
		props.enableRowSelection,
		props.renderRowActions,
		props.enableRowActions,
		props.enableColumnFilterModes,
		props.enableRowSelection,
		props.allowColumnFilters,
		props.allowExportData,
		props.allowPrintData,
	]);

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
						fillColor: theme.colors[theme.primaryColor][8],
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

	const handleExportRows = (rows: MRT_Row<T>[], originColumns) => {
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

	const maxHeight =
		`${props.height}`.includes('px') || `${props.height}`.includes('%')
			? `calc(${props.height} - 120px)`
			: `calc(${props.height}px - 120px)`;

	const buildInternalActionsToolbar = () => {
		if (!props.enableTopToolbar) {
			return <div />;
		}

		return (
			<Flex style={{ gap: 0, paddingLeft: 10 }} align="center" className="no-print">
				<CustomToggleGlobalFilterButton variant={props.variant} table={table} />
				<Tooltip withinPortal withArrow label={i18next.t('Refresh')}>
					<ActionIcon
						variant={props.variant}
						size="lg"
						color="var(--mantine-primary-color-filled)"
						style={{ width: '36px', height: '36px', marginRight: 2 }}
						onClick={handleRefresh}
					>
						<IconRefresh size="1.4rem" />
					</ActionIcon>
				</Tooltip>
				{props.allowColumnFilters ? <CustomToggleFiltersButton variant={props.variant} table={table} /> : null}
				<CustomShowHideColumnsButton variant={props.variant} table={table} />
				<Menu position="top-start" width={200} onOpen={handleOpenMenu} onClose={handleCloseMenu}>
					<Menu.Target>
						<Tooltip withinPortal withArrow label={i18next.t('Export')}>
							<ActionIcon
								variant={props.variant}
								size="lg"
								color="var(--mantine-primary-color-filled)"
								style={{ width: '36px', height: '36px', marginRight: 2 }}
							>
								<IconDownload size="1.4rem" />
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
					<ActionIcon
						variant={props.variant}
						size="lg"
						color="var(--mantine-primary-color-filled)"
						style={{ width: '36px', height: '36px', marginRight: 2 }}
						onClick={(event) => handlePrint(table)}
					>
						<IconPrinter size="1.4rem" />
					</ActionIcon>
				</Tooltip>
			</Flex>
		);
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
		enableTopToolbar: props.enableTopToolbar || true,
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
		renderDetailPanel: props.renderDetailPanel,
		mantineTableHeadCellProps: {
			style: {padding: props.tableHeadCellPadding}
		},
		mantinePaperProps: {
			withBorder: props.withBorder,
			shadow: props.withBorder ? 'xs' : '',
			style: {
				width: props.width,
			},
		},
		mantineFilterTextInputProps: {
			style: { borderBottom: 'unset', marginTop: '8px' },
			variant: 'filled',
		},
		mantineFilterSelectProps: {
			style: { borderBottom: 'unset', marginTop: '8px' },
			variant: 'filled',
		},
		positionActionsColumn: props.positionActionsColumn || 'first',
		renderRowActions: props.renderRowActions,
		renderRowActionMenuItems: props.renderRowActionMenuItems,
		renderToolbarInternalActions: props.renderToolbarInternalActions
			? props.renderToolbarInternalActions
			: () => buildInternalActionsToolbar(),
		mantineToolbarAlertBannerProps: props.isError
			? {
					color: 'error',
					children: props.error,
			  }
			: undefined,
		initialState: {
			// @ts-ignore
			density: props.cellPadding,
			showGlobalFilter: true,
		},
		state: {
			isLoading: isLoadingInternal,
			columnFilters,
			sorting,
			globalFilter,
			showProgressBars: isLoadingInternal,
			showSkeletons: false,
			showAlertBanner: props.isError,
			pagination,
			rowSelection,
			showGlobalFilter: (!globalFilter || globalFilter !== '') && props.enableGlobalFilter,
		},
		mantineProgressProps: {
			striped: false,
			animated: true,
			value: 0,
		},
		mantineTableContainerProps: {
			style: { maxHeight },
		},
		mantineSelectCheckboxProps: {
			style: {padding: px(props.tableHeadCellPadding) > px(props.cellPadding) ? `calc(${px(props.tableHeadCellPadding)}px - ${px(props.cellPadding)}px)` : 0}
		},
		mantineTableProps: {
			withColumnBorders: props.withColumnBorders,
			highlightOnHover: props.highlightOnHover,
			fz: props.fontSize,
			style: {
				borderTop: `1px solid ${theme.colors.gray[theme.colorScheme === 'dark' ? 8 : 3]}`,
			},
		},
		mantinePaginationProps: {
			showRowsPerPage: false,
		},
		onRowSelectionChange: setRowSelection,
		renderTopToolbarCustomActions: (table) => getToolBarCustomActions(table, props),
		localization: languages[i18n.language],
		data: isLoadingInternal ? [] : data,
		rowCount: props.dataSource.getGrandTotalRecords(),
		pageCount: props.dataSource.getTotalPages(),
		mantineTableBodyCellProps: ({ cell }) => ({
			onDoubleClick: (event) => {
				//
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
		mantineBottomToolbarProps: {
			style: {
				minHeight: props.bottomToolbarMinHeight ?? '3rem',
			}
		}
	});

	useArchbaseDataSourceListener<T, ID>({
		dataSource: props.dataSource,
		listener: (event: DataSourceEvent<T>): void => {
			if (
				event.type === DataSourceEventNames.dataChanged ||
				event.type === DataSourceEventNames.afterRemove ||
				event.type === DataSourceEventNames.afterSave ||
				event.type === DataSourceEventNames.afterAppend ||
				event.type === DataSourceEventNames.afterCancel
			) {
				setLoadingInternal(true);
				setPagination({
					pageIndex: props.dataSource ? props.dataSource.getCurrentPage() : props.pageIndex,
					pageSize: props.dataSource ? props.dataSource.getPageSize() : props.pageSize,
				});
			}
		},
	});

	useEffect(() => {
		if (props.enableGlobalFilter) {
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
		} else {
			const options = props.dataSource.getOptions();
			options.currentPage = pagination.pageIndex;
			props.dataSource.refreshData(options);
		}
	}, [pagination.pageIndex, pagination.pageSize, JSON.stringify(columnFilters), globalFilter, sorting]);

	return (
		<MantineReactTable table={table} />
	);
}

ArchbaseDataTable.defaultProps = {
	enableColumnResizing: true,
	enableColumnOrdering: true,
	enableRowNumbers: true,
	enableRowSelection: true,
	enableRowActions: true,
	variant: 'filled',
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
	height: '100%',
	pageSize: 15,
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
	cellPadding: 4,
	tableHeadCellPadding: 10
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
	maskOptions?: MaskOptions;
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

export interface ArchbaseTableRowActionsProps<T extends Object> {
	onEditRow: (row: MRT_Row<T>) => void;
	onRemoveRow: (row: MRT_Row<T>) => void;
	onViewRow: (row: MRT_Row<T>) => void;
	row: MRT_Row<T>;
	variant?: string;
}

export function ArchbaseTableRowActions<T extends Object>({
	onEditRow,
	onRemoveRow,
	onViewRow,
	row,
	variant = 'filled',
}: ArchbaseTableRowActionsProps<T>) {
	const theme = useArchbaseTheme();

	return (
		<Box style={{ display: 'flex' }}>
			{onEditRow ? (
				<Tooltip withinPortal withArrow position="left" label={t('Edit')}>
					<ActionIcon
						variant={variant === 'filled' ? 'transparent' : variant}
						color="green"
						onClick={() => onEditRow && onEditRow(row)}
					>
						<IconEdit color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} />
					</ActionIcon>
				</Tooltip>
			) : null}
			{onRemoveRow ? (
				<Tooltip withinPortal withArrow position="right" label={t('Remove')}>
					<ActionIcon
						variant={variant === 'filled' ? 'transparent' : variant}
						color="red"
						onClick={() => onRemoveRow && onRemoveRow(row)}
					>
						<IconTrash color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} />
					</ActionIcon>
				</Tooltip>
			) : null}
			{onViewRow ? (
				<Tooltip withinPortal withArrow position="right" label={t('View')}>
					<ActionIcon
						variant={variant === 'filled' ? 'transparent' : variant}
						color="black"
						onClick={() => onViewRow && onViewRow(row)}
					>
						<IconEye color={theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.dark[4]} />
					</ActionIcon>
				</Tooltip>
			) : null}
		</Box>
	);
}
