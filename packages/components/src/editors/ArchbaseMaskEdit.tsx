/**
 * ArchbaseMaskEdit — input mascarado com padrões comuns e integração com dataSource.
 * @status stable
 */
import {
	__InputProps,
	Input,
	InputStylesNames,
	InputVariant,
	InputWrapperStylesNames,
	MantineSize,
	PolymorphicFactory,
	StylesApiProps,
	useInputProps,
} from '@mantine/core';
import { useForceUpdate, useId } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IMaskInput } from 'react-imask';
import type { ArchbaseDataSource, DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useArchbaseTranslation } from '@archbase/core';
import { useValidationErrors } from '@archbase/core';

export enum MaskPattern {
	CNPJ = '00.000.000/0000-00',
	CEP = '00.000-000',
	CPF = '000.000.000-00',
	PLACA = 'aaa-00*00',
	PHONE = '(00) 00000-0000',
}

export type ArchbaseMaskEditStylesNames = InputStylesNames | InputWrapperStylesNames;

export interface ArchbaseMaskEditProps<T, ID>
	extends StylesApiProps<ArchbaseMaskEditFactory>,
	__InputProps,
	Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
	/** Tipo de campo html */
	type?: React.HTMLInputTypeAttribute;
	/** Propriedades para atribuir ao wrapper do mask edit */
	wrapperProps?: Record<string, any>;
	/** Nome do seletor estático */
	__staticSelector?: string;
	/** Fonte de dados onde será atribuido o valor do mask edit (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuido o valor do mask edit na fonte de dados */
	dataField?: string;
	/** Indicador se o mask edit está desabilitado */
	disabled?: boolean;
	/** Indicador se o mask edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Estilo do mask edit */
	style?: CSSProperties;
	/** Tamanho do mask edit */
	size?: MantineSize;
	/** Largura do mask edit */
	width?: string | number | undefined;
	/** Valor inicial do mask edit */
	value?: any;
	/** Texto sugestão do mask edit */
	placeholder?: string;
	/** Caractere a ser mostrado onde não houver valor no campo */
	placeholderChar?: string;
	/** Indicador se apresenta ou não a máscara */
	showMask?: boolean;
	/** Mascara podendo ser o tipo MaskPattern, uma Function ou uma string. Mais detalhes em: https://github.com/uNmAnNeR/imaskjs */
	mask?: MaskPattern | Function | string;
	/** Indicador se deverá ser salvo o valor com a máscara */
	saveWithMask?: boolean;
	/** Evento quando o foco sai do edit */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o edit recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do edit é alterado */
	onChangeValue?: (value: string, event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	/** Último erro ocorrido no mask edit */
	error?: string;
	/** Título do edit */
	title?: string;
	/** Título do edit */
	label?: string;
	/** Evento que retorna o valor do erro */
	onChangeError?: (error: string) => void;
	/** Mensagem customizada a ser exibida quando o campo está incompleto */
	customIncompleteErrorMessage?: string;
}

export type ArchbaseMaskEditFactory = PolymorphicFactory<{
	props: ArchbaseMaskEditProps<any, any>;
	defaultRef: HTMLInputElement;
	defaultComponent: 'input';
	stylesNames: ArchbaseMaskEditStylesNames;
	variant: InputVariant;
}>;

const defaultProps: Partial<ArchbaseMaskEditProps<any, any>> = {
	type: 'text',
	size: 'sm',
	__staticSelector: 'ArchbaseMaskEdit',
	value: '',
	readOnly: false,
	disabled: false,
	placeholderChar: '_',
	placeholder: '',
	mask: '',
	showMask: true,
	saveWithMask: false
};

export function ArchbaseMaskEdit<T, ID>(props: ArchbaseMaskEditProps<any, any>) {
	const {
		inputProps,
		wrapperProps,
		mask,
		placeholderChar,
		placeholder,
		readOnly,
		disabled,
		width,
		innerRef,
		title,
		onChangeError,
		customIncompleteErrorMessage,
		...others
	} = useInputProps('ArchbaseMaskEdit', defaultProps, props);
	const id = useId();
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbaseMaskEdit',
		props.dataSource,
		props.dataField,
		''
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && props.dataSource) {
	}

	const innerComponentRef = innerRef || useRef<any>(null);
	const [value, setValue] = useState<string>('');
	const forceUpdate = useForceUpdate();
	const { dataSource, dataField, onChangeValue, onFocusEnter, onFocusExit, saveWithMask, error } = props;
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const specialCharactersLength = useRef(0);
	const { t } = useArchbaseTranslation();

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	// ❌ REMOVIDO: Não limpar erro automaticamente quando valor muda
	// O erro deve ser limpo apenas quando o usuário EDITA o campo (no handleAccept)
	// useEffect(() => {
	// 	setInternalError(undefined);
	// }, [value]);

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	useEffect(() => {
		if(onChangeError) {
			onChangeError(internalError)
		}
	}, [internalError]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = value;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		setValue(initialValue);
	};

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

	const dataSourceEvent = useCallback((event: DataSourceEvent<any>) => {
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
	const stableDataSourceEvent = useCallback((event: DataSourceEvent<any>) => {
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

	const handleAccept = (changedValue, maskObject) => {
		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		const maskedValue = maskObject.value.replaceAll('_', '')
		specialCharactersLength.current = maskedValue.length - maskObject.unmaskedValue.length
		if (maskedValue.length !== mask?.length && maskObject.unmaskedValue.length !== 0) {
			return;
		}
		setValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(changedValue);
		}

		if (onChangeValue) {
			onChangeValue(changedValue, maskObject.value);
		}
	};

	const handleOnFocusExit = (event) => {
		const maskedValue = event.target.value.replaceAll('_', '');
		specialCharactersLength.current
		if (maskedValue.length < mask?.length && maskedValue.length - specialCharactersLength.current !== 0) {
			const errorMsg = customIncompleteErrorMessage ?? `${t('archbase:O campo está incompleto')}`;
			setInternalError(errorMsg);
			// Salvar no contexto também
			validationContext?.setError(fieldKey, errorMsg);
		} else {
			setInternalError("");
			// Limpar do contexto também
			validationContext?.clearError(fieldKey);
		}
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

	// Filtrar props que não devem ser passadas para o Input
	const { dataSource: _, dataField: __, showMask: ___, saveWithMask: ____, onChangeValue: _____, onFocusEnter: ______, onFocusExit: _______, ...filteredOthers } = others;

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<Input.Wrapper {...wrapperProps} label={title||props.label} error={displayError}>
			<Input<any>
				{...inputProps}
				{...filteredOthers}
				error={displayError}
				ref={innerComponentRef}
				component={IMaskInput}
				mask={mask}
				unmask={!saveWithMask}
				lazy={false}
				value={value}
				style={{
					width,
					...props.style,
				}}
				size={props.size}
				placeholderChar={placeholderChar}
				id={id}
				readOnly={isReadOnly()}
				disabled={disabled}
				placeholder={placeholder}
				onAccept={handleAccept}
				onBlur={handleOnFocusExit}
				onFocus={handleOnFocusEnter}
			/>
		</Input.Wrapper>
	);
}

ArchbaseMaskEdit.displayName = 'ArchbaseMaskEdit';
