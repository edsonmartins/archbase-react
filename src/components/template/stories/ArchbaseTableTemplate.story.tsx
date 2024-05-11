import { DataSourceEvent, DataSourceEventNames, LocalFilter } from '@components/datasource';
import {
	ArchbaseDataTableColumn,
	ArchbaseItemRender,
	ArchbaseItemRenderType,
	ArchbaseTableRowActions,
	Columns,
} from '@components/datatable';
import { useArchbaseRemoteServiceApi } from '@components/hooks/useArchbaseRemoteServiceApi';
import { ArchbaseNotifications } from '@components/notification';
import { ArchbaseQueryFilterDelegator } from '@components/querybuilder';
import { pessoasData } from '@demo/index';
import { API_TYPE } from '@demo/ioc/DemoIOCTypes';
import { FakePessoaService } from '@demo/service/FakePessoaService';
import {
	useArchbaseDataSource,
	useArchbaseDataSourceListener,
	useArchbaseForceUpdate,
	useArchbaseLocalFilterDataSource,
	useArchbaseRemoteDataSource,
	useArchbaseStore,
} from '@hooks/index';
import { Grid } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import { t } from 'i18next';
import React, { ReactNode, useMemo } from 'react';
import { PessoaStatus } from '../../../demo/data/types';
import { ArchbaseTableTemplate } from '../ArchbaseTableTemplate';
import { Pessoa } from 'demo/data/Pessoa';

const filters: LocalFilter[] = [];

const StatusValues: ArchbaseItemRenderType[] = [
	{
		value: PessoaStatus.APROVADO.toString(),
		label: 'Aprovado',
		color: 'green',
	},
	{
		value: PessoaStatus.REJEITADO.toString(),
		label: 'Rejeitado',
		color: 'red',
	},
	{
		value: PessoaStatus.PENDENTE.toString(),
		label: 'Pendente',
		color: 'orange',
	},
];

const ArchbaseTableTemplateExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const pessoaStore = useArchbaseStore('pessoaStore');
	const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa);
	/**
	 * Criando dataSource remoto
	 * @param dataSource Fonte de dados
	 */
	const {
		dataSource: dsPessoas,
		isLoading,
		error,
		isError,
		clearError,
	} = useArchbaseRemoteDataSource<Pessoa, number>({
		name: 'dsPessoas',
		service: pessoaApi,
		pageSize: 15,
		loadOnStart: true,
		store: pessoaStore,
		onLoadComplete: (dataSource) => {
			console.log(dataSource);
		},
		onDestroy: (_dataSource) => {
			//
		},
		onError: (error, origin) => {
			ArchbaseNotifications.showError(t('WARNING'), error, origin);
		},
	});

	useArchbaseDataSourceListener<Pessoa, string>({
		dataSource: dsPessoas,
		listener: (_event: DataSourceEvent<Pessoa>): void => {
			//
		},
	});

	// const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
	//   currentFilter: getDefaultEmptyFilter(),
	//   activeFilterIndex: -1,
	//   expandedFilter: false,
	// });
	const { dataSource: dsFilters } = useArchbaseLocalFilterDataSource({ initialData: filters, name: 'dsFilters' });
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });
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

	// const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
	//   setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
	// };

	// const handleToggleExpandedFilter = (expanded: boolean) => {
	//   setFilterState({ ...filterState, expandedFilter: expanded });
	// };

	// const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
	//   setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
	// };

	// const handleSearchByFilter = () => {};

	// const _queryFields: ReactNode = useMemo(() => {
	//   return (
	//     <QueryFields>
	//       <QueryField name="id" label="ID" dataType="number" sortable={true} quickFilter={true} quickFilterSort={true} />
	//       <QueryField
	//         name="nome"
	//         label="Nome da pessoa"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_CONTAINS}
	//         quickFilterSort={true}
	//       />
	//       <QueryField
	//         name="sexo"
	//         label="Sexo"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         quickFilterSort={true}
	//       >
	//         <QueryFieldValue label="Masculino" value="Masculino" />
	//         <QueryFieldValue label="Feminino" value="Feminino" />
	//       </QueryField>
	//       <QueryField
	//         name="cpf"
	//         label="CPF"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         mask={MaskPattern.CPF}
	//       />
	//       <QueryField
	//         name="pai"
	//         label="Nome do pai"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_CONTAINS}
	//         quickFilterSort={true}
	//       />
	//       <QueryField
	//         name="mae"
	//         label="Nome do mãe"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_CONTAINS}
	//         quickFilterSort={true}
	//       />
	//       <QueryField
	//         name="cidade"
	//         label="Cidade"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_CONTAINS}
	//         quickFilterSort={true}
	//       />

	//       <QueryField
	//         name="Estado"
	//         label="Estado"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_CONTAINS}
	//         quickFilterSort={true}
	//       />
	//       <QueryField
	//         name="email"
	//         label="E-mail"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_CONTAINS}
	//         quickFilterSort={true}
	//       />
	//       <QueryField
	//         name="data_nasc"
	//         label="Data nascimento"
	//         dataType="date"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_EQUALS}
	//       />
	//       <QueryField
	//         name="peso"
	//         label="Peso KG"
	//         dataType="number"
	//         sortable={true}
	//         quickFilter={true}
	//         operator={OP_EQUALS}
	//         quickFilterSort={true}
	//       />
	//       <QueryField
	//         name="status"
	//         label="Status da pessoa"
	//         dataType="string"
	//         sortable={true}
	//         quickFilter={true}
	//         quickFilterSort={true}
	//       >
	//         <QueryFieldValue label="APROVADO" value="0" />
	//         <QueryFieldValue label="REJEITADO" value="1" />
	//         <QueryFieldValue label="PENDENTE" value="2" />
	//       </QueryField>
	//     </QueryFields>
	//   );
	// }, []);

	const columns: ReactNode = useMemo(() => {
		return (
			<Columns>
				<ArchbaseDataTableColumn<Pessoa> dataField="id" dataType="uuid" header="Id" enableClickToCopy={true} />
				<ArchbaseDataTableColumn<Pessoa> dataField="nome" dataType="text" header="Nome da pessoa" />
				<ArchbaseDataTableColumn<Pessoa>
					dataField="data_nasc"
					dataType="date"
					header="Data nascimento"
					inputFilterType="date"
				/>
				<ArchbaseDataTableColumn<Pessoa> dataField="creditoOK" dataType="boolean" header="Crédito OK?" />
				<ArchbaseDataTableColumn<Pessoa>
					dataField="status"
					dataType="enum"
					inputFilterType="select"
					enumValues={StatusValues}
					header="Status"
					render={(data): ReactNode => {
						return <ArchbaseItemRender currentValue={`${data.getValue()}`} values={StatusValues} />;
					}}
				/>
			</Columns>
		);
	}, []);

	return (
		<Grid>
			<Grid.Col span={12} h={'100vh'}>
				<ArchbaseTableTemplate
					title="Pessoas"
					dataSource={dsPessoas}
					pageSize={15}
					cellPadding={4}
					bottomToolbarMinHeight={48}
					isLoading={isLoading}
					error={error}
					isError={isError}
					clearError={clearError}
					filterOptions={{
						activeFilterIndex: 0,
						enabledAdvancedFilter: false,
						apiVersion: '1.01',
						componentName: 'templateTableExemplo',
						viewName: 'templateTableView',
					}}
					columns={columns}
					userRowActions={{
						actions: ArchbaseTableRowActions<Pessoa>,
						onAddRow: () => {},
						onEditRow: () => {},
						onRemoveRow: () => {},
						onViewRow: () => {},
					}}
					filterType="advanced"
					filterPersistenceDelegator={dsFilters as ArchbaseQueryFilterDelegator}
				/>
			</Grid.Col>
		</Grid>
	);
};

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbaseTableTemplate> = {
	title: 'Modelos/Table template',
	component: ArchbaseTableTemplate,
};

export default meta;
type Story = StoryObj<typeof ArchbaseTableTemplate>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseTableTemplateExample />,
};
