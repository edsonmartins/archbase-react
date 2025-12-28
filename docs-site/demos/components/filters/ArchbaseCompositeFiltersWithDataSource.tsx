import React, { useState } from 'react';
import { Group, Stack, Text, Paper, Button, Code } from '@mantine/core';
import { ArchbaseCompositeFilters } from '@archbase/components';
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

  // Filtra os dados baseado no RSQL
  const filteredData = React.useMemo(() => {
    if (!rsqlOutput) return mockData;

    // Implementação simples de filtro RSQL para demonstração
    return mockData.filter(item => {
      // Para demo, filtra por nome se contém "like"
      if (rsqlOutput.includes('nome=like=')) {
        const match = rsqlOutput.match(/nome=like=\*([^*]+)\*/);
        if (match) {
          const searchTerm = match[1].toLowerCase();
          return item.nome.toLowerCase().includes(searchTerm);
        }
      }

      // Filtro de departamento
      if (rsqlOutput.includes('departamento==')) {
        const match = rsqlOutput.match(/departamento==([a-zA-Z]+)/);
        if (match) {
          return item.departamento === match[1];
        }
      }

      // Filtro de salário
      if (rsqlOutput.includes('salario>')) {
        const match = rsqlOutput.match(/salario>(\d+)/);
        if (match) {
          return item.salario > Number(match[1]);
        }
      }

      return true;
    });
  }, [rsqlOutput]);

  const clearFilters = () => {
    setFilters([]);
    setRsqlOutput('');
  };

  return (
    <Stack gap="md" p="md">
      <Text size="lg" fw={500}>
        Filtros Compostos com DataSource
      </Text>
      <Text size="sm" c="dimmed">
        Este exemplo demonstra como usar o ArchbaseCompositeFilters com um DataSource real.
        Os filtros geram RSQL que pode ser enviado para uma API REST.
      </Text>

      <ArchbaseCompositeFilters
        filters={filterDefinitions}
        value={filters}
        onChange={(newFilters, rsql) => {
          setFilters(newFilters);
          setRsqlOutput(rsql || '');
        }}
        quickFilters={quickFilters}
        placeholder="Adicione filtros..."
        enablePresets
        enableHistory
        enableQuickFilters
      />

      {rsqlOutput && (
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" fw={500} c="dimmed">
                RSQL gerado ({filters.length} filtro{filters.length !== 1 ? 's' : ''})
              </Text>
              <Button size="xs" variant="light" onClick={clearFilters}>
                Limpar
              </Button>
            </Group>
            <Code block style={{ fontSize: 12 }}>
              {rsqlOutput}
            </Code>
          </Stack>
        </Paper>
      )}

      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          <Text size="sm" fw={500} c="dimmed">
            Resultados ({filteredData.length} registro{filteredData.length !== 1 ? 's' : ''})
          </Text>
          <Text size="sm" c="dimmed">
            Em uma aplicação real, o RSQL seria enviado para a API:
          </Text>
          <Code block style={{ fontSize: 11 }}>
            {`GET /api/funcionarios?filter=${encodeURIComponent(rsqlOutput || '')}`}
          </Code>
        </Stack>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          <Text size="sm" fw={500}>Dados Filtrados:</Text>
          {filteredData.length === 0 ? (
            <Text size="sm" c="dimmed">Nenhum resultado encontrado</Text>
          ) : (
            filteredData.map(item => (
              <Paper key={item.id} withBorder p="xs" radius="sm">
                <Group justify="space-between">
                  <Text size="sm">{item.nome}</Text>
                  <Text size="xs" c="dimmed">{item.departamento} - R$ {item.salario}</Text>
                </Group>
              </Paper>
            ))
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
