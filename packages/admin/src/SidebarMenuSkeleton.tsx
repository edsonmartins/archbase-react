/**
 * SidebarMenuSkeleton - Componente de skeleton loading para a área de menu da sidebar.
 * Exibe placeholders animados enquanto as permissões de navegação são carregadas.
 * Este componente deve ser usado apenas na área do menu, não sobrepondo header/footer.
 */
import { Skeleton, Stack, Group, useMantineColorScheme, useMantineTheme, Text, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import React, { ReactNode } from 'react';

export interface SidebarMenuSkeletonProps {
	/** Número de itens de menu a exibir no skeleton */
	itemCount?: number;
	/** Se a sidebar está colapsada */
	collapsed?: boolean;
	/** Cor de fundo */
	backgroundColor?: string;
}

/**
 * Skeleton padrão para a área de itens de menu da sidebar.
 * Usa o estilo padrão do Mantine (cinza animado).
 */
export function SidebarMenuSkeleton({
	itemCount = 8,
	collapsed = false,
	backgroundColor,
}: SidebarMenuSkeletonProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const bgColor = backgroundColor ?? (colorScheme === 'dark' ? theme.colors.dark[7] : theme.white);

	if (collapsed) {
		return (
			<Stack
				gap="sm"
				p="xs"
				align="center"
				style={{
					backgroundColor: bgColor,
					width: '100%',
					height: '100%',
				}}
			>
				{Array.from({ length: itemCount }).map((_, i) => (
					<Skeleton
						key={i}
						height={32}
						width={32}
						radius="sm"
					/>
				))}
			</Stack>
		);
	}

	return (
		<Stack
			gap="xs"
			p="md"
			style={{
				backgroundColor: bgColor,
				flex: 1,
				width: '100%',
				height: '100%',
			}}
		>
			{Array.from({ length: itemCount }).map((_, i) => (
				<Group key={i} gap="sm" wrap="nowrap">
					<Skeleton
						height={24}
						width={24}
						radius="sm"
					/>
					<Skeleton
						height={18}
						radius="xl"
						style={{ flex: 1 }}
					/>
				</Group>
			))}
		</Stack>
	);
}

export interface SidebarGroupsSkeletonProps {
	/** Número de grupos a exibir no skeleton */
	groupCount?: number;
	/** Largura da coluna de grupos */
	width?: string | number;
	/** Altura da sidebar */
	height?: string | number;
	/** Cor de fundo da área de grupos */
	backgroundColor?: string;
}

/**
 * Skeleton para a área de grupos da sidebar (coluna lateral com ícones).
 * Usa o estilo padrão do Mantine (cinza animado).
 */
export function SidebarGroupsSkeleton({
	groupCount = 3,
	width = '80px',
	height = '100%',
	backgroundColor,
}: SidebarGroupsSkeletonProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	// Usar tons de cinza neutros para o skeleton (não a cor primária)
	const bgColor = backgroundColor ?? (colorScheme === 'dark'
		? theme.colors.dark[6]
		: theme.colors.gray[2]);

	return (
		<Stack
			gap="md"
			p="xs"
			align="center"
			style={{
				width,
				height,
				backgroundColor: bgColor,
			}}
		>
			{Array.from({ length: groupCount }).map((_, i) => (
				<Stack key={i} gap={4} align="center">
					<Skeleton
						height={48}
						width={48}
						radius="md"
						circle={false}
					/>
					<Skeleton
						height={10}
						width={40}
						radius="xl"
					/>
				</Stack>
			))}
		</Stack>
	);
}

export interface SidebarErrorMessageProps {
	/** Mensagem de erro a exibir */
	message: string;
	/** Cor de fundo */
	backgroundColor?: string;
	/** Componente customizado para exibir o erro */
	children?: ReactNode;
}

/**
 * Componente para exibir mensagem de erro na sidebar.
 */
export function SidebarErrorMessage({
	message,
	backgroundColor,
	children,
}: SidebarErrorMessageProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const bgColor = backgroundColor ?? (colorScheme === 'dark' ? theme.colors.dark[7] : theme.white);
	const textColor = colorScheme === 'dark' ? theme.colors.red[4] : theme.colors.red[6];

	if (children) {
		return <>{children}</>;
	}

	return (
		<Center p="md" style={{ backgroundColor: bgColor, flex: 1, height: '100%' }}>
			<Stack align="center" gap="xs">
				<IconAlertCircle size={32} color={textColor} />
				<Text size="sm" c={textColor} ta="center">
					{message}
				</Text>
			</Stack>
		</Center>
	);
}
