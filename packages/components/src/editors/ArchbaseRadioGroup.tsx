import { MantineSize, Radio } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { uniqueId } from 'lodash';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';

export interface ArchbaseRadioGroupProps<T, ID, O> {
	/** Fonte de dados onde será atribuido o valor do RadioGroup*/
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do RadioGroup na fonte de dados */
	dataField?: string;
	/** Estilo do componente */
	style?: CSSProperties;
	/** Estilo do componente filho */
	childStyle?: CSSProperties;
	/** Tamanho do edit */
	size?: MantineSize;
	/** Título do RadioGroup */
	label?: string;
	/** Descrição do RadioGroup */
	description?: string;
	/** Último erro ocorrido no RadioGroup */
	error?: string;
	/** Evento quando o foco sai do RadioGroup */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o RadioGroup recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando um valor é selecionado */
	onSelectValue?: (value: any) => void;
	/** Function que retorna o label de uma RadioItem */
	getOptionLabel?: (option: O) => string;
	/** Function que retorna o valor de uma RadioItem */
	getOptionValue?: (option: O) => any;
	/** Function que converte o valor selecionado do tipo padrão string para o tipo desejado */
	convertFromString?: (selected: string) => any;
	/** Opções de seleção iniciais */
	initialOptions?: O[] | object;
	/** Coleção de RadioItem[] que representam as opções do select */
	children?: ReactNode | ReactNode[];
	/** Valor de entrada controlado */
	value?: any;
	/** Valor padrão de entrada não controlado */
	defaultValue?: any;
	/** Direção dos itens do RadioGroup */
	direction?: 'horizontal' | 'vertical';
}

interface RadioItemProps {
	label: string;
	value: any;
	key: string;
}

function buildOptions<O>(
	initialOptions: O[] | object,
	children: ReactNode | ReactNode[] | undefined,
	getOptionLabel: (option: O) => string,
	getOptionValue: (option: O) => any,
): any {
	if (!initialOptions && !children) {
		return [];
	}

	if (children) {
		return React.Children.toArray(children).map((item: any) => {
			return { label: item.props.label, value: item.props.value.toString(), key: uniqueId('radio') };
		});
	}
	if (Array.isArray(initialOptions)) {
		return initialOptions.map((item: O) => {
			return { label: getOptionLabel(item), value: getOptionValue(item), key: uniqueId('radio') };
		});
	}

	return Object.keys(initialOptions).map((key) => ({
		label: key,
		value: initialOptions[key].toString(),
		key: uniqueId('radio'),
	}));
}

export function ArchbaseRadioGroup<T, ID, O>({
	dataSource,
	dataField,
	style,
	childStyle,
	size,
	label,
	description,
	error,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onSelectValue = () => {},
	getOptionLabel = (o: any) => o.label,
	getOptionValue = (o: any) => o.value,
	convertFromString,
	value,
	defaultValue,
	initialOptions = [],
	children,
	direction = 'vertical',
}: ArchbaseRadioGroupProps<T, ID, O>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseRadioGroup',
		dataSource,
		dataField,
		''
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
	}
	const [options, _setOptions] = useState<RadioItemProps[]>(
		buildOptions<O>(initialOptions, children, getOptionLabel, getOptionValue),
	);
	const [selectedValue, setSelectedValue] = useState<any>(value);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setInternalError(undefined);
	}, [options, selectedValue]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = value;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}
		if (typeof initialValue !== 'string') {
			initialValue = initialValue.toString();
		}
		setSelectedValue(initialValue);
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

	const handleChange = (currentSelectedValue: string) => {
		setSelectedValue((_prev) => currentSelectedValue);

		let savedValue = currentSelectedValue;
		if (convertFromString) {
			savedValue = convertFromString(currentSelectedValue);
		}
		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== savedValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(savedValue);
		}

		if (onSelectValue) {
			onSelectValue(savedValue);
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

	return (
		<Radio.Group
			description={description}
			defaultValue={selectedValue ? getOptionValue(selectedValue) : defaultValue}
			value={selectedValue}
			label={label}
			style={style}
			size={size}
			error={internalError}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			dir={direction === 'horizontal' ? 'row' : undefined}
			display={direction === 'horizontal' ? 'flex' : undefined}
		>
			{options.map((item) => (
				<Radio
					style={childStyle}
					label={item.label}
					value={item.value}
					key={item.key}
					pr={direction === 'horizontal' ? 20 : 0}
					checked={item.value === selectedValue}
				/>
			))}
		</Radio.Group>
	);
}
