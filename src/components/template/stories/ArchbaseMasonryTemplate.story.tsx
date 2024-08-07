import { DataSourceEvent, DataSourceEventNames, LocalFilter } from '@components/datasource';
import { ArchbaseCheckbox, MaskPattern } from '@components/editors';
import { useArchbaseRemoteServiceApi } from '@components/hooks/useArchbaseRemoteServiceApi';
import {
	ArchbaseMasonryContext,
	ArchbaseMasonryContextValue,
	ArchbaseMasonryCustomItemProps,
} from '@components/masonry/index';
import { ArchbaseNotifications } from '@components/notification';
import {
	ArchbaseQueryFilterDelegator,
	OP_CONTAINS,
	OP_EQUALS,
	QueryField,
	QueryFields,
	QueryFieldValue,
} from '@components/querybuilder';
import { pessoasData } from '@demo/index';
import { API_TYPE } from '@demo/ioc/DemoIOCTypes';
import { FakePessoaService } from '@demo/service/FakePessoaService';
import {
	useArchbaseDataSource,
	useArchbaseDataSourceListener,
	useArchbaseForceUpdate,
	useArchbaseLocalFilterDataSource,
	useArchbaseRemoteDataSource,
} from '@hooks/index';
import { Avatar, Button, Card, Center, Grid, Group, Paper, Progress, RingProgress, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import { IconAt, IconPhoneCall } from '@tabler/icons-react';
import { IconArrowDownRight } from '@tabler/icons-react';
import { IconArrowForwardUp } from '@tabler/icons-react';
import { t } from 'i18next';
import React, { ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ArchbaseMasonryTemplate } from '../ArchbaseMasonryTemplate';
import classes from './ArchbaseMasonryTemplate.module.css';
import { Pessoa } from 'demo/data/Pessoa';

const filters: LocalFilter[] = [];

const ArchbaseMasonryTemplateExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const [debug, setDebug] = useState<boolean>(true);
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
		pageSize: 10,
		loadOnStart: true,
		currentPage: 0,
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

	const filterFields: ReactNode = useMemo(() => {
		return (
			<QueryFields>
				<QueryField name="id" label="ID" dataType="number" sortable={true} quickFilter={true} quickFilterSort={true} />
				<QueryField
					name="nome"
					label="Nome da pessoa"
					dataType="string"
					sortable={true}
					quickFilter={true}
					operator={OP_CONTAINS}
					quickFilterSort={true}
				/>
				<QueryField
					name="sexo"
					label="Sexo"
					dataType="string"
					sortable={true}
					quickFilter={true}
					quickFilterSort={true}
				>
					<QueryFieldValue label="Masculino" value="Masculino" />
					<QueryFieldValue label="Feminino" value="Feminino" />
				</QueryField>
				<QueryField
					name="cpf"
					label="CPF"
					dataType="string"
					sortable={true}
					quickFilter={true}
					mask={MaskPattern.CPF}
				/>
				<QueryField
					name="pai"
					label="Nome do pai"
					dataType="string"
					sortable={true}
					quickFilter={true}
					operator={OP_CONTAINS}
					quickFilterSort={true}
				/>
				<QueryField
					name="mae"
					label="Nome do mãe"
					dataType="string"
					sortable={true}
					quickFilter={true}
					operator={OP_CONTAINS}
					quickFilterSort={true}
				/>
				<QueryField
					name="cidade"
					label="Cidade"
					dataType="string"
					sortable={true}
					quickFilter={true}
					operator={OP_CONTAINS}
					quickFilterSort={true}
				/>

				<QueryField
					name="Estado"
					label="Estado"
					dataType="string"
					sortable={true}
					quickFilter={true}
					operator={OP_CONTAINS}
					quickFilterSort={true}
				/>
				<QueryField
					name="email"
					label="E-mail"
					dataType="string"
					sortable={true}
					quickFilter={true}
					operator={OP_CONTAINS}
					quickFilterSort={true}
				/>
				<QueryField
					name="data_nasc"
					label="Data nascimento"
					dataType="date"
					sortable={true}
					quickFilter={true}
					operator={OP_EQUALS}
				/>
				<QueryField
					name="peso"
					label="Peso KG"
					dataType="number"
					sortable={true}
					quickFilter={true}
					operator={OP_EQUALS}
					quickFilterSort={true}
				/>
				<QueryField
					name="status"
					label="Status da pessoa"
					dataType="string"
					sortable={true}
					quickFilter={true}
					quickFilterSort={true}
				>
					<QueryFieldValue label="APROVADO" value="0" />
					<QueryFieldValue label="REJEITADO" value="1" />
					<QueryFieldValue label="PENDENTE" value="2" />
				</QueryField>
			</QueryFields>
		);
	}, []);

	return (
		<div style={{ width: '100%', height: 'calc(100vh - 30px)' }}>
			<ArchbaseCheckbox
				label="Debug"
				isChecked={debug}
				onChangeValue={(value: any, _event: any) => setDebug(value === true)}
			/>
			<ArchbaseMasonryTemplate
				filterType="advanced"
				title="Pessoas"
				dataSource={dsPessoas}
				pageSize={10}
				isLoading={isLoading}
				error={error}
				isError={isError}
				debug={debug}
				debugOptions={{
					debugLayoutHotKey: 'ctrl+shift+S',
					debugObjectInspectorHotKey: 'ctrl+shift+D',
					objectsToInspect: [{ name: 'Pessoa', object: dsPessoas }],
				}}
				clearError={clearError}
				width="100%"
				height="100%"
				filterOptions={{
					activeFilterIndex: 0,
					enabledAdvancedFilter: false,
					apiVersion: '1.01',
					componentName: 'templatePanelExemplo',
					viewName: 'templatePanelView',
				}}
				userActions={{
					visible: true,
					customUserActions: [
						{
							id: '5',
							icon: <IconArrowForwardUp />,
							color: 'cyan',
							label: 'liberar',
							executeAction: () => {},
							enabled: true,
							hint: 'Clique para liberar.',
						},
					],
				}}
				filterFields={filterFields}
				filterPersistenceDelegator={dsFilters as ArchbaseQueryFilterDelegator}
				columnsCount={5}
				gutter="10px"
				columnsCountBreakPoints={{ 320: 1, 640: 2, 960: 3, 1280: 4, 1600: 5 }}
				component={{ type: CustomItem }}
			/>
		</div>
	);
};

