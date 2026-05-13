import { ActionIconVariant, ImageProps, Input } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { isBase64 } from '@archbase/core';
import type { ArchbaseDataSource, DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { ArchbaseImagePickerEditor } from '../image';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseImageEditProps<T, ID> extends ImageProps {
	/** Fonte de dados onde será atribuido o valor do rich edit (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuido o valor do rich edit na fonte de dados */
	dataField?: string;
	/** Indicador se o rich edit está desabilitado */
	disabled?: boolean;
	/** Indicador se o rich edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do rich edit é obrigatório */
	required?: boolean;
	/** Estilo do checkbox */
	style?: CSSProperties;
	/** Título do rich edit */
	label?: string;
	/** Descrição do rich edit */
	description?: string;
	/** Último erro ocorrido no rich edit */
	error?: string;
	/** Controla a aparência dos botões, sendo padrão "transparent". ("filled" | "light" | "outline" | "transparent" | "white" | "subtle" | "default" | "gradient")*/
	variant?: ActionIconVariant;
	/** Image src */
	src?: string | null;
	/** Texto alternativo da imagem, usado como título para espaço reservado se a imagem não foi carregada */
	alt?: string;
	/** Largura da imagem, padrão de 100%, não pode exceder 100% */
	width?: number | string;
	/** Altura da imagem, o padrão é a altura da imagem original ajustada para determinada largura */
	height?: number | string;
	/** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, 0 por padrão */
	radius?: string | number | undefined;
	/** Obter ref do elemento de imagem */
	imageRef?: React.ForwardedRef<HTMLImageElement>;
	/** Legenda da imagem, exibida abaixo da imagem */
	caption?: React.ReactNode;
	aspectRatio?: number | null;
	objectFit?: 'cover' | 'contain' | 'fill' | 'revert' | 'scale-down';
	compressInitial?: number | undefined | null;
	onChangeImage?: (image: any) => void;
	/** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
	disabledBase64Convertion?: boolean;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	/** Cor de fundo da imagem */
	imageBackgroundColor?: string;
	/** Callback quando o estado de processamento muda (útil para desabilitar botões enquanto processa) */
	onProcessingChange?: (isProcessing: boolean) => void;
	/** Largura máxima da imagem em pixels (redimensiona automaticamente se exceder) */
	maxWidth?: number;
	/** Altura máxima da imagem em pixels (redimensiona automaticamente se exceder) */
	maxHeight?: number;
	/** Tamanho máximo da imagem em KB (recomprime se exceder) */
	maxSizeKb?: number;
}

export function ArchbaseImageEdit<T, ID>({
	width = 240,
	height = 240,
	dataSource,
	dataField,
	disabled,
	readOnly,
	required,
	label,
	description,
	error,
	src,
	radius = '4px',
	aspectRatio,
	objectFit = 'contain',
	compressInitial = 80,
	onChangeImage,
	disabledBase64Convertion,
	innerRef,
	variant,
	imageBackgroundColor,
	onProcessingChange,
	maxWidth,
	maxHeight,
	maxSizeKb,
	...otherProps
}: ArchbaseImageEditProps<T, ID>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string | undefined>(
		'ArchbaseImageEdit',
		dataSource,
		dataField,
		undefined
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
	const [value, setValue] = useState<string | undefined>(undefined);
	const innerComponentRef = useRef<any>(null);
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
		let initialValue: any = value;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		const wasBase64 = isBase64(initialValue) && !disabledBase64Convertion;
		if (wasBase64) {
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

	const handleChangeImage = (image: string | undefined) => {
		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		const changedValue = image;
		setValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField) {
			// ✅ CORRIGIDO: Normalizar valores para comparação
			const currentFieldValue = dataSource.getFieldValue(dataField);

			// Preparar valor para salvar
			let valueToSave: string | undefined;
			if (!changedValue) {
				valueToSave = undefined;
			} else {
				valueToSave = disabledBase64Convertion ? changedValue : btoa(changedValue);
			}

			// ✅ Normalizar ambos os valores para comparação (null, undefined, '' → undefined)
			const normalizedCurrent = currentFieldValue || undefined;
			const normalizedNew = valueToSave || undefined;

			// Só atualiza se realmente mudou
			if (normalizedCurrent !== normalizedNew) {
				// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
				v1v2Compatibility.handleValueChange(valueToSave);
			}
		}
		if (onChangeImage) {
			onChangeImage(image);
		}
	};

	const isReadOnly = () => {
		// 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<div style={{ position: 'relative', display: 'inline-block' }}>
			<Input.Wrapper
				withAsterisk={required}
				label={label}
				description={description}
				error={displayError}
				ref={innerRef || innerComponentRef}
			>
				<ArchbaseImagePickerEditor
					imageSrcProp={value}
					variant={variant}
					onProcessingChange={onProcessingChange}
					config={{
						borderRadius: radius,
						width,
						height,
						objectFit,
						compressInitial,
						showImageSize: !isReadOnly(),
						hideDeleteBtn: isReadOnly(),
						hideDownloadBtn: isReadOnly(),
						hideEditBtn: isReadOnly(),
						hideAddBtn: isReadOnly(),
						onChangeImage: handleChangeImage,
						imageBackgroundColor,
						maxWidth,
						maxHeight,
						maxSizeKb,
					}}
				/>
			</Input.Wrapper>
		</div>
	);
}
