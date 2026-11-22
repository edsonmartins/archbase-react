import { createRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArchbaseDataSource } from '@archbase/data';
import {
  ArchbaseDataGrid,
  ArchbaseDataGridAG,
  ArchbaseDataGridColumn,
  Columns,
  type ArchbaseDataGridProps,
  type ArchbaseDataGridRef,
} from '../src/datagrid';

/**
 * Contrato: a troca da engine interna (AG Grid -> beautiful-grid) não pode mudar
 * props, events nem o ref do ArchbaseDataGrid. Estes testes exercitam o componente
 * exportado pelo barrel público, do jeito que os templates o consomem.
 */

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
  endereco: { cidade: string };
}

const pessoas: Pessoa[] = [
  { id: 1, nome: 'Ana', idade: 31, endereco: { cidade: 'Curitiba' } },
  { id: 2, nome: 'Bruno', idade: 42, endereco: { cidade: 'Recife' } },
  { id: 3, nome: 'Carla', idade: 27, endereco: { cidade: 'Manaus' } },
];

// Contrato de tipos: as duas engines aceitam exatamente as mesmas props.
type PropsBGrid = ComponentProps<typeof ArchbaseDataGrid>;
type PropsAG = ComponentProps<typeof ArchbaseDataGridAG>;
const _propsIguais: PropsBGrid extends PropsAG ? (PropsAG extends PropsBGrid ? true : never) : never = true;
const _propsPublicas: ArchbaseDataGridProps<Pessoa, number> extends PropsBGrid ? true : never = true;
void _propsIguais;
void _propsPublicas;

function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

function criarDataSource() {
  const options = {
    records: pessoas.map((p) => ({ ...p })),
    grandTotalRecords: pessoas.length,
    currentPage: 0,
    totalPages: 1,
    pageSize: 10,
  };
  const ds = new ArchbaseDataSource<Pessoa, number>('pessoas', options);
  ds.open(options);
  ds.first();
  return ds;
}

function renderGrid(props: Partial<ArchbaseDataGridProps<Pessoa, number>> = {}, ds = criarDataSource()) {
  const utils = render(
    <ArchbaseDataGrid<Pessoa, number>
      dataSource={ds}
      getRowId={(row) => row.id}
      height={400}
      width={800}
      {...props}
    >
      <Columns>
        <ArchbaseDataGridColumn<Pessoa> dataField="nome" header="Nome" dataType="text" size={200} />
        <ArchbaseDataGridColumn<Pessoa> dataField="idade" header="Idade" dataType="integer" size={100} />
        <ArchbaseDataGridColumn<Pessoa>
          dataField="endereco.cidade"
          header="Cidade"
          dataType="text"
          size={200}
          render={({ getValue, row }) => <b data-testid={`cidade-${row.id}`}>{getValue()}</b>}
        />
      </Columns>
    </ArchbaseDataGrid>,
    { wrapper: Wrapper }
  );
  return { ...utils, ds };
}

