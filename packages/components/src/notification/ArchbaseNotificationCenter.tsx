/**
 * ArchbaseNotificationCenter — centro de notificacoes com icone de sino,
 * badge de nao-lidas e painel (Popover ou Drawer) com lista de notificacoes.
 * Implementado com componentes Mantine puros, sem dependencias externas alem de date-fns.
 * @status stable
 */
import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Divider,
	Drawer,
	Flex,
	Group,
	Indicator,
	MantineSize,
	Popover,
	ScrollArea,
	Stack,
	Text,
	Tooltip,
	UnstyledButton,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import type { FloatingPosition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
	IconBell,
	IconBellOff,
	IconCheck,
	IconChecks,
	IconCircleCheck,
	IconExclamationCircle,
	IconInfoCircle,
	IconAlertTriangle,
	IconTrash,
	IconX,
} from '@tabler/icons-react';
import React, { CSSProperties, ReactNode, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArchbaseNotificationItem {
	id: string;
	title: string;
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	read: boolean;
	createdAt: Date;
	icon?: ReactNode;
	action?: { label: string; onClick: () => void };
	metadata?: Record<string, any>;
}

export interface ArchbaseNotificationCenterProps {
	/** Lista de notificacoes a exibir */
	notifications: ArchbaseNotificationItem[];
	/** Callback ao marcar uma notificacao como lida */
	onMarkAsRead?: (id: string) => void;
	/** Callback ao marcar todas como lidas */
	onMarkAllAsRead?: () => void;
	/** Callback ao remover uma notificacao */
	onRemove?: (id: string) => void;
	/** Callback ao limpar todas as notificacoes */
	onClearAll?: () => void;
	/** Callback ao clicar em uma notificacao */
	onClick?: (notification: ArchbaseNotificationItem) => void;
	/** Modo de renderizacao: popover ou drawer */
	renderAs?: 'drawer' | 'popover';
	/** Posicao do popover (ignorado no modo drawer) */
	position?: FloatingPosition;
	/** Largura do painel */
	width?: number;
	/** Altura maxima da area de scroll */
	maxHeight?: number;
	/** Titulo do painel */
	title?: string;
	/** Mensagem quando nao ha notificacoes */
	emptyMessage?: string;
	/** Mostrar badge com contagem de nao-lidas */
	showBadge?: boolean;
	/** Tamanho do botao */
	buttonSize?: MantineSize;
	/** Variante do botao */
	buttonVariant?: string;
	/** Estilo customizado do wrapper */
	style?: CSSProperties;
	/** Classe CSS customizada */
	className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_COLORS: Record<string, string> = {
	info: 'blue',
	success: 'green',
	warning: 'yellow',
	error: 'red',
};

function defaultIconForType(type: string) {
	switch (type) {
		case 'success':
			return <IconCircleCheck size={20} />;
		case 'warning':
			return <IconAlertTriangle size={20} />;
		case 'error':
			return <IconExclamationCircle size={20} />;
		default:
			return <IconInfoCircle size={20} />;
	}
}

function relativeTime(date: Date): string {
	try {
		return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
	} catch {
		return '';
	}
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface NotificationItemRowProps {
	notification: ArchbaseNotificationItem;
	onMarkAsRead?: (id: string) => void;
	onRemove?: (id: string) => void;
	onClick?: (notification: ArchbaseNotificationItem) => void;
}

function NotificationItemRow({ notification, onMarkAsRead, onRemove, onClick }: NotificationItemRowProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === 'dark';
	const type = notification.type ?? 'info';
	const color = TYPE_COLORS[type] ?? 'blue';
	const icon = notification.icon ?? defaultIconForType(type);

	return (
		<UnstyledButton
			onClick={() => {
				if (!notification.read && onMarkAsRead) {
					onMarkAsRead(notification.id);
				}
				onClick?.(notification);
			}}
			style={{
				display: 'block',
				width: '100%',
				padding: '10px 12px',
				borderRadius: theme.radius.sm,
				backgroundColor: notification.read
					? 'transparent'
					: isDark
						? theme.colors.dark[6]
						: theme.colors.gray[0],
				cursor: 'pointer',
				transition: 'background-color 150ms ease',
			}}
			onMouseOver={(e) => {
				(e.currentTarget as HTMLElement).style.backgroundColor = isDark
					? theme.colors.dark[5]
					: theme.colors.gray[1];
			}}
			onMouseOut={(e) => {
				(e.currentTarget as HTMLElement).style.backgroundColor = notification.read
					? 'transparent'
					: isDark
						? theme.colors.dark[6]
						: theme.colors.gray[0];
			}}
		>
			<Flex gap="sm" align="flex-start">
				{/* Icon */}
				<Box
					style={{
						color: theme.colors[color]?.[isDark ? 4 : 6] ?? color,
						flexShrink: 0,
						marginTop: 2,
					}}
				>
					{icon}
				</Box>

				{/* Content */}
				<Box style={{ flex: 1, minWidth: 0 }}>
					<Flex justify="space-between" align="center" gap={4}>
						<Text
							size="sm"
							fw={notification.read ? 400 : 600}
							truncate
							style={{ flex: 1 }}
						>
							{notification.title}
						</Text>
						{!notification.read && (
							<Box
								style={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									backgroundColor: theme.colors[color]?.[isDark ? 4 : 6] ?? color,
									flexShrink: 0,
								}}
							/>
						)}
					</Flex>

					<Text size="xs" c="dimmed" lineClamp={2} mt={2}>
						{notification.message}
					</Text>

					<Flex justify="space-between" align="center" mt={6}>
						<Text size="xs" c="dimmed">
							{relativeTime(notification.createdAt)}
						</Text>

						<Group gap={4}>
							{notification.action && (
								<Button
									size="compact-xs"
									variant="light"
									color={color}
									onClick={(e) => {
										e.stopPropagation();
										notification.action!.onClick();
									}}
								>
									{notification.action.label}
								</Button>
							)}
							{!notification.read && onMarkAsRead && (
								<Tooltip label="Marcar como lida" withArrow>
									<ActionIcon
										size="xs"
										variant="subtle"
										color="gray"
										onClick={(e) => {
											e.stopPropagation();
											onMarkAsRead(notification.id);
										}}
									>
										<IconCheck size={14} />
									</ActionIcon>
								</Tooltip>
							)}
							{onRemove && (
								<Tooltip label="Remover" withArrow>
									<ActionIcon
										size="xs"
										variant="subtle"
										color="gray"
										onClick={(e) => {
											e.stopPropagation();
											onRemove(notification.id);
										}}
									>
										<IconX size={14} />
									</ActionIcon>
								</Tooltip>
							)}
						</Group>
					</Flex>
				</Box>
			</Flex>
		</UnstyledButton>
	);
}

// ---------------------------------------------------------------------------
// Panel content (shared between Popover and Drawer)
// ---------------------------------------------------------------------------

interface PanelContentProps {
	notifications: ArchbaseNotificationItem[];
	sortedNotifications: ArchbaseNotificationItem[];
	unreadCount: number;
	title: string;
	emptyMessage: string;
	maxHeight: number;
	onMarkAsRead?: (id: string) => void;
	onMarkAllAsRead?: () => void;
	onRemove?: (id: string) => void;
	onClearAll?: () => void;
	onClick?: (notification: ArchbaseNotificationItem) => void;
}

function PanelContent({
	sortedNotifications,
	unreadCount,
	title,
	emptyMessage,
	maxHeight,
	onMarkAsRead,
	onMarkAllAsRead,
	onRemove,
	onClearAll,
	onClick,
}: PanelContentProps) {
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<Stack gap={0}>
			{/* Header */}
			<Flex justify="space-between" align="center" px="md" py="sm">
				<Group gap="xs">
					<Text fw={600} size="md">
						{title}
					</Text>
					{unreadCount > 0 && (
						<Badge size="sm" variant="filled" color="blue" circle={unreadCount < 100}>
							{unreadCount}
						</Badge>
					)}
				</Group>
				{unreadCount > 0 && onMarkAllAsRead && (
					<Tooltip label="Marcar todas como lidas" withArrow>
						<ActionIcon variant="subtle" color="blue" onClick={onMarkAllAsRead}>
							<IconChecks size={18} />
						</ActionIcon>
					</Tooltip>
				)}
			</Flex>

			<Divider />

			{/* Body */}
			{sortedNotifications.length === 0 ? (
				<Stack align="center" justify="center" py="xl" gap="xs">
					<IconBellOff
						size={48}
						style={{
							color: isDark ? '#5c5f66' : '#adb5bd',
						}}
					/>
					<Text size="sm" c="dimmed">
						{emptyMessage}
					</Text>
				</Stack>
			) : (
				<ScrollArea.Autosize mah={maxHeight} type="auto" offsetScrollbars>
					<Stack gap={2} p="xs">
						{sortedNotifications.map((notification) => (
							<NotificationItemRow
								key={notification.id}
								notification={notification}
								onMarkAsRead={onMarkAsRead}
								onRemove={onRemove}
								onClick={onClick}
							/>
						))}
					</Stack>
				</ScrollArea.Autosize>
			)}

			{/* Footer */}
			{sortedNotifications.length > 0 && onClearAll && (
				<>
					<Divider />
					<Flex justify="center" py="xs">
						<Button
							variant="subtle"
							color="gray"
							size="compact-sm"
							leftSection={<IconTrash size={14} />}
							onClick={onClearAll}
						>
							Limpar todas
						</Button>
					</Flex>
				</>
			)}
		</Stack>
	);
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ArchbaseNotificationCenter(props: ArchbaseNotificationCenterProps) {
	const {
		notifications,
		onMarkAsRead,
		onMarkAllAsRead,
		onRemove,
		onClearAll,
		onClick,
		renderAs = 'popover',
		position = 'bottom-end',
		width = 380,
		maxHeight = 500,
		title = 'Notificações',
		emptyMessage = 'Nenhuma notificação',
		showBadge = true,
		buttonSize = 'lg',
		buttonVariant = 'subtle',
		style,
		className,
	} = props;

	const [opened, { open, close, toggle }] = useDisclosure(false);

	const unreadCount = useMemo(
		() => notifications.filter((n) => !n.read).length,
		[notifications],
	);

	const sortedNotifications = useMemo(() => {
		return [...notifications].sort((a, b) => {
			// Unread first
			if (a.read !== b.read) return a.read ? 1 : -1;
			// Then by createdAt descending
			return b.createdAt.getTime() - a.createdAt.getTime();
		});
	}, [notifications]);

	const bellButton = (
		<Indicator
			disabled={!showBadge || unreadCount === 0}
			label={unreadCount > 99 ? '99+' : unreadCount}
			size={18}
			color="red"
			offset={4}
			processing={unreadCount > 0}
		>
			<ActionIcon
				variant={buttonVariant as any}
				size={buttonSize}
				onClick={toggle}
				aria-label="Abrir central de notificações"
			>
				<IconBell size={22} />
			</ActionIcon>
		</Indicator>
	);

	const panelProps: PanelContentProps = {
		notifications,
		sortedNotifications,
		unreadCount,
		title,
		emptyMessage,
		maxHeight,
		onMarkAsRead,
		onMarkAllAsRead,
		onRemove,
		onClearAll,
		onClick,
	};

	if (renderAs === 'drawer') {
		return (
			<Box style={style} className={className}>
				{bellButton}
				<Drawer
					opened={opened}
					onClose={close}
					position="right"
					size={width}
					title={undefined}
					withCloseButton={false}
					padding={0}
				>
					<PanelContent {...panelProps} />
				</Drawer>
			</Box>
		);
	}

	return (
		<Box style={style} className={className}>
			<Popover
				opened={opened}
				onClose={close}
				position={position}
				width={width}
				shadow="lg"
				radius="md"
				withArrow
			>
				<Popover.Target>{bellButton}</Popover.Target>
				<Popover.Dropdown p={0} style={{ overflow: 'hidden' }}>
					<PanelContent {...panelProps} />
				</Popover.Dropdown>
			</Popover>
		</Box>
	);
}

ArchbaseNotificationCenter.displayName = 'ArchbaseNotificationCenter';
