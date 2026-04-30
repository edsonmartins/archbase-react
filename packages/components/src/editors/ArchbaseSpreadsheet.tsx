/**
 * ArchbaseSpreadsheet — wrapper para fortune-sheet integrado ao DataSource.
 * Permite exibir e editar dados tabulares em formato de planilha.
 * @status experimental
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Input } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDataSourceListener } from '@archbase/data';

// ─────────────────────────── Types ───────────────────────────

export type ArchbaseColumnType = 'text' | 'number' | 'date' | 'boolean' | 'currency';

export interface ArchbaseColumnDef<T> {
  /** Campo do registro mapeado para esta coluna */
  field: keyof T | string;
  /** Cabeçalho exibido na planilha */
  header: string;
  /** Largura da coluna em pixels */
  width?: number;
  /** Tipo do dado */
  type?: ArchbaseColumnType;
  /** Formato numérico (ex: '#,##0.00') */
  format?: string;
  /** Se a coluna é editável */
  editable?: boolean;
}

export interface ArchbaseSpreadsheetProps<T, ID> {
  /** Fonte de dados que fornece os registros */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Definição de colunas para mapeamento DataSource -> planilha */
  columns?: ArchbaseColumnDef<T>[];
  /** Dados standalone no formato Sheet[] do fortune-sheet */
  data?: any[];
  /** Permite edição (default: true) */
  editable?: boolean;
  /** Exibe a toolbar (default: true) */
  showToolbar?: boolean;
  /** Exibe a barra de fórmulas (default: true) */
  showFormulaBar?: boolean;
  /** Exibe as abas de planilhas (default: true) */
  showSheetTabs?: boolean;
  /** Altura do componente */
  height?: string | number;
  /** Largura do componente */
  width?: string | number;
  /** Callback quando uma célula é alterada */
  onCellChange?: (row: number, col: number, oldValue: any, newValue: any) => void;
  /** Callback quando a seleção muda */
  onSelectionChange?: (ranges: any[]) => void;
  /** Rótulo (Input.Wrapper) */
  label?: string;
  /** Descrição (Input.Wrapper) */
  description?: string;
  /** Somente leitura */
  readOnly?: boolean;
  /** Locale (default: 'pt-BR') */
  locale?: string;
  /** Estilo adicional do container */
  style?: CSSProperties;
  /** Classe CSS adicional */
  className?: string;
}

// ─────────────────────── Helpers ─────────────────────────

/** Retorna o valor de um campo possivelmente aninhado (notacao de ponto) */
function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/** Mapeia ArchbaseColumnType para o cell type do fortune-sheet */
function mapColumnTypeToCellType(type?: ArchbaseColumnType): number {
  switch (type) {
    case 'number':
    case 'currency':
      return 0; // number
    case 'boolean':
      return 0; // tratado como number (0/1)
    case 'date':
      return 0; // date stored as number in sheets
    case 'text':
    default:
      return 1; // string
  }
}

/** Converte valor do DataSource para valor da célula */
function toCellValue(value: any, type?: ArchbaseColumnType): any {
  if (value === null || value === undefined) return '';
  switch (type) {
    case 'boolean':
      return value ? 1 : 0;
    case 'number':
    case 'currency':
      return typeof value === 'number' ? value : Number(value) || 0;
    default:
      return String(value);
  }
}

/** Converte valor da célula de volta para o tipo esperado pelo DataSource */
function fromCellValue(value: any, type?: ArchbaseColumnType): any {
  if (value === '' || value === null || value === undefined) return null;
  switch (type) {
    case 'boolean':
      return Boolean(Number(value));
    case 'number':
    case 'currency':
      return Number(value);
    default:
      return String(value);
  }
}

// ─────────────────────── Conversao DS -> Sheet ───────────────────────

function buildSheetFromDataSource<T>(
  dataSource: IArchbaseDataSourceBase<T>,
  columns: ArchbaseColumnDef<T>[],
): any {
  const records = dataSource.browseRecords();
  const celldata: any[] = [];

  // Header row
  columns.forEach((col, colIdx) => {
    celldata.push({
      r: 0,
      c: colIdx,
      v: {
        v: col.header,
        ct: { fa: 'General', t: 's' },
        m: col.header,
        bl: 1, // bold
      },
    });
  });

  // Data rows
  records.forEach((record, rowIdx) => {
    columns.forEach((col, colIdx) => {
      const raw = getNestedValue(record, String(col.field));
      const value = toCellValue(raw, col.type);
      const ct =
        col.type === 'number' || col.type === 'currency'
          ? { fa: col.format || 'General', t: 'n' }
          : { fa: 'General', t: 's' };

      celldata.push({
        r: rowIdx + 1, // +1 for header
        c: colIdx,
        v: {
          v: value,
          ct,
          m: String(value),
        },
      });
    });
  });

  // Column widths
  const columnlen: Record<number, number> = {};
  columns.forEach((col, idx) => {
    columnlen[idx] = col.width ?? 100;
  });

  return {
    name: 'Sheet1',
    index: '0',
    status: 1,
    order: 0,
    celldata,
    column: columns.length,
    row: records.length + 1,
    config: {
      columnlen,
    },
  };
}

// ─────────────────────── Componente ─────────────────────────

