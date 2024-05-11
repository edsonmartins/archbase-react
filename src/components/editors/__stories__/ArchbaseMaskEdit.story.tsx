import { Button, Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate, useArchbaseValidator } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseMaskEdit, MaskPattern } from '../ArchbaseMaskEdit';
import { Pessoa } from '../../../demo/data/Pessoa';
import { ArchbaseNotifications } from '../../../components/notification';

const ArchbaseEditExample = () => {
	const [withError, setWithError] = useState(false)
	const forceUpdate = useArchbaseForceUpdate();
	const validator = useArchbaseValidator()
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({
		initialData: data,
		validator,
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
							<Text fw={500}>Mask Edit Component</Text>
						</Group>
					</Card.Section>
					<ArchbaseMaskEdit title="CPF" dataSource={dataSource} dataField="cpf" mask={MaskPattern.CPF} onChangeError={(error) => setWithError(!!error)}/>
					<Button onClick={() => {
						if (withError) {
							return;
						}
						dataSource.save(() => {
							ArchbaseNotifications.showSuccess("Sucesso", "CPF salvo")
							dataSource.edit()
						})
					}}>Salvar</Button>
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

const data = [new Pessoa(pessoasData[0])];

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
