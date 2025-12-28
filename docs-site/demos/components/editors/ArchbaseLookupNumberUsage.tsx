import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseLookupNumber } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  precoUnitario: number;
}

interface ProdutoPreco {
  id: string;
  nome: string;
  preco: number;
}

const produtoData: Produto = {
  id: '1',
  nome: 'Notebook Dell',
  precoUnitario: 3500.50,
};

const lookupProdutoPreco = async (codigo: string): Promise<ProdutoPreco> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id: codigo,
    nome: 'Notebook Dell',
    preco: 3500.50,
  };
};

export function ArchbaseLookupNumberUsage() {
  const [value, setValue] = useState<number>(0);
  const [foundValue, setFoundValue] = useState<ProdutoPreco | null>(null);

  return (
    <Stack gap="md" p="md">
      <ArchbaseLookupNumber<Produto, string, ProdutoPreco>
        label="Preço Unitário"
        placeholder="Digite o código..."
        value={value}
        onChangeValue={setValue}
        lookupValueDelegator={lookupProdutoPreco}
        onLookupResult={(result) => {
          setFoundValue(result);
          setValue(result.preco);
        }}
        decimalSeparator=","
        thousandSeparator="."
        precision={2}
        allowNegative={false}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor: {value}
        </Text>
        {foundValue && (
          <Text size="sm" mt="xs">
            Produto: {foundValue.nome}
          </Text>
        )}
      </Card>
    </Stack>
  );
}
