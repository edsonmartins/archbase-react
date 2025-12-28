import React, { useState, useCallback } from 'react';
import { Button, Stack, Text, Code, Card, Group, Grid, SimpleGrid } from '@mantine/core';
import { ArchbaseSpreadsheetImport } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  salario: number;
  admissao: string;
}

// Dados iniciais mock
const dadosIniciais: Funcionario[] = [];

export function ArchbaseSpreadsheetImportWithDataSource() {
  const [isOpen, setIsOpen] = useState(false);
  const [importStats, setImportStats] = useState<{ imported: number; total: number } | null>(null);

  const { dataSource } = useArchbaseDataSource<Funcionario, string>({
    initialData: dadosIniciais,
    name: 'funcionarios-import',
  });

  const campos = [
    { key: 'nome', label: 'Nome Completo', required: true },
    { key: 'email', label: 'E-mail', fieldType: 'email' as const, required: true },
    { key: 'departamento', label: 'Departamento', fieldType: 'select' as const, options: ['TI', 'RH', 'Financeiro', 'Vendas', 'Operações'] },
    { key: 'salario', label: 'Salário', fieldType: 'number' as const, required: true },
    { key: 'admissao', label: 'Data de Admissão', fieldType: 'date' as const },
  ];

  const handleOpenImport = () => {
    setIsOpen(true);
  };

  const handleDataLoaded = async (data: Funcionario[]) => {
    setImportStats({
      imported: data.length,
      total: dataSource.getTotalRecords(),
    });
  };

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button onClick={handleOpenImport}>
          Importar Funcionários
        </Button>
      </Group>

      <ArchbaseSpreadsheetImport<Funcionario>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Importar Funcionários"
        description="Importe uma lista de funcionários via CSV ou XLSX."
        fields={campos}
        maxRows={1000}
        dataSource={dataSource}
        onDataLoaded={handleDataLoaded}
        mapRows={(rows) =>
          rows.map((row) => ({
            id: crypto.randomUUID(),
            nome: row.nome || '',
            email: row.email || '',
            departamento: row.departamento || 'Geral',
            salario: parseFloat(String(row.salario)) || 0,
            admissao: row.admissao || new Date().toISOString().split('T')[0],
          }))
        }
      />

      {importStats && (
        <Card withBorder p="sm" radius="md" style={{ backgroundColor: '#e6f7ff' }}>
          <Text size="sm">
            Total de funcionários: <strong>{importStats.total}</strong>
            {importStats.imported > 0 && ` (${importStats.imported} importados nesta operação)`}
          </Text>
        </Card>
      )}

      {dataSource.getTotalRecords() > 0 && (
        <Card withBorder p="md" radius="md">
          <Text size="sm" fw={500} mb="xs">
            Funcionários Cadastrados:
          </Text>
          <Text size="sm" c="dimmed">
            {dataSource.getTotalRecords()} funcionário(s) importado(s)
          </Text>
        </Card>
      )}

      <Card withBorder p="md" radius="md">
        <Stack gap="xs">
          <Text size="sm" fw={500}>Funcionalidades:</Text>
          <Text size="sm" c="dimmed">
            • Importação de arquivos CSV e XLSX
          </Text>
          <Text size="sm" c="dimmed">
            • Validação de campos durante a importação
          </Text>
          <Text size="sm" c="dimmed">
            • Mapeamento automático de colunas
          </Text>
          <Text size="sm" c="dimmed">
            • Integração com DataSource V2
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
