/**
 * ArchbaseSignaturePad — captura de assinatura integrada ao DataSource (v1/v2).
 * Armazena a assinatura como string base64 (data URL).
 * @status stable
 */
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Group, Input, MantineSize, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { IconEraser, IconCheck } from '@tabler/icons-react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseSignaturePadProps<T, ID> {
	/** Fonte de dados onde sera atribuido o valor da assinatura (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde devera ser atribuido o valor da assinatura na fonte de dados */
	dataField?: string;
	/** Valor controlado (base64 data URL) */
	value?: string;
	/** Valor padrao (base64 data URL) */
	defaultValue?: string;
	/** Titulo do campo */
	label?: string;
	/** Descricao do campo */
	description?: string;
	/** Ultimo erro ocorrido */
	error?: string;
	/** Indicador se o preenchimento e obrigatorio */
	required?: boolean;
	/** Indicador se esta desabilitado */
	disabled?: boolean;
	/** Indicador se e somente leitura */
	readOnly?: boolean;
	/** Cor da caneta */
	penColor?: string;
	/** Cor de fundo do canvas */
	backgroundColor?: string;
	/** Largura do canvas */
	width?: number;
	/** Altura do canvas */
	height?: number;
	/** Exibir botao limpar */
	showClearButton?: boolean;
	/** Exibir botao confirmar */
	showConfirmButton?: boolean;
	/** Texto do botao limpar */
	clearLabel?: string;
	/** Texto do botao confirmar */
	confirmLabel?: string;
	/** Evento quando o valor muda (retorna base64 data URL) */
	onChangeValue?: (value: string | undefined) => void;
	/** Evento quando o foco entra */
	onFocusEnter?: React.FocusEventHandler<any>;
	/** Evento quando o foco sai */
	onFocusExit?: React.FocusEventHandler<any>;
	/** Evento quando o usuario confirma a assinatura */
	onConfirm?: (value: string | undefined) => void;
	/** Estilo do componente */
	style?: CSSProperties;
	/** Classe CSS */
	className?: string;
	/** Formato da imagem gerada */
	imageFormat?: 'png' | 'jpeg' | 'svg';
	/** Tamanho do componente */
	size?: MantineSize;
}

