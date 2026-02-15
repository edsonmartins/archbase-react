import React from 'react';
import { Badge, Indicator } from '@mantine/core';
import { SidebarBadgeProps } from '../types';

/**
 * Badge para exibir notificações/contadores em items do sidebar
 */
export function SidebarBadge({
	value,
	color = 'red',
	size = 'xs',
}: SidebarBadgeProps) {
	// Se valor for número e for maior que 99, mostrar "99+"
	const displayValue = typeof value === 'number' && value > 99 ? '99+' : value;

	return (
		<Badge size={size} color={color} variant="filled">
			{displayValue}
		</Badge>
	);
}

/**
 * Indicador de ponto para notificações
 * Útil quando não precisa mostrar número
 */
export function SidebarIndicator({
	children,
	show = true,
	color = 'red',
	processing = false,
}: {
	children: React.ReactNode;
	show?: boolean;
	color?: string;
	processing?: boolean;
}) {
	return (
		<Indicator
			disabled={!show}
			color={color}
			processing={processing}
			size={8}
			offset={4}
		>
			{children}
		</Indicator>
	);
}
