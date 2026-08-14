import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AnalyticsError, DEFAULT_STRINGS, type ReconcileResult } from '@archbase/analytics-core';
import { MemberPalette } from '../src/components/MemberPalette';
import { ResultTable } from '../src/components/ResultTable';
import { ResultChart } from '../src/components/ResultChart';
import { TimeDimensionControl } from '../src/components/TimeDimensionControl';
import { DegradedNotice, ErrorState, TruncatedNotice } from '../src/components/States';
import { FORMATTER, LABELER, META, Wrapper, fakeChartRenderer, resultado } from './fixtures';

describe('MemberPalette', () => {
  const base = {
    meta: META,
    selected: [],
    onToggle: vi.fn(),
    labeler: LABELER,
    formatter: FORMATTER,
    locale: 'pt-BR',
  };

  it('agrupa pelo metadado de grupo', () => {
    render(<MemberPalette {...base} />, { wrapper: Wrapper });

    expect(screen.getByText('Financeiro')).toBeDefined();
    expect(screen.getByText('Origem')).toBeDefined();
    expect(screen.getByText('Volume')).toBeDefined();
  });

  it('mostra todo membro da introspeccao, sem ocultar por logica propria', () => {
    render(<MemberPalette {...base} />, { wrapper: Wrapper });

    for (const rotulo of ['Receita', 'Itens', 'Canal', 'Árvore', 'Criado em']) {
      expect(screen.getByText(rotulo)).toBeDefined();
    }
  });

  it('filtra pela busca', async () => {
    const user = userEvent.setup();
    render(<MemberPalette {...base} />, { wrapper: Wrapper });

    await user.type(screen.getByPlaceholderText('Buscar'), 'rece');

    expect(screen.getByText('Receita')).toBeDefined();
    expect(screen.queryByText('Canal')).toBeNull();
  });

  it('ordena com acentuacao correta dentro do grupo', () => {
    render(<MemberPalette {...base} />, { wrapper: Wrapper });

    const origem = screen.getByText('Origem').parentElement;
    const textos = within(origem as HTMLElement)
      .getAllByText(/Árvore|Canal/)
      .map((node) => node.textContent);

    // Comparacao crua colocaria "Árvore" depois de "Canal".
    expect(textos).toEqual(['Árvore', 'Canal']);
  });

  it('avisa quando a busca nao encontra nada', async () => {
    const user = userEvent.setup();
    render(<MemberPalette {...base} />, { wrapper: Wrapper });

    await user.type(screen.getByPlaceholderText('Buscar'), 'zzzz');
    expect(screen.getByText('Nenhum membro encontrado.')).toBeDefined();
  });
});

describe('ResultTable', () => {
  const base = {
    meta: META,
    formatter: FORMATTER,
    labeler: LABELER,
    locale: 'pt-BR',
  };

  it('delega a formatacao a porta, sem dividir centavos na biblioteca', () => {
    render(<ResultTable result={resultado(1)} {...base} />, { wrapper: Wrapper });

    // 100000 centavos exibidos como R$ 1.000,00 — a conversao aconteceu na porta.
    const celula = screen.getByText((text) => text.replace(/\s/g, ' ') === 'R$ 1.000,00');
    expect(celula).toBeDefined();
  });

  it('usa o rotulo resolvido no cabecalho', () => {
    render(<ResultTable result={resultado(1)} {...base} />, { wrapper: Wrapper });
    expect(screen.getByText('Receita')).toBeDefined();
  });

  it('renderiza apenas a janela visivel de um resultado volumoso', () => {
    render(<ResultTable result={resultado(5000)} {...base} height={340} />, { wrapper: Wrapper });

    // Sem virtualizacao seriam 5000 linhas no DOM.
    const linhas = screen.getAllByRole('row');
    expect(linhas.length).toBeLessThan(200);
    expect(linhas.length).toBeGreaterThan(1);
  });
});

