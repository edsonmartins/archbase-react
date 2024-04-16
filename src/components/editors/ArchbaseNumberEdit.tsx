/* eslint-disable react/no-find-dom-node */

/* eslint-disable no-underscore-dangle */

/* eslint-disable no-unneeded-ternary */

/* eslint-disable @typescript-eslint/naming-convention */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-expressions */

/* eslint-disable no-nested-ternary */
import { __InputProps, CloseButton, CloseButtonProps, MantineSize, TextInput, TextInputProps } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import {
	useArchbaseDidMount,
	useArchbaseDidUpdate,
	useArchbasePrevious,
	useArchbaseWillUnmount,
} from '../hooks/lifecycle';

function formatNumber(
	value,
	precision = 2,
	decimalSeparator = '.',
	thousandSeparator = ',',
	allowNegative = false,
	prefix = '',
	suffix = '',
) {
	if (precision < 0) {
		precision = 0;
	}
	if (precision > 20) {
		precision = 20;
	}
	if (value === null || value === undefined) {
		return {
			value: 0,
			maskedValue: '',
		};
	}
	value = String(value);
	if (value.length === 0) {
		return {
			value: 0,
			maskedValue: '',
		};
	}
	let digits = value.match(/\d/g) || ['0'];
	let numberIsNegative = false;
	if (allowNegative) {
		const negativeSignCount = (value.match(/-/g) || []).length;
		numberIsNegative = negativeSignCount % 2 === 1;
		let allDigitsAreZero = true;
		for (let idx = 0; idx < digits.length; idx += 1) {
			if (digits[idx] !== '0') {
				allDigitsAreZero = false;
				break;
			}
		}
		if (allDigitsAreZero) {
			numberIsNegative = false;
		}
	}
	while (digits.length <= precision) {
		digits.unshift('0');
	}
	if (precision > 0) {
		digits.splice(digits.length - precision, 0, '.');
	}
	digits = Number(digits.join('')).toFixed(precision).split('');
	let raw = Number(digits.join(''));
	let decimalpos = digits.length - precision - 1;
	if (precision > 0) {
		digits[decimalpos] = decimalSeparator;
	} else {
		decimalpos = digits.length;
	}
	for (let x = decimalpos - 3; x > 0; x -= 3) {
		digits.splice(x, 0, thousandSeparator);
	}
	if (prefix.length > 0) {
		digits.unshift(prefix);
	}
	if (suffix.length > 0) {
		digits.push(suffix);
	}
	if (allowNegative && numberIsNegative) {
		digits.unshift('-');
		raw = -raw;
	}

	return {
		value: raw,
		maskedValue: digits.join('').trim(),
	};
}

