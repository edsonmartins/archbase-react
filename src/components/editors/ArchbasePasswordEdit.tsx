import {
	ActionIcon,
	InputVariant,
	MantineSize,
	PasswordInput,
	TextInput,
	Tooltip,
	useMantineTheme,
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';
import { useArchbaseV1V2Compatibility } from '../core/patterns/ArchbaseV1V2CompatibilityPattern';

export interface ArchbasePasswordEditProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do edit */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
	dataField?: string;
	/** Indicador se o edit está desabilitado */
	disabled?: boolean;
	/** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do edit é obrigatório */
	required?: boolean;
	/** Valor inicial */
	value?: string;
	/** Estilo do edit */
	style?: CSSProperties;
	/** Tamanho do edit */
	size?: MantineSize;
	/** Largura do edit */
	width?: string | number | undefined;
	/** Texto sugestão do edit */
	placeholder?: string;
	/** Título do edit */
	label?: string;
	/** Descrição do edit */
	description?: string;
	/** Último erro ocorrido no edit */
	error?: string;
	/** Evento quando o foco sai do edit */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o edit recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do edit é alterado */
	onChangeValue?: (value: any, event: any) => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	variant?: InputVariant;
}

export function ArchbasePasswordEdit<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	style,
	placeholder,
	label,
	description,
	error,
	required,
	size,
	width,
	innerRef,
	value,
	onKeyDown,
	onKeyUp,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	variant,
}: ArchbasePasswordEditProps<T, ID>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbasePasswordEdit',
		dataSource,
		dataField,
		''
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
		console.log(`[ArchbasePasswordEdit] DataSource version: ${v1v2Compatibility.dataSourceVersion}`);
	}

	const [currentValue, setCurrentValue] = useState<string>(value || '');
	const innerComponentRef = useRef<any>();
	const theme = useMantineTheme();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setInternalError(undefined);
	}, [currentValue]);

	useEffect(() => {
		if (error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = currentValue;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		setCurrentValue(initialValue);
	};

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

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
				// 🔄 MIGRAÇÃO V1/V2: forceUpdate apenas para V1
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
			}

			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
			}
		}
	}, [v1v2Compatibility.isDataSourceV2]);

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

	const handleChange = (event) => {
		event.preventDefault();
		const changedValue = event.target.value;

		event.persist();
		setCurrentValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(changedValue);
		}

		if (onChangeValue) {
			onChangeValue(event, changedValue);
		}
	};

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	const handleOnFocusExit = (event) => {
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleOnFocusEnter = (event) => {
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const isReadOnly = () => {
		// 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
		return v1v2Compatibility.isReadOnly(readOnly);
	};

	return (
		<PasswordInput
			disabled={disabled}
			readOnly={isReadOnly()}
			size={size!}
			style={{
				width,
				...style,
			}}
			value={currentValue}
			ref={innerRef || innerComponentRef}
			required={required}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			placeholder={placeholder}
			description={description}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			label={label}
			error={internalError}
		/>
	);
}
