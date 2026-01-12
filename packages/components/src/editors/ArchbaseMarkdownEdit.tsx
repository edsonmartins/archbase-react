/**
 * ArchbaseMarkdownEdit — editor Markdown (react-markdown-editor-lite) com binding opcional ao dataSource.
 * @status stable
 */
import { Input, Skeleton } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

// Armazenamento para componentes carregados dinamicamente
let EditorComponent: React.ComponentType<any> | null = null;
let MarkdownItType: any = null;
let loadPromise: Promise<void> | null = null;

// Função para carregar react-markdown-editor-lite e markdown-it
async function loadMarkdownEditor(): Promise<void> {
	if (loadPromise) return loadPromise;
	if (EditorComponent && MarkdownItType) return Promise.resolve();

	loadPromise = (async () => {
		// Carregar markdown-it primeiro
		const markdownItModule = await import('markdown-it');
		MarkdownItType = markdownItModule.default;

		// Carregar o editor
		const editorModule = await import('react-markdown-editor-lite');
		EditorComponent = editorModule.default;

		// @ts-ignore - CSS import
		await import('react-markdown-editor-lite/lib/index.css');
	})();

	return loadPromise;
}

function getInitialValue<T>(
	value: any,
	dataSource?: IArchbaseDataSourceBase<T>,
	dataField?: string,
): any {
	let initialValue: any = value;
	if (dataSource && dataField) {
		initialValue = dataSource.getFieldValue(dataField);
		if (!initialValue) {
			initialValue = '';
		}
	}
	return initialValue;
}

export interface ArchbaseMarkdownEditProps<T, ID> {
	/** Indicador se o editor recebe o foco automaticamente */
	autoFocus?: boolean;
	/** Fonte de dados onde será atribuido o valor do editor (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuido o valor do editor na fonte de dados */
	dataField?: string;
	/** Indicador se o editor está desabilitado */
	disabled?: boolean;
	/** Indicador se o editor é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do editor é obrigatório */
	required?: boolean;
	/** Estilo do editor */
	style?: CSSProperties;
	/** Largura do editor */
	width?: string | number | undefined;
	/** Altura do editor */
	height?: string | number | undefined;
	/** Altura mínima do editor */
	minHeight?: string | number | undefined;
	/** Título do editor */
	label?: string;
	/** Descrição do editor */
	description?: string;
	/** Último erro ocorrido no editor */
	error?: string;
	/** Valor inicial do markdown */
	value?: string;
	/** Texto de espaço reservado quando vazio */
	placeholder?: string;
	/** Habilitar visualização em tempo real */
	enablePreview?: boolean;
	/** Sanitização HTML */
	sanitize?: ((html: string) => string) | boolean;
	/** Evento quando o valor do editor é alterado */
	onChangeValue?: (value: string) => void;
	/** Evento quando o editor é salvo (Ctrl+S) */
	onSave?: (value: string) => void;
	/** Evento quando o foco sai do editor */
	onFocusExit?: (event: FocusEvent) => void;
	/** Evento quando o editor recebe o foco */
	onFocusEnter?: (event: FocusEvent) => void;
	/** Evento quando HTML é gerado */
	onHtmlChanged?: (html: string) => void;
	/** Modo de edição (live, preview, readonly, etc.) */
	previewOnly?: boolean;
}

export function ArchbaseMarkdownEdit<T, ID>({
	autoFocus = false,
	dataSource,
	dataField,
	disabled,
	readOnly,
	required,
	label,
	description,
	error,
	width,
	height,
	minHeight,
	placeholder = 'Enter markdown content...',
	enablePreview = true,
	sanitize,
	onChangeValue,
	onSave,
	onFocusExit,
	onFocusEnter,
	onHtmlChanged,
	previewOnly = false,
	value,
	style,
}: ArchbaseMarkdownEditProps<T, ID>) {
	// Hook de compatibilidade V1/V2
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbaseMarkdownEdit',
		dataSource,
		dataField,
		''
	);

	// Contexto de validação (opcional)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	const [currentValue, setCurrentValue] = useState<string | undefined>(
		getInitialValue(value, dataSource, dataField),
	);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// Atualizar se o prop error vier definido
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
				// ForceUpdate apenas para V1
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
			}
			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
				validationContext?.setError(fieldKey, event.error);
			}
		}
	}, [v1v2Compatibility.isDataSourceV2, validationContext, fieldKey]);

	// Ref para manter callback sempre atualizado
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

	const handleChange = (content: string) => {
		// Limpa erro quando usuário edita o campo
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setCurrentValue(content);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== content) {
			v1v2Compatibility.handleValueChange(content);
		}

		if (onChangeValue) {
			onChangeValue(content);
		}
	};

	const handleFocus = (event: FocusEvent) => {
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const handleBlur = (event: FocusEvent) => {
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleHtmlChanged = (html: string) => {
		if (onHtmlChanged) {
			onHtmlChanged(html);
		}
	};

	const isReadOnlyValue = () => {
		return readOnly || v1v2Compatibility.isReadOnly || previewOnly;
	};

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	// Estado para verificar se estamos no cliente e se o editor foi carregado
	const [isLoaded, setIsLoaded] = useState(false);
	const [, forceRender] = useState({});

	useEffect(() => {
		// Não carregar no servidor
		if (typeof window === 'undefined') return;

		loadMarkdownEditor().then(() => {
			setIsLoaded(true);
			forceRender({});
		});
	}, []);

	// Renderizar skeleton no SSR ou enquanto não está carregado
	if (!isLoaded || !EditorComponent || !MarkdownItType) {
		return (
			<Input.Wrapper withAsterisk={required} label={label} description={description} error={displayError}>
				<Skeleton height={height || 400} width={width || '100%'} />
			</Input.Wrapper>
		);
	}

	const MarkdownEditor = EditorComponent;
	const MdParser = MarkdownItType;

	// Configurar estilo do container
	const containerStyle: CSSProperties = {
		width: width || '100%',
		...(height && { height }),
		...(minHeight && { minHeight }),
		...style,
	};

	// Props do editor
	const editorProps: Record<string, any> = {
		value: currentValue || '',
		style: containerStyle,
		onChange: handleChange,
		renderHTML: (text: string) => MdParser({ html: true }).render(text),
		sanitize: sanitize ?? ((html: string) => html),
		placeholder,
		canView: enablePreview ? {
			menu: true,
			md: true,
			html: true,
			fullScreen: true,
			hideMenu: false,
		} : {
			menu: false,
			md: true,
			html: false,
			fullScreen: false,
			hideMenu: true,
		},
	};

	if (autoFocus) {
		editorProps.autoFocus = true;
	}

	if (onSave) {
		editorProps.onSave = onSave;
	}

	if (onFocusEnter) {
		editorProps.onFocus = handleFocus;
	}

	if (onFocusExit) {
		editorProps.onBlur = handleBlur;
	}

	if (onHtmlChanged) {
		editorProps.onHTMLChange = handleHtmlChanged;
	}

	if (isReadOnlyValue()) {
		editorProps.readOnly = true;
	}

	if (disabled) {
		editorProps.disabled = true;
	}

	return (
		<Input.Wrapper withAsterisk={required} label={label} description={description} error={displayError}>
			<MarkdownEditor {...editorProps} />
		</Input.Wrapper>
	);
}

// Re-exportar tipo para compatibilidade
export type { default as MarkdownEditorLite } from 'react-markdown-editor-lite';
