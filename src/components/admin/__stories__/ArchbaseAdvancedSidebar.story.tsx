import { useArchbaseAdminStore, useArchbaseTheme } from '@components/hooks';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseAdvancedSidebar } from '../ArchbaseAdvancedSidebar';
import { navigationDataSampleWithGroup } from '../navigationDataWithGroup';

const ArchbaseAdvancedSidebarExample = () => {
	const adminStore = useArchbaseAdminStore();
	const theme = useArchbaseTheme();

	return (
		<div style={{ width: '100%', height: '800px' }}>
			<ArchbaseAdvancedSidebar
				navigationData={navigationDataSampleWithGroup}
				sidebarHeight="800px"
				sidebarGroupWidth="90px"
				selectedGroupColor="#132441"
				groupColor="white"
				backgroundGroupColor="#132441"
				groupLabelDarkColor="white"
				groupLabelLightColor="white"
				theme={theme}
			/>
		</div>
	);
};

const ArchbaseAdvancedSidebarWithouLabelExample = () => {
	const adminStore = useArchbaseAdminStore();
	const theme = useArchbaseTheme();

	return (
		<div style={{ width: '100%', height: '800px' }}>
			<ArchbaseAdvancedSidebar
				navigationData={navigationDataSampleWithGroup}
				sidebarHeight="800px"
				sidebarGroupWidth="60px"
				selectedGroupColor="#132441"
				groupColor="white"
				backgroundGroupColor="#132441"
				groupLabelDarkColor="white"
				groupLabelLightColor="white"
				showGroupLabels={false}
				theme={theme}
			/>
		</div>
	);
};

const meta: Meta<typeof ArchbaseAdvancedSidebar> = {
	title: 'Admin/Multi sidebar',
	component: ArchbaseAdvancedSidebar,
};

export default meta;
type Story = StoryObj<typeof ArchbaseAdvancedSidebar>;

export const Primary: Story = {
	name: 'Exemplo com label e fundo customizado',
	render: () => <ArchbaseAdvancedSidebarExample />,
};

export const WithoutLabel: Story = {
	name: 'Exemplo sem label e fundo customizado',
	render: () => <ArchbaseAdvancedSidebarWithouLabelExample />,
};