function ArchbaseSpreadsheetInner<T, ID>(
  props: ArchbaseSpreadsheetProps<T, ID>,
) {
  const {
    dataSource,
    columns,
    data: externalData,
    editable = true,
    showToolbar = true,
    showFormulaBar = true,
    showSheetTabs = true,
    height = '400px',
    width = '100%',
    onCellChange,
    onSelectionChange,
    label,
    description,
    readOnly = false,
    locale = 'pt-BR',
    style,
    className,
  } = props;

  const forceUpdate = useForceUpdate();
  const prevCellDataRef = useRef<Map<string, any>>(new Map());

  // ── Construir dados da planilha ──

  const sheetData = useMemo(() => {
    if (externalData && externalData.length > 0) {
      return externalData;
    }
    if (dataSource && columns && columns.length > 0) {
      return [buildSheetFromDataSource(dataSource, columns)];
    }
    return [
      {
        name: 'Sheet1',
        index: '0',
        status: 1,
        order: 0,
        celldata: [],
        column: 10,
        row: 30,
      },
    ];
  }, [externalData, dataSource, columns]);

  // ── Guardar referencia a valores anteriores para detectar mudancas ──

  useEffect(() => {
    const map = new Map<string, any>();
    if (sheetData && sheetData.length > 0) {
      const sheet = sheetData[0];
      if (sheet.celldata) {
        for (const cell of sheet.celldata) {
          map.set(`${cell.r}_${cell.c}`, cell.v?.v);
        }
      }
    }
    prevCellDataRef.current = map;
  }, [sheetData]);

  // ── Listener do DataSource ──

  const handleDataSourceEvent = useCallback(
    (event: DataSourceEvent<T>) => {
      switch (event.type) {
        case DataSourceEventNames.dataChanged:
        case DataSourceEventNames.recordChanged:
        case DataSourceEventNames.refreshData:
        case DataSourceEventNames.afterInsert:
        case DataSourceEventNames.afterRemove:
        case DataSourceEventNames.afterCancel:
        case DataSourceEventNames.afterSave:
        case DataSourceEventNames.afterEdit:
          forceUpdate();
          break;
      }
    },
    [forceUpdate],
  );

  if (dataSource) {
    useArchbaseDataSourceListener<T>({
      dataSource,
      listener: handleDataSourceEvent,
    });
  }

  // ── Handlers fortune-sheet ──

  const handleCellUpdated = useCallback(
    (row: number, col: number, newValue: any) => {
      const key = `${row}_${col}`;
      const oldValue = prevCellDataRef.current.get(key);
      prevCellDataRef.current.set(key, newValue);

      // Callback externo
      onCellChange?.(row, col, oldValue, newValue);

      // Atualizar DataSource se em modo de edicao
      if (dataSource && columns && columns.length > 0 && row > 0) {
        const recordIndex = row - 1; // header na linha 0
        const colDef = columns[col];
        if (colDef && colDef.editable !== false) {
          const records = dataSource.browseRecords();
          if (recordIndex >= 0 && recordIndex < records.length) {
            // Navegar para o registro correspondente
            if (dataSource.getCurrentIndex() !== recordIndex) {
              dataSource.gotoRecord(recordIndex);
            }
            if (dataSource.isEditing() || dataSource.isInserting()) {
              const converted = fromCellValue(newValue, colDef.type);
              dataSource.setFieldValue(String(colDef.field), converted);
            }
          }
        }
      }
    },
    [dataSource, columns, onCellChange],
  );

  // ── Fortune-sheet onChange handler ──

  const handleChange = useCallback(
    (data: any[]) => {
      // fortune-sheet dispara onChange com os dados atualizados
      // Detectar mudancas de celula comparando com o estado anterior
      if (data && data.length > 0) {
        const sheet = data[0];
        if (sheet?.celldata) {
          for (const cell of sheet.celldata) {
            const key = `${cell.r}_${cell.c}`;
            const prev = prevCellDataRef.current.get(key);
            const cur = cell.v?.v;
            if (prev !== cur) {
              handleCellUpdated(cell.r, cell.c, cur);
            }
          }
        }
      }
    },
    [handleCellUpdated],
  );

  // ── Locale mapping ──

  const lang = useMemo(() => {
    if (locale?.startsWith('pt')) return 'pt-BR' as const;
    if (locale?.startsWith('es')) return 'es' as const;
    if (locale?.startsWith('zh')) return 'zh' as const;
    return 'en' as const;
  }, [locale]);

  // ── Computed height ──

  const computedHeight = typeof height === 'number' ? `${height}px` : height;
  const computedWidth = typeof width === 'number' ? `${width}px` : width;

  // ── Render ──

  const spreadsheetContent = (
    <Box
      className={className}
      style={{
        height: computedHeight,
        width: computedWidth,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <Workbook
        data={sheetData}
        onChange={handleChange}
        allowEdit={editable && !readOnly}
        showToolbar={showToolbar}
        showFormulaBar={showFormulaBar}
        showSheetTabs={showSheetTabs}
        lang={lang}
      />
    </Box>
  );

  if (label || description) {
    return (
      <Input.Wrapper label={label} description={description}>
        {spreadsheetContent}
      </Input.Wrapper>
    );
  }

  return spreadsheetContent;
}

export const ArchbaseSpreadsheet = React.memo(ArchbaseSpreadsheetInner) as typeof ArchbaseSpreadsheetInner;

(ArchbaseSpreadsheet as any).displayName = 'ArchbaseSpreadsheet';
