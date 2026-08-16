import { useEffect, useRef, useState } from 'react';
import {
  ListTable,
  PivotTable,
  themes,
  TYPES,
  type ListTableConstructorOptions,
  type PivotTableConstructorOptions,
} from '@visactor/vtable';
import type {
  ResultColumn,
  TableRenderProps,
  TableRenderer,
  ValueFormatter,
} from '@archbase/analytics-core';

type VTableColumns = NonNullable<ListTableConstructorOptions['columns']>;
type VTableInstance = ListTable | PivotTable;

/** Modo do heatmap: escala global, por coluna, por linha, ou desligado. */
type HeatmapMode = 'full' | 'col' | 'row' | 'off';

const agrupamentos = (props: TableRenderProps): ResultColumn[] =>
  props.result.columns.filter((c) => c.kind !== 'measure');
const medidas = (props: TableRenderProps): ResultColumn[] =>
  props.result.columns.filter((c) => c.kind === 'measure');

/** Pivota quando ha ao menos duas dimensoes de agrupamento e uma medida. */
function devePivotar(props: TableRenderProps): boolean {
  return agrupamentos(props).length >= 2 && medidas(props).length >= 1;
}

/** Contexto de formatacao da porta para uma coluna/medida. */
function contexto(column: ResultColumn, locale: string) {
  return { format: column.format, precision: column.precision, memberName: column.member, locale };
}

/** SUM por padrao; AVG para media declarada (`aggType`) ou razao (`percent`). */
function tipoAgregacao(props: TableRenderProps, column: ResultColumn) {
  const membro = props.meta.byName.get(column.member);
  return column.format === 'percent' || membro?.aggType === 'avg'
    ? TYPES.AggregationType.AVG
    : TYPES.AggregationType.SUM;
}

/** Rotulo: labeler (i18n) com fallback ao title, mais granularidade. */
function rotulo(props: TableRenderProps, column: ResultColumn): string {
  const membro = props.meta.byName.get(column.member);
  const base = membro ? props.labeler.label(membro, props.locale) : column.title;
  return column.granularity ? `${base} (${column.granularity})` : base;
}

// ─── Heatmap ────────────────────────────────────────────────────────────────

interface Faixa {
  min: number;
  max: number;
}
interface FaixasMedida {
  full: Faixa;
  porColuna: Map<string, Faixa>;
  porLinha: Map<string, Faixa>;
}

function ampliar(f: Faixa, v: number) {
  if (v < f.min) f.min = v;
  if (v > f.max) f.max = v;
}

/** Chaves das dimensoes de linha (todas menos a ultima) e da dimensao de coluna
 *  (a ultima) — o mesmo criterio do pivot. */
function eixos(props: TableRenderProps): { colDim?: string; rowDims: string[] } {
  const grupos = agrupamentos(props);
  return {
    colDim: grupos.length ? grupos[grupos.length - 1].member : undefined,
    rowDims: grupos.slice(0, -1).map((c) => c.member),
  };
}

/** Faixas [min,max] de uma medida: global, por valor da dimensao de coluna, e
 *  por chave das dimensoes de linha. Base dos tres modos de heatmap. */
function calcularFaixas(props: TableRenderProps, member: string): FaixasMedida {
  const { colDim, rowDims } = eixos(props);
  const full: Faixa = { min: Infinity, max: -Infinity };
  const porColuna = new Map<string, Faixa>();
  const porLinha = new Map<string, Faixa>();
  const acumula = (mapa: Map<string, Faixa>, chave: string, v: number) => {
    let f = mapa.get(chave);
    if (!f) {
      f = { min: Infinity, max: -Infinity };
      mapa.set(chave, f);
    }
    ampliar(f, v);
  };
  for (const row of props.result.rows) {
    const v = Number(row[member]);
    if (!Number.isFinite(v)) continue;
    ampliar(full, v);
    if (colDim) acumula(porColuna, String(row[colDim] ?? ''), v);
    acumula(porLinha, rowDims.map((d) => String(row[d] ?? '')).join('¦'), v);
  }
  return { full, porColuna, porLinha };
}

/** Fundo do heatmap: teal com alpha crescente. Semi-transparente de proposito —
 *  assenta bem sobre tema claro e escuro. */
function corHeatmap(t: number): string {
  const alpha = 0.06 + Math.min(1, Math.max(0, t)) * 0.44;
  return `rgba(56, 158, 178, ${alpha.toFixed(3)})`;
}

