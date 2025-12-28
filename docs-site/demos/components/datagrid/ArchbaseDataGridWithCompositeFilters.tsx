import { useState } from 'react';
import { ArchbaseDataGrid, Columns, ArchbaseDataGridColumn } from '@archbase/components';
import { ArchbaseRemoteDataSourceV2 } from '@archbase/data';
import { Button, Group, Stack, Text, Code, Card, Box } from '@mantine/core';

/**
 * Demo do ArchbaseDataGrid com ArchbaseCompositeFilters
 *
 * Este exemplo mostra como usar o componente ArchbaseCompositeFilters
 * integrado ao ArchbaseDataGrid para criar filtros avançados com RSQL.
 */

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  departamento: string;
  cargo: string;
  salario: number;
  ativo: boolean;
  dataAdmissao: string;
}

// Dados de exemplo
const dadosExemplo: Funcionario[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    departamento: 'TI',
    cargo: 'Desenvolvedor Senior',
    salario: 8500,
    ativo: true,
    dataAdmissao: '2020-03-15',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    departamento: 'RH',
    cargo: 'Analista de RH',
    salario: 5200,
    ativo: true,
    dataAdmissao: '2019-07-20',
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    departamento: 'TI',
    cargo: 'Desenvolvedor Junior',
    salario: 3800,
    ativo: true,
    dataAdmissao: '2022-01-10',
  },
  {
    id: '4',
    nome: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    departamento: 'Financeiro',
    cargo: 'Contador',
    salario: 6100,
    ativo: false,
    dataAdmissao: '2018-05-08',
  },
  {
    id: '5',
    nome: 'Carlos Lima',
    email: 'carlos.lima@empresa.com',
    departamento: 'TI',
    cargo: 'Tech Lead',
    salario: 12000,
    ativo: true,
    dataAdmissao: '2017-09-01',
  },
];

// Criar DataSource V2
const createDataSource = () => {
  const dataSource = new ArchbaseRemoteDataSourceV2<Funcionario>({
    initialData: dadosExemplo,
    keyField: 'id',
  });

  // Configurar paginação
  dataSource.setPageSize(10);

  return dataSource;
};

export function ArchbaseDataGridWithCompositeFilters() {
  const [dataSource] = useState(() => createDataSource());
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [currentRSQL, setCurrentRSQL] = useState<string>('');

  // Definições de filtro para o ArchbaseCompositeFilters
  // Se não fornecido, o DataGrid gera automaticamente a partir das colunas
  const filterDefinitions = [
    {
      key: 'nome',
      label: 'Nome',
      type: 'text' as const,
    },
    {
      key: 'email',
      label: 'E-mail',
      type: 'text' as const,
    },
    {
      key: 'departamento',
      label: 'Departamento',
      type: 'enum' as const,
      options: [
        { value: 'TI', label: 'Tecnologia da Informação' },
        { value: 'RH', label: 'Recursos Humanos' },
        { value: 'Financeiro', label: 'Financeiro' },
        { value: 'Comercial', label: 'Comercial' },
      ],
    },
    {
      key: 'cargo',
      label: 'Cargo',
      type: 'text' as const,
    },
    {
      key: 'salario',
      label: 'Salário',
      type: 'currency' as const,
    },
    {
      key: 'ativo',
      label: 'Ativo',
      type: 'boolean' as const,
    },
    {
      key: 'dataAdmissao',
      label: 'Data de Admissão',
      type: 'date' as const,
    },
  ];

  const handleFiltersChange = (filters: any[], rsql?: string) => {
    setActiveFilters(filters);
    setCurrentRSQL(rsql || '');
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setCurrentRSQL('');
  };

  return (
    <Stack gap="md">
      <Box>
        <Text size="lg" fw={500} mb="xs">
          DataGrid com Filtros Compostos
        </Text>
        <Text size="sm" c="dimmed">
          O componente ArchbaseDataGrid agora suporta filtros compostos através da prop useCompositeFilters.
          Os filtros geram RSQL automaticamente, que é aplicado ao DataSource.
        </Text>
      </Box>

      {/* Card com RSQL gerado */}
      {currentRSQL && (
        <Card padding="sm" withBorder shadow="sm" bg="gray.0">
          <Group justify="space-between" align="center">
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={500}>
                RSQL Gerado ({activeFilters.length} filtro{activeFilters.length !== 1 ? 's' : ''})
              </Text>
              <Code block fz="xs">
                {currentRSQL}
              </Code>
            </Stack>
            <Button size="xs" variant="light" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </Group>
        </Card>
      )}

      {/* DataGrid com ArchbaseCompositeFilters */}
      <ArchbaseDataGrid<Funcionario>
        dataSource={dataSource}
        useCompositeFilters={true}
        filterDefinitions={filterDefinitions}
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
        height={400}
        enableRowSelection={true}
        enableRowActions={false}
        showPagination={true}
      >
        <Columns>
          <ArchbaseDataGridColumn<Funcionario>
            header="Nome"
            dataField="nome"
            dataType="text"
            size={200}
            enableColumnFilter={true}
            enableGlobalFilter={true}
          />
          <ArchbaseDataGridColumn<Funcionario>
            header="E-mail"
            dataField="email"
            dataType="text"
            size={220}
            enableColumnFilter={true}
            enableGlobalFilter={false}
          />
          <ArchbaseDataGridColumn<Funcionario>
            header="Departamento"
            dataField="departamento"
            dataType="enum"
            enumValues={[
              { label: 'TI', value: 'TI' },
              { label: 'RH', value: 'RH' },
              { label: 'Financeiro', value: 'Financeiro' },
              { label: 'Comercial', value: 'Comercial' },
            ]}
            size={130}
            enableColumnFilter={true}
          />
          <ArchbaseDataGridColumn<Funcionario>
            header="Cargo"
            dataField="cargo"
            dataType="text"
            size={180}
            enableColumnFilter={true}
          />
          <ArchbaseDataGridColumn<Funcionario>
            header="Salário"
            dataField="salario"
            dataType="currency"
            size={120}
            enableColumnFilter={true}
            align="right"
            headerAlign="right"
          />
          <ArchbaseDataGridColumn<Funcionario>
            header="Ativo"
            dataField="ativo"
            dataType="boolean"
            size={80}
            enableColumnFilter={true}
            align="center"
            headerAlign="center"
          />
        </Columns>
      </ArchbaseDataGrid>

      {/* Card com informações */}
      <Card padding="md" withBorder>
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            Funcionalidades:
          </Text>
          <Text size="sm" c="dimmed">
            • Filtros visuais com pills para fácil identificação
          </Text>
          <Text size="sm" c="dimmed">
            • Geração automática de RSQL (padrão RESTful Service Query Language)
          </Text>
          <Text size="sm" c="dimmed">
            • Suporte a múltiplos operadores (contém, igual, maior, menor, etc.)
          </Text>
          <Text size="sm" c="dimmed">
            • Filtros pré-definidos (Quick Filters) para consultas comuns
          </Text>
          <Text size="sm" c="dimmed">
            • Histórico de filtros utilizados
          </Text>
          <Text size="sm" c="dimmed">
            • Salvar e carregar presets de filtros
          </Text>
          <Text size="sm" c="dimmed">
            • Compatível com DataSource V1 e V2
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
}