export interface ArchbaseNumberEditProps<T, ID>
	extends TextInputProps,
		Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'>,
		React.RefAttributes<HTMLInputElement> {
	/** Determina se o valor de entrada pode ser limpo, adiciona o botão limpar à seção direita, falso por padrão */
	clearable?: boolean;
	/** Adereços adicionados ao botão limpar */
	clearButtonProps?: CloseButtonProps;
	/** Fonte de dados onde será atribuido o valor do number edit */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do number edit na fonte de dados */
	dataField?: string;
	/** Indicador se o number edit está desabilitado */
	disabled: boolean;
	/** Indicador se o number edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly: boolean;
	/** Estilo do number edit */
	style?: CSSProperties;
	/** Tamanho do number edit */
	size?: MantineSize;
	/** Largura do number edit */
	width?: string | number | undefined;
	/** Nome da classe para estilo do number edit */
	className?: string;
	/** Último erro ocorrido no number edit */
	error?: string;
	/** Evento quando o foco sai do edit */
	onFocusExit?: FocusEventHandler<T> | undefined;
	/** Evento quando o edit recebe o foco */
	onFocusEnter?: FocusEventHandler<T> | undefined;
	/** Evento quando o valor do edit é alterado */
	onChangeValue: (maskValue: any, value: number, event: any) => void;
	/** Valor inicial do campo */
	value: number | string;
	/** Caracter separador decimal */
	decimalSeparator: string;
	/** Caracter separador de milhar */
	thousandSeparator: string;
	/** Número de casas decimais */
	precision: number;
	/** Permite números negativos */
	allowNegative: boolean;
	/** Aceita em branco */
	allowEmpty: boolean;
	/** Prefixo */
	prefix: string;
	/** Sufixo */
	suffix: string;
	/** Indicador se aceita apenas números inteiros */
	integer: boolean;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseNumberEdit<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	style,
	className = '',
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	value = 0,
	decimalSeparator = ',',
	thousandSeparator = '.',
	precision = 2,
	allowNegative = true,
	allowEmpty = false,
	clearable = true,
	prefix = '',
	suffix = '',
	integer = false,
	wrapperProps,
	clearButtonProps,
	rightSection,
	unstyled,
	classNames,
	width,
	size,
	error,
	innerRef,
	...others
}: ArchbaseNumberEditProps<T, ID>) {
	const [isOpen, _setIsOpen] = useState(false);
	const [maskedValue, setMaskedValue] = useState<string>('');
	const maskedValuePrev = useArchbasePrevious(maskedValue);
	const [_currentValue, setCurrentValue] = useState<number | undefined>();
	const innerComponentRef = innerRef || useRef<any>();
	const [_inputSelectionStart, setInputSelectionStart] = useState(0);
	const [inputSelectionEnd, setInputSelectionEnd] = useState(0);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setInternalError(undefined);
	}, [maskedValue, _currentValue]);

	const prepareProps = () => {
		let initialValue: any = value;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		if (!initialValue || initialValue === null) {
			initialValue = allowEmpty ? null : '';
		} else {
			if (typeof initialValue === 'string') {
				if (thousandSeparator === '.') {
					initialValue = initialValue.replace(/\./g, '');
				}
				if (decimalSeparator !== '.') {
					initialValue = initialValue.replace(new RegExp(decimalSeparator, 'g'), '.');
				}
				initialValue = initialValue.replace(/[^0-9-.]/g, '');
				initialValue = Number.parseFloat(initialValue);
			}
			initialValue = Number(initialValue).toLocaleString(undefined, {
				style: 'decimal',
				minimumFractionDigits: precision,
				maximumFractionDigits: precision,
			});
		}
		const result = formatNumber(
			initialValue,
			precision,
			decimalSeparator,
			thousandSeparator,
			allowNegative,
			prefix,
			suffix,
		);

		return { maskedValue: result.maskedValue, value: result.value };
	};

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

	const loadDataSourceFieldValue = () => {
		if (dataSource && dataField) {
			const value = dataSource.getFieldValue(dataField);
			const result = formatNumber(value, precision, decimalSeparator, thousandSeparator, allowNegative, prefix, suffix);
			setMaskedValue(result.maskedValue);
			setCurrentValue(0);
		}
	};

	const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
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

	useArchbaseDidMount(() => {
		const result = prepareProps();
		setMaskedValue(result.maskedValue);
		setCurrentValue(result.value);
		if (dataSource && dataField) {
			dataSource.addListener(dataSourceEvent);
			dataSource.addFieldChangeListener(dataField, fieldChangedListener);
		}
		const input = ReactDOM.findDOMNode(innerComponentRef.current) as HTMLInputElement;
		const selectionEnd = Math.min(
			input.selectionEnd ? input.selectionEnd : 0,
			input.value ? input.value.length - suffix.length : 0,
		);
		const selectionStart = Math.min(input.selectionStart ? input.selectionStart : 0, selectionEnd);
		input.setSelectionRange(selectionStart, selectionEnd);
	});

	useArchbaseDidUpdate(() => {
		const input = ReactDOM.findDOMNode(innerComponentRef.current) as HTMLInputElement;
		const value = innerComponentRef?.current ? input.value : '';
		const isNegative = (value.match(/-/g) || []).length % 2 === 1;
		const minPos = prefix.length + (isNegative ? 1 : 0);
		let selectionEnd = Math.max(minPos, Math.min(inputSelectionEnd, value.length - suffix.length));
		let selectionStart = Math.max(minPos, Math.min(inputSelectionEnd, selectionEnd));
		const regexEscapeRegex = /[-[\]{}()*+?.,\\^$|#\s]/g;
		const separatorsRegex = new RegExp(
			`${decimalSeparator.replace(regexEscapeRegex, '\\$&')}|${thousandSeparator.replace(regexEscapeRegex, '\\$&')}`,
			'g',
		);
		if (maskedValue) {
			const prevValue = `${maskedValuePrev}`;
			const currSeparatorCount = (maskedValue.match(separatorsRegex) || []).length;
			const prevSeparatorCount = (prevValue.match(separatorsRegex) || []).length;
			const adjustment = Math.max(currSeparatorCount - prevSeparatorCount, 0);

			selectionEnd += adjustment;
			selectionStart += adjustment;

			const baselength = suffix.length + prefix.length + decimalSeparator.length + Number(precision) + 1;

			if (maskedValue.length === baselength) {
				selectionEnd = value.length - suffix.length;
				selectionStart = selectionEnd;
			}

			input.setSelectionRange(selectionStart, selectionEnd);
			setInputSelectionEnd(selectionEnd);
			setInputSelectionStart(selectionStart);
		}
	}, [isOpen]);

	useArchbaseDidUpdate(() => {
		const result = prepareProps();
		setMaskedValue(result.maskedValue);
		setCurrentValue(result.value);
	}, []);

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	const handleChange = (event) => {
		event.preventDefault();
		const { maskedValue: changedMaskedValue, value: changedValue } = formatNumber(
			event.target.value,
			precision,
			decimalSeparator,
			thousandSeparator,
			allowNegative,
			prefix,
			suffix,
		);

		if (dataSource && !dataSource.isBrowsing() && dataField) {
			dataSource.setFieldValue(dataField, changedValue);
		}

		event.persist();
		setMaskedValue((_prev) => changedMaskedValue);
		setCurrentValue((_prev) => changedValue);
		if (onChangeValue) {
			onChangeValue(changedMaskedValue, changedValue, event);
		}
	};

	const handleOnFocusExit = (event) => {
		setInputSelectionEnd(0);
		setInputSelectionStart(0);
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleOnFocusEnter = (event) => {
		const input = ReactDOM.findDOMNode(innerComponentRef.current) as HTMLInputElement;
		const value = innerComponentRef?.current ? input.value : '';
		const selectionEnd = value.length - suffix.length;
		const isNegative = (value.match(/-/g) || []).length % 2 === 1;
		const selectionStart = prefix.length + (isNegative ? 1 : 0);
		event.target.setSelectionRange(selectionStart, selectionEnd);
		setInputSelectionEnd(selectionEnd);
		setInputSelectionStart(selectionStart);
	};

	const _rightSection =
		rightSection ||
		(clearable && value && !readOnly ? (
			<CloseButton
				variant="transparent"
				onMouseDown={(event) => event.preventDefault()}
				tabIndex={-1}
				onClick={() => {
					setMaskedValue((_prev) => '');
					setCurrentValue((_prev) => 0);
					if (dataSource && !dataSource.isBrowsing() && dataField) {
						dataSource.setFieldValue(dataField, allowEmpty ? null : 0);
					}
				}}
				unstyled={unstyled}
				{...clearButtonProps}
			/>
		) : null);

	const isReadOnly = () => {
		let tmpRreadOnly = readOnly;
		if (dataSource && !readOnly) {
			tmpRreadOnly = dataSource.isBrowsing();
		}

		return tmpRreadOnly;
	};

	return (
		<TextInput
			disabled={!!disabled}
			{...others}
			className={className}
			ref={innerComponentRef}
			type="text"
			value={maskedValue}
			rightSection={_rightSection}
			size={size}
			error={internalError}
			style={{
				width,
				...style,
			}}
			readOnly={isReadOnly()}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			onMouseUp={handleOnFocusExit}
			styles={{
				input: {
					textAlign: 'right',
				},
			}}
		/>
	);
}

ArchbaseNumberEdit.defaultProps = {
	onChangeValue: () => {},
	value: '0',
	decimalSeparator: ',',
	thousandSeparator: '.',
	precision: 2,
	allowNegative: false,
	prefix: '',
	suffix: '',
	readOnly: false,
	integer: false,
	disabled: false,
	onFocusExit: () => {},
	onFocusEnter: () => {},
	allowEmpty: true,
};

ArchbaseNumberEdit.displayName = 'ArchbaseNumberEdit';
