import {
	ActionIcon,
	ActionIconVariant,
	MantineSize,
	Tooltip,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForceUpdate } from '@mantine/hooks';
import { IconClock } from '@tabler/icons-react';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseTimeEditProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do edit (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
	dataField?: string;
	/** Indicador se o edit está desabilitado */
	disabled?: boolean;
	/** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do edit é obrigatório */
	required?: boolean;
	/** Valor inicial no formato HH:MM */
	value?: string;
	/** Estilo do edit */
	style?: CSSProperties;
	/** Tamanho do edit */
	size?: MantineSize;
	/** Largura do edit */
	width?: string | number | undefined;
	/** Icone à direita (substitui o ícone padrão de relógio) */
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
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o edit recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do edit é alterado */
	onChangeValue?: (value: string, event: any) => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	variant?: ActionIconVariant;
	/** Controla se o picker de hora será exibido */
	withPicker?: boolean;
}

export function ArchbaseTimeEdit<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	style,
	placeholder = "HH:MM",
	label,
	description,
	error,
	required,
	size,
	width,
	innerRef,
	value,
	icon,
	onKeyDown,
	onKeyUp,
	onActionSearchExecute,
	tooltipIconSearch = 'Clique aqui para Localizar',
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	variant,
	withPicker = true
}: ArchbaseTimeEditProps<T, ID>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbaseTimeEdit',
		dataSource,
		dataField,
		''
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
	}

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	const [currentValue, setCurrentValue] = useState<string>(value || '');
	const timeInputRef = useRef<HTMLInputElement>(null);
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// ❌ REMOVIDO: Não limpar erro automaticamente quando valor muda
	// O erro deve ser limpo apenas quando o usuário EDITA o campo (no handleChange)
	// useEffect(() => {
	// 	setInternalError(undefined);
	// }, [currentValue]);

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
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

	const handleChange = (event) => {
		event.preventDefault();
		const changedValue = event.target.value;

		event.persist();

		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setCurrentValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(changedValue);
		}

		if (onChangeValue) {
			onChangeValue(changedValue, event);
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

	// Componente padrão do picker de hora
	const defaultPickerControl = (
		<ActionIcon
			variant="subtle"
			color="gray"
			onClick={() => timeInputRef.current?.showPicker()}
			disabled={disabled || isReadOnly()}
		>
			<IconClock size="1rem" stroke={1.5} />
		</ActionIcon>
	);

	// Componente de botão de pesquisa personalizado
	const searchButton = onActionSearchExecute ? (
		<Tooltip withinPortal withArrow label={tooltipIconSearch}>
			<ActionIcon
				style={{
					backgroundColor:
						variant === 'filled'
							? colorScheme === 'dark'
								? theme.colors[theme.primaryColor][5]
								: theme.colors[theme.primaryColor][6]
							: undefined,
				}}
				tabIndex={-1}
				variant={variant}
				onClick={onActionSearchExecute}
				disabled={disabled || isReadOnly()}
			>
				{icon || <IconClock size="1rem" stroke={1.5} />}
			</ActionIcon>
		</Tooltip>
	) : null;

	// Define o que será exibido à direita do componente
	const rightSection = onActionSearchExecute
		? searchButton
		: (withPicker ? defaultPickerControl : null);

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<TimeInput
			disabled={disabled}
			readOnly={isReadOnly()}
			size={size!}
			style={{
				width,
				...style,
			}}
			value={currentValue}
			ref={innerRef || timeInputRef}
			required={required}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			placeholder={placeholder}
			description={description}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			label={label}
			error={displayError}
			rightSection={rightSection}
		/>
	);
}
