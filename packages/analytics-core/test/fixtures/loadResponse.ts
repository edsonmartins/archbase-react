/**
 * Respostas simuladas de carga. Valores numericos chegam como string, tal como
 * a camada semantica costuma emitir — a coercao e responsabilidade do nucleo.
 */

/** Envelope moderno: um unico conjunto de resultados. */
export const LOAD_SIMPLES = {
  results: [
    {
      query: {
        measures: ['pedidos.receita_cents', 'pedidos.itens_total'],
        dimensions: ['pedidos.canal'],
      },
      data: [
        { 'pedidos.canal': 'Loja', 'pedidos.receita_cents': '1250000', 'pedidos.itens_total': '42' },
        { 'pedidos.canal': 'Online', 'pedidos.receita_cents': '800000', 'pedidos.itens_total': '31' },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
  ],
};

/**
 * Envelope antigo, sem `results`. O cliente normaliza as duas formas para que a
 * versao da camada semantica nao vaze para o Anel 1.
 */
export const LOAD_LEGADO = {
  query: {
    measures: ['pedidos.receita_cents'],
    dimensions: ['pedidos.canal'],
  },
  data: [{ 'pedidos.canal': 'Loja', 'pedidos.receita_cents': '1250000' }],
  annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
};

/**
 * Comparacao por multiplos intervalos: a mesma measure retorna para os dois
 * periodos em uma unica consulta. O primeiro conjunto e o periodo principal.
 *
 * Cobre os tres casos que o calculo de variacao precisa distinguir:
 *   Loja     1250000 sobre 1000000  -> variacao positiva
 *   Online    800000 sobre  850000  -> variacao negativa
 *   Parceiro  100000 sobre       0  -> razao indefinida, nunca infinita
 */
export const LOAD_COMPARACAO = {
  results: [
    {
      query: {
        measures: ['pedidos.receita_cents'],
        dimensions: ['pedidos.canal'],
        timeDimensions: [
          { dimension: 'pedidos.criado_em', dateRange: ['2026-07-01', '2026-07-31'] },
        ],
      },
      data: [
        { 'pedidos.canal': 'Loja', 'pedidos.receita_cents': '1250000' },
        { 'pedidos.canal': 'Online', 'pedidos.receita_cents': '800000' },
        { 'pedidos.canal': 'Parceiro', 'pedidos.receita_cents': '100000' },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
    {
      query: {
        measures: ['pedidos.receita_cents'],
        dimensions: ['pedidos.canal'],
        timeDimensions: [
          { dimension: 'pedidos.criado_em', dateRange: ['2026-06-01', '2026-06-30'] },
        ],
      },
      data: [
        { 'pedidos.canal': 'Loja', 'pedidos.receita_cents': '1000000' },
        { 'pedidos.canal': 'Online', 'pedidos.receita_cents': '850000' },
        { 'pedidos.canal': 'Parceiro', 'pedidos.receita_cents': '0' },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
  ],
};

/**
 * Comparacao com granularidade: cada periodo traz varias linhas por chave de
 * dimensao, alinhadas por posicao ordinal dentro da chave.
 */
export const LOAD_COMPARACAO_GRANULAR = {
  results: [
    {
      query: {
        measures: ['pedidos.receita_cents'],
        dimensions: ['pedidos.canal'],
        timeDimensions: [
          {
            dimension: 'pedidos.criado_em',
            granularity: 'day',
            dateRange: ['2026-07-01', '2026-07-02'],
          },
        ],
      },
      data: [
        {
          'pedidos.canal': 'Loja',
          'pedidos.criado_em.day': '2026-07-01T00:00:00.000',
          'pedidos.receita_cents': '600000',
        },
        {
          'pedidos.canal': 'Loja',
          'pedidos.criado_em.day': '2026-07-02T00:00:00.000',
          'pedidos.receita_cents': '650000',
        },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
    {
      query: {
        measures: ['pedidos.receita_cents'],
        dimensions: ['pedidos.canal'],
        timeDimensions: [
          {
            dimension: 'pedidos.criado_em',
            granularity: 'day',
            dateRange: ['2026-06-01', '2026-06-02'],
          },
        ],
      },
      data: [
        {
          'pedidos.canal': 'Loja',
          'pedidos.criado_em.day': '2026-06-01T00:00:00.000',
          'pedidos.receita_cents': '500000',
        },
        {
          'pedidos.canal': 'Loja',
          'pedidos.criado_em.day': '2026-06-02T00:00:00.000',
          'pedidos.receita_cents': '400000',
        },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
  ],
};

/**
 * Esparsidade deliberada, com buracos em posicoes diferentes nos dois periodos.
 *
 * Julho tem 4 dias no intervalo e falta o dia 2; junho tem os mesmos 4 dias e
 * falta o dia 3. Alinhado por posicao no array — o defeito — julho-03 parearia
 * com junho-02 e o numero sairia plausivel. Alinhado por posicao relativa ao
 * inicio do intervalo, cada dia pareia com o seu.
 *
 * Junho ainda tem um quinto dia que julho nao tem: e a cauda que precisa parear
 * com nulo em vez de ser descartada.
 */
export const LOAD_COMPARACAO_ESPARSA = {
  results: [
    {
      query: {
        measures: ['pedidos.receita_cents'],
        timeDimensions: [
          {
            dimension: 'pedidos.criado_em',
            granularity: 'day',
            dateRange: ['2026-07-01', '2026-07-04'],
          },
        ],
      },
      data: [
        { 'pedidos.criado_em.day': '2026-07-01T00:00:00.000', 'pedidos.receita_cents': '100' },
        // dia 2 ausente
        { 'pedidos.criado_em.day': '2026-07-03T00:00:00.000', 'pedidos.receita_cents': '300' },
        { 'pedidos.criado_em.day': '2026-07-04T00:00:00.000', 'pedidos.receita_cents': '400' },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
    {
      query: {
        measures: ['pedidos.receita_cents'],
        timeDimensions: [
          {
            dimension: 'pedidos.criado_em',
            granularity: 'day',
            dateRange: ['2026-06-01', '2026-06-05'],
          },
        ],
      },
      data: [
        { 'pedidos.criado_em.day': '2026-06-01T00:00:00.000', 'pedidos.receita_cents': '10' },
        { 'pedidos.criado_em.day': '2026-06-02T00:00:00.000', 'pedidos.receita_cents': '20' },
        // dia 3 ausente
        { 'pedidos.criado_em.day': '2026-06-04T00:00:00.000', 'pedidos.receita_cents': '40' },
        { 'pedidos.criado_em.day': '2026-06-05T00:00:00.000', 'pedidos.receita_cents': '50' },
      ],
      annotation: { measures: {}, dimensions: {}, timeDimensions: {} },
    },
  ],
};

export const ERRO_TIMEOUT = { error: { code: 'QUERY_TIMEOUT', retryable: false } };
export const ERRO_CONCORRENCIA = { error: { code: 'CONCURRENCY_LIMIT', retryable: true } };
export const ERRO_MEMBRO = { error: { code: 'FORBIDDEN_MEMBER', retryable: false } };
/** Envelope fora do conjunto fechado: degrada para UPSTREAM_ERROR. */
export const ERRO_DESCONHECIDO = { error: { code: 'ALGO_NOVO', retryable: false } };