describe('ResultChart', () => {
  const base = {
    result: resultado(),
    formatter: FORMATTER,
    locale: 'pt-BR',
    onChangeViz: vi.fn(),
  };

  it('oferece apenas as visualizacoes que o renderizador entrega', () => {
    render(
      <ResultChart
        {...base}
        viz="bar"
        availableViz={['table', 'bar', 'line']}
        chartRenderer={fakeChartRenderer(['pie', 'area'])}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Barras')).toBeDefined();
    expect(screen.queryByText('Pizza')).toBeNull();
    expect(screen.queryByText('Area')).toBeNull();
  });

  it('cai para a tabela quando o renderizador nao suporta a visualizacao pedida', () => {
    render(
      <ResultChart
        {...base}
        viz="pie"
        availableViz={['table', 'bar']}
        chartRenderer={fakeChartRenderer(['pie'])}
        renderTable={() => <div data-testid="tabela" />}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByTestId('tabela')).toBeDefined();
    expect(screen.queryByTestId('grafico')).toBeNull();
  });

  it('nao mostra seletor quando so ha uma visualizacao possivel', () => {
    render(<ResultChart {...base} viz="table" availableViz={['table']} />, { wrapper: Wrapper });
    expect(screen.queryByText('Barras')).toBeNull();
  });
});

describe('TimeDimensionControl', () => {
  const base = {
    meta: META,
    labeler: LABELER,
    locale: 'pt-BR',
    onChange: vi.fn(),
    onChangeCompare: vi.fn(),
  };

  it('nao oferece comparacao sem dimensao temporal, e nao explica a ausencia', () => {
    render(<TimeDimensionControl {...base} timeDimension={undefined} canCompare={false} />, {
      wrapper: Wrapper,
    });

    expect(screen.queryByText('Comparar com outro periodo')).toBeNull();
    // A ausencia nao e apresentada como erro.
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('oferece comparacao havendo dimensao temporal', () => {
    render(
      <TimeDimensionControl
        {...base}
        timeDimension={{ dimension: 'pedidos.criado_em', granularity: 'month' }}
        canCompare
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByText('Comparar com outro periodo')).toBeDefined();
  });
});

describe('estados', () => {
  const degradada = (removedCount: number, allRemoved = false): ReconcileResult => ({
    query: {},
    removedCount,
    allRemoved,
    degraded: removedCount > 0,
  });

  it('avisa a degradacao em quantidade, nunca por nome', () => {
    render(<DegradedNotice reconciliation={degradada(3)} strings={DEFAULT_STRINGS} />, {
      wrapper: Wrapper,
    });

    const alerta = screen.getByRole('alert');
    expect(alerta.textContent).toContain('3');
    // Nenhum nome de membro pode aparecer no aviso.
    expect(alerta.textContent).not.toContain('pedidos');
    expect(alerta.textContent).not.toContain('receita');
  });

  it('usa a forma singular para um unico membro', () => {
    render(<DegradedNotice reconciliation={degradada(1)} strings={DEFAULT_STRINGS} />, {
      wrapper: Wrapper,
    });
    expect(screen.getByRole('alert').textContent).toContain('1 item');
  });

  it('informa, sem erro tecnico, quando nada sobrou', () => {
    render(<DegradedNotice reconciliation={degradada(2, true)} strings={DEFAULT_STRINGS} />, {
      wrapper: Wrapper,
    });

    const texto = screen.getByRole('alert').textContent ?? '';
    expect(texto).toBe(DEFAULT_STRINGS.degradedAllMembers);
    expect(texto).not.toMatch(/erro|error|falha/i);
  });

  it('nao avisa quando nao houve degradacao', () => {
    render(<DegradedNotice reconciliation={degradada(0)} strings={DEFAULT_STRINGS} />, {
      wrapper: Wrapper,
    });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('deriva a mensagem de falha do codigo, nunca do texto do servidor', () => {
    const erro = new AnalyticsError('QUERY_TIMEOUT', {
      serverMessage: 'pg_stat_activity: canceling statement due to timeout',
    });

    render(<ErrorState error={erro} strings={DEFAULT_STRINGS} />, { wrapper: Wrapper });

    const texto = screen.getByRole('alert').textContent ?? '';
    expect(texto).toBe(DEFAULT_STRINGS.timeoutError);
    expect(texto).not.toContain('pg_stat_activity');
  });

  it('sugere filtrar diante de truncamento', () => {
    render(<TruncatedNotice strings={DEFAULT_STRINGS} />, { wrapper: Wrapper });
    expect(screen.getByRole('alert').textContent).toBe(DEFAULT_STRINGS.truncatedWarning);
  });
});
