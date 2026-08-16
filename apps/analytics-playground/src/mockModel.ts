/**
 * Modelo + backend simulados para o playground do explorador.
 *
 * Nada aqui existe em produção: é um domínio de vendas sintético, rico o
 * bastante para exercitar tabela (muitas linhas), pivot, séries temporais e os
 * formatos (moeda em centavos, inteiro, percentual). O `fetchImpl` abaixo é
 * injetado no `AnalyticsProvider` — nenhum backend, token ou Cube envolvido.
 */
import type { RawMetaResponse } from '@archbase/analytics-core'

export const MOCK_META: RawMetaResponse = {
  cubes: [
    {
      name: 'vendas',
      title: 'Vendas',
      type: 'view',
      measures: [
        {
          name: 'vendas.receita_cents',
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
          name: 'vendas.pedidos',
          title: 'Pedidos',
          type: 'number',
          aggType: 'sum',
          meta: { i18n: { 'pt-BR': 'Pedidos' }, format: 'integer', group: 'Volume' },
        },
        {
          name: 'vendas.ticket_medio_cents',
          title: 'Ticket médio',
          type: 'number',
          aggType: 'avg',
          meta: { i18n: { 'pt-BR': 'Ticket médio' }, format: 'currency_cents', group: 'Financeiro' },
        },
        {
          name: 'vendas.margem_ratio',
          title: 'Margem',
          type: 'number',
          meta: { i18n: { 'pt-BR': 'Margem', en: 'Margin' }, format: 'percent', group: 'Financeiro' },
        },
      ],
      dimensions: [
        {
          name: 'vendas.canal',
          title: 'Canal',
          type: 'string',
          meta: { i18n: { 'pt-BR': 'Canal', en: 'Channel' }, format: 'text', group: 'Origem' },
        },
        {
          name: 'vendas.regiao',
          title: 'Região',
          type: 'string',
          meta: { i18n: { 'pt-BR': 'Região' }, format: 'text', group: 'Origem' },
        },
        {
          name: 'vendas.categoria',
          title: 'Categoria',
          type: 'string',
          meta: { i18n: { 'pt-BR': 'Categoria' }, format: 'text', group: 'Produto' },
        },
        {
          name: 'vendas.criado_em',
          title: 'Criado em',
          type: 'time',
          meta: { i18n: { 'pt-BR': 'Criado em', en: 'Created at' }, format: 'datetime', group: 'Tempo' },
        },
      ],
    },
  ],
}

const DIM_VALUES: Record<string, string[]> = {
  'vendas.canal': ['Loja', 'Online', 'Parceiro', 'Marketplace'],
  'vendas.regiao': ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
  'vendas.categoria': ['Bebidas', 'Limpeza', 'Higiene', 'Mercearia', 'Frios', 'Padaria'],
}

const MESES = [
  '2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01',
  '2026-05-01', '2026-06-01', '2026-07-01', '2026-08-01',
]

/** FNV-1a — determinístico, para um demo estável (sem Math.random). */
function hash(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0)
}

// ─── Fatos base na granularidade fina ──────────────────────────────────────
// canal × regiao × categoria × mes. Agregar estes fatos sob demanda mantem os
// numeros consistentes entre queries e faz filtro em qualquer dimensao valer.

interface FatoBase {
  'vendas.canal': string
  'vendas.regiao': string
  'vendas.categoria': string
  'vendas.criado_em': string
  receita: number
  pedidos: number
  custo: number
}

function construirFatos(): FatoBase[] {
  const fatos: FatoBase[] = []
  for (const canal of DIM_VALUES['vendas.canal']) {
    for (const regiao of DIM_VALUES['vendas.regiao']) {
      for (const categoria of DIM_VALUES['vendas.categoria']) {
        for (const mes of MESES) {
          const chave = `${canal}|${regiao}|${categoria}|${mes}`
          const receita = 5_000 + (hash(`${chave}|r`) % 95_000)
          const pedidos = 1 + (hash(`${chave}|p`) % 40)
          const custo = Math.round(receita * (0.55 + (hash(`${chave}|c`) % 300) / 1000))
          fatos.push({
            'vendas.canal': canal,
            'vendas.regiao': regiao,
            'vendas.categoria': categoria,
            'vendas.criado_em': mes,
            receita,
            pedidos,
            custo,
          })
        }
      }
    }
  }
  return fatos
}

// 4×5×6×8 = 960 fatos deterministicos, calculados uma vez na carga do modulo.
const FATOS = construirFatos()

