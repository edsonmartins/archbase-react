import { Box, Input, useComputedColorScheme } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

export { DiffMethod } from 'react-diff-viewer-continued';

export interface ArchbaseDiffViewerProps {
	/** Texto original (lado esquerdo) */
	oldValue: string;
	/** Texto novo (lado direito) */
	newValue: string;
	/** Exibir em modo split (lado a lado) ou unificado */
	splitView?: boolean;
	/** Exibir apenas as diferenças */
	showDiffOnly?: boolean;
	/** Titulo do painel esquerdo */
	leftTitle?: string;
	/** Titulo do painel direito */
	rightTitle?: string;
	/** Linguagem para syntax highlighting */
	language?: string;
	/** Metodo de comparacao */
	compareMethod?: DiffMethod;
	/** Titulo do componente */
	label?: string;
	/** Descricao do componente */
	description?: string;
	/** Estilo do componente */
	style?: CSSProperties;
	/** Classe CSS do componente */
	className?: string;
	/** Largura do componente */
	width?: string | number;
	/** Altura maxima do componente (com scroll) */
	height?: string | number;
	/** Usar tema escuro (auto-detectado do Mantine se nao informado) */
	useDarkTheme?: boolean;
	/** Ocultar numeros de linha */
	hideLineNumbers?: boolean;
	/** Linhas de contexto ao redor das diferencas */
	extraLinesSurroundingDiff?: number;
}

const ArchbaseDiffViewer: React.FC<ArchbaseDiffViewerProps> = ({
	oldValue,
	newValue,
	splitView = true,
	showDiffOnly = false,
	leftTitle,
	rightTitle,
	language,
	compareMethod = DiffMethod.CHARS,
	label,
	description,
	style,
	className,
	width,
	height,
	useDarkTheme,
	hideLineNumbers = false,
	extraLinesSurroundingDiff = 3,
}) => {
	const computedColorScheme = useComputedColorScheme('light');
	const darkTheme = useDarkTheme ?? computedColorScheme === 'dark';

	const containerStyle: CSSProperties = {
		width,
		...(height
			? {
					maxHeight: height,
					overflow: 'auto',
				}
			: {}),
		...style,
	};

	const diffContent = (
		<Box className={className} style={containerStyle}>
			<ReactDiffViewer
				oldValue={oldValue}
				newValue={newValue}
				splitView={splitView}
				showDiffOnly={showDiffOnly}
				leftTitle={leftTitle}
				rightTitle={rightTitle}
				compareMethod={compareMethod}
				useDarkTheme={darkTheme}
				hideLineNumbers={hideLineNumbers}
				extraLinesSurroundingDiff={extraLinesSurroundingDiff}
			/>
		</Box>
	);

	if (label || description) {
		return (
			<Input.Wrapper label={label} description={description}>
				{diffContent}
			</Input.Wrapper>
		);
	}

	return diffContent;
};

ArchbaseDiffViewer.displayName = 'ArchbaseDiffViewer';

export { ArchbaseDiffViewer };
