import React, { useState, useRef } from 'react';
import { Group, Stack, Text, Paper, Button, Code } from '@mantine/core';
import {
  ArchbaseCompositeFilters,
  ArchbaseDataGrid,
  ArchbaseDataSource,
} from '@archbase/components';
import type {
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
  QuickFilterPreset,
} from '@archbase/components';

// Mock de dados
interface Funcionario {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  salario: number;
  idade: number;
  ativo: string;
  dataAdmissao: string;
}

const mockData: Funcionario[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', departamento: 'TI', salario: 5000, idade: 25, ativo: 'ativo', dataAdmissao: '2023-01-15' },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com', departamento: 'RH', salario: 4500, idade: 32, ativo: 'ativo', dataAdmissao: '2022-05-20' },
  { id: '3', nome: 'Pedro Costa', email: 'pedro@email.com', departamento: 'TI', salario: 6000, idade: 28, ativo: 'inativo', dataAdmissao: '2021-10-10' },
  { id: '4', nome: 'Ana Oliveira', email: 'ana@email.com', departamento: 'Financeiro', salario: 5500, idade: 35, ativo: 'ativo', dataAdmissao: '2020-03-25' },
  { id: '5', nome: 'Carlos Lima', email: 'carlos@email.com', departamento: 'TI', salario: 7000, idade: 42, ativo: 'ativo', dataAdmissao: '2019-08-15' },
];

const filterDefinitions: ArchbaseFilterDefinition[] = [
  { key: 'nome', label: 'Nome', type: 'text' },
  { key: 'email', label: 'E-mail', type: 'text' },
  { key: 'departamento', label: 'Departamento', type: 'enum', options: [
    { value: 'TI', label: 'TI' },
    { value: 'RH', label: 'RH' },
    { value: 'Financeiro', label: 'Financeiro' },
    { value: 'Operações', label: 'Operações' },
  ]},
  { key: 'salario', label: 'Salário', type: 'currency' },
  { key: 'idade', label: 'Idade', type: 'integer' },
  { key: 'ativo', label: 'Status', type: 'enum', options: [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'pendente', label: 'Pendente' },
  ]},
];

const quickFilters: QuickFilterPreset[] = [
  {
    id: 'ti-ativos',
    name: 'TI Ativos',
    filters: [
      { key: 'departamento', label: 'Departamento', type: 'enum', operator: '=', value: 'TI', displayValue: 'TI' },
      { key: 'ativo', label: 'Status', type: 'enum', operator: '=', value: 'ativo', displayValue: 'Ativo' },
    ],
  },
  {
    id: 'salario-alto',
    name: 'Salário > 5000',
    filters: [
      { key: 'salario', label: 'Salário', type: 'currency', operator: '>', value: 5000, displayValue: '5000' },
    ],
  },
];

export function ArchbaseCompositeFiltersWithDataSource() {
  const [filters, setFilters] = useState<ArchbaseActiveFilter[]>([]);
  const [rsqlOutput, setRsqlOutput] = useState<string>('');
  const dataSourceRef = useRef<ArchbaseDataSource<Funcionario, string> | null>(null);

  // Filtra os dados baseado no RSQL
  const filteredData = React.useMemo(() => {
    if (!rsqlOutput) return mockData;

    // Implementação simples de filtro RSQL
    return mockData.filter(item => {
      return filters.every(filter => {
        const value = String(item[filter.key as keyof Funcionario] || '').toLowerCase();
        const filterValue = String(filter.value).toLowerCase();

        switch (filter.operator) {
          case 'contains':
            return value.includes(filterValue);
          case '=':
            return value === filterValue;
          case '!=':
            return value !== filterValue;
          case '>':
            return Number(value) > Number(filterValue);
          case '<':
            return Number(value) < Number(filterValue);
          case '>=':
            return Number(value) >= Number(filterValue);
          case '<=':
            return Number(value) <= Number(filterValue);
          default:
            return true;
        }
      });
    });
  }, [filters, rsqlOutput]);

  const colunas = [
    { field: 'nome', headerName: 'Nome', width: 180 },
    { field: 'email', headerName: 'E-mail', width: 200 },
    { field: 'departamento', headerName: 'Departamento', width: 100 },
    { field: 'idade', headerName: 'Idade', width: 80 },
    { field: 'salario', headerName: 'Salário', width: 100, valueFormatter: (p: any) => `R$ ${p.value}` },
    { field: 'ativo', headerName: 'Status', width: 100 },
  ];

  return (
    <Stack gap="md" p="md">
      <Text size="lg" fw={500}>
        Filtros com DataGrid
      </Text>

      <ArchbaseCompositeFilters
        filters={filterDefinitions}
        value={filters}
        onChange={(newFilters, rsql) => {
          setFilters(newFilters);
          setRsqlOutput(rsql || '');
        }}
        quickFilters={quickFilters}
        enableQuickFilters
      />

      <Paper withBorder p="xs" radius="md">
        <Group justify="space-between">
          <Text size="sm">
            {filteredData.length} registros encontrados
          </Text>
          {rsqlOutput && (
            <Code style={{ fontSize: 11 }}>{rsqlOutput}</Code>
          )}
        </Group>
      </Paper>

      <Paper withBorder p="0" radius="md" style={{ height: 300 }}>
        <ArchbaseDataGrid<Funcionario, string>
          dataSource={{
            records: filteredData,
            grandTotalRecords: filteredData.length,
            currentPage: 1,
            totalPages: 1,
            pageSize: 10,
          }}
          columns={colunas}
          height={300}
          hideFooter
        />
      </Paper>
    </Stack>
  );
}
