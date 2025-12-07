import { Chip, ChipVariant, Flex, Input } from '@mantine/core';
import { uniqueId } from 'lodash';
import React, { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useForceUpdate } from '@mantine/hooks';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseChipGroupProps<T, ID, O> {
	/** Fonte de dados onde será atribuido o valor do ChipGroup (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuido o valor do ChipGroup na fonte de dados */
	dataField?: string;
	/** Evento quando um valor é selecionado */
	onSelectValue?: (value: any) => void;
	/** Function que retorna o label de uma ChipItem */
	getOptionLabel?: (option: O) => string;
	/** Function que retorna o valor de uma ChipItem */
	getOptionValue?: (option: O) => any;
	/** Function que converte os valores do datasource para uma lista de chips selecionados do tipo padrão string[] ou string */
	convertToValue?: (source: any) => string[] | string;
	/** Function que converte o valor selecionado do tipo padrão string[] ou string para o tipo desejado */
	convertFromValue?: (selected: string[] | string) => any;
	/** Opções de seleção iniciais */
	initialOptions?: O[] | object;
	/** Coleção de ChipItem[] que representam as opções do select */
	children?: ReactNode | ReactNode[];
	/** Valor de entrada controlado */
	value?: any;
	/** Valor padrão de entrada não controlado */
	defaultValue?: any;
	/** Controla a aparência do chip, sendo padrão "filled" para dark theme e "outline" para light theme. ("outline" | "light" | "filled")*/
	variant?: ChipVariant;
	/** Tipo do chip */
	type?: 'checkbox' | 'radio';
	/** Permite que múltiplos valores sejam selecionados */
	multiple?: boolean;
	/** Estilo do chip */
	style?: CSSProperties;
	/** Último erro ocorrido no chip */
	error?: string;
	/** Título do edit */
	label?: string;
	/** Descrição do edit */
	description?: string;
	/** Último erro ocorrido no edit */
}

interface ChipItemProps {
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
			return { label: item.props.label, value: item.props.value.toString(), key: uniqueId('chip') };
		});
	}
	if (Array.isArray(initialOptions)) {
		return initialOptions.map((item: O) => {
			return { label: getOptionLabel(item), value: getOptionValue(item), key: uniqueId('chip') };
		});
	}

	return Object.keys(initialOptions).map((key) => ({
		label: key,
		value: initialOptions[key].toString(),
		key: uniqueId('chip'),
	}));
}

export function ArchbaseChipGroup<T, ID, O>({
	dataSource,
	dataField,
	onSelectValue = () => {},
	getOptionLabel = (o: any) => o.label,
	getOptionValue = (o: any) => o.value,
	convertToValue = (value) => (value === undefined || value === null ? '' : value.toString()),
	convertFromValue,
	value,
	defaultValue,
	initialOptions = [],
	children,
	variant,
	type,
	multiple = false,
	error,
	style,
	label,
	description,
}: ArchbaseChipGroupProps<T, ID, O>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseChipGroup',
		dataSource,
		dataField,
		multiple ? [] : ''
	);

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
	}
	const [options, _setOptions] = useState<ChipItemProps[]>(
		buildOptions<O>(initialOptions, children, getOptionLabel, getOptionValue),
	);
	const [selectedValue, setSelectedValue] = useState<any>(multiple ? [] : value);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = multiple ? [] : value;

		if (dataSource && dataField) {
			const fieldValue = dataSource.getFieldValue(dataField);
			if (multiple) {
				const sourceArray = Array.isArray(fieldValue)
					? fieldValue
					: fieldValue === undefined || fieldValue === null
						? []
						: [fieldValue];

				const mapped = sourceArray
					.map((it) => convertToValue(it))
					.flat()
					.filter((it) => it !== undefined && it !== null && it !== '');

				initialValue = Array.isArray(mapped) ? mapped : [mapped];
			} else {
				const converted = convertToValue(fieldValue);
				initialValue = converted !== undefined && converted !== null ? converted : '';
			}
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
				// Salvar no contexto (se disponível)
				validationContext?.setError(fieldKey, event.error);
			}
		}
	}, [v1v2Compatibility.isDataSourceV2, validationContext, fieldKey]);

	// Ref para manter callback sempre atualizado (corrige problema de closure desatualizada)
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	// Wrapper estável que delega para ref
	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	// Registrar listeners com cleanup apropriado
	useEffect(() => {
		loadDataSourceFieldValue();
		if (dataSource && dataField) {
			const hasFieldListener = typeof (dataSource as any).addFieldChangeListener === 'function';
			dataSource.addListener(stableDataSourceEvent);
			if (hasFieldListener) {
				(dataSource as any).addFieldChangeListener(dataField, fieldChangedListener);
			}

			return () => {
				dataSource.removeListener(stableDataSourceEvent);
				if (hasFieldListener) {
					(dataSource as any).removeFieldChangeListener(dataField, fieldChangedListener);
				}
			};
		}
	}, [dataSource, dataField, stableDataSourceEvent, fieldChangedListener]);

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (currentSelectedValue: string | string[]) => {
		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		const nextValue = multiple
			? Array.isArray(currentSelectedValue)
				? currentSelectedValue
				: currentSelectedValue
					? [currentSelectedValue]
					: []
			: currentSelectedValue;

		setSelectedValue((_prev) => nextValue);

		let savedValue = nextValue;
		if (convertFromValue) {
			savedValue = convertFromValue(nextValue);
		}
		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== savedValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(savedValue);
		}

		if (onSelectValue) {
			onSelectValue(savedValue);
		}
	};

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<Input.Wrapper label={label} error={displayError} description={description}>
			<Chip.Group
				defaultValue={undefined}
				value={selectedValue}
				onChange={handleChange}
				multiple={multiple}
			>
				<Flex gap="sm" wrap="wrap" justify="flex-start" align="center">
					{options.map((item) => (
						<Chip style={style} value={item.value} key={item.key} variant={variant} type={type}>
							{item.label}
						</Chip>
					))}
				</Flex>
			</Chip.Group>
		</Input.Wrapper>
	);
}
