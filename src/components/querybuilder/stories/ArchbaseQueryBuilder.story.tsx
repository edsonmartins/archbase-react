import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import {
  useArchbaseDataSource,
  useArchbaseDataSourceListener,
  useArchbaseForceUpdate,
  useArchbaseLocalFilterDataSource,
  useArchbaseRemoteDataSource,
} from '../../hooks';
import { Meta, StoryObj } from '@storybook/react';
import { Pessoa, pessoasData } from '../../../demo/index';
import { ArchbaseQueryBuilder } from '../ArchbaseQueryBuilder';
import { t } from 'i18next';
import {
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  ArchbaseQueryFilterState,
  OP_CONTAINS,
  OP_EQUALS,
  QueryField,
  QueryFieldValue,
  QueryFields,
  getDefaultEmptyFilter,
} from '../ArchbaseFilterCommons';
import { LocalFilter } from '../../../components/datasource/ArchbaseLocalFilterDataSource';
import { FakePessoaService } from '../../../demo/service/FakePessoaService';
import { API_TYPE } from '../../../demo/ioc/DemoIOCTypes';
import { useArchbaseRemoteServiceApi } from '../../../components/hooks/useArchbaseRemoteServiceApi';
import { ArchbaseNotifications } from '../../../components/notification';
import { MaskPattern } from '../../../components/editors';
import { DataSourceEvent, DataSourceEventNames } from '../../../components/datasource';

const filters: LocalFilter[] = [];

const ArchbaseQueryBuilderExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa);
  /**
   * Criando dataSource remoto
   * @param dataSource Fonte de dados
   */
  const {
    dataSource: dsPessoas,
    // isLoading,
    // error,
    // isError,
    // clearError,
  } = useArchbaseRemoteDataSource<Pessoa, number>({
    name: 'dsPessoas',
    service: pessoaApi,
    pageSize: 50,
    loadOnStart: true,
    currentPage: 0,
    onLoadComplete: (_dataSource) => {
      //
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

  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });
  const filterRef = useRef<any>();
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

  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded });
  };

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleSearchByFilter = () => {};

  const queryFields: ReactNode = useMemo(() => {
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
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>QueryBuilder Filter Component</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 800 })}>
            <ArchbaseQueryBuilder
              id={'this.props.filterName'}
              viewName={'ViewPessoa'}
              apiVersion="1.00"
              ref={filterRef}
              expandedFilter={filterState.expandedFilter}
              persistenceDelegator={dsFilters as ArchbaseQueryFilterDelegator}
              currentFilter={filterState.currentFilter}
              activeFilterIndex={filterState.activeFilterIndex}
              onSelectedFilter={handleSelectedFilter}
              onFilterChanged={handleFilterChanged}
              onSearchByFilter={handleSearchByFilter}
              onToggleExpandedFilter={handleToggleExpandedFilter}
              width={'560px'}
              height="170px"
            >
              {queryFields}
            </ArchbaseQueryBuilder>
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/Query Builder',
  component: ArchbaseQueryBuilderExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseQueryBuilderExample> = {
  args: {
    render: () => {
      <ArchbaseQueryBuilderExample />;
    },
  },
};
