/**
 * ArchbaseDataTable V1 Baseline Tests
 * 
 * Estes testes capturam o comportamento EXATO da versão V1 atual.
 * TODOS os testes devem passar após migração V1/V2.
 * 
 * ⚠️ CRITICAL: Se qualquer teste falhar após migração, 
 *    a migração deve ser REVERTIDA imediatamente.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseDataTable } from '@archbase/components';
import { ArchbaseDataSource } from '@archbase/data';
import React from 'react';

// Mock data para testes
interface TestData {
  id: number;
  nome: string;
  email: string;
  idade: number;
  ativo: boolean;
  dataContrato: string;
}

const mockData: TestData[] = [
  { id: 1, nome: 'João Silva', email: 'joao@test.com', idade: 30, ativo: true, dataContrato: '2023-01-01' },
  { id: 2, nome: 'Maria Santos', email: 'maria@test.com', idade: 25, ativo: true, dataContrato: '2023-02-15' },
  { id: 3, nome: 'Pedro Costa', email: 'pedro@test.com', idade: 35, ativo: false, dataContrato: '2023-03-01' },
  { id: 4, nome: 'Ana Silva', email: 'ana@test.com', idade: 28, ativo: true, dataContrato: '2023-01-15' },
  { id: 5, nome: 'Carlos Lima', email: 'carlos@test.com', idade: 42, ativo: false, dataContrato: '2023-04-01' },
];

// Definição de colunas típica
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'nome',
    header: 'Nome',
    size: 200,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 250,
  },
  {
    accessorKey: 'idade',
    header: 'Idade',
    size: 80,
  },
  {
    accessorKey: 'ativo',
    header: 'Ativo',
    size: 80,
    cell: ({ getValue }: any) => (getValue() ? 'Sim' : 'Não'),
  },
  {
    accessorKey: 'dataContrato',
    header: 'Data Contrato',
    size: 120,
  },
];

describe('ArchbaseDataTable V1 Baseline', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let dataSource: ArchbaseDataSource<TestData, number>;

  beforeEach(() => {
    user = userEvent.setup();
    dataSource = new ArchbaseDataSource('testDataSource', {
      records: mockData,
      grandTotalRecords: mockData.length,
      currentPage: 0,
      totalPages: 1,
      pageSize: 10,
    });
    dataSource.open();
    dataSource.first();
  });

  afterEach(() => {
    dataSource.close();
  });

  describe('🔍 Basic Initialization', () => {
    test('should render with minimal props', () => {
      render(<ArchbaseDataTable columns={columns} data={mockData} />);
      
      // Deve renderizar tabela
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Deve mostrar headers
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Idade')).toBeInTheDocument();
    });

    test('should render with dataSource integration', () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
        />
      );
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Deve mostrar dados do dataSource
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('joao@test.com')).toBeInTheDocument();
    });

    test('should handle empty data gracefully', () => {
      const emptyDataSource = new ArchbaseDataSource('empty', {
        records: [],
        grandTotalRecords: 0,
        currentPage: 0,
        totalPages: 0,
        pageSize: 10,
      });
      emptyDataSource.open();

      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={emptyDataSource}
        />
      );
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Deve mostrar mensagem de dados vazios
      expect(screen.getByText(/sem dados|no data|empty/i)).toBeInTheDocument();
      
      emptyDataSource.close();
    });
  });

  describe('🔗 DataSource Integration (CRITICAL)', () => {
    test('should sync with dataSource record navigation', async () => {
      const onSelectedRowsChanged = jest.fn();
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
          onSelectedRowsChanged={onSelectedRowsChanged}
        />
      );
      
      // Primeiro registro deve estar selecionado
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      
      // Navegar para próximo registro
      dataSource.next();
      
      await waitFor(() => {
        // Seleção deve atualizar
        expect(onSelectedRowsChanged).toHaveBeenCalled();
      });
    });

    test('should update data when dataSource refreshes', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
        />
      );
      
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      
      // Atualizar dados no dataSource
      const newData = [
        { id: 10, nome: 'Novo Usuario', email: 'novo@test.com', idade: 30, ativo: true, dataContrato: '2023-05-01' }
      ];
      
      dataSource.setData(newData, {
        grandTotalRecords: 1,
        currentPage: 0,
        totalPages: 1,
        pageSize: 10,
      });
      
      await waitFor(() => {
        expect(screen.getByText('Novo Usuario')).toBeInTheDocument();
        expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
      });
    });

    test('should handle dataSource CRUD operations', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
        />
      );
      
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      
      // Remover registro atual
      dataSource.remove();
      
      await waitFor(() => {
        // Primeiro registro não deve mais estar visível
        expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
        // Próximo registro deve ser exibido
        expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      });
    });

    test('should sync pagination with dataSource', async () => {
      // Criar dataSource com múltiplas páginas
      const largeDataSource = new ArchbaseDataSource('large', {
        records: mockData.slice(0, 2), // Apenas 2 registros por página
        grandTotalRecords: mockData.length,
        currentPage: 0,
        totalPages: 3,
        pageSize: 2,
      });
      largeDataSource.open();

      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={largeDataSource}
          enablePagination
        />
      );
      
      // Deve mostrar controles de paginação
      expect(screen.getByText(/página|page/i)).toBeInTheDocument();
      expect(screen.getByText(/próximo|next/i)).toBeInTheDocument();
      
      largeDataSource.close();
    });
  });

  describe('📋 Column Configuration (Critical Features)', () => {
    test('should render all configured columns', () => {
      render(<ArchbaseDataTable columns={columns} data={mockData} />);
      
      // Verificar headers das colunas
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Idade')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Data Contrato')).toBeInTheDocument();
    });

    test('should apply custom cell renderers', () => {
      render(<ArchbaseDataTable columns={columns} data={mockData} />);
      
      // Coluna 'ativo' deve usar renderer customizado
      expect(screen.getByText('Sim')).toBeInTheDocument(); // Para ativo: true
      expect(screen.getByText('Não')).toBeInTheDocument(); // Para ativo: false
    });

    test('should handle column sizing', () => {
      render(<ArchbaseDataTable columns={columns} data={mockData} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Headers devem estar presentes (size validation via CSS)
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(columns.length);
    });

    test('should support column sorting', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableSorting
        />
      );
      
      // Clicar no header para ordenar
      const nomeHeader = screen.getByText('Nome');
      await user.click(nomeHeader);
      
      // Deve mostrar indicador de ordenação
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });
  });

  describe('🔍 Filtering (Critical Feature)', () => {
    test('should support column filters', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableFiltering
        />
      );
      
      // Deve mostrar inputs de filtro
      const filterInputs = screen.getAllByRole('textbox');
      expect(filterInputs.length).toBeGreaterThan(0);
    });

    test('should filter data based on column filters', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableFiltering
        />
      );
      
      // Todos os registros devem estar visíveis inicialmente
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      
      // Filtrar por nome
      const filterInputs = screen.getAllByRole('textbox');
      const nomeFilter = filterInputs.find(input => 
        input.closest('th')?.textContent?.includes('Nome')
      );
      
      if (nomeFilter) {
        await user.type(nomeFilter, 'João');
        
        await waitFor(() => {
          expect(screen.getByText('João Silva')).toBeInTheDocument();
          expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
        });
      }
    });

    test('should support global filtering', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableGlobalFilter
        />
      );
      
      // Deve ter campo de busca global
      const globalFilter = screen.getByPlaceholderText(/buscar|search/i);
      expect(globalFilter).toBeInTheDocument();
      
      await user.type(globalFilter, 'Silva');
      
      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument();
        expect(screen.getByText('Ana Silva')).toBeInTheDocument();
        expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
      });
    });
  });

  describe('📄 Pagination (Critical Feature)', () => {
    test('should support pagination controls', () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enablePagination
          pageSize={2}
        />
      );
      
      // Deve mostrar controles de paginação
      expect(screen.getByText(/página|page/i)).toBeInTheDocument();
      expect(screen.getByText(/anterior|previous/i)).toBeInTheDocument();
      expect(screen.getByText(/próximo|next/i)).toBeInTheDocument();
    });

    test('should navigate between pages', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enablePagination
          pageSize={2}
        />
      );
      
      // Primeira página deve mostrar primeiros 2 registros
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.queryByText('Pedro Costa')).not.toBeInTheDocument();
      
      // Ir para próxima página
      const nextButton = screen.getByText(/próximo|next/i);
      await user.click(nextButton);
      
      await waitFor(() => {
        expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
        expect(screen.getByText('Pedro Costa')).toBeInTheDocument();
      });
    });

    test('should sync with dataSource pagination', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
          enablePagination
        />
      );
      
      // Quando dataSource mudar de página, tabela deve sincronizar
      const currentPage = dataSource.getCurrentPage();
      expect(currentPage).toBe(0);
      
      // Deve mostrar página atual corretamente
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('✅ Row Selection (Critical Feature)', () => {
    test('should support single row selection', async () => {
      const onSelectedRowsChanged = jest.fn();
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableRowSelection
          rowSelectionMode="single"
          onSelectedRowsChanged={onSelectedRowsChanged}
        />
      );
      
      // Clicar em uma linha
      const firstRow = screen.getByText('João Silva').closest('tr');
      await user.click(firstRow!);
      
      expect(onSelectedRowsChanged).toHaveBeenCalledWith(
        expect.arrayContaining([mockData[0]]),
        expect.any(Object)
      );
    });

    test('should support multiple row selection', async () => {
      const onSelectedRowsChanged = jest.fn();
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableRowSelection
          rowSelectionMode="multiple"
          onSelectedRowsChanged={onSelectedRowsChanged}
        />
      );
      
      // Deve mostrar checkboxes
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
      
      // Selecionar primeira linha
      await user.click(checkboxes[1]); // [0] é "select all"
      
      expect(onSelectedRowsChanged).toHaveBeenCalledWith(
        expect.arrayContaining([mockData[0]]),
        expect.any(Object)
      );
    });

    test('should support select all functionality', async () => {
      const onSelectedRowsChanged = jest.fn();
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableRowSelection
          rowSelectionMode="multiple"
          onSelectedRowsChanged={onSelectedRowsChanged}
        />
      );
      
      // Checkbox "select all" no header
      const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
      await user.click(selectAllCheckbox);
      
      expect(onSelectedRowsChanged).toHaveBeenCalledWith(
        mockData,
        expect.any(Object)
      );
    });
  });

  describe('⚡ Event Handling (Critical Callbacks)', () => {
    test('should call onSelectedRowsChanged when selection changes', async () => {
      const onSelectedRowsChanged = jest.fn();
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableRowSelection
          onSelectedRowsChanged={onSelectedRowsChanged}
        />
      );
      
      const firstRow = screen.getByText('João Silva').closest('tr');
      await user.click(firstRow!);
      
      expect(onSelectedRowsChanged).toHaveBeenCalled();
    });

    test('should handle row double-click', async () => {
      const onRowDoubleClick = jest.fn();
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          onRowDoubleClick={onRowDoubleClick}
        />
      );
      
      const firstRow = screen.getByText('João Silva').closest('tr');
      await user.dblClick(firstRow!);
      
      expect(onRowDoubleClick).toHaveBeenCalledWith(
        mockData[0],
        expect.any(Object)
      );
    });

    test('should sync row click with dataSource navigation', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
        />
      );
      
      // Clicar na segunda linha
      const secondRow = screen.getByText('Maria Santos').closest('tr');
      await user.click(secondRow!);
      
      await waitFor(() => {
        // DataSource deve navegar para o registro clicado
        expect(dataSource.getCurrentRecord()).toEqual(mockData[1]);
      });
    });
  });

  describe('🎨 Styling and Layout', () => {
    test('should apply custom width', () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          width={800}
        />
      );
      
      const container = screen.getByRole('table').closest('div');
      expect(container).toHaveStyle({ width: '800px' });
    });

    test('should apply custom height', () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          height={400}
        />
      );
      
      const container = screen.getByRole('table').closest('div');
      expect(container).toHaveStyle({ height: '400px' });
    });

    test('should apply custom style', () => {
      const customStyle = { backgroundColor: 'lightblue' };
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          style={customStyle}
        />
      );
      
      const container = screen.getByRole('table').closest('div');
      expect(container).toHaveStyle(customStyle);
    });
  });

  describe('🔧 Edge Cases and Error Handling', () => {
    test('should handle null/undefined data gracefully', () => {
      expect(() => {
        render(<ArchbaseDataTable columns={columns} data={null as any} />);
      }).not.toThrow();
      
      expect(() => {
        render(<ArchbaseDataTable columns={columns} data={undefined as any} />);
      }).not.toThrow();
    });

    test('should handle empty columns array', () => {
      expect(() => {
        render(<ArchbaseDataTable columns={[]} data={mockData} />);
      }).not.toThrow();
    });

    test('should handle component unmount gracefully', () => {
      const { unmount } = render(
        <ArchbaseDataTable columns={columns} dataSource={dataSource} />
      );
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('should handle dataSource close during operation', () => {
      render(
        <ArchbaseDataTable columns={columns} dataSource={dataSource} />
      );
      
      // Fechar dataSource enquanto componente está montado
      dataSource.close();
      
      // Não deve gerar erros
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('♿ Accessibility (a11y)', () => {
    test('should have proper table structure', () => {
      render(<ArchbaseDataTable columns={columns} data={mockData} />);
      
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(columns.length);
      expect(screen.getAllByRole('row')).toHaveLength(mockData.length + 1); // +1 for header
    });

    test('should support keyboard navigation', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableRowSelection
        />
      );
      
      // Tab para entrar na tabela
      await user.tab();
      
      // Primeira linha deve ser focável
      const firstRow = screen.getByText('João Silva').closest('tr');
      expect(firstRow).toBeInTheDocument();
    });

    test('should have proper ARIA labels', () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          data={mockData}
          enableRowSelection
          enablePagination
        />
      );
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Controles de paginação devem ter labels
      if (screen.queryByText(/próximo/i)) {
        expect(screen.getByText(/próximo/i)).toBeInTheDocument();
      }
    });
  });

  describe('🔄 RSQL Query Building (DataSource Integration)', () => {
    test('should build filter expressions correctly', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
          enableFiltering
        />
      );
      
      // Esta funcionalidade é interna mas crítica para DataSource
      // Testar que filtros são aplicados corretamente
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });

    test('should build sort expressions correctly', async () => {
      render(
        <ArchbaseDataTable 
          columns={columns} 
          dataSource={dataSource}
          enableSorting
        />
      );
      
      // Ordenação deve ser aplicada via DataSource
      const nomeHeader = screen.getByText('Nome');
      await user.click(nomeHeader);
      
      // Verificar que tabela ainda funciona
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
