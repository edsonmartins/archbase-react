import { Box } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ActionsDemo } from '../ActionsDemo';
import { ArchbaseActionButtons } from '../ArchbaseActionButtons';

const ArchbaseActionButtonsExample = () => {
	return (
		<Box maw={1600}>
			<ArchbaseActionButtons
				actions={ActionsDemo}
				options={{
					largerBreakPoint: '600px',
					smallerBreakPoint: '400px',
					largerSpacing: '1rem',
					smallerSpacing: '1rem',
					largerButtonVariant: 'filled',
					smallerButtonVariant: 'filled',
					menuItemVariant: 'filled',
					menuButtonVariant: 'filled',
					menuButtonColor: 'blue.5',
					menuDropdownPosition: 'bottom',
					menuItemApplyActionColor: true,
					menuPosition: 'right',
				}}
			/>
		</Box>
	);
};

const meta: Meta<typeof ArchbaseActionButtons> = {
	title: 'Botões/ActionButtons',
	component: ArchbaseActionButtons,
};

export default meta;
type Story = StoryObj<typeof ArchbaseActionButtons>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseActionButtonsExample />,
};
