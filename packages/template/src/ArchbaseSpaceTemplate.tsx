import {
	AlertVariant,
	Box,
	Button,
	Flex,
	Grid,
	Pagination,
	Paper,
	px,
	ScrollArea,
	StyleProp,
	Text,
} from '@mantine/core';
// Import GridColProps to get the proper ColSpan type
import { GridColProps } from '@mantine/core';
type ColSpan = GridColProps['span'];
import { useHotkeys, useUncontrolled } from '@mantine/hooks';
import useComponentSize, { ComponentSize } from '@rehooks/component-size';
import { IconBug, IconEdit, IconEye } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import React, { CSSProperties, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useArchbaseAppContext } from '@archbase/core';
// REMOVIDO: useArchbaseV1V2Compatibility - ArchbaseSpaceTemplate não usa dataSource
import type { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseDebugInspector } from '@archbase/components';
import { ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed, ArchbaseSpaceTop } from '@archbase/layout';
import { ArchbaseAlert } from '@archbase/components';
import {
	ArchbaseQueryBuilder,
	ArchbaseQueryFilter,
	ArchbaseQueryFilterDelegator,
	ArchbaseQueryFilterState,
	FilterOptions,
	getDefaultEmptyFilter,
} from '@archbase/advanced';
import { ArchbaseDebugOptions, ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';
import { ArchbaseConditionalSecurityWrapper } from './components';
import { useOptionalTemplateSecurity } from './hooks';

interface ArchbaseBreakpointsColSpans {
	/** Col span em (min-width: theme.breakpoints.xs) */
	xs?: ColSpan;
	/** Col span em (min-width: theme.breakpoints.sm) */
	sm?: ColSpan;
	/** Col span em (min-width: theme.breakpoints.md) */
	md?: ColSpan;
	/** Col span em (min-width: theme.breakpoints.lg) */
	lg?: ColSpan;
	/** Col span em (min-width: theme.breakpoints.xl) */
	xl?: ColSpan;
}

export interface ArchbaseSpaceTemplateOptions {
	/** Indicar qual lado do header irá crescer para preencher o espaço sobrando (Válido somente quando headerGridColumns não é atribuído ao options) */
	headerFlexGrow?: 'left' | 'even' | 'right';
	/** Justificar o conteúdo interno da parte direita do header.*/
	headerFlexRightJustifyContent?: StyleProp<React.CSSProperties['justifyContent']>;
	/** Justificar o conteúdo interno da parte esquerda do header.*/
	headerFlexLeftJustifyContent?: StyleProp<React.CSSProperties['justifyContent']>;
	/** Indicar os ColSpan das grids para cada parte do header (left, middle, right) de acordo com os breakpoints */
	headerGridColumns?: {
		right?: ArchbaseBreakpointsColSpans;
		middle?: ArchbaseBreakpointsColSpans;
		left?: ArchbaseBreakpointsColSpans;
	};
	/** Indicar qual lado do footer irá crescer para preencher o espaço sobrando (Válido somente quando footerGridColumns não é atribuído ao options) */
	footerFlexGrow?: 'left' | 'even' | 'right';
	/** Justificar o conteúdo interno da parte direita do footer.*/
	footerFlexRightJustifyContent?: StyleProp<React.CSSProperties['justifyContent']>;
	/** Justificar o conteúdo interno da parte esquerda do footer.*/
	footerFlexLeftJustifyContent?: StyleProp<React.CSSProperties['justifyContent']>;
	/** Indicar os ColSpan das grids para cada parte do footer (left, middle, right) de acordo com os breakpoints */
	footerGridColumns?: {
		right?: ArchbaseBreakpointsColSpans;
		middle?: ArchbaseBreakpointsColSpans;
		left?: ArchbaseBreakpointsColSpans;
	};
}

export interface ArchbaseSpaceTemplateProps<T, ID> extends ArchbaseTemplateSecurityProps {
	title: string;
	variant?: AlertVariant | string;
	headerLeft?: ReactNode;
	headerMiddle?: ReactNode;
	headerRight?: ReactNode;
	footerLeft?: ReactNode;
	footerMiddle?: ReactNode;
	footerRight?: ReactNode;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	width?: number | string | undefined;
	height?: number | string | undefined;
	withBorder?: boolean;
	children?: React.ReactNode;
	radius?: string | number | undefined;
	debug?: boolean;
	defaultDebug?: boolean;
	isError?: boolean;
	error?: string | undefined;
	clearError?: () => void;
	/** Opções de personalização */
	options?: ArchbaseSpaceTemplateOptions;
	style?: CSSProperties;
	debugOptions?: ArchbaseDebugOptions;
}

function buildHeader(
	options: ArchbaseSpaceTemplateOptions,
	headerLeft: ReactNode,
	headerRight: ReactNode,
	debug: boolean,
) {
	if (options && options.headerGridColumns) {
		const headerGridColumnsLeft: ArchbaseBreakpointsColSpans = options.headerGridColumns.left
			? options.headerGridColumns.left
			: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
		const headerGridColumnsMiddle: ArchbaseBreakpointsColSpans = options.headerGridColumns.middle
			? options.headerGridColumns.middle
			: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
		const headerGridColumnsRight: ArchbaseBreakpointsColSpans = options.headerGridColumns.right
			? options.headerGridColumns.right
			: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };

		return (
			<Grid m={0} gutter="xs" justify="center" align="center" grow>
				<Grid.Col
					span={{
						xs: headerGridColumnsLeft.xs,
						sm: headerGridColumnsLeft.sm,
						md: headerGridColumnsLeft.md,
						lg: headerGridColumnsLeft.lg,
					} as any}
					style={{
						border: debug ? '1px dashed' : '',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					{headerLeft}
				</Grid.Col>
				<Grid.Col
					span={{
						xs: headerGridColumnsMiddle.xs,
						sm: headerGridColumnsMiddle.sm,
						md: headerGridColumnsMiddle.md,
						lg: headerGridColumnsMiddle.lg,
					} as any}
					style={{
						border: debug ? '1px dashed' : '',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				></Grid.Col>
				<Grid.Col
					span={{
						xs: headerGridColumnsRight.xs,
						sm: headerGridColumnsRight.sm,
						md: headerGridColumnsRight.md,
						lg: headerGridColumnsRight.lg,
					} as any}
					style={{
						border: debug ? '1px dashed' : '',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					{headerRight}
				</Grid.Col>
			</Grid>
		);
	} else {
		const headerFlexGrow = options && options.headerFlexGrow ? options.headerFlexGrow : 'even';
		const headerFlexRightJustifyContent =
			options && options.headerFlexRightJustifyContent ? options.headerFlexRightJustifyContent : 'flex-end';
		const headerFlexLeftJustifyContent =
			options && options.headerFlexLeftJustifyContent ? options.headerFlexLeftJustifyContent : 'flex-start';

		return (
			<Flex justify={'space-between'}>
				<Flex
					w={headerFlexGrow === 'left' || headerFlexGrow === 'even' ? '100%' : undefined}
					maw={headerFlexGrow === 'left' || headerFlexGrow === 'even' ? undefined : '100%'}
					align={'center'}
					justify={headerFlexLeftJustifyContent}
					style={{
						border: debug ? '1px dashed' : '',
					}}
				>
					{headerLeft}
				</Flex>
				<Flex
					w={headerFlexGrow === 'right' || headerFlexGrow === 'even' ? '100%' : undefined}
					maw={headerFlexGrow === 'right' || headerFlexGrow === 'even' ? undefined : '100%'}
					align={'center'}
					justify={headerFlexRightJustifyContent}
					style={{
						border: debug ? '1px dashed' : '',
					}}
				>
					{headerRight}
				</Flex>
			</Flex>
		);
	}
}

function buildFooter(
	options: ArchbaseSpaceTemplateOptions,
	footerLeft: ReactNode,
	footerRight: ReactNode,
	debug: boolean,
) {
	if (options && options.footerGridColumns) {
		const headerGridColumnsLeft: ArchbaseBreakpointsColSpans = options.footerGridColumns.left
			? options.footerGridColumns.left
			: { xs: 'content', sm: 'content', md: 'content', lg: 'content' };
		const headerGridColumnsMiddle: ArchbaseBreakpointsColSpans = options.footerGridColumns.middle
			? options.footerGridColumns.middle
			: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'auto' };
		const footerGridColumnsRight: ArchbaseBreakpointsColSpans = options.footerGridColumns.right
			? options.footerGridColumns.right
			: { xs: 'content', sm: 'content', md: 'content', lg: 'content' };

		return (
			<Grid m={0} gutter="xs" justify="center" align="center" grow>
				<Grid.Col
					span={{
						xs: headerGridColumnsLeft.xs,
						sm: headerGridColumnsLeft.sm,
						md: headerGridColumnsLeft.md,
						lg: headerGridColumnsLeft.lg,
					} as any}
					style={{
						border: debug ? '1px dashed' : '',
						display: 'flex',
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}
				>
					{footerLeft}
				</Grid.Col>
				<Grid.Col
					span={{
						xs: headerGridColumnsMiddle.xs,
						sm: headerGridColumnsMiddle.sm,
						md: headerGridColumnsMiddle.md,
						lg: headerGridColumnsMiddle.lg,
					} as any}
					style={{
						border: debug ? '1px dashed' : '',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				></Grid.Col>
				<Grid.Col
					span={{
						xs: footerGridColumnsRight.xs,
						sm: footerGridColumnsRight.sm,
						md: footerGridColumnsRight.md,
						lg: footerGridColumnsRight.lg,
					} as any}
					style={{
						border: debug ? '1px dashed' : '',
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					{footerRight}
				</Grid.Col>
			</Grid>
		);
	} else {
		const footerFlexGrow = options && options.footerFlexGrow ? options.footerFlexGrow : 'even';
		const footerFlexRightJustifyContent =
			options && options.footerFlexRightJustifyContent ? options.footerFlexRightJustifyContent : 'flex-end';
		const footerFlexLeftJustifyContent =
			options && options.footerFlexLeftJustifyContent ? options.footerFlexLeftJustifyContent : 'flex-start';

		return (
			<Flex justify={'space-between'}>
				<Flex
					w={footerFlexGrow === 'left' || footerFlexGrow === 'even' ? '100%' : undefined}
					maw={footerFlexGrow === 'left' || footerFlexGrow === 'even' ? undefined : '100%'}
					align={'center'}
					justify={footerFlexLeftJustifyContent}
					style={{
						border: debug ? '1px dashed' : '',
						height: 'auto',
						padding: footerLeft && 'calc(0.625rem / 2)',
					}}
				>
					{footerLeft}
				</Flex>
				<Flex
					w={footerFlexGrow === 'right' || footerFlexGrow === 'even' ? '100%' : undefined}
					maw={footerFlexGrow === 'right' || footerFlexGrow === 'even' ? undefined : '100%'}
					align={'center'}
					justify={footerFlexRightJustifyContent}
					style={{
						border: debug ? '1px dashed' : '',
						height: 'auto',
						padding: footerRight && 'calc(0.625rem / 2)',
					}}
				>
					{footerRight}
				</Flex>
			</Flex>
		);
	}
}

export function ArchbaseSpaceTemplate<T extends object, ID>({
	title,
	innerRef,
	isError = false,
	error = '',
	clearError,
	width = '100%',
	height = '100%',
	withBorder = true,
	children,
	radius,
	debug,
	defaultDebug,
	headerLeft,
	headerMiddle,
	headerRight,
	footerLeft,
	footerMiddle,
	footerRight,
	variant,
	options = {},
	style,
	debugOptions = {
		debugLayoutHotKey: 'ctrl+shift+S',
		debugObjectInspectorHotKey: 'ctrl+shift+D',
		objectsToInspect: [],
	},
	// Props de segurança (opcionais)
	resourceName,
	resourceDescription,
	requiredPermissions,
	fallbackComponent,
	securityOptions,
}: ArchbaseSpaceTemplateProps<T, ID>) {
	const [_debug, setDebug] = useUncontrolled({
		value: debug,
		defaultValue: defaultDebug,
		finalValue: false,
	});
	useHotkeys([[debugOptions && debugOptions.debugLayoutHotKey, () => setDebug(!_debug)]]);
	const appContext = useArchbaseAppContext();
	const {t} = useArchbaseTranslation();

	// 🔐 SEGURANÇA: Hook opcional de segurança (só ativa se resourceName fornecido)
	const security = useOptionalTemplateSecurity({
		resourceName,
		resourceDescription,
		autoRegisterActions: securityOptions?.autoRegisterActions ?? true
	});

	// NOTA: ArchbaseSpaceTemplate não usa dataSource, então não precisa de useArchbaseV1V2Compatibility
	// O hook foi removido pois causava re-renders desnecessários

	// Usar ref local se innerRef não for fornecido (evita criar ref condicional)
	const localRef = useRef<any>(null);
	const innerComponentRef = innerRef || localRef;
	const headerRef = useRef<any>(null);
	const footerRef = useRef<any>(null);
	const headerSize = useComponentSize(headerRef);
	const footerSize = useComponentSize(footerRef);
	const innerComponentSize = useComponentSize(innerComponentRef);

	// CORREÇÃO: Usar useMemo para evitar criar novo objeto a cada render
	// Isso previne loops infinitos quando useComponentSize dispara re-renders
	const contentSize: ComponentSize = useMemo(() => ({
		height: innerComponentSize.height - headerSize.height - footerSize.height - Number(px('0.625rem')),
		width: innerComponentSize.width - headerSize.width - footerSize.width,
	}), [innerComponentSize.height, innerComponentSize.width, headerSize.height, headerSize.width, footerSize.height, footerSize.width]);

	const debugRef = useRef<boolean>(defaultDebug);

	useEffect(() => {
		if (defaultDebug !== debugRef.current) {
			setDebug(defaultDebug);
			debugRef.current = defaultDebug;
		}
	}, [defaultDebug, setDebug]);

	// Conteúdo do template (inline para evitar criar função a cada render)
	const templateContent = (
		<>
			<Paper
				ref={innerComponentRef}
				withBorder={withBorder}
				radius={radius}
				style={{ width: width, height: height, padding: 4, ...style }}
			>
				<ArchbaseSpaceFixed height={'100%'}>
					<ArchbaseSpaceTop size={headerSize.height}>
						<div ref={headerRef}>{buildHeader(options, headerLeft, headerRight, _debug)}</div>
					</ArchbaseSpaceTop>
					<ArchbaseSpaceFill>
						<ScrollArea
							h={contentSize.height}
							style={{
								border: _debug ? '1px dashed' : '',
								padding: 'calc(0.625rem / 2)',
							}}
						>
							{children ? (
								<Fragment>
									{isError && (
										<ArchbaseAlert
											autoClose={20000}
											withCloseButton={true}
											withBorder={true}
											icon={<IconBug size="1.4rem" />}
											title={`${t('WARNING')}`}
											titleColor="rgb(250, 82, 82)"
											variant={variant ?? appContext.variant}
											onClose={() => clearError && clearError()}
										>
											<span>{error}</span>
										</ArchbaseAlert>
									)}
									{children}
								</Fragment>
							) : (
								_debug && (
									<Flex h={contentSize.height + 80} justify="center" align="center" wrap="wrap">
										<Text size="lg">INSIRA O CONTEÚDO DO PAINEL AQUI.</Text>
									</Flex>
								)
							)}
						</ScrollArea>
					</ArchbaseSpaceFill>
					<ArchbaseSpaceBottom size={footerSize.height}>
						<div ref={footerRef}>{buildFooter(options, footerLeft, footerRight, _debug)}</div>
					</ArchbaseSpaceBottom>
				</ArchbaseSpaceFixed>
			</Paper>
			<ArchbaseDebugInspector
				debugObjectInspectorHotKey={debugOptions && debugOptions.debugObjectInspectorHotKey}
				objectsToInspect={debugOptions && debugOptions.objectsToInspect}
			/>
		</>
	);

	// 🔐 WRAPPER CONDICIONAL: Só aplica segurança SE resourceName fornecido
	return (
		<ArchbaseConditionalSecurityWrapper
			resourceName={resourceName}
			resourceDescription={resourceDescription}
			requiredPermissions={requiredPermissions}
			fallbackComponent={fallbackComponent}
			onSecurityReady={securityOptions?.onSecurityReady}
			onAccessDenied={securityOptions?.onAccessDenied}
		>
			{templateContent}
		</ArchbaseConditionalSecurityWrapper>
	);
}
