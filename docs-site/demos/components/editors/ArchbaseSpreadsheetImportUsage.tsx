import React, { useState } from 'react';
import { Button, Stack, Text, Code, Card, Group } from '@mantine/core';
import { ArchbaseSpreadsheetImport } from '@archbase/components';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  ativo: boolean;
}

// Simula um repositório em memória
let produtoIdCounter = 1;
const produtosRepository: Produto[] = [];

export function ArchbaseSpreadsheetImportUsage() {
  const [isOpen, setIsOpen] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [ultimoImport, setUltimoImport] = useState<{ validCount: number; invalidCount: number } | null>(null);

  const campos = [
    { key: 'nome', label: 'Nome do Produto', required: true },
    { key: 'preco', label: 'Preço', fieldType: 'number' as const, required: true },
    { key: 'categoria', label: 'Categoria', fieldType: 'select' as const, options: ['Eletrônicos', 'Roupas', 'Alimentos', 'Móveis'] },
    { key: 'ativo', label: 'Ativo', fieldType: 'boolean' as const },
  ];

  const handleDataLoaded = (data: Produto[]) => {
    console.log('Dados carregados:', data);
  };

  const handleProdutoAdicionado = (produto: any) => {
    const novoProduto: Produto = {
      ...produto,
      id: String(produtoIdCounter++),
    };
    produtosRepository.push(novoProduto);
  };

  const handleImportComplete = (data: Produto[]) => {
    setProdutos([...produtosRepository]);
    setUltimoImport({
      validCount: data.length,
      invalidCount: 0,
    });
  };

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button onClick={() => setIsOpen(true)}>
          Importar Planilha
        </Button>
      </Group>

      <ArchbaseSpreadsheetImport<Produto>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Importar Produtos"
        description="Selecione um arquivo CSV ou XLSX com os produtos a serem importados."
        fields={campos}
        maxRows={500}
        onDataLoaded={handleImportComplete}
        onRowAdded={handleProdutoAdicionado}
        mapRows={(rows) =>
          rows.map((row) => ({
            id: String(produtoIdCounter++),
            nome: row.nome || '',
            preco: parseFloat(row.preco) || 0,
            categoria: row.categoria || 'Geral',
            ativo: row.ativo === true || row.ativo === 'sim' || row.ativo === 'true',
          }))
        }
      />

      {ultimoImport && (
        <Card withBorder p="sm" radius="md" style={{ backgroundColor: '#f0fff4' }}>
          <Text size="sm" fw={500} c="green">
            Importação concluída! {ultimoImport.validCount} linhas importadas.
          </Text>
        </Card>
      )}

      {produtos.length > 0 && (
        <Card withBorder p="md" radius="md">
          <Text size="sm" fw={500} mb="xs">
            Produtos Importados:
          </Text>
          <Code block style={{ fontSize: 11, maxHeight: 200, overflow: 'auto' }}>
            {JSON.stringify(produtos, null, 2)}
          </Code>
        </Card>
      )}
    </Stack>
  );
}