describe('ArchbaseDataGrid (beautiful-grid)', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza cabeçalhos, valores e o render customizado com campo aninhado', () => {
    renderGrid();

    expect(screen.getByText('Nome')).toBeDefined();
    expect(screen.getByText('Idade')).toBeDefined();
    expect(screen.getByText('Ana')).toBeDefined();
    expect(screen.getByText('42')).toBeDefined();
    // render recebe { getValue, row } como sempre recebeu
    expect(screen.getByTestId('cidade-3').textContent).toBe('Manaus');
  });

  it('renderiza a coluna de ações com renderRowActions(row)', () => {
    renderGrid({
      renderRowActions: (row) => <button type="button">editar-{row.id}</button>,
    });

    expect(screen.getByText('Ações')).toBeDefined();
    expect(screen.getByRole('button', { name: 'editar-2' })).toBeDefined();
  });

  it('onCellDoubleClick recebe { id, columnName, rowData }', async () => {
    const onCellDoubleClick = vi.fn();
    renderGrid({ onCellDoubleClick });

    await user.dblClick(screen.getByText('Bruno'));

    expect(onCellDoubleClick).toHaveBeenCalledTimes(1);
    expect(onCellDoubleClick.mock.calls[0][0]).toMatchObject({
      id: 2,
      columnName: 'nome',
      rowData: { id: 2, nome: 'Bruno' },
    });
  });

  it('clicar em uma célula move o registro corrente do DataSource', async () => {
    const { ds } = renderGrid();
    expect(ds.getCurrentRecord()?.id).toBe(1);

    await user.click(screen.getByText('Carla'));

    await waitFor(() => expect(ds.getCurrentRecord()?.id).toBe(3));
  });

  it('seleção por checkbox dispara onSelectedRowsChanged e alimenta o ref', async () => {
    const onSelectedRowsChanged = vi.fn();
    const gridRef = createRef<ArchbaseDataGridRef<Pessoa>>();
    const { container } = renderGrid({ onSelectedRowsChanged, gridRef: gridRef as any });

    const checkboxes = Array.from(
      container.querySelectorAll<HTMLElement>('tr[data-ri] input[type="checkbox"], tr[data-ri] [role="checkbox"]')
    );
    expect(checkboxes.length).toBeGreaterThanOrEqual(3);

    await user.click(checkboxes[1]);

    await waitFor(() => expect(onSelectedRowsChanged).toHaveBeenCalled());
    const ultimaChamada = onSelectedRowsChanged.mock.calls.at(-1)![0] as Pessoa[];
    expect(ultimaChamada.map((p) => p.id)).toEqual([2]);
    await waitFor(() => expect(gridRef.current!.getSelectedRows().map((p) => p.id)).toEqual([2]));

    act(() => gridRef.current!.clearSelection());
    await waitFor(() => expect(gridRef.current!.getSelectedRows()).toEqual([]));
    expect((onSelectedRowsChanged.mock.calls.at(-1)![0] as Pessoa[]).length).toBe(0);
  });

  it('expõe todos os métodos do ref público', () => {
    const gridRef = createRef<ArchbaseDataGridRef<Pessoa>>();
    renderGrid({ gridRef: gridRef as any });

    const metodos: Array<keyof ArchbaseDataGridRef<Pessoa>> = [
      'getSelectedRows',
      'clearSelection',
      'refreshData',
      'exportData',
      'printData',
      'expandRow',
      'collapseRow',
      'collapseAllRows',
      'getExpandedRows',
      'getFilterModel',
      'getGridApi',
      'autoSizeAllColumns',
      'sizeColumnsToFit',
    ];
    metodos.forEach((metodo) => expect(typeof gridRef.current![metodo]).toBe('function'));

    expect(gridRef.current!.getFilterModel()).toEqual({ items: [], quickFilterValues: [] });
    expect(gridRef.current!.getExpandedRows()).toEqual([]);
    expect(gridRef.current!.getGridApi()).toBeNull();
    act(() => {
      gridRef.current!.autoSizeAllColumns();
      gridRef.current!.sizeColumnsToFit();
    });
  });

  it('ordenar pelo cabeçalho chama refreshData do DataSource com sort (modo servidor)', async () => {
    const ds = criarDataSource();
    const refreshData = vi.spyOn(ds as any, 'refreshData').mockImplementation(() => undefined);
    renderGrid({}, ds);

    await user.click(screen.getByText('Nome'));

    await waitFor(() => expect(refreshData).toHaveBeenCalled());
    const options = refreshData.mock.calls.at(-1)![0] as any;
    expect(options.sort).toEqual(['nome:asc']);
  });

  it('onExport / onPrint registram os abridores dos modais', () => {
    const onExport = vi.fn();
    const onPrint = vi.fn();
    renderGrid({ onExport, onPrint });

    expect(typeof onExport.mock.calls[0][0]).toBe('function');
    expect(typeof onPrint.mock.calls[0][0]).toBe('function');
  });

  it('reflete no corpo da grid os registros após um evento do DataSource', async () => {
    const { ds } = renderGrid();

    act(() => {
      ds.setData({
        records: [{ id: 9, nome: 'Zeca', idade: 50, endereco: { cidade: 'Natal' } }],
        grandTotalRecords: 1,
        currentPage: 0,
        totalPages: 1,
        pageSize: 10,
      });
    });

    await waitFor(() => expect(screen.getByText('Zeca')).toBeDefined());
    expect(screen.queryByText('Ana')).toBeNull();
  });
});
