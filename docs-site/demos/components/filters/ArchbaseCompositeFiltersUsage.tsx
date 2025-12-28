import React, { useState } from 'react';
import { Group, Stack, Text, Paper, Code, Badge } from '@mantine/core';
import { ArchbaseCompositeFilters } from '@archbase/components';
import type { ArchbaseFilterDefinition, ArchbaseActiveFilter, QuickFilterPreset } from '@archbase/components';

// Definição dos campos filtráveis
const filterDefinitions: ArchbaseFilterDefinition[] = [
  {
    key: 'nome',
    label: 'Nome',
    type: 'text',
  },
  {
    key: 'email',
    label: 'E-mail',
    type: 'text',
  },
  {
    key: 'idade',
    label: 'Idade',
    type: 'integer',
  },
  {
    key: 'salario',
    label: 'Salário',
    type: 'currency',
  },
  {
    key: 'ativo',
    label: 'Status',
    type: 'enum',
    options: [
      { value: 'ativo', label: 'Ativo' },
      { value: 'inativo', label: 'Inativo' },
      { value: 'pendente', label: 'Pendente' },
    ],
  },
  {
    key: 'dataAdmissao',
    label: 'Data de Admissão',
    type: 'date',
  },
];

// Quick filters predefinidos
const quickFilters: QuickFilterPreset[] = [
  {
    id: 'ativos',
    name: 'Usuários Ativos',
    filters: [
      {
        key: 'ativo',
        label: 'Status',
        type: 'enum',
        operator: '=',
        value: 'ativo',
        displayValue: 'Ativo',
      },
    ],
  },
  {
    id: 'maiores-30',
    name: 'Maiores de 30 anos',
    filters: [
      {
        key: 'idade',
        label: 'Idade',
        type: 'integer',
        operator: '>',
        value: 30,
        displayValue: '30',
      },
    ],
  },
  {
    id: 'recentes',
    name: 'Admitidos recentemente',
    filters: [
      {
        key: 'dataAdmissao',
        label: 'Data de Admissão',
        type: 'date',
        operator: 'date_after',
        value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        displayValue: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      },
    ],
  },
];

export function ArchbaseCompositeFiltersUsage() {
  const [filters, setFilters] = useState<ArchbaseActiveFilter[]>([]);
  const [rsqlOutput, setRsqlOutput] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <Text size="lg" fw={500}>
        Filtros Compostos com Saída RSQL
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

      {/* Exibe o RSQL gerado */}
      {rsqlOutput && (
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group gap="xs">
              <Text size="sm" fw={500} c="dimmed">
                RSQL gerado:
              </Text>
            </Group>
            <Code block style={{ fontSize: 12, wordBreak: 'break-all' }}>
              {rsqlOutput}
            </Code>
          </Stack>
        </Paper>
      )}

      {/* Exibe os filtros ativos em formato JSON */}
      {filters.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Text size="sm" fw={500} c="dimmed">
              Filtros ativos ({filters.length}):
            </Text>
            <Code block style={{ fontSize: 11, maxHeight: 150, overflow: 'auto' }}>
              {JSON.stringify(filters, null, 2)}
            </Code>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
