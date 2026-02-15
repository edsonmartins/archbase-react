import React from 'react';
import {
	UnstyledButton,
	Group,
	Avatar,
	Text,
	Box,
	Tooltip,
	useMantineTheme,
	useMantineColorScheme,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { SidebarUserProfileProps } from '../types';

/**
 * Componente de perfil do usuário para o footer do sidebar
 * Exibe avatar, nome e email do usuário
 */
export function SidebarUserProfile({
	name,
	email,
	avatar,
	onClick,
	collapsed = false,
}: SidebarUserProfileProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const bgHoverColor = colorScheme === 'dark'
		? theme.colors.dark[5]
		: theme.colors.gray[1];

	// Renderizar avatar
	const renderAvatar = () => {
		if (typeof avatar === 'string') {
			return <Avatar src={avatar} radius="xl" size={collapsed ? 'sm' : 'md'} />;
		}
		if (avatar) {
			return avatar;
		}
		// Avatar com iniciais se não tiver imagem
		const initials = name
			? name
					.split(' ')
					.map((n) => n[0])
					.slice(0, 2)
					.join('')
					.toUpperCase()
			: '?';
		return (
			<Avatar radius="xl" size={collapsed ? 'sm' : 'md'} color={theme.primaryColor}>
				{initials}
			</Avatar>
		);
	};

	// Conteúdo colapsado
	if (collapsed) {
		return (
			<Tooltip label={name || 'Perfil'} position="right" withArrow>
				<UnstyledButton
					onClick={onClick}
					p="xs"
					style={{
						borderRadius: theme.radius.sm,
						display: 'flex',
						justifyContent: 'center',
						width: '100%',
						transition: 'background-color 150ms ease',
					}}
					styles={{
						root: {
							'&:hover': {
								backgroundColor: bgHoverColor,
							},
						},
					}}
				>
					{renderAvatar()}
				</UnstyledButton>
			</Tooltip>
		);
	}

	// Conteúdo expandido
	return (
		<UnstyledButton
			onClick={onClick}
			p="sm"
			style={{
				borderRadius: theme.radius.sm,
				width: '100%',
				transition: 'background-color 150ms ease',
			}}
			styles={{
				root: {
					'&:hover': {
						backgroundColor: bgHoverColor,
					},
				},
			}}
		>
			<Group wrap="nowrap">
				{renderAvatar()}
				<Box style={{ flex: 1, overflow: 'hidden' }}>
					{name && (
						<Text
							size="sm"
							fw={500}
							style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{name}
						</Text>
					)}
					{email && (
						<Text
							size="xs"
							c="dimmed"
							style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{email}
						</Text>
					)}
				</Box>
				{onClick && (
					<IconChevronRight
						size={16}
						color={colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6]}
					/>
				)}
			</Group>
		</UnstyledButton>
	);
}
