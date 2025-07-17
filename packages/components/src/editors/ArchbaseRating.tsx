import { Input, MantineSize, Rating } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import React, { CSSProperties, FocusEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';

export interface ArchbaseRatingProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do rating*/
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do rating na fonte de dados */
	dataField?: string;
	/** Indicador se o rating está desabilitado */
	disabled?: boolean;
	/** Indicador se o rating é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do rating é obrigatório */
	required?: boolean;
	/** Quantidade de controles a ser renderizado */
	count: number;
	/** Valor inicial */
	value?: number;
	/** O ícone que é exibido quando o símbolo está vazio*/
	emptySymbol?: React.ReactNode | ((value: number) => React.ReactNode);
	/** Este ícone que é exibido quando o símbolo está cheio */
	fullSymbol?: React.ReactNode | ((value: number) => React.ReactNode);
	/** Número de frações em que cada item pode ser dividido, 1 por padrão */
	fractions?: number;
	/** Chamado quando o item é pairado */
	onHover?(value: number): void;
	/** A função deve retornar labelText para os símbolos */
	getSymbolLabel?: (value: number) => string;
	/** Nome da avaliação, deve ser único na página */
	name?: string;
	/** Se verdadeiro, apenas o símbolo selecionado mudará para símbolo completo */
	highlightSelectedOnly?: boolean;
	/** Estilo do rating */
	style?: CSSProperties;
	/** Título do rating */
	label?: string;
	/** Descrição do rating */
	description?: string;
	/** Último erro ocorrido no rating */
	error?: string;
	/** Tamanho do rating */
	size?: MantineSize;
	/** Evento quando o foco sai do rating */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o rating recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do rating é alterado */
	onChangeValue?: (value?: number) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseRating<T, ID>({
	dataSource,
	dataField,
	readOnly = false,
	style,
	size,
	innerRef,
	value,
	fractions,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	error,
	label,
	description,
}: ArchbaseRatingProps<T, ID>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<number>(
		'ArchbaseRating',
		dataSource,
		dataField,
		0
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
	}
	const [currentValue, setCurrentValue] = useState<number | undefined>(value);
	const innerComponentRef = innerRef || useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setInternalError(undefined);
	}, [currentValue]);

	const loadDataSourceFieldValue = () => {
		let initialValue: number | undefined = currentValue;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = 0;
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

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (value?: number) => {
		setCurrentValue((_prev) => value);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== value) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(value);
		}

		if (onChangeValue) {
			onChangeValue(value);
		}
	};

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
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	return (
		<Input.Wrapper label={label} error={internalError} description={description}>
			<Rating
				readOnly={isReadOnly()}
				size={size!}
				style={style}
				fractions={fractions}
				value={currentValue}
				ref={innerComponentRef}
				onChange={handleChange}
				onBlur={handleOnFocusExit}
				onFocus={handleOnFocusEnter}
			/>
		</Input.Wrapper>
	);
}
