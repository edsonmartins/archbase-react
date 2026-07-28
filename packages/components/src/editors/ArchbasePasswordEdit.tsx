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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import type {
	ArchbasePasswordPolicy,
	ArchbasePasswordValidationResult,
} from '@archbase/core';
import { resolveArchbasePasswordPolicy, useValidationErrors, validateArchbasePassword } from '@archbase/core';
import { ArchbasePasswordStrengthMeter } from './ArchbasePasswordStrengthMeter';

export interface ArchbasePasswordEditProps<T, ID> {
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
	/**
	 * Critérios de senha forte aplicados como pré-validação no próprio componente.
	 * `true` aplica a política padrão do Archbase; um objeto permite ajustar cada critério.
	 * Quando ausente nenhuma validação de força é feita (comportamento original).
	 */
	passwordPolicy?: ArchbasePasswordPolicy | boolean;
	/** Indicador se a lista de critérios deve ser exibida. Padrão: true quando há política */
	showPasswordRequirements?: boolean;
	/** Indicador se a barra de força deve ser exibida. Padrão: true quando há política */
	showPasswordStrengthBar?: boolean;
	/**
	 * Quando os critérios ficam visíveis:
	 * `onFocus` (padrão) enquanto o campo tem foco ou está inválido,
	 * `always` sempre, `whenInvalid` somente quando algum critério falha.
	 */
	passwordRequirementsVisibility?: 'always' | 'onFocus' | 'whenInvalid';
	/** Evento disparado a cada mudança no resultado da pré-validação */
	onPasswordValidation?: (result: ArchbasePasswordValidationResult) => void;
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
	passwordPolicy,
	showPasswordRequirements = true,
	showPasswordStrengthBar = true,
	passwordRequirementsVisibility = 'onFocus',
	onPasswordValidation,
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
	}

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	const [currentValue, setCurrentValue] = useState<string>(value || '');
	const innerComponentRef = useRef<any>(null);
	const theme = useMantineTheme();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// Pré-validação de senha forte: só entra em ação quando uma política é informada.
	const resolvedPolicy = useMemo(() => resolveArchbasePasswordPolicy(passwordPolicy), [passwordPolicy]);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [policyError, setPolicyError] = useState<string | undefined>(undefined);

	const policyResult = useMemo(
		() => (resolvedPolicy ? validateArchbasePassword(currentValue, resolvedPolicy) : undefined),
		[currentValue, resolvedPolicy]
	);

	useEffect(() => {
		if (policyResult && onPasswordValidation) {
			onPasswordValidation(policyResult);
		}
	}, [policyResult]);

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
				event.type === DataSourceEventNames.afterInsert ||
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

	// Wrapper estável que delega para ref - nunca muda, então o listener permanece consistente
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

		// O erro de política reaparece no blur; enquanto digita o feedback fica na lista de critérios.
		if (policyError) {
			setPolicyError(undefined);
		}

		setCurrentValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(changedValue);
		}

		if (onChangeValue) {
			onChangeValue(event, changedValue);
		}
	};

	const handleOnFocusExit = (event) => {
		setIsFocused(false);
		// Só acusa erro depois que o usuário terminou de digitar e o campo tem conteúdo.
		if (policyResult && currentValue) {
			setPolicyError(policyResult.error);
		}
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleOnFocusEnter = (event) => {
		setIsFocused(true);
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const isReadOnly = () => {
		// 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	// Erro a ser exibido: local, do contexto ou da política de senha
	const displayError = internalError || contextError || policyError;

	const shouldShowPolicyFeedback = (): boolean => {
		if (!policyResult || isReadOnly() || disabled) {
			return false;
		}
		switch (passwordRequirementsVisibility) {
			case 'always':
				return true;
			case 'whenInvalid':
				return currentValue.length > 0 && !policyResult.valid;
			default:
				return isFocused || (currentValue.length > 0 && !policyResult.valid);
		}
	};

	const passwordInput = (
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
			error={displayError}
		/>
	);

	if (!resolvedPolicy) {
		return passwordInput;
	}

	return (
		<div style={{ width }}>
			{passwordInput}
			{shouldShowPolicyFeedback() && (
				<ArchbasePasswordStrengthMeter
					value={currentValue}
					policy={resolvedPolicy}
					showStrengthBar={showPasswordStrengthBar}
					showRequirements={showPasswordRequirements}
				/>
			)}
		</div>
	);
}
