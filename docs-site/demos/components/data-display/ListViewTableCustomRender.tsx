import React from 'react';
import { ArchbaseListViewTable } from '@archbase/components';
import { Badge, Text } from '@mantine/core';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export function ListViewTableCustomRender() {
  const data: Product[] = [
    { id: '1', name: 'Laptop', price: 2500, stock: 15, category: 'Eletrônicos' },
    { id: '2', name: 'Mouse', price: 50, stock: 150, category: 'Eletrônicos' },
    { id: '3', name: 'Mesa', price: 800, stock: 5, category: 'Móveis' },
    { id: '4', name: 'Cadeira', price: 450, stock: 8, category: 'Móveis' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const columns = [
    {
      key: 'name' as const,
      title: 'Produto',
      width: 200,
    },
    {
      key: 'price' as const,
      title: 'Preço',
      width: 120,
      textAlign: 'right' as const,
      renderCell: (record: Product) => (
        <Text fw={500}>{formatCurrency(record.price)}</Text>
      ),
    },
    {
      key: 'stock' as const,
      title: 'Estoque',
      width: 100,
      textAlign: 'center' as const,
      renderCell: (record: Product) => (
        <Badge
          color={record.stock < 10 ? 'red' : record.stock < 50 ? 'yellow' : 'green'}
        >
          {record.stock} un
        </Badge>
      ),
    },
    {
      key: 'category' as const,
      title: 'Categoria',
      width: 150,
    },
  ];

  return (
    <div style={{ height: 400 }}>
      <ArchbaseListViewTable
        data={data}
        columns={columns}
        rowKey="id"
        height={400}
      />
    </div>
  );
}
