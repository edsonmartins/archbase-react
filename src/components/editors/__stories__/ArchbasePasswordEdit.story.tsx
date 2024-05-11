import { Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbasePasswordEdit } from '../ArchbasePasswordEdit';
import { Pessoa } from '../../../demo/data/Pessoa';

const ArchbasePasswordEditExample = () => {
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
						<Group justify="space-between">
							<Text fw={500}>PasswordEdit Component</Text>
						</Group>
					</Card.Section>
					<ArchbasePasswordEdit label="Senha" dataSource={dataSource} dataField="senha" />
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsPessoas</Text>
						</Group>
					</Card.Section>
					<ArchbaseObjectInspector data={dataSource} />
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbasePasswordEdit> = {
	title: 'Editores/Password Edit',
	component: ArchbasePasswordEdit,
};

export default meta;
type Story = StoryObj<typeof ArchbasePasswordEdit>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbasePasswordEditExample />,
};
