/* eslint-disable no-underscore-dangle */

/* eslint-disable no-unneeded-ternary */

/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable no-nested-ternary */
import {
	__InputProps,
	CloseButton,
	CloseButtonProps,
	Input,
	InputStylesNames,
	InputVariant,
	InputWrapperStylesNames,
	MantineSize,
	PolymorphicFactory,
	Popover,
	PopoverProps,
	StylesApiProps,
	useInputProps,
} from '@mantine/core';
import {
	Calendar,
	CalendarBaseProps,
	CalendarLevel,
	CalendarStylesNames,
	DateValue,
	DecadeLevelSettings,
	HiddenDatesInput,
	MonthLevelSettings,
	pickCalendarProps,
	useDatesContext,
	YearLevelSettings,
} from '@mantine/dates';
import { useDidUpdate, useForceUpdate, useUncontrolled } from '@mantine/hooks';
import dayjs from 'dayjs';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { convertDateToISOString, convertISOStringToDate } from '../core/utils/string-utils';
import { type ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/';

const dateFormats = {
	'DD/MM/YYYY': {
		mask: '00/00/0000',
		format: (date) => {
			if (!date) return '';
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();
			return [day, month, year].join('/');
		},
		parse: (str) => {
			const [day, month, year] = str.split('/');
			return new Date(year, month - 1, day);
		},
	},
	'DD-MM-YYYY': {
		mask: '00-00-0000',
		format: (date) => {
			if (!date) return '';
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();
			return [day, month, year].join('-');
		},
		parse: (str) => {
			const [day, month, year] = str.split('-');
			return new Date(year, month - 1, day);
		},
	},
	'YYYY/MM/DD': {
		mask: '`0000/00/00',
		format: (date) => {
			if (!date) return '';
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();
			return [year, month, day].join('/');
		},
		parse: (str) => {
			const [year, month, day] = str.split('/');
			return new Date(year, month - 1, day);
		},
	},
	'YYYY-MM-DD': {
		mask: '`0000-00-00',
		format: (date) => {
			if (!date) return '';
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();
			return [year, month, day].join('-');
		},
		parse: (str) => {
			const [year, month, day] = str.split('-');
			return new Date(year, month - 1, day);
		},
	},
};

function dateStringParser(dateString: string) {
	const date = new Date(dateString);

	if (Number.isNaN(date.getTime()) || !dateString) {
		return null;
	}

	return date;
}

export function assignTime(originalDate: DateValue, resultDate: DateValue) {
	if (!originalDate || !resultDate) {
		return resultDate;
	}

	const hours = originalDate.getHours();
	const minutes = originalDate.getMinutes();
	const seconds = originalDate.getSeconds();
	const ms = originalDate.getMilliseconds();

	const result = new Date(resultDate);
	result.setHours(hours);
	result.setMinutes(minutes);
	result.setSeconds(seconds);
	result.setMilliseconds(ms);

	return result;
}

interface IsDateValid {
	date: DateValue;
	maxDate?: Date;
	minDate?: Date;
}

function isDateValid({ date, maxDate, minDate }: IsDateValid) {
	if (date == null) {
		return false;
	}

	if (Number.isNaN(date.getTime())) {
		return false;
	}

	if (maxDate && dayjs(date).isAfter(maxDate, 'date')) {
		return false;
	}

	if (minDate && dayjs(date).isBefore(minDate, 'date')) {
		return false;
	}

	return true;
}

export type ArchbaseDatePickerEditStylesNames = CalendarStylesNames | InputStylesNames | InputWrapperStylesNames;

export interface ArchbaseDatePickerEditProps<T, ID>
	extends StylesApiProps<ArchbaseDatePickerEditFactory>,
	__InputProps,
	CalendarBaseProps,
	DecadeLevelSettings,
	YearLevelSettings,
	MonthLevelSettings,
	Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
	/** Analisa a entrada do usuário para convertê-la em um objeto Date */
	dateParser?: (value: string) => DateValue;
	/** Valor do componente controlado */
	value?: DateValue;
	/** Valor padrão para componente não controlado */
	defaultValue?: DateValue;
	/** Chamado quando o valor muda */
	onChange?(value: DateValue): void;
	/** Adereços adicionados ao componente Popover */
	popoverProps?: Partial<Omit<PopoverProps, 'children'>>;
	/** Determina se o valor de entrada pode ser limpo, adiciona o botão limpar à seção direita, falso por padrão */
	clearable?: boolean;
	/** Adereços adicionados ao botão limpar */
	clearButtonProps?: CloseButtonProps;
	/** Determina se o valor de entrada deve ser revertido para o último valor válido conhecido no desfoque, verdadeiro por padrão */
	fixOnBlur?: boolean;
	/** Determina se o valor pode ser desmarcado quando o usuário clica na data selecionada no calendário ou apaga o conteúdo da entrada, verdadeiro se prop limpável estiver definido, falso por padrão */
	allowDeselect?: boolean;
	/** Determina se o tempo (horas, minutos, segundos e milissegundos) deve ser preservado quando uma nova data é escolhida, verdadeiro por padrão */
	preserveTime?: boolean;
	/** Nível máximo que o usuário pode atingir (década, ano, mês), o padrão é década */
	maxLevel?: CalendarLevel;
	/** Nível inicial exibido ao usuário (década, ano, mês), usado para componente não controlado */
	defaultLevel?: CalendarLevel;
	/** Nível atual exibido ao usuário (década, ano, mês), usado para componente controlado */
	level?: CalendarLevel;
	/** Chamado quando o nível muda */
	onLevelChange?(level: CalendarLevel): void;
	/** Fonte de dados onde será atribuido o valor do datePicker */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do datePicker na fonte de dados */
	dataField?: string;
	/** Indicador se o date picker está desabilitado */
	disabled?: boolean;
	/** Indicador se o date picker é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Estilo do date picker */
	style?: CSSProperties;
	/** Tamanho do date picker */
	size?: MantineSize;
	/** Largura do date picker */
	width?: string | number | undefined;
	/** Possíveis formatos para a data */
	dateFormat?: 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'YYYY/MM/DD' | 'YYYY-MM-DD';
	/** Caracter a ser mostrado quando não houver um valor*/
	placeholderChar?: string;
	/** Indicador se o caracter deve ser mostrado quando não houver um valor */
	showPlaceholderFormat?: boolean;
	/** Evento quando o foco sai do date picker */
	onFocusExit?: React.FocusEvent<HTMLInputElement>;
	/** Evento quando o date picker recebe o foco */
	onFocusEnter?: React.FocusEvent<HTMLInputElement>;
	/** Indica se o date picker tem o preenchimento obrigatório */
	required?: boolean;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	/** Último erro ocorrido no datepicker */
	error?: string;
	/** Título do edit */
	title?: string;
}

