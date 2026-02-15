import React, { useCallback } from 'react';
import {
	TextInput,
	ActionIcon,
	Kbd,
	Group,
	useMantineTheme,
	useMantineColorScheme,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { SidebarSearchProps } from '../types';

/**
 * Campo de busca para o sidebar
 * Suporta atalho de teclado e botão de limpar
 */
export function SidebarSearch({
	placeholder = 'Buscar...',
	value,
	onChange,
	onClear,
	collapsed = false,
}: SidebarSearchProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(e.currentTarget.value);
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		onChange?.('');
		onClear?.();
	}, [onChange, onClear]);

	const hasValue = value && value.length > 0;

	// Se colapsado, mostrar apenas ícone
	if (collapsed) {
		return (
			<ActionIcon
				variant="subtle"
				size="lg"
				color={colorScheme === 'dark' ? 'gray' : 'dark'}
			>
				<IconSearch size={18} />
			</ActionIcon>
		);
	}

	return (
		<TextInput
			placeholder={placeholder}
			leftSection={<IconSearch size={16} />}
			rightSection={
				hasValue ? (
					<ActionIcon
						variant="subtle"
						size="sm"
						onClick={handleClear}
						style={{ cursor: 'pointer' }}
					>
						<IconX size={14} />
					</ActionIcon>
				) : (
					<Kbd size="xs" style={{ marginRight: 4 }}>
						/
					</Kbd>
				)
			}
			value={value}
			onChange={handleChange}
			size="sm"
			styles={{
				input: {
					backgroundColor: colorScheme === 'dark'
						? theme.colors.dark[6]
						: theme.colors.gray[0],
				},
			}}
		/>
	);
}