function ArchbaseSignaturePadInner<T, ID>(
	{
		dataSource,
		dataField,
		value: valueProp,
		defaultValue,
		label,
		description,
		error,
		required = false,
		disabled = false,
		readOnly = false,
		penColor = 'black',
		backgroundColor,
		width = 400,
		height = 200,
		showClearButton = true,
		showConfirmButton = false,
		clearLabel = 'Limpar',
		confirmLabel = 'Confirmar',
		onChangeValue,
		onFocusEnter,
		onFocusExit,
		onConfirm,
		style,
		className,
		imageFormat = 'png',
		size,
	}: ArchbaseSignaturePadProps<T, ID>,
) {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme('light');
	const sigCanvasRef = useRef<SignatureCanvas | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const forceUpdate = useForceUpdate();

	// Cor de fundo responsiva ao dark mode
	const resolvedBackgroundColor =
		backgroundColor ?? (colorScheme === 'dark' ? theme.colors.dark[6] : 'white');

	// Hook de compatibilidade V1/V2
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string | undefined>(
		'ArchbaseSignaturePad',
		dataSource,
		dataField,
		valueProp ?? defaultValue ?? undefined,
	);

	// Contexto de validacao
	const validationContext = useValidationErrors();
	const fieldKey = `${dataField}`;
	const contextError = validationContext?.getError(fieldKey);

	const [internalError, setInternalError] = useState<string | undefined>(error);
	const [localValue, setLocalValue] = useState<string | undefined>(
		valueProp ?? defaultValue ?? undefined,
	);

	// Atualizar erro externo
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	// Carregar valor do datasource
	const loadDataSourceFieldValue = useCallback(() => {
		let initialValue: string | undefined = valueProp ?? defaultValue ?? undefined;

		if (dataSource && dataField) {
			const fieldVal = dataSource.getFieldValue(dataField);
			initialValue = fieldVal || undefined;
		}

		setLocalValue(initialValue);
	}, [dataSource, dataField, valueProp, defaultValue]);

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, [loadDataSourceFieldValue]);

	const dataSourceEvent = useCallback(
		(event: DataSourceEvent<T>) => {
			if (dataSource && dataField) {
				if (
					event.type === DataSourceEventNames.dataChanged ||
					event.type === DataSourceEventNames.recordChanged ||
					event.type === DataSourceEventNames.afterScroll ||
					event.type === DataSourceEventNames.afterCancel ||
					event.type === DataSourceEventNames.afterEdit
				) {
					loadDataSourceFieldValue();
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}

				if (
					event.type === DataSourceEventNames.onFieldError &&
					event.fieldName === dataField
				) {
					setInternalError(event.error);
					validationContext?.setError(fieldKey, event.error);
				}
			}
		},
		[
			v1v2Compatibility.isDataSourceV2,
			dataSource,
			dataField,
			loadDataSourceFieldValue,
			forceUpdate,
			validationContext,
			fieldKey,
		],
	);

	// Ref estavel para o callback
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	// Registrar listeners
	useEffect(() => {
		loadDataSourceFieldValue();
		if (dataSource && dataField) {
			const hasFieldListener =
				typeof (dataSource as any).addFieldChangeListener === 'function';
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

	// Carregar imagem no canvas quando o valor muda
	useEffect(() => {
		const sigCanvas = sigCanvasRef.current;
		if (!sigCanvas) return;

		if (localValue && localValue.startsWith('data:')) {
			sigCanvas.fromDataURL(localValue, {
				width,
				height,
				ratio: 1,
			});
		} else if (!localValue) {
			sigCanvas.clear();
		}
	}, [localValue, width, height]);

	const getMimeType = (): string => {
		switch (imageFormat) {
			case 'jpeg':
				return 'image/jpeg';
			case 'svg':
				return 'image/svg+xml';
			case 'png':
			default:
				return 'image/png';
		}
	};

	const getDataURL = (): string | undefined => {
		const sigCanvas = sigCanvasRef.current;
		if (!sigCanvas || sigCanvas.isEmpty()) {
			return undefined;
		}

		if (imageFormat === 'svg') {
			const dataUrl = sigCanvas.toDataURL('image/svg+xml');
			return dataUrl;
		}

		return sigCanvas.toDataURL(getMimeType());
	};

	const handleStrokeEnd = () => {
		if (disabled || isReadOnly()) return;

		// Limpar erros ao interagir
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		const base64Value = getDataURL();
		setLocalValue(base64Value);

		// Salvar no datasource
		if (
			dataSource &&
			!dataSource.isBrowsing() &&
			dataField &&
			dataSource.getFieldValue(dataField) !== base64Value
		) {
			v1v2Compatibility.handleValueChange(base64Value);
		}

		if (onChangeValue) {
			onChangeValue(base64Value);
		}
	};

	const handleClear = () => {
		if (disabled || isReadOnly()) return;

		const sigCanvas = sigCanvasRef.current;
		if (sigCanvas) {
			sigCanvas.clear();
		}

		// Limpar erros
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setLocalValue(undefined);

		if (
			dataSource &&
			!dataSource.isBrowsing() &&
			dataField
		) {
			v1v2Compatibility.handleValueChange(undefined);
		}

		if (onChangeValue) {
			onChangeValue(undefined);
		}
	};

	const handleConfirm = () => {
		const base64Value = getDataURL();
		if (onConfirm) {
			onConfirm(base64Value);
		}
	};

	const isReadOnly = (): boolean => {
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	const handleFocusEnter = (event: React.FocusEvent<any>) => {
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const handleFocusExit = (event: React.FocusEvent<any>) => {
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const displayError = internalError || contextError;
	const isDisabledOrReadOnly = disabled || isReadOnly();

	return (
		<Input.Wrapper
			withAsterisk={required}
			label={label}
			description={description}
			error={displayError}
			size={size}
			className={className}
			style={style}
		>
			<Box
				ref={containerRef}
				onFocus={handleFocusEnter}
				onBlur={handleFocusExit}
				tabIndex={0}
				style={{
					border: `1px solid ${
						displayError
							? theme.colors.red[6]
							: colorScheme === 'dark'
								? theme.colors.dark[4]
								: theme.colors.gray[4]
					}`,
					borderRadius: theme.radius.sm,
					overflow: 'hidden',
					width,
					opacity: disabled ? 0.6 : 1,
					cursor: isDisabledOrReadOnly ? 'not-allowed' : 'crosshair',
					position: 'relative',
				}}
			>
				<SignatureCanvas
					ref={sigCanvasRef}
					penColor={penColor}
					backgroundColor={resolvedBackgroundColor}
					canvasProps={{
						width,
						height,
						style: {
							display: 'block',
							pointerEvents: isDisabledOrReadOnly ? 'none' : 'auto',
						},
					}}
					onEnd={handleStrokeEnd}
				/>
			</Box>
			{(showClearButton || showConfirmButton) && (
				<Group gap="xs" mt="xs">
					{showClearButton && (
						<Button
							variant="light"
							size="xs"
							leftSection={<IconEraser size={16} />}
							onClick={handleClear}
							disabled={isDisabledOrReadOnly}
						>
							{clearLabel}
						</Button>
					)}
					{showConfirmButton && (
						<Button
							variant="filled"
							size="xs"
							leftSection={<IconCheck size={16} />}
							onClick={handleConfirm}
							disabled={isDisabledOrReadOnly}
						>
							{confirmLabel}
						</Button>
					)}
				</Group>
			)}
		</Input.Wrapper>
	);
}

export const ArchbaseSignaturePad = React.memo(ArchbaseSignaturePadInner) as typeof ArchbaseSignaturePadInner;

(ArchbaseSignaturePad as any).displayName = 'ArchbaseSignaturePad';