export type ArchbaseDatePickerEditFactory = PolymorphicFactory<{
	props: ArchbaseDatePickerEditProps<any, any>;
	defaultRef: HTMLInputElement;
	defaultComponent: 'input';
	stylesNames: ArchbaseDatePickerEditStylesNames;
	variant: InputVariant;
}>;

const defaultProps: Partial<ArchbaseDatePickerEditProps<any, any>> = {
	fixOnBlur: true,
	preserveTime: true,
	size: 'sm',
	readOnly: false,
	disabled: false,
	clearable: true,
	required: false,
	placeholderChar: '_',
	showPlaceholderFormat: true,
	dateFormat: 'DD/MM/YYYY',
};

export function ArchbaseDatePickerEdit<T, ID>(props: ArchbaseDatePickerEditProps<T, ID>) {
	const {
		inputProps,
		wrapperProps,
		value,
		defaultValue,
		onChange,
		clearable,
		clearButtonProps,
		popoverProps,
		getDayProps,
		locale,
		dateParser,
		minDate,
		maxDate,
		fixOnBlur,
		onFocus,
		onBlur,
		onClick,
		readOnly,
		name,
		form,
		rightSection,
		unstyled,
		classNames,
		styles,
		allowDeselect,
		preserveTime,
		date,
		defaultDate,
		onDateChange,
		showPlaceholderFormat,
		placeholderChar,
		dateFormat,
		dataSource,
		dataField,
		width,
		innerRef,
		title,
		...rest
	} = useInputProps('ArchbaseDatePickerEdit', defaultProps, props);

	const { calendarProps, others } = pickCalendarProps(rest);
	const innerComponentRef = innerRef || useRef<any>();
	const ctx = useDatesContext();
	const [_value, setValue, controlled] = useUncontrolled({
		value,
		defaultValue,
		finalValue: null,
		onChange,
	});
	const [internalError, setInternalError] = useState<string | undefined>(props.error);
	const forceUpdate = useForceUpdate();

	const [_date, setDate] = useUncontrolled({
		value: date,
		defaultValue: defaultValue || defaultDate,
		finalValue: null,
		onChange: onDateChange,
	});
	const formatValue = (val: DateValue) => (val ? dateFormats[dateFormat!].format(val) : '');
	const [inputValue, setInputValue] = useUncontrolled({
		value: formatValue(_value),
	});

	const defaultDateParser = (val: string) => {
		const parsedDate = dateFormats[dateFormat!].parse(val);
		return Number.isNaN(parsedDate.getTime()) ? dateStringParser(val) : parsedDate;
	};

	const isReadOnly = () => {
		let _readOnly = readOnly;
		if (dataSource && !readOnly) {
			_readOnly = dataSource.isBrowsing();
		}
		return _readOnly;
	};

	const _dateParser = dateParser || defaultDateParser;
	const _allowDeselect = clearable || allowDeselect;

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

	const dataSourceEvent = useCallback((event: DataSourceEvent<any>) => {
		if (dataSource && dataField) {
			if (
				event.type === DataSourceEventNames.dataChanged ||
				event.type === DataSourceEventNames.recordChanged ||
				event.type === DataSourceEventNames.afterScroll ||
				event.type === DataSourceEventNames.afterCancel ||
				event.type === DataSourceEventNames.afterEdit
			) {
				loadDataSourceFieldValue();
				forceUpdate();
			}

			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
			}
		}
	}, []);

	const loadDataSourceFieldValue = useCallback(() => {
		if (dataSource && dataField) {
			const value = dataSource.getFieldValue(dataField);
			if (value) {
				const resultDate: Date = convertISOStringToDate(value);
				const result = dateFormats[dateFormat!].format(resultDate);
				if (result !== inputValue) {
					setInputValue(result);
					setDate(resultDate);
					setValue(resultDate);
				}
			} else {
				setInputValue("");
				setDate(null);
				setValue(null);
			}
		}
	}, []);

	const setDataSourceFieldValue = useCallback((value: Date | undefined | null) => {
		if (dataSource && dataField) {
			const fieldValue = dataSource.getFieldValue(dataField);
			if (!value || value === null) {
				if (value !== fieldValue) {
					dataSource.setFieldValue(dataField, value);
				}
			} else {
				const resultValue = convertDateToISOString(value);
				if (resultValue !== fieldValue) {
					dataSource.setFieldValue(dataField, resultValue);
				}
			}
		}
	}, []);

	useArchbaseDidMount(() => {
		loadDataSourceFieldValue();
		if (dataSource && dataField) {
			dataSource.addListener(dataSourceEvent);
			dataSource.addFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	useEffect(() => {
		setInternalError(undefined);
	}, [_value, _date, inputValue]);

	useEffect(() => {
		if (controlled) {
			setDate(value!);
		}
	}, [controlled, value]);

	useEffect(() => {
		setInputValue(formatValue(_value));
	}, [ctx.locale]);

	const [dropdownOpened, setDropdownOpened] = useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!isReadOnly()) {
			const val = event.currentTarget.value;
			setInputValue(val);

			if (val.trim() === '' && _allowDeselect) {
				setValue(null);
				setDataSourceFieldValue(null);
			} else {
				const dateValue = _dateParser(val);
				if (isDateValid({ date: dateValue, minDate, maxDate })) {
					setValue(dateValue);
					setDate(dateValue);
				}
			}
		}
	};

	const handleComplete = (maskValue) => {
		if (!isReadOnly()) {
			if (maskValue.trim() === '' && _allowDeselect) {
				setValue(null);
				setDataSourceFieldValue(null);
			} else if (maskValue && maskValue.length === 10) {
				const dateValue = dateFormats[dateFormat!].parse(maskValue);
				if (isDateValid({ date: dateValue, minDate, maxDate })) {
					setValue(dateValue);
					setDate(dateValue);
					setInputValue(formatValue(dateValue));
					setDataSourceFieldValue(dateValue);
				}
			}
		}
	};

	const handleAccept = (_maskValue: string, maskRef) => {
		if (!isReadOnly()) {
			if (maskRef.masked.rawInputValue === '' && _allowDeselect) {
				setValue(null);
				setDate(null);
				setDataSourceFieldValue(null);
				setInputValue('');
			}
		}
	};

	const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		onBlur?.(event);
		setDropdownOpened(false);
		if (!isReadOnly()) {
			fixOnBlur && setInputValue(formatValue(_value));
		}
	};

	const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		if (!isReadOnly()) {
			onFocus?.(event);
			setDropdownOpened(true);
		}
	};

	const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
		if (!isReadOnly()) {
			onClick?.(event);
			setDropdownOpened(true);
		}
	};

	const _getDayProps = (day: Date) => ({
		...getDayProps?.(day),
		selected: dayjs(_value).isSame(day, 'day'),
		onClick: () => {
			if (!isReadOnly()) {
				const valueWithTime = preserveTime ? assignTime(_value, day) : day;
				const val = _allowDeselect ? (dayjs(_value).isSame(day, 'day') ? null : valueWithTime) : valueWithTime;
				setValue(val);
				setInputValue(formatValue(val));
				setInternalError(undefined);
				setDropdownOpened(false);
			}
		},
	});

	const _rightSection =
		rightSection ||
		(clearable && _value && !isReadOnly() ? (
			<CloseButton
				variant="transparent"
				onMouseDown={(event) => event.preventDefault()}
				tabIndex={-1}
				onClick={() => {
					setValue(null);
					setInputValue('');
					setDataSourceFieldValue(null);
				}}
				unstyled={unstyled}
				{...clearButtonProps}
			/>
		) : null);

	useDidUpdate(() => {
		value !== undefined && !dropdownOpened && setInputValue(formatValue(value));
	}, [value]);

	return (
		<>
			<Input.Wrapper {...wrapperProps} error={internalError} label={title}>
				<Popover
					opened={dropdownOpened}
					trapFocus={false}
					position="bottom-start"
					disabled={isReadOnly()}
					withinPortal={true}
					withRoles={false}
					{...popoverProps}
				>
					<Popover.Target>
						<Input.Wrapper required={props.required} __staticSelector="ArchbaseDatePickerEdit">
							<Input<any>
								data-dates-input
								data-read-only={readOnly || undefined}
								autoComplete="off"
								ref={innerComponentRef}
								component={IMaskInput}
								rightSection={_rightSection}
								lazy={!showPlaceholderFormat}
								placeholderChar={placeholderChar}
								mask={dateFormats[dateFormat!].mask}
								onBlur={handleInputBlur}
								onFocus={handleInputFocus}
								onClick={handleInputClick}
								onComplete={handleComplete}
								onChange={handleInputChange}
								onAccept={handleAccept}
								readOnly={isReadOnly()}
								value={inputValue}
								style={{
									width,
									...props.style,
								}}
								{...inputProps}
								{...others}
								format={(date) => {
									if (!date) return '';
									const day = String(date.getDate()).padStart(2, '0');
									const month = String(date.getMonth() + 1).padStart(2, '0');
									const year = date.getFullYear();

									return [day, month, year].join('/');
								}}
								parse={(str) => {
									const [day, month, year] = str.split('/');
									return new Date(year, month - 1, day);
								}}
							/>
						</Input.Wrapper>
					</Popover.Target>
					<Popover.Dropdown onMouseDown={(event) => event.preventDefault()} data-dates-dropdown>
						<Calendar
							__staticSelector="ArchbaseDatePickerEdit"
							{...calendarProps}
							classNames={classNames}
							styles={styles}
							unstyled={unstyled}
							__preventFocus
							minDate={minDate}
							maxDate={maxDate}
							locale={ctx.locale}
							getDayProps={_getDayProps}
							size={inputProps.size as MantineSize}
							date={_date ? _date : undefined}
							onDateChange={setDate}
						/>
					</Popover.Dropdown>
				</Popover>
				<HiddenDatesInput name={name ? name : ''} form={form ? form : ''} value={_value} type="default" />
			</Input.Wrapper>
		</>
	);
}

ArchbaseDatePickerEdit.displayName = 'ArchbaseDatePickerEdit';
