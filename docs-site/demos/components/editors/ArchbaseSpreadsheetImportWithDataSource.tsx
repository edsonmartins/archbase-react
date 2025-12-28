import React, { useState, useCallback, useRef } from 'react';
import { Button, Stack, Text, Code, Card, Group, Grid, SimpleGrid } from '@mantine/core';
import { ArchbaseSpreadsheetImport, ArchbaseDataGrid } from '@archbase/components';
import { ArchbaseDataSource, ArchbaseRemoteDelegate } from '@archbase/data';

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  salario: number;
  admissao: string;
}

// Mock do DataSource
class MockFuncionarioDelegate extends ArchbaseRemoteDelegate<Funcionario, string> {
  private data: Funcionario[] = [];
  private idCounter = 1;

  async create(dataSource: ArchbaseDataSource<Funcionario, string>, entity: Partial<Funcionario>): Promise<Funcionario> {
    const novo: Funcionario = {
      id: String(this.idCounter++),
      nome: entity.nome || '',
      email: entity.email || '',
      departamento: entity.departamento || '',
      salario: entity.salario || 0,
      admissao: entity.admissao || new Date().toISOString().split('T')[0],
    };
    this.data.push(novo);
    return novo;
  }

  async readAll(dataSource: ArchbaseDataSource<Funcionario, string>): Promise<Funcionario[]> {
    return this.data;
  }

  async readById(id: string): Promise<Funcionario | null> {
    return this.data.find(f => f.id === id) || null;
  }

  async update(id: string, entity: Partial<Funcionario>): Promise<Funcionario> {
    const index = this.data.findIndex(f => f.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...entity };
      return this.data[index];
    }
    throw new Error('Funcionário não encontrado');
  }

  async delete(id: string): Promise<void> {
    const index = this.data.findIndex(f => f.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  async count(): Promise<number> {
    return this.data.length;
  }

  getData() {
    return this.data;
  }
}

export function ArchbaseSpreadsheetImportWithDataSource() {
  const [isOpen, setIsOpen] = useState(false);
  const [dataSource, setDataSource] = useState<ArchbaseDataSource<Funcionario, string> | null>(null);
  const delegateRef = useRef<MockFuncionarioDelegate | null>(null);
  const [importStats, setImportStats] = useState<{ imported: number; total: number } | null>(null);

  const handleDataSourceInit = useCallback((ds: ArchbaseDataSource<Funcionario, string>) => {
    setDataSource(ds);
  }, []);

  const campos = [
    { key: 'nome', label: 'Nome Completo', required: true },
    { key: 'email', label: 'E-mail', fieldType: 'email' as const, required: true },
    { key: 'departamento', label: 'Departamento', fieldType: 'select' as const, options: ['TI', 'RH', 'Financeiro', 'Vendas', 'Operações'] },
    { key: 'salario', label: 'Salário', fieldType: 'number' as const, required: true },
    { key: 'admissao', label: 'Data de Admissão', fieldType: 'date' as const },
  ];

  const handleOpenImport = () => {
    if (!delegateRef.current) {
      delegateRef.current = new MockFuncionarioDelegate();
    }

    const ds = new ArchbaseDataSource<Funcionario, string>(
      'funcionarios-import',
      delegateRef.current,
      {
        records: delegateRef.current.getData(),
        grandTotalRecords: 0,
        currentPage: 1,
        totalPages: 1,
        pageSize: 50,
      }
    );
    setDataSource(ds);
    setIsOpen(true);
  };

  const handleDataLoaded = async (data: Funcionario[]) => {
    if (dataSource) {
      await dataSource.load();
      setImportStats({
        imported: data.length,
        total: delegateRef.current?.getData().length || 0,
      });
    }
  };

  const colunas = [
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'email', headerName: 'E-mail', width: 220 },
    { field: 'departamento', headerName: 'Departamento', width: 120 },
    { field: 'salario', headerName: 'Salário', width: 120, valueFormatter: (p: any) => `R$ ${p.value?.toFixed(2)}` },
    { field: 'admissao', headerName: 'Admissão', width: 120 },
  ];

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button onClick={handleOpenImport}>
          Importar Funcionários
        </Button>
        {dataSource && (
          <Button variant="light" onClick={async () => {
            await dataSource?.load();
            setImportStats({ imported: 0, total: delegateRef.current?.getData().length || 0 });
          }}>
            Atualizar Grid
          </Button>
        )}
      </Group>

      {dataSource && (
        <ArchbaseSpreadsheetImport<Funcionario>
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Importar Funcionários"
          description="Importe uma lista de funcionários via CSV ou XLSX."
          fields={campos}
          maxRows={1000}
          dataSource={dataSource}
          onDataLoaded={handleDataLoaded}
          onRowAdded={async (row) => {
            await dataSource?.create(row);
          }}
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
      )}

      {importStats && (
        <Card withBorder p="sm" radius="md" style={{ backgroundColor: '#e6f7ff' }}>
          <Text size="sm">
            Total de funcionários: <strong>{importStats.total}</strong>
            {importStats.imported > 0 && ` (${importStats.imported} importados nesta operação)`}
          </Text>
        </Card>
      )}

      {dataSource && (
        <Card withBorder p="md" radius="md">
          <Text size="sm" fw={500} mb="xs">
            Funcionários Cadastrados:
          </Text>
          <ArchbaseDataGrid<Funcionario, string>
            dataSource={dataSource}
            onDataSourceInit={handleDataSourceInit}
            columns={colunas}
            height={300}
          />
        </Card>
      )}
    </Stack>
  );
}
