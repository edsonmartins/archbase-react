import React, { useCallback, useState } from 'react';
import { NavLink, Tooltip, Badge, Kbd, Box, Menu, useMantineTheme, useMantineColorScheme, Center } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ArchbaseNavigationItem } from '../../types';
import { SidebarItemProps, ExtendedNavigationItem } from '../types';
import { archbaseI18next } from '@archbase/core';

/**
 * Componente de item de menu do sidebar
 * Usa NavLink do Mantine com suporte a aninhamento
 */
export function SidebarItem({
	item,
	depth = 0,
	collapsed = false,
	active = false,
	onClick,
	textColor,
	iconColor,
	hoverColor,
	itemHeight = 40,
}: SidebarItemProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const extendedItem = item as ExtendedNavigationItem;
	const [isHovered, setIsHovered] = useState(false);

	// Cor do texto - usa o que foi passado via props
	const computedTextColor = textColor || 'var(--mantine-color-text)';

	// Cor do ícone - usa o que foi passado via props
	const computedIconColor = iconColor || theme.colors[theme.primaryColor][6];

	// Cor de hover - usa prop ou fallback para primary color
	const hoverBgColor = hoverColor || theme.colors[theme.primaryColor][6];
	// Cor de hover quando ativo - usa tom mais escuro (darken)
	const hoverActiveBgColor = hoverColor
		? `color-mix(in srgb, ${hoverColor} 80%, black)`
		: theme.colors[theme.primaryColor][8];

	// Cores dinâmicas baseadas no hover/active state
	const currentBgColor = isHovered
		? (active ? hoverActiveBgColor : hoverBgColor)
		: (active ? hoverBgColor : 'transparent');
	const currentTextColor = (isHovered || active) ? theme.white : computedTextColor;
	const currentIconColor = (isHovered || active) ? theme.white : computedIconColor;

	// Verificar se item está desabilitado
	const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;

	// Verificar se deve esconder item desabilitado
	if (isDisabled && item.hideDisabledItem) {
		return null;
	}

	// Verificar se deve mostrar no sidebar
	if (!item.showInSidebar) {
		return null;
	}

	// Handler de clique
	const handleClick = useCallback(() => {
		if (!isDisabled && onClick) {
			onClick(item);
		}
	}, [isDisabled, onClick, item]);

	// Traduzir label
	const translatedLabel = archbaseI18next.t(item.label);

	// Renderizar badge se houver
	const renderBadge = () => {
		if (!extendedItem.badge) return null;
		return (
			<Badge size="xs" color={extendedItem.badgeColor || 'blue'} variant="filled">
				{extendedItem.badge}
			</Badge>
		);
	};

	// Renderizar atalho de teclado se houver
	const renderShortcut = () => {
		if (!extendedItem.shortcut) return null;
		return (
			<Kbd size="xs" style={{ marginLeft: 'auto' }}>
				{extendedItem.shortcut}
			</Kbd>
		);
	};

	// Se o item tem subitems (links)
	if (item.links && item.links.length > 0) {
		// Filtrar apenas items visíveis
		const visibleLinks = item.links.filter((link) => {
			const linkDisabled = typeof link.disabled === 'function' ? link.disabled() : link.disabled;
			return link.showInSidebar && (!linkDisabled || !link.hideDisabledItem);
		});

		if (visibleLinks.length === 0 && isDisabled && item.hideDisabledItem) {
			return null;
		}

		// Se está colapsado, mostrar como menu flutuante
		if (collapsed) {
			return (
				<Menu
					position="right-start"
					withArrow
					shadow="md"
					trigger="hover"
					openDelay={100}
					closeDelay={200}
				>
					<Menu.Target>
						<Center style={{ width: '100%', padding: '8px 0' }}>
							<Tooltip label={translatedLabel} position="right" withArrow>
								<Box
									style={{
										color: computedIconColor,
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									{item.icon}
								</Box>
							</Tooltip>
						</Center>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>{translatedLabel}</Menu.Label>
						{visibleLinks.map((link, index) => {
							const linkDisabled = typeof link.disabled === 'function' ? link.disabled() : link.disabled;
							return (
								<Menu.Item
									key={index}
									leftSection={link.icon}
									disabled={linkDisabled}
									onClick={() => onClick?.(link)}
								>
									{archbaseI18next.t(link.label)}
								</Menu.Item>
							);
						})}
					</Menu.Dropdown>
				</Menu>
			);
		}

		// Renderizar como NavLink com filhos
		return (
			<NavLink
				label={translatedLabel}
				leftSection={<Box style={{ color: currentIconColor }}>{item.icon}</Box>}
				rightSection={
					<Box style={{ display: 'flex', alignItems: 'center', gap: 4, color: currentTextColor }}>
						{renderBadge()}
						<IconChevronRight
							size={14}
							style={{
								transition: 'transform 200ms ease',
							}}
						/>
					</Box>
				}
				childrenOffset={28}
				defaultOpened={item.initiallyOpened || active}
				disabled={isDisabled}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					height: itemHeight,
					backgroundColor: currentBgColor,
					transition: 'background-color 150ms ease',
				}}
				styles={{
					root: {
						borderRadius: 0,
					},
					label: {
						color: currentTextColor,
					},
					children: {
						paddingLeft: 0,
					},
				}}
			>
				{visibleLinks.map((link, index) => (
					<SidebarItem
						key={index}
						item={link}
						depth={depth + 1}
						collapsed={collapsed}
						active={active}
						onClick={onClick}
						textColor={textColor}
						iconColor={iconColor}
						hoverColor={hoverColor}
						itemHeight={itemHeight}
					/>
				))}
			</NavLink>
		);
	}

	// Item simples sem subitems - modo colapsado
	if (collapsed) {
		return (
			<Tooltip
				label={extendedItem.tooltip || translatedLabel}
				position="right"
				withArrow
			>
				<Center
					style={{
						width: '100%',
						height: itemHeight,
						cursor: isDisabled ? 'not-allowed' : 'pointer',
						opacity: isDisabled ? 0.5 : 1,
						backgroundColor: active ? hoverBgColor : 'transparent',
						transition: 'background-color 150ms ease',
					}}
					onClick={handleClick}
					onMouseEnter={(e) => {
						if (!isDisabled) {
							// Se ativo, usa cor mais escura; se não, usa cor padrão de hover
							e.currentTarget.style.backgroundColor = active ? hoverActiveBgColor : hoverBgColor;
						}
					}}
					onMouseLeave={(e) => {
						// Volta para o estado original
						e.currentTarget.style.backgroundColor = active ? hoverBgColor : 'transparent';
					}}
				>
					<Box style={{ color: active ? theme.white : computedIconColor }}>
						{item.icon}
					</Box>
				</Center>
			</Tooltip>
		);
	}

	// Item simples sem subitems - modo expandido
	return (
		<NavLink
			label={translatedLabel}
			leftSection={<Box style={{ color: currentIconColor }}>{item.icon}</Box>}
			rightSection={
				<Box style={{ display: 'flex', alignItems: 'center', gap: 4, color: currentTextColor }}>
					{renderBadge()}
					{renderShortcut()}
				</Box>
			}
			active={active}
			disabled={isDisabled}
			onClick={handleClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				height: itemHeight,
				paddingLeft: depth > 0 ? depth * 16 + 12 : undefined,
				backgroundColor: currentBgColor,
				transition: 'background-color 150ms ease',
			}}
			styles={{
				root: {
					borderRadius: 0,
				},
				label: {
					color: currentTextColor,
				},
			}}
		/>
	);
}
