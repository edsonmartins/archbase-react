import React, { useState } from 'react';
import { Button, Group, Card, Text, Stack } from '@mantine/core';
import { ArchbaseSpreadsheetImport } from '@archbase/components';
import type { SpreadsheetField } from '@archbase/components';

interface ProductData {
  nome: string;
  quantidade: number;
  preco: number;
  categoria: string;
}

export function ArchbaseSpreadsheetImportUsage() {
  const [isOpen, setIsOpen] = useState(false);
  const [importedData, setImportedData] = useState<ProductData[]>([]);

  const fields: SpreadsheetField[] = [
    {
      key: 'nome',
      label: 'Nome do Produto',
      required: true,
      fieldType: 'text',
      validations: {
        min: 3,
        max: 100,
      },
    },
    {
      key: 'quantidade',
      label: 'Quantidade',
      required: true,
      fieldType: 'number',
      validations: {
        min: 1,
        max: 10000,
      },
    },
    {
      key: 'preco',
      label: 'Preço',
      required: true,
      fieldType: 'number',
      validations: {
        min: 0.01,
      },
    },
    {
      key: 'categoria',
      label: 'Categoria',
      required: true,
      fieldType: 'select',
      options: ['Eletrônicos', 'Roupas', 'Alimentos', 'Móveis', 'Outros'],
    },
  ];

  const handleDataLoaded = (data: ProductData[]) => {
    setImportedData(data);
  };

  return (
    <Stack gap="md">
      <Group justify="center">
        <Button size="lg" onClick={() => setIsOpen(true)}>
          Importar Planilha
        </Button>
      </Group>

      {importedData.length > 0 && (
        <Card shadow="sm" padding="lg" withBorder>
          <Stack gap="sm">
            <Text fw={500}>
              {importedData.length} produtos importados
            </Text>
            <Text size="xs" c="dimmed">
              Última importação: {new Date().toLocaleString()}
            </Text>
          </Stack>
        </Card>
      )}

      <ArchbaseSpreadsheetImport<ProductData>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Importar Produtos"
        description="Selecione um arquivo CSV ou Excel para importar produtos."
        fields={fields}
        onDataLoaded={handleDataLoaded}
        allowedFileTypes={['csv', 'xlsx', 'xls']}
        maxFileSize={5 * 1024 * 1024}
        maxRows={500}
      />
    </Stack>
  );
}
