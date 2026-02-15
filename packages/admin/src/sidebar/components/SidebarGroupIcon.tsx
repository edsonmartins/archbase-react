import React from 'react';
import { ActionIcon, Stack, Text, Tooltip, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { SidebarGroupIconProps } from '../types';

/**
 * Componente de ícone de grupo para a variante Rail
 * Renderiza um ícone clicável com label opcional
 */
export function SidebarGroupIcon({
	group,
	active = false,
	onClick,
	showLabel = true,
	activeColor,
	inactiveColor,
}: SidebarGroupIconProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	// Cores padrão
	const defaultActiveColor = colorScheme === 'dark'
		? theme.colors[theme.primaryColor][8]
		: theme.colors[theme.primaryColor][0];

	const defaultInactiveColor = colorScheme === 'dark'
		? theme.colors[theme.primaryColor][6]
		: theme.colors[theme.primaryColor][7];

	const labelColor = colorScheme === 'dark'
		? theme.colors[theme.primaryColor][2]
		: theme.colors[theme.primaryColor][2];

	const computedActiveColor = activeColor ?? defaultActiveColor;
	const computedInactiveColor = inactiveColor ?? defaultInactiveColor;

	const content = (
		<Stack
			gap={2}
			align="center"
			justify="center"
			style={{ textAlign: 'center' }}
		>
			<ActionIcon
				size={48}
				variant={active ? 'filled' : 'subtle'}
				color={active ? computedActiveColor : computedInactiveColor}
				onClick={onClick}
				style={{
					transition: 'all 150ms ease',
				}}
			>
				{group.icon}
			</ActionIcon>
			{showLabel && (
				<Text
					size="xs"
					c={labelColor}
					style={{
						maxWidth: 70,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{group.label}
				</Text>
			)}
		</Stack>
	);

	// Envolver com Tooltip se não mostrar label
	if (!showLabel) {
		return (
			<Tooltip label={group.hint || group.label} position="right" withArrow>
				{content}
			</Tooltip>
		);
	}

	return content;
}
