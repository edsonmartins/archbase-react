import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { ReactNode, useMemo, useRef, useState } from 'react';
import {
  ArchbaseQueryFilter,
  ArchbaseQueryFilterState,
  getDefaultEmptyFilter,
  OP_CONTAINS,
  OP_EQUALS,
  QueryField,
  QueryFields,
  QueryFieldValue,
} from './ArchbaseFilterCommons';
import { ArchbaseQueryBuilder } from './ArchbaseQueryBuilder';

const ArchbaseQueryBuilderExample = () => {
  const [filterState, setFilterState] = useState<ArchbaseQueryFilterState>({
    currentFilter: getDefaultEmptyFilter(),
    activeFilterIndex: -1,
    expandedFilter: false,
  });
  const filterRef = useRef<any>();

  const handleFilterChanged = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleToggleExpandedFilter = (expanded: boolean) => {
    setFilterState({ ...filterState, expandedFilter: expanded });
  };

  const handleSelectedFilter = (filter: ArchbaseQueryFilter, activeFilterIndex: number) => {
    setFilterState({ ...filterState, currentFilter: filter, activeFilterIndex });
  };

  const handleSearchByFilter = () => {
    console.log('Buscar por filtro:', filterState.currentFilter);
  };

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
            <Group justify="space-between">
              <Text fw={500}>QueryBuilder Filter Component</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 800 }}>
            <ArchbaseQueryBuilder
              id={'queryBuilderExample'}
              viewName={'ViewPessoa'}
              apiVersion="1.00"
              ref={filterRef}
              expandedFilter={filterState.expandedFilter}
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

const meta: Meta<typeof ArchbaseQueryBuilder> = {
  title: 'Filtros/Query Builder',
  component: ArchbaseQueryBuilder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseQueryBuilder é um componente de construção de consultas/filtros avançados.

## Características
- Construção visual de filtros
- Suporte a múltiplos tipos de dados
- Operadores lógicos (AND, OR)
- Campos com valores predefinidos
- Ordenação de campos
- Filtro rápido
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseQueryBuilder>;

export const ExemploSimples: Story = {
  name: 'Exemplo Simples',
  render: () => <ArchbaseQueryBuilderExample />,
};