// Valor da dimensao / chave da linha da celula, lidos do caminho de cabecalho
// que o VTable entrega ao estilo (`cellHeaderPaths`).
type CellArg = { dataValue?: unknown; cellHeaderPaths?: unknown };
interface DimInfo {
  dimensionKey?: string;
  value?: string;
}
function caminhos(arg?: CellArg): { col: DimInfo[]; row: DimInfo[] } {
  const p = (arg?.cellHeaderPaths ?? {}) as { colHeaderPaths?: DimInfo[]; rowHeaderPaths?: DimInfo[] };
  return { col: p.colHeaderPaths ?? [], row: p.rowHeaderPaths ?? [] };
}
function valorColuna(arg: CellArg | undefined, colDim: string): string | undefined {
  return caminhos(arg).col.find((d) => d?.dimensionKey === colDim)?.value;
}
function chaveLinha(arg: CellArg | undefined, rowDims: string[]): string {
  const path = caminhos(arg).row;
  return rowDims.map((d) => path.find((p) => p?.dimensionKey === d)?.value ?? '').join('¦');
}

/** Funcao de bgColor por celula de uma medida, conforme o modo de heatmap.
 *  `off` retorna `undefined` (sem cor). Celulas de total, sendo somas, caem fora
 *  da faixa das celulas individuais e ficam neutras. */
function fundoDaMedida(props: TableRenderProps, member: string, mode: HeatmapMode) {
  if (mode === 'off') return undefined;
  const faixas = calcularFaixas(props, member);
  const { colDim, rowDims } = eixos(props);
  return (arg?: CellArg) => {
    const v = Number(arg?.dataValue);
    if (!Number.isFinite(v)) return 'transparent';
    let faixa = faixas.full;
    if (mode === 'col' && colDim) {
      faixa = faixas.porColuna.get(valorColuna(arg, colDim) ?? '') ?? faixas.full;
    } else if (mode === 'row' && rowDims.length) {
      faixa = faixas.porLinha.get(chaveLinha(arg, rowDims)) ?? faixas.full;
    }
    const { min, max } = faixa;
    if (max === min || v > max || v < min) return 'transparent';
    return corHeatmap((v - min) / (max - min));
  };
}

// ─── Tabela plana (ListTable) ──────────────────────────────────────────────

function formatarCelula(formatter: ValueFormatter, column: ResultColumn, locale: string) {
  return (record: Record<string, unknown>): string =>
    formatter.format(record[column.member] ?? null, contexto(column, locale));
}

/**
 * Agregacao da coluna para a linha de totais. A primeira coluna (dimensao) so
 * exibe o rotulo "Total": COUNT e numerico-seguro e o `formatFun` fixo troca o
 * numero pelo rotulo. (CUSTOM com retorno de string quebra a linha no VTable.)
 */
function aggregacaoDaColuna(props: TableRenderProps, column: ResultColumn, index: number) {
  if (column.kind === 'measure') {
    return {
      aggregationType: tipoAgregacao(props, column),
      formatFun: (value: number) => props.formatter.format(value, contexto(column, props.locale)),
    };
  }
  if (index === 0) {
    return { aggregationType: TYPES.AggregationType.COUNT, formatFun: () => 'Total' };
  }
  return undefined;
}

function construirColunas(props: TableRenderProps, mode: HeatmapMode): VTableColumns {
  // Na tabela plana cada medida e uma unica coluna: col/row nao se aplicam,
  // caem em `full` (ou `off`).
  const modoPlano: HeatmapMode = mode === 'off' ? 'off' : 'full';
  return props.result.columns.map((column, index) => {
    const medida = column.kind === 'measure';
    return {
      field: column.member,
      title: rotulo(props, column),
      // VTable ordena pelo valor bruto do registro — nunca pelo texto formatado.
      sort: true,
      fieldFormat: formatarCelula(props.formatter, column, props.locale),
      style: medida
        ? { textAlign: 'right', bgColor: fundoDaMedida(props, column.member, modoPlano) }
        : { textAlign: 'left' },
      headerStyle: { textAlign: medida ? 'right' : 'left' },
      aggregation: aggregacaoDaColuna(props, column, index),
    };
  }) as VTableColumns;
}

function construirOpcoesPlano(props: TableRenderProps, mode: HeatmapMode): ListTableConstructorOptions {
  return {
    records: props.result.rows,
    columns: construirColunas(props, mode),
    // Largura por conteudo (nunca trunca) + estica para preencher; scroll
    // horizontal quando ha colunas demais. Altura fixa, scroll vertical interno.
    widthMode: 'autoWidth',
    autoFillWidth: true,
    heightMode: 'standard',
    frozenColCount: 1,
    theme: escolherTema(),
  };
}

// ─── Tabela dinamica (PivotTable) ──────────────────────────────────────────
//
// A ultima dimensao vira o eixo de colunas; as demais, o eixo de linhas; as
// medidas, os indicadores das celulas (agregadas por VTable).

