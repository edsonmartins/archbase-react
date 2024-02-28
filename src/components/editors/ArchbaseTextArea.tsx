import { MantineSize, Textarea } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isBase64 } from '../core/utils';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

export interface ArchbaseTextAreaProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do textarea */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do textarea na fonte de dados */
	dataField?: string;
	/** Indicador se o textarea está desabilitado */
	disabled?: boolean;
	/** Indicador se o textarea é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do textarea é obrigatório */
	required?: boolean;
	/** Estilo do textarea */
	style?: CSSProperties;
	/** Tamanho do textarea */
	size?: MantineSize;
	/** Largura do textarea */
	width?: string | number | undefined;
	/** Indicador se textarea crescerá com o conteúdo até que maxRows sejam atingidos  */
	autosize?: boolean;
	/** Número mínimo de linhas obrigatórias */
	minRows?: number;
	/** Número máximo de linhas aceitas */
	maxRows?: number;
	/** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
	disabledBase64Convertion?: boolean;
	/** Texto sugestão do textarea */
	placeholder?: string;
	/** Título do textarea */
	label?: string;
	/** Descrição do textarea */
	description?: string;
	/** Último erro ocorrido no textarea */
	error?: string;
	/** Evento quando o foco sai do textarea */
	onFocusExit?: FocusEventHandler<T> | undefined;
	/** Evento quando o textarea recebe o foco */
	onFocusEnter?: FocusEventHandler<T> | undefined;
	/** Evento quando o valor do textarea é alterado */
	onChangeValue?: (value: any, event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLTextAreaElement> | undefined;
}

export function ArchbaseTextArea<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	style,
	placeholder,
	label,
	description,
	error,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	autosize = false,
	minRows,
	maxRows,
	required = false,
	disabledBase64Convertion = false,
	innerRef,
}: ArchbaseTextAreaProps<T, ID>) {
	const [value, setValue] = useState<string>('');
	const innerComponentRef = useRef<any>();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setInternalError(undefined);
	}, [value]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = value;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		if (isBase64(initialValue) && !disabledBase64Convertion) {
			initialValue = atob(initialValue);
		}

		setValue(initialValue);
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
				forceUpdate();
			}
			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
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

	const handleChange = (event) => {
		event.preventDefault();
		const changedValue = event.target.value;

		event.persist();
		setValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
			dataSource.setFieldValue(dataField, disabledBase64Convertion ? changedValue : btoa(changedValue));
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

	return (
		<Textarea
			disabled={disabled}
			readOnly={readOnly}
			style={style}
			value={value}
			ref={innerRef || innerComponentRef}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			placeholder={placeholder}
			label={label}
			description={description}
			error={internalError}
			autosize={autosize}
			minRows={minRows}
			maxRows={maxRows}
			required={required}
		/>
	);
}
