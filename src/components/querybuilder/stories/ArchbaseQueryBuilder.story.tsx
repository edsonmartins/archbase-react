import React, { ReactNode, useMemo, useRef, useState } from 'react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { useArchbaseForceUpdate } from '../../hooks';
import { Meta, StoryObj } from '@storybook/react';
import { Pessoa, pessoasData } from '@demo/index';
import { ArchbaseQueryBuilder } from '../ArchbaseQueryBuilder';
import {
  ArchbaseQueryFilter,
  ArchbaseQueryFilterState,
  OP_CONTAINS,
  QueryField,
  QueryFields,
  getDefaultEmptyFilter,
} from '../ArchbaseFilterCommons';

const ArchbaseEditExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });
  const filterRef = useRef<any>();
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

  const onFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const onToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded });
  };

  const onSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const queryFields: ReactNode = useMemo(() => {
    return (
      <QueryFields>
        <QueryField name="id" label="ID" dataType="number" sortable={true} quickFilter={true} quickFilterSort={true} />
        <QueryField name="cdPessoa" label="Código" dataType="string" sortable={true} quickFilter={true} />
        <QueryField
          name="boEnderecoHomologado"
          label="Endereço homologado"
          dataType="boolean"
          sortable={true}
          quickFilter={true}
        />
        <QueryField
          name="razaoSocial"
          label="Razão social"
          dataType="string"
          sortable={true}
          quickFilter={true}
          operator={OP_CONTAINS}
          quickFilterSort={true}
        />
        <QueryField
          name="nome"
          label="Nome"
          dataType="string"
          sortable={true}
          quickFilter={true}
          operator={OP_CONTAINS}
        />
        <QueryField
          name="cpf"
          label="CPF"
          dataType="string"
          sortable={true}
          quickFilter={true}
          operator={OP_CONTAINS}
          quickFilterSort={true}
        />
        <QueryField
          name="cnpj"
          label="CNPJ"
          dataType="string"
          sortable={true}
          quickFilter={true}
          operator={OP_CONTAINS}
        />
        <QueryField
          name="tpStatus"
          label="Status"
          dataType="string"
          sortable={true}
          quickFilter={true}
          quickFilterSort={true}
        >
          <QueryFieldValue label="ATIVO" value="ATIVO" />
          <QueryFieldValue label="INATIVO" value="INATIVO" />
          <QueryFieldValue label="BLOQUEADO" value="BLOQUEADO" />
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
          <ArchbaseQueryBuilder
            id={'this.props.filterName'}
            viewName={'ViewPessoa'}
            apiVersion="1.00"
            ref={filterRef}
            expandedFilter={filterState.expandedFilter}
            persistenceDelegator={this._dataSourceFilter}
            currentFilter={filterState.currentFilter}
            activeFilterIndex={filterState.activeFilterIndex}
            onSelectedFilter={onSelectedFilter}
            onFilterChanged={onFilterChanged}
            onSearchByFilter={onSearchByFilter}
            onToggleExpandedFilter={onToggleExpandedFilter}
            width={'660px'}
            height="170px"
          >
            {queryFields}
          </ArchbaseQueryBuilder>
        </Card>
      </Grid.Col>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}></ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/Textarea',
  component: ArchbaseEditExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseEditExample> = {
  args: {
    render: () => {
      <ArchbaseEditExample />;
    },
  },
};