type CustomItemProps = ArchbaseMasonryCustomItemProps<Pessoa, string>;

const CustomItem = (props: CustomItemProps) => {
	const masonryContextValue = useContext<ArchbaseMasonryContextValue<Pessoa, string>>(ArchbaseMasonryContext);
	const itemRef = useRef<any>(null);

	useEffect(() => {
		if (itemRef.current && props.active) {
			itemRef.current.focus();
		}
	}, [props.active]);

	const handleClick = (event) => {
		event.preventDefault();
		if (!props.disabled) {
			if (masonryContextValue.handleSelectItem) {
				masonryContextValue.handleSelectItem(props.index, props.recordData);
			}
		}
	};

	const backgroundColor = props.active ? masonryContextValue.activeBackgroundColor : '';
	const color = props.active ? masonryContextValue.activeColor : '';

	return (
		<Paper
			withBorder={true}
			onClick={handleClick}
			style={{ maxWidth: 380, overflow: 'hidden', width: 320, height: 240, padding: '8px', backgroundColor, color }}
			ref={itemRef}
			tabIndex={-1}
		>
			<Group wrap="nowrap">
				<Avatar src={props.recordData.foto} size={94} radius="md" />
				<div>
					<Text fz="lg" fw={500} className={classes.name} truncate={true}>
						{props.recordData.nome}
					</Text>

					<Group wrap="nowrap" gap={10} mt={3}>
						<IconAt stroke={1.5} size="1rem" className={classes.icon} />
						<Text fz="xs" c="dimmed" className={classes.name}>
							{props.recordData.email}
						</Text>
					</Group>

					<Group wrap="nowrap" gap={10} mt={5}>
						<IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
						<Text fz="xs" c="dimmed" className={classes.name}>
							{props.recordData.celular}
						</Text>
					</Group>
				</div>
			</Group>
			<Card withBorder radius="md" p="sm" className={classes.card}>
				<Grid>
					<Grid.Col span={8}>
						<Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
							Total mês
						</Text>
						<Text fz="lg" fw={500} className={classes.stats}>
							R$5.431 / R$10.000
						</Text>
					</Grid.Col>
					<Grid.Col span={4}>
						<RingProgress
							size={80}
							roundCaps
							thickness={8}
							sections={[{ value: 34, color: 'red' }]}
							label={
								<Center>
									<IconArrowDownRight size="1.4rem" stroke={1.5} />
								</Center>
							}
						/>
					</Grid.Col>
				</Grid>
				<Progress
					value={54.31}
					mt="md"
					size="lg"
					radius="xl"
					classNames={{
						root: classes.progressTrack,
						section: classes.progressBar,
					}}
				/>
			</Card>
		</Paper>
	);
};

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbaseMasonryTemplate> = {
	title: 'Modelos/Masonry template',
	component: ArchbaseMasonryTemplate,
};

export default meta;
type Story = StoryObj<typeof ArchbaseMasonryTemplate>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseMasonryTemplateExample />,
};
