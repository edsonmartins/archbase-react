/**
 * As ações de uma linha: ver, editar, remover e permissões — na ordem em que aparecem.
 *
 * <p>Eram três blocos idênticos, um por entidade, diferindo só nos handlers e no slot. A
 * ordem dos ícones é parte do contrato da tela e está fixada em
 * {@code test/ArchbaseSecurityView.fluxos.test.tsx}, que localiza os botões por posição.
 */
import React, { type ReactNode } from 'react';
import { ActionIcon, Group, Tooltip, useMantineColorScheme } from '@mantine/core';
import { useArchbaseTheme } from '@archbase/core';
import { IconEdit, IconEye, IconShieldCheckered, IconTrashX } from '@tabler/icons-react';
import type { TranslateFn } from './columns';

export interface SecurityRowActionsProps<T> {
	row: T;
	onView: (row: T) => void;
	onEdit: (row: T) => void;
	onRemove: (row: T) => void;
	onEditPermissions: () => void;
	/** Slot: entra antes das ações padrão. */
	before?: (row: T) => ReactNode;
	/** Slot: entra depois das ações padrão. */
	after?: (row: T) => ReactNode;
	t: TranslateFn;
}

export function SecurityRowActions<T>({
	row,
	onView,
	onEdit,
	onRemove,
	onEditPermissions,
	before,
	after,
	t,
}: SecurityRowActionsProps<T>) {
	const theme = useArchbaseTheme();
	const { colorScheme } = useMantineColorScheme();
	const escuro = colorScheme === 'dark';
	const cor = (nome: 'blue' | 'yellow' | 'red' | 'green') =>
		escuro ? theme.colors[nome][8] : theme.colors[nome][4];

	return (
		<Group gap={1} wrap="nowrap">
			{before?.(row)}
			<ActionIcon variant="transparent" onClick={() => onView(row)}>
				<IconEye size={20} color={cor('blue')} />
			</ActionIcon>
			<ActionIcon variant="transparent" onClick={() => onEdit(row)}>
				<IconEdit size={20} color={cor('yellow')} />
			</ActionIcon>
			<ActionIcon variant="transparent" onClick={() => onRemove(row)}>
				<IconTrashX size={20} color={cor('red')} />
			</ActionIcon>
			<Tooltip withinPortal withArrow position="left" label={`${t('archbase:Edit permissions')}`}>
				<ActionIcon variant="transparent" onClick={onEditPermissions}>
					<IconShieldCheckered size={20} color={cor('green')} />
				</ActionIcon>
			</Tooltip>
			{after?.(row)}
		</Group>
	);
}
