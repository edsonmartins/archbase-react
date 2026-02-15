import React, { useState, useCallback } from 'react';
import {
	Box,
	Collapse,
	Group,
	Text,
	UnstyledButton,
	useMantineTheme,
	useMantineColorScheme,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { SidebarGroupProps } from '../types';

/**
 * Componente de grupo colapsável do sidebar
 * Agrupa items relacionados com header clicável
 */
export function SidebarGroup({
	label,
	icon,
	children,
	defaultExpanded = true,
	expanded: controlledExpanded,
	onExpandedChange,
	groupId,
}: SidebarGroupProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	// Estado interno (se não controlado)
	const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

	// Determinar se é controlado ou não
	const isControlled = controlledExpanded !== undefined;
	const expanded = isControlled ? controlledExpanded : internalExpanded;

	// Handler de toggle
	const handleToggle = useCallback(() => {
		if (isControlled) {
			onExpandedChange?.(!expanded);
		} else {
			setInternalExpanded((prev) => !prev);
		}
	}, [isControlled, expanded, onExpandedChange]);

	// Cores baseadas no tema
	const headerBgColor = colorScheme === 'dark'
		? theme.colors.dark[6]
		: theme.colors.gray[1];

	const headerHoverColor = colorScheme === 'dark'
		? theme.colors.dark[5]
		: theme.colors.gray[2];

	const textColor = colorScheme === 'dark'
		? theme.colors.gray[4]
		: theme.colors.gray[7];

	const iconColor = colorScheme === 'dark'
		? theme.colors[theme.primaryColor][4]
		: theme.colors[theme.primaryColor][6];

	return (
		<Box>
			{/* Header do grupo */}
			<UnstyledButton
				onClick={handleToggle}
				w="100%"
				p="xs"
				style={{
					borderRadius: theme.radius.sm,
					backgroundColor: headerBgColor,
					transition: 'background-color 150ms ease',
				}}
				styles={{
					root: {
						'&:hover': {
							backgroundColor: headerHoverColor,
						},
					},
				}}
			>
				<Group justify="space-between" wrap="nowrap">
					<Group gap="xs" wrap="nowrap">
						{icon && (
							<Box style={{ color: iconColor }}>
								{icon}
							</Box>
						)}
						<Text size="sm" fw={600} c={textColor}>
							{label}
						</Text>
					</Group>
					<IconChevronDown
						size={16}
						color={textColor}
						style={{
							transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
							transition: 'transform 200ms ease',
						}}
					/>
				</Group>
			</UnstyledButton>

			{/* Conteúdo colapsável */}
			<Collapse in={expanded}>
				<Box mt={4}>
					{children}
				</Box>
			</Collapse>
		</Box>
	);
}

/**
 * Componente de divisor/seção do sidebar
 * Apenas exibe um label sem funcionalidade de colapso
 */
export function SidebarSection({
	label,
	children,
}: {
	label: string;
	children?: React.ReactNode;
}) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const textColor = colorScheme === 'dark'
		? theme.colors.gray[5]
		: theme.colors.gray[6];

	return (
		<Box>
			<Text
				size="xs"
				fw={700}
				c={textColor}
				tt="uppercase"
				px="sm"
				py="xs"
				style={{ letterSpacing: '0.5px' }}
			>
				{label}
			</Text>
			{children}
		</Box>
	);
}
