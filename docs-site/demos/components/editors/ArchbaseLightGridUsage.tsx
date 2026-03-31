import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseLightGrid } from '@archbase/components';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
}

const sampleData: Produto[] = [
  { id: '1', nome: 'Notebook Dell', categoria: 'Informatica', preco: 4599.9 },
  { id: '2', nome: 'Mouse Logitech', categoria: 'Perifericos', preco: 189.9 },
  { id: '3', nome: 'Teclado Mecanico', categoria: 'Perifericos', preco: 349.9 },
  { id: '4', nome: 'Monitor 27"', categoria: 'Informatica', preco: 2199.0 },
  { id: '5', nome: 'Webcam HD', categoria: 'Perifericos', preco: 299.9 },
];

const columns = [
  { field: 'nome' as const, header: 'Nome', width: 200, type: 'text' as const },
  { field: 'categoria' as const, header: 'Categoria', width: 150, type: 'text' as const },
  { field: 'preco' as const, header: 'Preco (R$)', width: 120, type: 'number' as const, align: 'right' as const },
];

export function ArchbaseLightGridUsage() {
  return (
    <Stack gap="md" p="md">
      <ArchbaseLightGrid<Produto, string>
        data={sampleData}
        columns={columns}
        height={300}
        showRowNumbers
        label="Lista de Produtos"
        description="Grid leve baseado em sheet-happens"
      />
    </Stack>
  );
}
