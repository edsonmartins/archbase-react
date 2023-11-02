import { Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pessoa, pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseMaskEdit, MaskPattern } from '../ArchbaseMaskEdit';

const ArchbaseEditExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({
		initialData: data,
		name: 'dsPessoas',
	});
	if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
		dataSource.edit();
	}
	useArchbaseDataSourceListener<Pessoa, string>({
		dataSource,
		listener: (event: DataSourceEvent<Pessoa>): void => {
			switch (event.type) {
				case DataSourceEventNames.fieldChanged: {
					forceUpdate();
					break;
				}
				default:
			}
		},
	});

	return (
		<Grid>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group position="apart">
							<Text weight={500}>Mask Edit Component</Text>
						</Group>
					</Card.Section>
					<ArchbaseMaskEdit
						label="CPF"
						dataSource={dataSource}
						dataField="cpf"
						mask={MaskPattern.CPF}
					/>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group position="apart">
							<Text weight={500}>DataSource dsPessoas</Text>
						</Group>
					</Card.Section>
					<ArchbaseObjectInspector data={dataSource} />
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbaseMaskEdit> = {
	title: 'Editores/Mask Edit',
	component: ArchbaseMaskEdit,
};

export default meta;
type Story = StoryObj<typeof ArchbaseMaskEdit>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseEditExample />,
};
