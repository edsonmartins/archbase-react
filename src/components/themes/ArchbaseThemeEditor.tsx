import { Card, ColorPicker, MantineSize } from '@mantine/core';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useArchbaseV1V2Compatibility } from '../core/patterns/ArchbaseV1V2CompatibilityPattern';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { useArchbaseDataSourceListener } from '../hooks';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

export interface ArchbaseThemeEditorProps<T, ID> {
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
	/** Icone à direita */
	icon?: ReactNode;
	/** Dica para botão localizar */
	tooltipIconSearch?: string;
	/** Evento ocorre quando clica no botão localizar */
	onActionSearchExecute?: () => void;
	/** Texto sugestão do edit */
	placeholder?: string;
	/** Título do edit */
	label?: string;
	/** Descrição do edit */
	description?: string;
	/** Último erro ocorrido no edit */
	error?: string;
	/** Evento quando o foco sai do edit */
	onFocusExit?: FocusEventHandler<T> | undefined;
	/** Evento quando o edit recebe o foco */
	onFocusEnter?: FocusEventHandler<T> | undefined;
	/** Evento quando o valor do edit é alterado */
	onChangeValue?: (value: any, event: any) => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseThemeEditor<T, ID>({ 
	dataSource, 
	dataField, 
	value,
	onChangeValue,
	disabled = false,
	readOnly = false,
	...props 
}: ArchbaseThemeEditorProps<T, ID>) {
	// V1/V2 Compatibility Pattern
	const {
		isDataSourceV2,
		currentValue,
		handleValueChange,
		dataSourceEvent,
		loadDataSourceFieldValue,
		isReadOnly
	} = useArchbaseV1V2Compatibility<string>(
		'ArchbaseThemeEditor',
		dataSource,
		dataField,
		value || ''
	);

	// DataSource listener setup
	useArchbaseDataSourceListener<T, ID>({
		dataSource,
		listener: dataSourceEvent
	});

	// Load initial value
	useEffect(() => {
		loadDataSourceFieldValue();
	}, [loadDataSourceFieldValue]);

	// Handle color change
	const handleColorChange = useCallback((color: string) => {
		handleValueChange(color, { target: { value: color } });
		
		// External callback
		if (onChangeValue) {
			onChangeValue(color, { target: { value: color } });
		}
	}, [handleValueChange, onChangeValue]);

	return (
		<Card>
			<ColorPicker 
				value={currentValue || '#000000'}
				onChange={handleColorChange}
				disabled={disabled || isReadOnly}
				{...props}
			/>
		</Card>
	);
}
