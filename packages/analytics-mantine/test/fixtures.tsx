import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import {
  createDefaultLabeler,
  normalizeMeta,
  ptBrFormatter,
  type AnalyticsMeta,
  type ChartRenderer,
  type NormalizedResult,
  type RawMetaResponse,
  type VizType,
} from '@archbase/analytics-core';

/** Modelo ficticio. Nao corresponde a produto algum, e nao deve. */
export const META_CRU: RawMetaResponse = {
  cubes: [
    {
      name: 'pedidos',
      title: 'Pedidos',
      type: 'view',
      measures: [
        {
          name: 'pedidos.receita_cents',
          title: 'Receita',
          type: 'number',
          aggType: 'sum',
          meta: {
            i18n: { 'pt-BR': 'Receita', en: 'Revenue' },
            format: 'currency_cents',
            group: 'Financeiro',
            default_viz: 'bar',
          },
        },
        {
          name: 'pedidos.itens_total',
          title: 'Itens',
          type: 'number',
          meta: { i18n: { 'pt-BR': 'Itens' }, format: 'integer', group: 'Volume' },
        },
      ],
      dimensions: [
        {
          name: 'pedidos.canal',
          title: 'Canal',
          type: 'string',
          meta: { i18n: { 'pt-BR': 'Canal' }, format: 'text', group: 'Origem' },
        },
        {
          name: 'pedidos.arvore',
          title: 'Árvore',
          type: 'string',
          meta: { i18n: { 'pt-BR': 'Árvore' }, format: 'text', group: 'Origem' },
        },
        {
          name: 'pedidos.criado_em',
          title: 'Criado em',
          type: 'time',
          meta: { i18n: { 'pt-BR': 'Criado em' }, format: 'datetime', group: 'Tempo' },
        },
      ],
    },
  ],
};

export const META: AnalyticsMeta = normalizeMeta(META_CRU);
export const LABELER = createDefaultLabeler('pt-BR');
export const FORMATTER = ptBrFormatter;

export function fakeChartRenderer(unsupported: VizType[] = []): ChartRenderer {
  return {
    supports: (viz) => !unsupported.includes(viz),
    render: () => <div data-testid="grafico" />,
  };
}

export function resultado(rowCount = 3): NormalizedResult {
  const rows = Array.from({ length: rowCount }, (_, index) => ({
    'pedidos.canal': `Canal ${index + 1}`,
    'pedidos.receita_cents': (index + 1) * 100000,
  }));

  return {
    columns: [
      { member: 'pedidos.canal', title: 'Canal', kind: 'dimension', format: 'text' },
      {
        member: 'pedidos.receita_cents',
        title: 'Receita',
        kind: 'measure',
        format: 'currency_cents',
      },
    ],
    rows,
    periods: [{ index: 0, label: 'Periodo atual' }],
    rowsByPeriod: [rows],
    deltas: [],
    truncated: false,
    query: {},
  };
}

export function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}
