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
	DateStringValue,
	DecadeLevelSettings,
	HiddenDatesInput,
	MonthLevelSettings,
	pickCalendarProps,
	useDatesContext,
	YearLevelSettings,
} from '@mantine/dates';

// Compatibility type for old DateValue (keeping internal usage as Date)
type DateValue = Date | null;
import { useDidUpdate, useForceUpdate, useUncontrolled } from '@mantine/hooks';
import dayjs from 'dayjs';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { convertDateToISOString, convertISOStringToDate } from '@archbase/core';
import { type ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';

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

	// Ensure we have Date objects
	const origDate = originalDate instanceof Date ? originalDate : new Date(originalDate);
	const resDate = resultDate instanceof Date ? resultDate : new Date(resultDate);

	const hours = origDate.getHours();
	const minutes = origDate.getMinutes();
	const seconds = origDate.getSeconds();
	const ms = origDate.getMilliseconds();

	const result = new Date(resDate);
	result.setHours(hours);
	result.setMinutes(minutes);
	result.setSeconds(seconds);
	result.setMilliseconds(ms);

	return result;
}

interface IsDateValid {
	date: DateValue;
	maxDate?: DateValue;
	minDate?: DateValue;
}

function isDateValid({ date, maxDate, minDate }: IsDateValid) {
	if (date == null) {
		return false;
	}

	// Convert to Date object if it's a string
	const dateObj = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(dateObj.getTime())) {
		return false;
	}

	if (maxDate) {
		const maxDateObj = maxDate instanceof Date ? maxDate : new Date(maxDate);
		if (dayjs(dateObj).isAfter(maxDateObj, 'date')) {
			return false;
		}
	}

	if (minDate) {
		const minDateObj = minDate instanceof Date ? minDate : new Date(minDate);
		if (dayjs(dateObj).isBefore(minDateObj, 'date')) {
			return false;
		}
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
	value?: DateValue | string;
	/** Valor padrão para componente não controlado */
	defaultValue?: DateValue | string;
	/** Chamado quando o valor muda */
	onChange?(value: DateValue): void;
	/** Evento quando o valor é alterado */
	onChangeValue?: (value: any, event: any) => void;
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
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o date picker recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Indica se o date picker tem o preenchimento obrigatório */
	required?: boolean;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	/** Último erro ocorrido no datepicker */
	error?: string;
	/** Título do edit */
	title?: string;
	/** Título do edit */
	label?: string;
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
	dateFormat: 'DD/MM/YYYY'
};

