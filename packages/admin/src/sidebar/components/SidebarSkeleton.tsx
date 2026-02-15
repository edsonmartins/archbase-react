import React from 'react';
import { Box, Skeleton, Stack, Group, useMantineTheme, useMantineColorScheme } from '@mantine/core';

export interface SidebarSkeletonProps {
	/** Número de items a exibir */
	itemCount?: number;
	/** Se o sidebar está colapsado */
	collapsed?: boolean;
	/** Cor de fundo */
	backgroundColor?: string;
	/** Altura de cada item */
	itemHeight?: number;
	/** Mostrar grupos */
	showGroups?: boolean;
	/** Número de grupos */
	groupCount?: number;
}

/**
 * Skeleton para loading do menu do sidebar
 */
export function SidebarMenuSkeleton({
	itemCount = 8,
	collapsed = false,
	backgroundColor,
	itemHeight = 40,
	showGroups = true,
	groupCount = 2,
}: SidebarSkeletonProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const bgColor = backgroundColor || (colorScheme === 'dark' ? theme.colors.dark[7] : theme.white);

	// Se colapsado, mostrar apenas círculos de ícones
	if (collapsed) {
		return (
			<Stack gap="sm" p="xs" style={{ backgroundColor: bgColor }}>
				{Array.from({ length: itemCount }).map((_, index) => (
					<Skeleton key={index} circle height={32} width={32} />
				))}
			</Stack>
		);
	}

	// Gerar items com variação de largura
	const generateItems = (count: number, hasIndent: boolean = false) => {
		return Array.from({ length: count }).map((_, index) => {
			// Variar a largura para parecer mais natural
			const widthPercent = 60 + Math.random() * 30;
			return (
				<Group
					key={index}
					gap="sm"
					p="xs"
					style={{
						paddingLeft: hasIndent ? 24 : undefined,
						height: itemHeight,
					}}
				>
					<Skeleton circle height={24} width={24} />
					<Skeleton height={14} width={`${widthPercent}%`} radius="sm" />
				</Group>
			);
		});
	};

	// Se não mostrar grupos, apenas items simples
	if (!showGroups) {
		return (
			<Stack gap={2} p="xs" style={{ backgroundColor: bgColor }}>
				{generateItems(itemCount)}
			</Stack>
		);
	}

	// Calcular items por grupo
	const itemsPerGroup = Math.ceil(itemCount / groupCount);

	return (
		<Stack gap="md" p="xs" style={{ backgroundColor: bgColor }}>
			{Array.from({ length: groupCount }).map((_, groupIndex) => (
				<Box key={groupIndex}>
					{/* Header do grupo */}
					<Group gap="sm" p="xs">
						<Skeleton circle height={20} width={20} />
						<Skeleton height={12} width={80 + Math.random() * 40} radius="sm" />
					</Group>
					{/* Items do grupo */}
					<Stack gap={2} mt={4}>
						{generateItems(
							groupIndex === groupCount - 1
								? itemCount - groupIndex * itemsPerGroup
								: itemsPerGroup,
							true
						)}
					</Stack>
				</Box>
			))}
		</Stack>
	);
}

/**
 * Skeleton para a coluna de grupos (Rail variant)
 */
export function SidebarGroupsSkeleton({
	groupCount = 4,
	width = 80,
	backgroundColor,
}: {
	groupCount?: number;
	width?: string | number;
	backgroundColor?: string;
}) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const bgColor = backgroundColor || (colorScheme === 'dark'
		? theme.colors[theme.primaryColor][8]
		: theme.colors[theme.primaryColor][6]);

	return (
		<Stack
			gap="sm"
			p="xs"
			align="center"
			style={{
				width,
				backgroundColor: bgColor,
				height: '100%',
			}}
		>
			{Array.from({ length: groupCount }).map((_, index) => (
				<Stack key={index} gap={4} align="center">
					<Skeleton circle height={48} width={48} />
					<Skeleton height={10} width={40} radius="sm" />
				</Stack>
			))}
		</Stack>
	);
}

/**
 * Skeleton para o header do sidebar
 */
export function SidebarHeaderSkeleton({
	collapsed = false,
}: {
	collapsed?: boolean;
}) {
	if (collapsed) {
		return (
			<Box p="xs" style={{ display: 'flex', justifyContent: 'center' }}>
				<Skeleton circle height={32} width={32} />
			</Box>
		);
	}

	return (
		<Group gap="sm" p="md">
			<Skeleton circle height={40} width={40} />
			<Stack gap={4} style={{ flex: 1 }}>
				<Skeleton height={14} width="70%" radius="sm" />
				<Skeleton height={10} width="50%" radius="sm" />
			</Stack>
		</Group>
	);
}

/**
 * Skeleton para o perfil do usuário no footer
 */
export function SidebarUserProfileSkeleton({
	collapsed = false,
}: {
	collapsed?: boolean;
}) {
	if (collapsed) {
		return (
			<Box p="xs" style={{ display: 'flex', justifyContent: 'center' }}>
				<Skeleton circle height={36} width={36} />
			</Box>
		);
	}

	return (
		<Group gap="sm" p="sm">
			<Skeleton circle height={36} width={36} />
			<Stack gap={4} style={{ flex: 1 }}>
				<Skeleton height={12} width="60%" radius="sm" />
				<Skeleton height={10} width="80%" radius="sm" />
			</Stack>
		</Group>
	);
}

/**
 * Mensagem de erro para o sidebar
 */
export function SidebarErrorMessage({
	message,
	backgroundColor,
}: {
	message: string;
	backgroundColor?: string;
}) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const bgColor = backgroundColor || (colorScheme === 'dark' ? theme.colors.dark[7] : theme.white);
	const textColor = colorScheme === 'dark' ? theme.colors.red[4] : theme.colors.red[6];

	return (
		<Box
			p="md"
			style={{
				backgroundColor: bgColor,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100%',
			}}
		>
			<Box
				p="md"
				style={{
					backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.red[0],
					borderRadius: theme.radius.md,
					textAlign: 'center',
					color: textColor,
					fontSize: theme.fontSizes.sm,
				}}
			>
				{message}
			</Box>
		</Box>
	);
}
