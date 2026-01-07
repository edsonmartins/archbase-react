/**
 * ArchbaseMarkdownEdit — editor Markdown (md-editor-rt) com binding opcional ao dataSource.
 * @status stable
 */
import { Input, Skeleton } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

// Storage para componente carregado dinamicamente
let MdEditorComponent: React.ComponentType<any> | null = null;
let loadPromise: Promise<void> | null = null;

// Tipos de toolbar do md-editor-rt
export type ToolbarItem =
  | 'bold'
  | 'underline'
  | 'italic'
  | 'strikeThrough'
  | '-'
  | 'heading'
  | 'moreMark'
  | 'title'
  | 'sub'
  | 'sup'
  | 'quote'
  | 'unorderedList'
  | 'orderedList'
  | 'task'
  | '-'
  | 'codeRow'
  | 'code'
  | 'link'
  | 'image'
  | 'table'
  | '-'
  | 'revoke'
  | 'next'
  | 'save'
  | '='
  | 'pageFullscreen'
  | 'fullscreen'
  | 'preview'
  | 'htmlPreview'
  | 'catalog'
  | 'github';

// Função para carregar md-editor-rt
async function loadMdEditor(): Promise<void> {
	if (loadPromise) return loadPromise;
	if (MdEditorComponent) return Promise.resolve();

	loadPromise = (async () => {
		const mdModule = await import('md-editor-rt');
		// @ts-ignore - CSS import
		await import('md-editor-rt/lib/style.css');
		MdEditorComponent = mdModule.MdEditor;
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
	/** Tema do editor (light/dark) */
	theme?: 'light' | 'dark';
	/** Tema do preview (default, github, vuepress, etc.) */
	previewTheme?: string;
	/** Tema do código (atom, github, etc.) */
	codeTheme?: string;
	/** Idioma da interface (en, zh-CN) */
	language?: string;
	/** Largura da tabulação em espaços */
	tabWidth?: number;
	/** Mostrar toolbar */
	showToolbar?: boolean;
	/** Esconder toolbar (alias para showToolbar) */
	hideToolbar?: boolean;
	/** Configuração da toolbar */
	toolbars?: ToolbarItem[][];
	/** Sanitização HTML */
	sanitize?: ((html: string) => string) | boolean;
	/** Habilitar upload de imagens */
	enableImageUpload?: boolean;
	/** Handler customizado para upload de imagens */
	onUploadImg?: (files: File[]) => Promise<string[]>;
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
	placeholder,
	theme = 'light',
	previewTheme = 'default',
	codeTheme = 'atom',
	language = 'en',
	tabWidth = 2,
	showToolbar = true,
	hideToolbar,
	toolbars,
	sanitize,
	enableImageUpload = false,
	onUploadImg,
	onChangeValue,
	onSave,
	onFocusExit,
	onFocusEnter,
	onHtmlChanged,
	previewOnly = false,
	value,
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

	const handleSave = (content: string) => {
		if (onSave) {
			onSave(content);
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

	const handleUploadImg = async (files: File[]): Promise<string[]> => {
		if (enableImageUpload && onUploadImg) {
			return onUploadImg(files);
		}
		// Default behavior: converter para base64
		return Promise.all(
			files.map((file) => {
				return new Promise<string>((resolve) => {
					const reader = new FileReader();
					reader.onload = (e) => resolve(e.target?.result as string);
					reader.readAsDataURL(file);
				});
			})
		);
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

		loadMdEditor().then(() => {
			setIsLoaded(true);
			forceRender({});
		});
	}, []);

	// Renderizar skeleton no SSR ou enquanto não está carregado
	if (!isLoaded || !MdEditorComponent) {
		return (
			<Input.Wrapper withAsterisk={required} label={label} description={description} error={displayError}>
				<Skeleton height={height || 400} width={width || '100%'} />
			</Input.Wrapper>
		);
	}

	const MdEditor = MdEditorComponent;

	// Props do editor
	const editorProps: Record<string, any> = {
		modelValue: currentValue || '',
		onChange: handleChange,
		onSave: handleSave,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onHtmlChanged: handleHtmlChanged,
		theme,
		previewTheme,
		codeTheme,
		language,
		tabWidth,
		placeholder,
		sanitize,
		autoFocus,
	};

	// Props de upload
	if (enableImageUpload) {
		editorProps.onUploadImg = handleUploadImg;
	}

	// Props de toolbar
	if (hideToolbar || !showToolbar) {
		editorProps.toolbars = [];
	} else if (toolbars) {
		editorProps.toolbars = toolbars;
	}

	// Props de altura
	if (height) {
		editorProps.height = height;
	}
	if (minHeight) {
		editorProps.minHeights = minHeight;
	}

	// Readonly
	if (isReadOnlyValue()) {
		editorProps.readOnly = true;
	}

	return (
		<Input.Wrapper withAsterisk={required} label={label} description={description} error={displayError}>
			<MdEditor {...editorProps} />
		</Input.Wrapper>
	);
}

// Re-exportar tipos do md-editor-rt para conveniência
export type { ToolbarNames } from 'md-editor-rt';