export function ArchbaseDatePickerEdit<T, ID>(props: ArchbaseDatePickerEditProps<T, ID>) {
	const {
		inputProps,
		wrapperProps,
		value,
		defaultValue,
		onChange,
		onChangeValue,
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
		onFocusEnter,
		onFocusExit,
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
	const innerComponentRef = innerRef || useRef<any>(null);
	const ctx = useDatesContext();
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<Date | null>(
		'ArchbaseDatePickerEdit',
		dataSource,
		dataField,
		null
	);

	// 🔄 DEBUG: Log da versão detectada (apenas desenvolvimento)
	if (process.env.NODE_ENV === 'development' && dataSource) {
		console.log(`[ArchbaseDatePickerEdit] DataSource version: ${v1v2Compatibility.dataSourceVersion}`);
	}

	// 🔄 MIGRAÇÃO V1/V2: Converter valores string para Date se necessário
	const processValue = (val: DateValue | string | null) => {
		if (!val) return null;
		if (typeof val === 'string') {
			try {
				// Tentar parsear como data formatada primeiro
				return dateFormats[dateFormat!].parse(val);
			} catch {
				// Se falhar, tentar como ISO string
				try {
					return convertISOStringToDate(val);
				} catch {
					return null;
				}
			}
		}
		return val as DateValue;
	};

	const [_value, setValue, controlled] = useUncontrolled({
		value: processValue(value),
		defaultValue: processValue(defaultValue),
		finalValue: null,
		onChange,
	});
	const [internalError, setInternalError] = useState<string | undefined>(props.error);
	const forceUpdate = useForceUpdate();

	const [_date, setDate] = useUncontrolled({
		value: date ? (typeof date === 'string' ? date : date.toISOString().split('T')[0]) : null,
		defaultValue: _value ? _value.toISOString().split('T')[0] : defaultDate ? (typeof defaultDate === 'string' ? defaultDate : defaultDate.toISOString().split('T')[0]) : null,
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
			// 🔄 MIGRAÇÃO V1/V2: Usar compatibilidade para determinar readonly
			_readOnly = v1v2Compatibility.isReadOnly(readOnly);
		}
		return _readOnly;
	};

	const _dateParser = dateParser || defaultDateParser;
	const _allowDeselect = clearable || allowDeselect;

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

	// 🔄 MIGRAÇÃO V1/V2: Event listener compatível
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
				
				// 🔄 MIGRAÇÃO V1/V2: forceUpdate apenas para V1
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
				// V2 atualiza automaticamente via estado otimizado
			}

			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
			}
		}
	}, [v1v2Compatibility.isDataSourceV2]);

	const loadDataSourceFieldValue = useCallback(() => {
		if (dataSource && dataField) {
			const value = dataSource.getFieldValue(dataField);
			if (value) {
				// 🔄 MIGRAÇÃO V1/V2: Tratar tanto strings formatadas quanto ISO strings
				let resultDate: Date;
				let result: string;
				
				if (typeof value === 'string') {
					// Tentar parsear como data formatada primeiro
					try {
						resultDate = dateFormats[dateFormat!].parse(value);
						if (isNaN(resultDate.getTime())) {
							throw new Error('Invalid date');
						}
						result = value; // Já está no formato correto
					} catch {
						// Se falhar, tentar como ISO string
						resultDate = convertISOStringToDate(value);
						result = dateFormats[dateFormat!].format(resultDate);
					}
				} else {
					// Assumir que é Date
					resultDate = value instanceof Date ? value : new Date(value);
					result = dateFormats[dateFormat!].format(resultDate);
				}
				
				if (result !== inputValue) {
					setInputValue(result);
					setDate(resultDate.toISOString().split('T')[0]);
					setValue(resultDate);
				}
			} else {
				setInputValue("");
				setDate(null);
				setValue(null);
			}
		}
	}, [dataField, dataSource, dateFormat, inputValue]);

	const setDataSourceFieldValue = useCallback((value: Date | undefined | null | string) => {
		if (dataSource && dataField) {
			// 🔄 MIGRAÇÃO V1/V2: Para compatibilidade V1, usar strings formatadas ao invés de ISO
			let processedValue: any = value;
			
			if (value && typeof value !== 'string') {
				// Se for Date, converter para string formatada (formato do input)
				processedValue = formatValue(value);
			}
			
			v1v2Compatibility.handleValueChange(processedValue);
		}
	}, [v1v2Compatibility.handleValueChange, dateFormat]);

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
		if (controlled && _value) {
			setDate(_value.toISOString().split('T')[0]);
		}
	}, [controlled, _value]);

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
				setDataSourceFieldValue('');
				onChangeValue?.(null, event);
			} else {
				const dateValue = _dateParser(val);
				// Convert minDate and maxDate to DateValue for validation
				const minDateValue = minDate ? (typeof minDate === 'string' ? new Date(minDate) : minDate) : undefined;
				const maxDateValue = maxDate ? (typeof maxDate === 'string' ? new Date(maxDate) : maxDate) : undefined;
				if (isDateValid({ date: dateValue, minDate: minDateValue, maxDate: maxDateValue })) {
					setValue(dateValue);
					setDate(dateValue ? (typeof dateValue === 'string' ? dateValue : dateValue.toISOString().split('T')[0]) : null);
					setDataSourceFieldValue(val);
					onChangeValue?.(val, event);
				}
			}
		}
	};

	const handleComplete = (maskValue) => {
		if (!isReadOnly()) {
			if (maskValue.trim() === '' && _allowDeselect) {
				setValue(null);
				setDataSourceFieldValue('');
				onChangeValue?.(null, { target: { value: maskValue } });
			} else if (maskValue && maskValue.length === 10) {
				const dateValue = dateFormats[dateFormat!].parse(maskValue);
				// Convert minDate and maxDate to DateValue for validation
				const minDateValue = minDate ? (typeof minDate === 'string' ? new Date(minDate) : minDate) : undefined;
				const maxDateValue = maxDate ? (typeof maxDate === 'string' ? new Date(maxDate) : maxDate) : undefined;
				if (isDateValid({ date: dateValue, minDate: minDateValue, maxDate: maxDateValue })) {
					setValue(dateValue);
					setDate(dateValue ? (typeof dateValue === 'string' ? dateValue : dateValue.toISOString().split('T')[0]) : null);
					setInputValue(formatValue(dateValue));
					setDataSourceFieldValue(maskValue);
					onChangeValue?.(maskValue, { target: { value: maskValue } });
				}
			}
		}
	};

	const handleAccept = (_maskValue: string, maskRef) => {
		if (!isReadOnly()) {
			if (maskRef.masked.rawInputValue === '' && _allowDeselect) {
				setValue(null);
				setDate(null);
				setDataSourceFieldValue('');
				setInputValue('');
				onChangeValue?.('', { target: { value: '' } });
			}
		}
	};

	const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		onBlur?.(event);
		onFocusExit?.(event);
		setDropdownOpened(false);
		if (!isReadOnly()) {
			fixOnBlur && setInputValue(formatValue(_value));
		}
	};

	const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		if (!isReadOnly()) {
			onFocus?.(event);
			onFocusEnter?.(event);
			setDropdownOpened(true);
		}
	};

	const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
		if (!isReadOnly()) {
			onClick?.(event);
			setDropdownOpened(true);
		}
	};

	const _getDayProps = (dayString: DateStringValue) => {
		const day = new Date(dayString);
		return {
			...getDayProps?.(dayString),
			selected: dayjs(_value).isSame(day, 'day'),
			onClick: () => {
				if (!isReadOnly()) {
					const valueWithTime = preserveTime ? assignTime(_value, day) : day;
					const val = _allowDeselect ? (dayjs(_value).isSame(day, 'day') ? null : valueWithTime) : valueWithTime;
					setValue(val);
					const formattedValue = formatValue(val);
					setInputValue(formattedValue);
					setInternalError(undefined);
					setDropdownOpened(false);
					setDataSourceFieldValue(formattedValue);
					onChangeValue?.(formattedValue, { target: { value: formattedValue } });
				}
			},
		};
	};

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
					setDataSourceFieldValue('');
					onChangeValue?.('', { target: { value: '' } });
				}}
				unstyled={unstyled}
				{...clearButtonProps}
			/>
		) : null);

	useDidUpdate(() => {
		value !== undefined && !dropdownOpened && setInputValue(formatValue(_value));
	}, [_value]);

	return (
		<>
			<Input.Wrapper {...wrapperProps} error={internalError} label={title||props.label}>
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
