/**
 * ArchbaseActionButtons — grupo de ações padrão para fluxos CRUD.
 * @status stable
 */
import { ActionIcon, Button, Menu, px, Space, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';
import React, { MutableRefObject, ReactNode, Ref, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { isLastElementOfArray } from '@archbase/core';
import { useArchbaseSize } from '@archbase/core';

export interface ActionButtonsCustomComponentsDefinition {
	largeButtonType?: React.ElementType;
	largeButtonProps?: any;
	mediumButtonType?: React.ElementType;
	mediumButtonProps?: any;
	smallButtonType?: React.ElementType;
	smallButtonProps?: any;
}

export interface ArchbaseAction {
	/** Id da Action */
	id: string;
	/** Ícone do Action Button */
	icon?: ReactNode;
	/** Cor do Action Button */
	color?: string;
	/** Título da Action Button */
	label: string;
	/** Ação a ser executada ao clicar no Action Button */
	executeAction: () => void;
	/** Indicador se o Action Button está habilitado para executar a ação */
	enabled: boolean;
	/** Detalhamento da ação para ajudar o usuário*/
	hint?: string;
}

export interface ArchbaseActionButtonsOptions {
	/** Limite que determina a partir de quantos px o botão maior será renderizado*/
	largerBreakPoint?: string;
	/** Limite que determina a partir de quantos px o botão menor será renderizado*/
	smallerBreakPoint?: string;
	/** Espaçamento do botão maior */
	largerSpacing?: string;
	/** Espaçamento do botão menor */
	smallerSpacing?: string;
	/** Variação do botão maior */
	largerButtonVariant?: string;
	/** Variação do botão menor */
	smallerButtonVariant?: string;
	/** Variação do item do menu */
	menuItemVariant?: string;
	/** Variação do botão do menu */
	menuButtonVariant?: string;
	/** Cor do botão do menu */
	menuButtonColor?: string;
	/** Posição do dropdown do menu */
	menuDropdownPosition?:
		| 'bottom'
		| 'left'
		| 'right'
		| 'top'
		| 'bottom-end'
		| 'bottom-start'
		| 'left-end'
		| 'left-start'
		| 'right-end'
		| 'right-start'
		| 'top-end'
		| 'top-start';
	/** Posição do menu */
	menuPosition?: 'right' | 'left';
	menuItemApplyActionColor?: boolean;
}

export interface ArchbaseActionButtonsProps {
	/** Lista de ações */
	actions: ArchbaseAction[];
	/**  Variação padrão para todo o componente, que será sobrescrito pela variação mais específica de options */
	variant?: string;
	/** Opções de personalização */
	options?: ArchbaseActionButtonsOptions;
	/** Definição dos componentes personalizados */
	customComponents?: ActionButtonsCustomComponentsDefinition;
}

interface ArchbaseActionButtonProps {
	/** Ação */
	action: ArchbaseAction;
	/**  Variação padrão */
	variant?: string;
	/** Opções de personalização */
	options?: ArchbaseActionButtonsOptions;
	/** Definição dos componentes personalizados */
	customComponents?: ActionButtonsCustomComponentsDefinition;
	/** Ação a ser executada ao clicar no Action Button */
	handleExecuteAction: (action: ArchbaseAction) => void;
}

function buildLargeActionButton(
	{ action, options, variant, handleExecuteAction, customComponents }: ArchbaseActionButtonProps,
	buttonRef: Ref<any>,
) {
	const LargeActionButton = customComponents ? customComponents.largeButtonType : null;
	if (LargeActionButton) {
		let largeButtonProps = {};
		if (customComponents && customComponents.largeButtonProps) {
			largeButtonProps = customComponents.largeButtonProps;
		}

		return (
			<LargeActionButton
				ref={buttonRef}
				action={action}
				variant={options && options.largerButtonVariant ? options.largerButtonVariant : variant}
				key={action.id}
				disabled={!action.enabled}
				onClick={() => handleExecuteAction(action)}
				{...largeButtonProps}
			/>
		);
	} else {
		return (
			<Button
				ref={buttonRef}
				color={action.color}
				variant={options && options.largerButtonVariant ? options.largerButtonVariant : variant}
				key={action.id}
				disabled={!action.enabled}
				onClick={() => handleExecuteAction(action)}
			>
				{action.icon}
				<Text>{action.label}</Text>
			</Button>
		);
	}
}

function buildMediumActionButton(
	{ action, options, variant, handleExecuteAction, customComponents }: ArchbaseActionButtonProps,
	buttonRef: Ref<any>,
) {
	const MediumActionButton = customComponents ? customComponents.mediumButtonType : null;
	if (MediumActionButton) {
		let mediumButtonProps = {};
		if (customComponents && customComponents.mediumButtonProps) {
			mediumButtonProps = customComponents.mediumButtonProps;
		}

		return (
			<MediumActionButton
				ref={buttonRef}
				action={action}
				variant={options && options.smallerButtonVariant ? options.smallerButtonVariant : variant}
				key={action.id}
				disabled={!action.enabled}
				onClick={() => handleExecuteAction(action)}
				{...mediumButtonProps}
			/>
		);
	} else {
		return (
			<ActionIcon
				ref={buttonRef}
				color={action.color}
				variant={options && options.smallerButtonVariant ? options.smallerButtonVariant : variant}
				key={action.id}
				disabled={!action.enabled}
				onClick={() => handleExecuteAction(action)}
			>
				{action.icon}
			</ActionIcon>
		);
	}
}

function buildHiddenActionButton({
	action,
	options,
	variant,
	handleExecuteAction,
	customComponents,
}: ArchbaseActionButtonProps) {
	const SmallActionButton = customComponents ? customComponents.smallButtonType : null;

	return (
		<Menu.Item
			leftSection={action.icon}
			key={action.id}
			disabled={!action.enabled}
			color={options && options.menuItemApplyActionColor ? action.color : undefined}
			onClick={() => handleExecuteAction(action)}
		>
			<Tooltip withinPortal withArrow disabled={!action.hint} label={action.hint}>
				{SmallActionButton ? (
					<div>
						<SmallActionButton
							action={action}
							variant={options && options.menuItemVariant ? options.menuItemVariant : variant}
						/>
					</div>
				) : (
					<Text variant={options && options.menuItemVariant ? options.menuItemVariant : variant}>{action.label}</Text>
				)}
			</Tooltip>
		</Menu.Item>
	);
}

function buildVisibleActionButton(props: ArchbaseActionButtonProps, isLarge: boolean, buttonRef: Ref<any>) {
	if (isLarge) {
		return buildLargeActionButton(props, buttonRef);
	} else {
		return buildMediumActionButton(props, buttonRef);
	}
}

export function ArchbaseActionButtons({ actions, variant, customComponents, options }: ArchbaseActionButtonsProps) {
	const buttonRefsRef = useRef<MutableRefObject<any>[]>([]);
	const buttonMenuRef = useRef<any>(null);
	const largerButtonWidthRef = useRef<any>([]);
	const smallerButtonWidthRef = useRef<any>([]);
	const [visibleActionsLength, setVisibleActionsLength] = useState(actions.length);
	const [hiddenActions, setHiddenActions] = useState<ArchbaseAction[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerWidth] = useArchbaseSize(containerRef);
	const [opened, setOpened] = useState(false);

	const theme = useMantineTheme();
	const _largerBreakPoint = options && options.largerBreakPoint ? options.largerBreakPoint : theme.breakpoints.md;
	const _smallerBreakPoint = options && options.smallerBreakPoint ? options.smallerBreakPoint : theme.breakpoints.sm;

	const isLarge = useMediaQuery(`(min-width: ${_largerBreakPoint})`);
	const isSmall = useMediaQuery(`(max-width: ${_smallerBreakPoint})`);

	const largerSpacingPx = Number(options && options.largerSpacing ? px(options.largerSpacing) : px('1rem'));
	const smallerSpacingPx = Number(options && options.smallerSpacing ? px(options.smallerSpacing) : px('0.25rem'));
	const spacingPx = isLarge ? largerSpacingPx : smallerSpacingPx;

	const _menuPosition = options && options.menuPosition ? options.menuPosition : 'right';

	const currentButtonWidthRef = isLarge ? largerButtonWidthRef : smallerButtonWidthRef;

	const calculateVisibleActions = useCallback(() => {
		const container = containerRef.current;
		if (container) {
			const containerWidth = container.clientWidth;
			let totalWidth = 0;
			let menuWidth = 0;
			let maxVisibleActions = 0;

			menuWidth += buttonMenuRef.current ? buttonMenuRef.current.offsetWidth : 50;
			if (
				buttonRefsRef.current.filter((value) => value.current).length === actions.length &&
				currentButtonWidthRef.current.length === 0
			) {
				currentButtonWidthRef.current = [];
				buttonRefsRef.current.forEach((buttonRef) => {
					currentButtonWidthRef.current = [...currentButtonWidthRef.current, buttonRef.current.offsetWidth];
				});
			}

			currentButtonWidthRef.current.forEach((buttonWidth: number, index: number) => {
				totalWidth += buttonWidth + (isLastElementOfArray(actions, index) ? 0 : spacingPx);

				if (totalWidth <= containerWidth - (menuWidth + Number(spacingPx))) {
					maxVisibleActions++;
				}
			});

			if (isSmall) {
				setHiddenActions(actions);
				setVisibleActionsLength(0);
			} else {
				setHiddenActions(actions.slice(maxVisibleActions));
				setVisibleActionsLength(maxVisibleActions);
			}
		}
	}, [actions, isSmall, currentButtonWidthRef, spacingPx]);

	useLayoutEffect(() => {
		calculateVisibleActions();
	}, [actions, containerWidth, calculateVisibleActions]);

	function handleExecuteAction(action: ArchbaseAction) {
		if (action.enabled) {
			action.executeAction();
		}
	}

	function buildMenu() {
		buttonMenuRef.current = null;
		return (
			hiddenActions.length > 0 && (
				<>
					{visibleActionsLength !== 0 && _menuPosition === 'right' ? <Space w={spacingPx} /> : undefined}
					<div ref={buttonMenuRef}>
						<Menu
							opened={opened}
							onChange={setOpened}
							withinPortal={true}
							position={
								options && options.menuDropdownPosition
									? options.menuDropdownPosition
									: _menuPosition === 'right'
									? 'bottom-end'
									: 'bottom-start'
							}
						>
							<Menu.Target>
								{isLarge ? (
									<Button
										color={options && options.menuButtonColor ? options.menuButtonColor : 'blue.5'}
										variant={options && options.menuButtonVariant ? options.menuButtonVariant : variant}
										px={'10px'}
									>
										<IconMenu2 />
									</Button>
								) : (
									<ActionIcon
										color={options && options.menuButtonColor ? options.menuButtonColor : 'blue.5'}
										variant={options && options.menuButtonVariant ? options.menuButtonVariant : variant}
									>
										<IconMenu2 />
									</ActionIcon>
								)}
							</Menu.Target>
							<Menu.Dropdown>
								{hiddenActions.map((action) =>
									buildHiddenActionButton({
										action,
										options,
										variant,
										handleExecuteAction,
										customComponents,
									}),
								)}
							</Menu.Dropdown>
						</Menu>
					</div>
					{visibleActionsLength !== 0 && _menuPosition === 'left' ? <Space w={spacingPx} /> : undefined}
				</>
			)
		);
	}
	buttonRefsRef.current = [];
	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: _menuPosition === 'right' ? 'flex-end' : 'flex-start',
			}}
			ref={containerRef}
		>
			{_menuPosition === 'left' ? buildMenu() : undefined}
			{actions.map((action, index) => {
				const buttonRef = React.createRef();
				buttonRefsRef.current = [...buttonRefsRef.current, buttonRef];
				if (index >= visibleActionsLength) {
					return undefined;
				}
				return (
					<>
						<Tooltip withArrow withinPortal={true} disabled={!action.hint} label={action.hint}>
							<div>
								{buildVisibleActionButton(
									{
										action,
										options,
										variant,
										handleExecuteAction,
										customComponents,
									},
									isLarge,
									buttonRef,
								)}
							</div>
						</Tooltip>
						{visibleActionsLength === index + 1 ? undefined : <Space w={spacingPx} key={index} />}
					</>
				);
			})}
			{_menuPosition === 'right' ? buildMenu() : undefined}
		</div>
	);
}
