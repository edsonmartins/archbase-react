import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useRef } from 'react';
import { Pessoa, pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseNumberEdit } from '../ArchbaseNumberEdit';

const ArchbaseNumberEditExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const inputRef = useRef<HTMLInputElement>(null);
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
							<Text fw={500}>Number Edit Component</Text>
						</Group>
					</Card.Section>
					<ArchbaseNumberEdit<Pessoa, string>
						width={200}
						innerRef={inputRef}
						label="Altura"
						dataSource={dataSource}
						dataField="altura"
						precision={2}
					/>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsPessoas</Text>
						</Group>
					</Card.Section>
					<ScrollArea style={{ height: 500 }}>
						<ArchbaseObjectInspector data={dataSource} />
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbaseNumberEdit> = {
	title: 'Editores/Number Edit',
	component: ArchbaseNumberEdit,
};

export default meta;
type Story = StoryObj<typeof ArchbaseNumberEdit>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseNumberEditExample />,
};
