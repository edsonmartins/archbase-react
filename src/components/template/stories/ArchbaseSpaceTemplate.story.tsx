import { ArchbaseActionButtons } from '@components/buttons/ArchbaseActionButtons';
import { ArchbaseGlobalFilter } from '@components/querybuilder/ArchbaseGlobalFilter';
import { Card } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ActionsDemo } from '../../buttons/ActionsDemo';
import { ArchbaseSpaceTemplate } from '../ArchbaseSpaceTemplate';

export const ArchbaseSpaceTemplateExample = () => {
	return (
		<div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
			<ArchbaseSpaceTemplate
				title="Pessoas"
				options={{
					headerFlexGrow: 'right',
				}}
				headerLeft={
					<Card>
						<ArchbaseGlobalFilter
							minFilterValueLength={3}
							searchableFields={['id', 'cpf', 'nome', 'idade']}
							onFilter={(value) => console.log(value)}
						/>
					</Card>
				}
				headerRight={
					<ArchbaseActionButtons
						actions={ActionsDemo}
						options={{
							largerBreakPoint: '800px',
							smallerBreakPoint: '400px',
							largerSpacing: '2rem',
							smallerSpacing: '0.5rem',
							largerButtonVariant: 'filled',
							smallerButtonVariant: 'filled',
							menuItemVariant: 'filled',
							menuButtonVariant: 'filled',
							menuButtonColor: 'blue.5',
							menuItemApplyActionColor: true,
							menuPosition: 'right',
						}}
					/>
				}
			/>
		</div>
	);
};

const meta: Meta<typeof ArchbaseSpaceTemplate> = {
	title: 'Modelos/Space template',
	component: ArchbaseSpaceTemplate,
};

export default meta;
type Story = StoryObj<typeof ArchbaseSpaceTemplate>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseSpaceTemplateExample />,
};
