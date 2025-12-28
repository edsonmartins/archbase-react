import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseTreeSelect, ArchbaseTreeNode } from '@archbase/components';

const treeData: ArchbaseTreeNode[] = [
  {
    id: '1',
    text: 'Eletrônicos',
    state: { selected: false, expanded: false, loading: false },
    nodes: [
      {
        id: '1-1',
        text: 'Celulares',
        state: { selected: false, expanded: false, loading: false },
        nodes: [
          { id: '1-1-1', text: 'iPhone', state: { selected: false, expanded: false, loading: false } },
          { id: '1-1-2', text: 'Samsung', state: { selected: false, expanded: false, loading: false } },
          { id: '1-1-3', text: 'Xiaomi', state: { selected: false, expanded: false, loading: false } },
        ],
      },
      {
        id: '1-2',
        text: 'Notebooks',
        state: { selected: false, expanded: false, loading: false },
        nodes: [
          { id: '1-2-1', text: 'Dell', state: { selected: false, expanded: false, loading: false } },
          { id: '1-2-2', text: 'HP', state: { selected: false, expanded: false, loading: false } },
          { id: '1-2-3', text: 'Lenovo', state: { selected: false, expanded: false, loading: false } },
        ],
      },
    ],
  },
  {
    id: '2',
    text: 'Roupas',
    state: { selected: false, expanded: false, loading: false },
    nodes: [
      { id: '2-1', text: 'Masculino', state: { selected: false, expanded: false, loading: false } },
      { id: '2-2', text: 'Feminino', state: { selected: false, expanded: false, loading: false } },
      { id: '2-3', text: 'Infantil', state: { selected: false, expanded: false, loading: false } },
    ],
  },
];

export function ArchbaseTreeSelectUsage() {
  const [value, setValue] = useState<ArchbaseTreeNode | null>(null);

  return (
    <Stack gap="md" p="md">
      <ArchbaseTreeSelect
        label="Categoria"
        width="100%"
        options={treeData}
        getOptionLabel={(node) => node.text}
        getOptionValue={(node) => node.id}
        onSelectValue={(node) => setValue(node)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor selecionado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(value, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
