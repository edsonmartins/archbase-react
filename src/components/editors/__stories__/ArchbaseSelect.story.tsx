import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PedidoStatus } from '../../../demo/data/types';
import { Pedido, pedidosData, Pessoa, pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseSelect } from '../ArchbaseSelect';
import { ArchbaseSelectItem } from '../ArchbaseSelectItem';

const pessoasList: Pessoa[] = pessoasData;
const pedidosList: Pedido[] = pedidosData;

const ArchbaseSelectExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const { dataSource } = useArchbaseDataSource<Pedido, string>({
		initialData: pedidosList,
		name: 'dsPedidos',
	});
	if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
		dataSource.edit();
	}
	useArchbaseDataSourceListener<Pedido, string>({
		dataSource,
		listener: (event: DataSourceEvent<Pedido>): void => {
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
			<Grid.Col span={12}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group position="apart">
							<Text weight={500}>Select Component</Text>
						</Group>
					</Card.Section>
					<Box sx={(_theme) => ({ height: 150 })}>
						<ArchbaseSelect<Pedido, string, Pessoa>
							label="Nome"
							dataSource={dataSource}
							dataField="cliente"
							initialOptions={pessoasList}
							getOptionLabel={(option: Pessoa) => option.nome}
							getOptionValue={(option: Pessoa) => option}
						/>
						<ArchbaseSelect<Pedido, string, PedidoStatus>
							label="Status"
							dataSource={dataSource}
							dataField="status"
							searchable={false}
							getOptionLabel={(option: PedidoStatus) => option.toString()}
							getOptionValue={(option: PedidoStatus) => option}
						>
							<ArchbaseSelectItem
								disabled={false}
								label="Pendente"
								value={PedidoStatus.PENDENTE}
							/>
							<ArchbaseSelectItem
								disabled={false}
								label="Faturado"
								value={PedidoStatus.FATURADO}
							/>
							<ArchbaseSelectItem
								disabled={false}
								label="Cancelado"
								value={PedidoStatus.CANCELADO}
							/>
						</ArchbaseSelect>
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col span={6}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group position="apart">
							<Text weight={500}>Objeto Pedido</Text>
						</Group>
					</Card.Section>
					<ScrollArea sx={(_theme) => ({ height: 500 })}>
						<ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
					</ScrollArea>
				</Card>
			</Grid.Col>
			<Grid.Col span={6}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group position="apart">
							<Text weight={500}>DataSource dsPedidos</Text>
						</Group>
					</Card.Section>
					<ScrollArea sx={(_theme) => ({ height: 500 })}>
						<ArchbaseObjectInspector data={dataSource} />
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseSelect> = {
	title: 'Editores/Select',
	component: ArchbaseSelect,
};

export default meta;
type Story = StoryObj<typeof ArchbaseSelect>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseSelectExample />,
};