/** Valor de uma dimensao no fato; undefined se `membro` nao for dimensao base. */
function valorDimensao(fato: FatoBase, membro: string): string | undefined {
  const chaves = ['vendas.canal', 'vendas.regiao', 'vendas.categoria', 'vendas.criado_em']
  return chaves.includes(membro) ? String((fato as Record<string, unknown>)[membro]) : undefined
}

interface Acumulado {
  receita: number
  pedidos: number
  custo: number
}

/** Measure agregada do grupo (soma; ticket e margem sao razoes de somas). */
function valorDaMeasure(measure: string, g: Acumulado): string {
  switch (measure) {
    case 'vendas.receita_cents':
      return String(g.receita)
    case 'vendas.pedidos':
      return String(g.pedidos)
    case 'vendas.ticket_medio_cents':
      return String(g.pedidos > 0 ? Math.round(g.receita / g.pedidos) : 0)
    case 'vendas.margem_ratio':
      return (g.receita > 0 ? (g.receita - g.custo) / g.receita : 0).toFixed(3)
    default:
      return '0'
  }
}

interface MockFilter {
  member: string
  operator: string
  values?: string[]
}

interface MockQuery {
  measures?: string[]
  dimensions?: string[]
  timeDimensions?: Array<{ dimension: string; granularity?: string }>
  filters?: MockFilter[]
}

/** Predicado de um filtro sobre um valor (dimensão). Espelha os operadores do FilterBuilder. */
function corresponde(valor: string, f: MockFilter): boolean {
  const vals = (f.values ?? []).map((v) => v.toLowerCase())
  const alvo = valor.toLowerCase()
  switch (f.operator) {
    case 'equals':
      return vals.includes(alvo)
    case 'notEquals':
      return !vals.includes(alvo)
    case 'contains':
      return vals.some((v) => alvo.includes(v))
    case 'notContains':
      return !vals.some((v) => alvo.includes(v))
    case 'startsWith':
      return vals.some((v) => alvo.startsWith(v))
    case 'endsWith':
      return vals.some((v) => alvo.endsWith(v))
    case 'gt':
      return vals.every((v) => alvo > v)
    case 'gte':
      return vals.every((v) => alvo >= v)
    case 'lt':
      return vals.every((v) => alvo < v)
    case 'lte':
      return vals.every((v) => alvo <= v)
    case 'set':
      return valor !== '' && valor != null
    case 'notSet':
      return valor === '' || valor == null
    default:
      return true
  }
}

function gerarLinhas(query: MockQuery): Array<Record<string, string>> {
  const dims = query.dimensions ?? []
  const timeDims = (query.timeDimensions ?? []).map((t) => t.dimension)
  const measures = query.measures ?? []
  const filtros = query.filters ?? []
  const grupoCols = [...dims, ...timeDims]

  // 1) Filtra os fatos base — vale para qualquer dimensao, agrupada ou nao.
  const filtrados = FATOS.filter((f) =>
    filtros.every((flt) => {
      const val = valorDimensao(f, flt.member)
      return val === undefined ? true : corresponde(val, flt)
    }),
  )

  // 2) Agrupa pelas colunas pedidas e acumula as measures aditivas.
  const grupos = new Map<string, { cols: Record<string, string>; acc: Acumulado }>()
  for (const f of filtrados) {
    const chave = grupoCols.map((c) => valorDimensao(f, c) ?? '').join('¦')
    let g = grupos.get(chave)
    if (!g) {
      const cols: Record<string, string> = {}
      for (const c of grupoCols) cols[c] = valorDimensao(f, c) ?? ''
      g = { cols, acc: { receita: 0, pedidos: 0, custo: 0 } }
      grupos.set(chave, g)
    }
    g.acc.receita += f.receita
    g.acc.pedidos += f.pedidos
    g.acc.custo += f.custo
  }

  // 3) Monta as linhas com as measures pedidas (valores como string).
  return [...grupos.values()].map((g) => {
    const linha: Record<string, string> = { ...g.cols }
    for (const m of measures) linha[m] = valorDaMeasure(m, g.acc)
    return linha
  })
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * `fetchImpl` para o `AnalyticsProvider`: serve `v1/meta` e `v1/load` a partir
 * do modelo sintético acima. Ignora o host, casa pelo sufixo do caminho.
 */
export const mockFetch: typeof fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.toString()

  if (url.endsWith('/v1/meta')) {
    return jsonResponse(MOCK_META)
  }

  if (url.endsWith('/v1/load')) {
    const corpo = init?.body ? JSON.parse(String(init.body)) : {}
    const query: MockQuery = corpo.query ?? {}
    const data = gerarLinhas(query)
    return jsonResponse({
      results: [{ query, data, annotation: { measures: {}, dimensions: {}, timeDimensions: {} } }],
    })
  }

  return new Response('not found', { status: 404 })
}
