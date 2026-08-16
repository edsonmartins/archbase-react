import type { AnalyticsMeta, NormalizedResult, ResultColumn } from '../meta/types';
import type { MemberLabeler, ValueFormatter } from '../ports/types';

export interface CsvOptions {
  /** Formata os valores de celula (moeda, %, data) por membro. */
  formatter: ValueFormatter;
  locale: string;
  /** Rotula os cabecalhos (i18n); sem ele, usa o `title` da coluna. */
  labeler?: MemberLabeler;
  meta?: AnalyticsMeta;
  /** Separador de campo. Default `;` — o Excel pt-BR abre direto. */
  separator?: string;
  /**
   * `false` (default): celulas com o valor formatado — paridade com a tela.
   * `true`: medidas como numero cru (sem moeda/%/milhar) — melhor p/ calculo em
   * planilha. `currency_cents` sai em centavos (unidade bruta), `percent` como
   * fracao 0-1: nenhuma conversao de unidade acontece aqui, igual as portas.
   */
  raw?: boolean;
}

function cabecalho(column: ResultColumn, opts: CsvOptions): string {
  const membro = opts.meta?.byName.get(column.member);
  const base = membro && opts.labeler ? opts.labeler.label(membro, opts.locale) : column.title;
  return column.granularity ? `${base} (${column.granularity})` : base;
}

/** Escapa um campo conforme RFC 4180: aspas se contiver separador, aspas ou quebra. */
function escapar(valor: string, separador: string): string {
  if (valor.includes(separador) || valor.includes('"') || valor.includes('\n') || valor.includes('\r')) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

function celula(column: ResultColumn, row: Record<string, unknown>, opts: CsvOptions): string {
  const bruto = row[column.member] ?? '';
  if (opts.raw && column.kind === 'measure') {
    const n = Number(bruto);
    return Number.isFinite(n) ? String(n) : '';
  }
  return opts.formatter.format(bruto, {
    format: column.format,
    precision: column.precision,
    memberName: column.member,
    locale: opts.locale,
  });
}

/**
 * Serializa um resultado normalizado em CSV (RFC 4180, linhas CRLF). Puro: nao
 * toca no DOM nem baixa arquivo — o consumidor envolve num Blob e dispara o
 * download (adicionando o BOM UTF-8 para o Excel respeitar os acentos).
 */
export function resultToCsv(result: NormalizedResult, opts: CsvOptions): string {
  const sep = opts.separator ?? ';';
  const header = result.columns.map((c) => escapar(cabecalho(c, opts), sep));
  const linhas = result.rows.map((row) =>
    result.columns.map((c) => escapar(celula(c, row, opts), sep)),
  );
  return [header, ...linhas].map((cols) => cols.join(sep)).join('\r\n');
}
