import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pedido, pedidosData, Pessoa } from '../../../demo/index';
import { API_TYPE } from '../../../demo/ioc/DemoIOCTypes';
import { FakePessoaService } from '../../../demo/service/FakePessoaService';
import { processErrorMessage } from '../../core/exceptions';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseRemoteServiceApi } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { Page } from '../../service';
import { ArchbaseAsyncSelect, OptionsResult } from '../ArchbaseAsyncSelect';

const pedidosList: Pedido[] = pedidosData;
const PAGE_SIZE = 10;

const ArchbaseAsyncSelectExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa);
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

	const loadRemotePessoas = async (page, value): Promise<OptionsResult<Pessoa>> => {
		return new Promise<OptionsResult<Pessoa>>(async (resolve, reject) => {
			try {
				const result: Page<Pessoa> = await pessoaApi.findAllWithFilter(value, page, PAGE_SIZE);
				resolve({
					options: result.content,
					page: result.pageable.pageNumber,
					totalPages: result.totalPages,
				});
			} catch (error) {
				reject(processErrorMessage(error));
			}
		});
	};

	return (
		<Grid>
			<Grid.Col offset={1} span={6}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>AsyncSelect Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 100 }}>
						<ArchbaseAsyncSelect<Pedido, string, Pessoa>
							label="Nome"
							dataSource={dataSource}
							dataField="cliente"
							getOptionLabel={(option: Pessoa) => option && option.nome}
							getOptionValue={(option: Pessoa) => option}
							getOptions={loadRemotePessoas}
						// converter={value => value.altura}
						/>
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsPedidos</Text>
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

const meta: Meta<typeof ArchbaseAsyncSelect> = {
	title: 'Editores/AsyncSelect',
	component: ArchbaseAsyncSelect,
};

export default meta;
type Story = StoryObj<typeof ArchbaseAsyncSelect>;

export const Primary: Story = {
	name: 'Exemplo básico',
	render: () => <ArchbaseAsyncSelectExample />,
};
