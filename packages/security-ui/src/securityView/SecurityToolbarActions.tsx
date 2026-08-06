/**
 * A barra de ferramentas das abas de usuários, grupos e perfis: "Novo" e "Editar permissões".
 *
 * <p>A aba de tokens de acesso <b>não</b> usa este componente, de propósito: ela tem um botão
 * de revogar com estado desabilitado próprio, e forçá-la aqui produziria uma abstração com
 * mais exceções do que regra.
 */
import React from 'react';
import { Button, Flex, Group } from '@mantine/core';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import type { TranslateFn } from './columns';

export interface SecurityToolbarActionsProps {
	onAdd: () => void;
	onEditPermissions: () => void;
	t: TranslateFn;
}

export const SecurityToolbarActions = ({ onAdd, onEditPermissions, t }: SecurityToolbarActionsProps) => (
	<Flex justify={'space-between'} style={{ width: '50%' }}>
		<Group align="end" gap={'4px'} wrap="nowrap">
			<Button color={'green'} leftSection={<IconPlus />} onClick={onAdd}>
				{`${t('archbase:New')}`}
			</Button>
			<Button color={'blue'} leftSection={<IconEdit />} onClick={onEditPermissions}>
				{`${t('archbase:Edit permissions')}`}
			</Button>
		</Group>
		<Flex align={'flex-start'} justify={'flex-end'} style={{ width: '200px' }}></Flex>
	</Flex>
);
