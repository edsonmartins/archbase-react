/**
 * ArchbaseCodeViewer — visualizador de codigo-fonte com syntax highlighting
 * usando @mantine/code-highlight, com binding opcional ao dataSource.
 * @status stable
 */
import { Box, Input } from '@mantine/core';
import { CodeHighlight, CodeHighlightTabs } from '@mantine/code-highlight';
import type { CodeHighlightTabsCode } from '@mantine/code-highlight';
import { useForceUpdate } from '@mantine/hooks';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';

function getInitialValue<T>(
	value: string | undefined,
	dataSource?: IArchbaseDataSourceBase<T>,
	dataField?: string,
): string {
	let initialValue: string | undefined = value;
	if (dataSource && dataField) {
		initialValue = dataSource.getFieldValue(dataField) as string | undefined;
		if (!initialValue) {
			initialValue = '';
		}
	}
	return initialValue ?? '';
}

export interface ArchbaseCodeViewerTab {
	/** Nome do arquivo exibido na aba */
	fileName: string;
	/** Codigo-fonte da aba */
	code: string;
	/** Linguagem para syntax highlighting */
	language: string;
	/** Icone opcional da aba */
	icon?: React.ReactNode;
}

export interface ArchbaseCodeViewerProps<T> {
	/** Fonte de dados onde sera lido o valor do codigo (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo de onde sera lido o valor do codigo na fonte de dados */
	dataField?: string;
	/** Valor do codigo (standalone) */
	value?: string;
	/** Alias para value */
	code?: string;
	/** Linguagem para syntax highlighting @default 'typescript' */
	language?: string;
	/** Exibir numeros de linha @default true */
	showLineNumbers?: boolean;
	/** Exibir botao de copiar @default true */
	showCopyButton?: boolean;
	/** Label do componente */
	label?: string;
	/** Descricao do componente */
	description?: string;
	/** Mensagem de erro */
	error?: string;
	/** Linhas destacadas */
	highlightLines?: Record<string, { color: string; label?: string }>;
	/** Altura maxima com scroll */
	maxHeight?: string | number;
	/** Estilo CSS */
	style?: CSSProperties;
	/** Classe CSS */
	className?: string;
	/** Largura do componente */
	width?: string | number;
	/** Quando fornecido, renderiza CodeHighlightTabs em vez de CodeHighlight */
	tabs?: ArchbaseCodeViewerTab[];
	/** Exibir borda ao redor do codigo @default false */
	withBorder?: boolean;
	/** Border radius @default 'sm' */
	radius?: string | number;
	/** Label do botao de copiar @default 'Copiar' */
	copyLabel?: string;
	/** Label do botao apos copiar @default 'Copiado' */
	copiedLabel?: string;
	/** Exibir botao de expandir/colapsar @default false */
	withExpandButton?: boolean;
}

export function ArchbaseCodeViewer<T>({
	dataSource,
	dataField,
	value,
	code,
	language = 'typescript',
	showLineNumbers: _showLineNumbers = true,
	showCopyButton = true,
	label,
	description,
	error,
	highlightLines: _highlightLines,
	maxHeight,
	style,
	className,
	width,
	tabs,
	withBorder = false,
	radius = 'sm',
	copyLabel = 'Copiar',
	copiedLabel = 'Copiado',
	withExpandButton = false,
}: ArchbaseCodeViewerProps<T>) {
	// Hook de compatibilidade V1/V2
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbaseCodeViewer',
		dataSource,
		dataField,
		'',
	);

	const forceUpdate = useForceUpdate();

	const [currentValue, setCurrentValue] = useState<string>(
		getInitialValue(value ?? code, dataSource, dataField),
	);

	const loadDataSourceFieldValue = () => {
		let initialValue: string | undefined = value ?? code;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField) as string | undefined;
			if (!initialValue) {
				initialValue = '';
			}
		}

		setCurrentValue(initialValue ?? '');
	};

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

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
			}
		},
		[v1v2Compatibility.isDataSourceV2],
	);

	// Ref para manter callback sempre atualizado
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	// Wrapper estavel que delega para ref
	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	// Registrar listeners com cleanup apropriado
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

	// Atualizar quando value/code prop mudar externamente
	useEffect(() => {
		if (!dataSource && !dataField) {
			setCurrentValue(value ?? code ?? '');
		}
	}, [value, code, dataSource, dataField]);

	const codeContent = currentValue;

	const renderCodeHighlight = () => {
		if (tabs && tabs.length > 0) {
			const tabsCode: CodeHighlightTabsCode[] = tabs.map((tab) => ({
				fileName: tab.fileName,
				code: tab.code,
				language: tab.language,
				icon: tab.icon,
			}));

			return (
				<CodeHighlightTabs
					code={tabsCode}
					withCopyButton={showCopyButton}
					withBorder={withBorder}
					radius={radius as any}
					copyLabel={copyLabel}
					copiedLabel={copiedLabel}
					withExpandButton={withExpandButton}
				/>
			);
		}

		return (
			<CodeHighlight
				code={codeContent}
				language={language}
				withCopyButton={showCopyButton}
				withBorder={withBorder}
				radius={radius as any}
				copyLabel={copyLabel}
				copiedLabel={copiedLabel}
				withExpandButton={withExpandButton}
			/>
		);
	};

	const wrapperStyle: CSSProperties = {
		...style,
		width,
	};

	const codeWrapper = maxHeight ? (
		<Box style={{ maxHeight, overflow: 'auto' }}>{renderCodeHighlight()}</Box>
	) : (
		renderCodeHighlight()
	);

	if (label || description || error) {
		return (
			<Input.Wrapper
				label={label}
				description={description}
				error={error}
				style={wrapperStyle}
				className={className}
			>
				{codeWrapper}
			</Input.Wrapper>
		);
	}

	return (
		<Box style={wrapperStyle} className={className}>
			{codeWrapper}
		</Box>
	);
}

ArchbaseCodeViewer.displayName = 'ArchbaseCodeViewer';