function construirOpcoesPivot(props: TableRenderProps, mode: HeatmapMode): PivotTableConstructorOptions {
  const grupos = agrupamentos(props);
  const eixoLinha = grupos.slice(0, -1);
  const eixoColuna = grupos[grupos.length - 1];
  const measuresList = medidas(props);

  return {
    records: props.result.rows,
    rows: eixoLinha.map((c) => ({ dimensionKey: c.member, title: rotulo(props, c) })),
    columns: [{ dimensionKey: eixoColuna.member, title: rotulo(props, eixoColuna) }],
    indicators: measuresList.map((m) => ({
      indicatorKey: m.member,
      title: rotulo(props, m),
      aggregation: { aggregationType: tipoAgregacao(props, m) },
      // `format` do indicador formata a celula; recebe o valor agregado.
      format: (value: unknown) => {
        const numero = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(numero)
          ? props.formatter.format(numero, contexto(m, props.locale))
          : String(value ?? '');
      },
      style: { textAlign: 'right', bgColor: fundoDaMedida(props, m.member, mode) },
    })),
    // Uma medida: indicador no eixo de linha. Varias: viram colunas sob cada
    // valor da dimensao.
    indicatorsAsCol: measuresList.length > 1,
    // Grand totals de linha (a direita) + coluna (embaixo); intersecao = total geral.
    dataConfig: {
      totals: {
        row: { showGrandTotals: true, grandTotalLabel: 'Total' },
        column: { showGrandTotals: true, grandTotalLabel: 'Total' },
      },
    },
    widthMode: 'autoWidth',
    autoFillWidth: true,
    theme: escolherTema(),
  } as PivotTableConstructorOptions;
}

// Tema basico por color-scheme; o polimento dark/light fica para depois.
function escolherTema() {
  const dark =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return dark ? themes.DARK : themes.DEFAULT;
}

// ─── Componente ─────────────────────────────────────────────────────────────

const ALTURA_TOOLBAR = 38;

function BotaoModo({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        font: 'inherit',
        fontSize: 12,
        padding: '3px 12px',
        cursor: 'pointer',
        borderRadius: 4,
        border: '1px solid rgba(128,128,128,0.4)',
        background: ativo ? 'rgba(128,128,128,0.25)' : 'transparent',
        color: 'inherit',
        opacity: ativo ? 1 : 0.65,
      }}
    >
      {children}
    </button>
  );
}

function VTableResult(props: TableRenderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<VTableInstance | null>(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  const podePivotar = devePivotar(props);
  const temMedidas = medidas(props).length > 0;
  const [override, setOverride] = useState<boolean | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapMode>('full');
  const pivotEfetivo = podePivotar && (override ?? true);
  const temToolbar = podePivotar || temMedidas;

  const alturaBase = props.height && props.height > 0 ? props.height : 420;
  const alturaTabela = Math.max(120, alturaBase - (temToolbar ? ALTURA_TOOLBAR : 0));

  // Recria a instancia quando estrutura/dados/modo mudam.
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const p = propsRef.current;
    const table = pivotEfetivo
      ? new PivotTable(containerRef.current, construirOpcoesPivot(p, heatmap))
      : new ListTable(containerRef.current, construirOpcoesPlano(p, heatmap));
    tableRef.current = table;
    return () => {
      table.release();
      tableRef.current = null;
    };
  }, [props.result, props.locale, props.formatter, props.labeler, pivotEfetivo, heatmap]);

  // Reajusta o canvas quando a altura disponivel muda (ex.: painel recolhido).
  useEffect(() => {
    tableRef.current?.resize?.();
  }, [props.height]);

  return (
    <div style={{ width: '100%', height: props.height ?? '100%', display: 'flex', flexDirection: 'column' }}>
      {temToolbar && (
        <div
          style={{
            display: 'flex',
            gap: 14,
            paddingBottom: 8,
            flex: '0 0 auto',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {podePivotar && (
            <div style={{ display: 'flex', gap: 6 }}>
              <BotaoModo ativo={!pivotEfetivo} onClick={() => setOverride(false)}>
                Plano
              </BotaoModo>
              <BotaoModo ativo={pivotEfetivo} onClick={() => setOverride(true)}>
                Pivot
              </BotaoModo>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, opacity: 0.55 }}>Cores</span>
            <BotaoModo ativo={heatmap === 'full'} onClick={() => setHeatmap('full')}>
              Total
            </BotaoModo>
            {pivotEfetivo && (
              <BotaoModo ativo={heatmap === 'col'} onClick={() => setHeatmap('col')}>
                Coluna
              </BotaoModo>
            )}
            {pivotEfetivo && (
              <BotaoModo ativo={heatmap === 'row'} onClick={() => setHeatmap('row')}>
                Linha
              </BotaoModo>
            )}
            <BotaoModo ativo={heatmap === 'off'} onClick={() => setHeatmap('off')}>
              Off
            </BotaoModo>
          </div>
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: alturaTabela, flex: '0 0 auto' }} />
    </div>
  );
}

/**
 * Renderizador de tabela baseado no VisActor VTable — grade rica para BI:
 * virtualizacao, ordenacao no valor bruto, totais, coluna congelada, heatmap
 * (total/coluna/linha) e pivot (automatico a partir de 2 dimensoes, com toggle).
 * Injete via `ports.tableRenderer`; sem ele a biblioteca usa a tabela Mantine.
 */
export function createVTableRenderer(): TableRenderer {
  return { render: (props) => <VTableResult {...props} /> };
}
