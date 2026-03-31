/**
 * ArchbaseLightGrid — grid leve baseado em sheet-happens com integração ao DataSource.
 * Ideal para exibição e edição tabular de alto desempenho com milhares de linhas.
 * @status experimental
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Text, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import Sheet from 'sheet-happens';
import 'sheet-happens/dist/index.css';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDataSourceListener } from '@archbase/data';
import type { CSSProperties } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ArchbaseLightGridColumn<T> {
  /** Campo do registro (keyof T ou path com notação de ponto) */
  field: keyof T | string;
  /** Texto do cabeçalho */
  header: string;
  /** Largura da coluna em pixels */
  width?: number;
  /** Tipo de dado da coluna */
  type?: 'text' | 'number' | 'date' | 'boolean' | 'currency' | 'custom';
  /** Formato (ex.: "DD/MM/YYYY", "0,0.00", "R$ #.##0,00") */
  format?: string;
  /** Se a coluna e editavel */
  editable?: boolean;
  /** Se a coluna deve ficar fixa a esquerda */
  frozen?: boolean;
  /** Alinhamento do texto */
  align?: 'left' | 'center' | 'right';
}

export interface ArchbaseLightGridProps<T, ID> {
  /** Fonte de dados */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Definicao das colunas */
  columns: ArchbaseLightGridColumn<T>[];
  /** Dados standalone (usado quando nao ha dataSource) */
  data?: T[];
  /** Habilita edicao de celulas */
  editable?: boolean;
  /** Altura do grid */
  height?: string | number;
  /** Largura do grid */
  width?: string | number;
  /** Exibe numeracao de linhas */
  showRowNumbers?: boolean;
  /** Callback quando uma celula e alterada */
  onCellChange?: (record: T, field: string, oldValue: any, newValue: any) => void;
  /** Callback quando a selecao muda */
  onSelectionChange?: (selection: { row: number; col: number }[]) => void;
  /** Somente leitura (sobrescreve editable) */
  readOnly?: boolean;
  /** Label exibido acima do grid */
  label?: string;
  /** Descricao exibida abaixo do label */
  description?: string;
  /** Estilo CSS do container */
  style?: CSSProperties;
  /** Classe CSS do container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

function setNestedValue(obj: any, path: string, value: any): void {
  if (!obj || !path) return;
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (current[parts[i]] == null) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

function formatCellValue(
  value: any,
  type: ArchbaseLightGridColumn<any>['type'],
  format?: string,
): string {
  if (value == null) return '';

  switch (type) {
    case 'boolean':
      return value ? 'Sim' : 'Nao';

    case 'number':
      if (typeof value === 'number') {
        if (format) {
          try {
            const decimals = (format.split('.')[1] || '').length;
            return value.toLocaleString('pt-BR', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
          } catch {
            return String(value);
          }
        }
        return value.toLocaleString('pt-BR');
      }
      return String(value);

    case 'currency':
      if (typeof value === 'number') {
        return value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      }
      return String(value);

    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
      }
      if (typeof value === 'string') {
        try {
          const d = new Date(value);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('pt-BR');
          }
        } catch {
          // fall through
        }
      }
      return String(value);

    case 'text':
    default:
      return String(value);
  }
}

function parseCellInput(
  input: string,
  type: ArchbaseLightGridColumn<any>['type'],
): any {
  if (input === '' || input == null) return null;

  switch (type) {
    case 'boolean':
      return (
        input.toLowerCase() === 'true' ||
        input.toLowerCase() === 'sim' ||
        input === '1'
      );

    case 'number':
    case 'currency': {
      const cleaned = input.replace(/[R$\s.]/g, '').replace(',', '.');
      const num = Number(cleaned);
      return isNaN(num) ? input : num;
    }

    case 'date': {
      // Tenta parsear DD/MM/YYYY
      const parts = input.split('/');
      if (parts.length === 3) {
        const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        if (!isNaN(d.getTime())) return d.toISOString();
      }
      // Tenta ISO
      const iso = new Date(input);
      if (!isNaN(iso.getTime())) return iso.toISOString();
      return input;
    }

    default:
      return input;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ArchbaseLightGridInner<T, ID>(
  props: ArchbaseLightGridProps<T, ID>,
) {
  const {
    dataSource,
    columns,
    data: standaloneData,
    editable = false,
    height = '400px',
    width = '100%',
    showRowNumbers = true,
    onCellChange,
    onSelectionChange,
    readOnly = false,
    label,
    description,
    style,
    className,
  } = props;

  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';
  const forceUpdate = useForceUpdate();

  const [records, setRecords] = useState<T[]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const recordsRef = useRef<T[]>([]);

  // Sincroniza dados do DataSource ou standalone
  const syncRecords = useCallback(() => {
    if (dataSource) {
      const dsRecords = dataSource.browseRecords() || [];
      recordsRef.current = dsRecords;
      setRecords(dsRecords);
    } else if (standaloneData) {
      recordsRef.current = standaloneData;
      setRecords(standaloneData);
    }
  }, [dataSource, standaloneData]);

  // Numero de colunas congeladas
  const frozenCols = useMemo(
    () => columns.filter((c) => c.frozen).length,
    [columns],
  );

  // Listener do DataSource
  const dataSourceEvent = useCallback(
    (event: DataSourceEvent<T>) => {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.refreshData ||
        event.type === DataSourceEventNames.afterAppend ||
        event.type === DataSourceEventNames.afterRemove ||
        event.type === DataSourceEventNames.afterInsert ||
        event.type === DataSourceEventNames.afterSave ||
        event.type === DataSourceEventNames.afterCancel ||
        event.type === DataSourceEventNames.afterEdit
      ) {
        syncRecords();
        forceUpdate();
      }

      if (event.type === DataSourceEventNames.afterScroll) {
        if (dataSource) {
          const idx = dataSource.getCurrentIndex();
          setSelectedRow(idx);
        }
      }

      if (event.type === DataSourceEventNames.fieldChanged) {
        syncRecords();
        forceUpdate();
      }
    },
    [dataSource, syncRecords, forceUpdate],
  );

  // Ref estavel para o listener
  const dataSourceEventRef = useRef(dataSourceEvent);
  useEffect(() => {
    dataSourceEventRef.current = dataSourceEvent;
  }, [dataSourceEvent]);

  const stableListener = useCallback((event: DataSourceEvent<T>) => {
    dataSourceEventRef.current(event);
  }, []);

  // Registra listener no DataSource
  useEffect(() => {
    if (dataSource) {
      dataSource.addListener(stableListener);
      syncRecords();
      setSelectedRow(dataSource.getCurrentIndex());
    }
    return () => {
      if (dataSource) {
        dataSource.removeListener(stableListener);
      }
    };
  }, [(dataSource as any)?.uuid || dataSource?.getName()]);

  // Sincroniza dados standalone
  useEffect(() => {
    if (!dataSource && standaloneData) {
      syncRecords();
    }
  }, [standaloneData, dataSource]);

  // -----------------------------------------------------------------------
  // sheet-happens callbacks
  // -----------------------------------------------------------------------

  const cellWidth = useCallback(
    (col: number): number => {
      if (col < 0 || col >= columns.length) return 100;
      return columns[col].width ?? 100;
    },
    [columns],
  );

  const cellHeight = useCallback((): number => {
    return 28;
  }, []);

  const sourceData = useCallback(
    (row: number, col: number): string => {
      if (row < 0 || row >= records.length) return '';
      if (col < 0 || col >= columns.length) return '';

      const record = records[row];
      const column = columns[col];
      const field = String(column.field);
      const rawValue = getNestedValue(record, field);

      return formatCellValue(rawValue, column.type, column.format);
    },
    [records, columns],
  );

  // editData is a getter in sheet-happens: (row, col) => string
  // Returns the current editing value for a cell (empty string for no edit state)
  const editDataMap = useRef<Record<string, string>>({});

  const editData = useCallback(
    (row: number, col: number): string => {
      const key = `${row}:${col}`;
      return editDataMap.current[key] ?? '';
    },
    [],
  );

  // onChange handles cell value changes in sheet-happens
  const handleCellChanges = useCallback(
    (changes: Array<{ x: number; y: number; value: string | number }>) => {
      for (const change of changes) {
        const { x: col, y: row, value: rawValue } = change;
        const value = String(rawValue);
        if (readOnly || !editable) return;
        if (row < 0 || row >= records.length) return;
        if (col < 0 || col >= columns.length) return;

        const column = columns[col];
        if (column.editable === false) return;

        const record = records[row];
        const field = String(column.field);
        const oldValue = getNestedValue(record, field);
        const newValue = parseCellInput(value, column.type);

        if (dataSource) {
          if (dataSource.getCurrentIndex() !== row) {
            dataSource.gotoRecord(row);
          }
          dataSource.setFieldValue(field, newValue);
        } else {
          setNestedValue(record, field, newValue);
          setRecords([...records]);
        }

        if (onCellChange) {
          onCellChange(record, field, oldValue, newValue);
        }
      }
    },
    [readOnly, editable, records, columns, dataSource, onCellChange],
  );

  const isReadOnly = useCallback(
    (row: number, col: number): boolean => {
      if (readOnly || !editable) return true;
      if (col < 0 || col >= columns.length) return true;
      const column = columns[col];
      return column.editable === false;
    },
    [readOnly, editable, columns],
  );

  // Headers
  const headerData = useCallback(
    (col: number): string => {
      if (col < 0 || col >= columns.length) return '';
      return columns[col].header;
    },
    [columns],
  );

  // Selection change
  const onSelectionChanged = useCallback(
    (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => {
      // Navega para a linha selecionada no DataSource
      if (dataSource && y1 >= 0 && y1 < records.length) {
        if (dataSource.getCurrentIndex() !== y1) {
          dataSource.gotoRecord(y1);
        }
      }
      setSelectedRow(y1);

      if (onSelectionChange) {
        const selection: { row: number; col: number }[] = [];
        for (let r = Math.min(y1, y2); r <= Math.max(y1, y2); r++) {
          for (let c = Math.min(x1, x2); c <= Math.max(x1, x2); c++) {
            selection.push({ row: r, col: c });
          }
        }
        onSelectionChange(selection);
      }
    },
    [dataSource, records.length, onSelectionChange],
  );

  // Cell style para dark mode e alinhamento
  const cellStyle = useCallback(
    (
      x: number,
      y: number,
    ): Record<string, any> => {
      const style: Record<string, any> = {};

      if (isDark) {
        style.color = theme.colors.dark[0];
        style.backgroundColor =
          y === selectedRow
            ? theme.colors.dark[5]
            : theme.colors.dark[7];
      } else {
        style.backgroundColor =
          y === selectedRow
            ? theme.colors.blue[0]
            : '#ffffff';
      }

      if (x >= 0 && x < columns.length) {
        const column = columns[x];
        if (column.align) {
          style.textAlign = column.align;
        } else if (
          column.type === 'number' ||
          column.type === 'currency'
        ) {
          style.textAlign = 'right';
        }
      }

      return style;
    },
    [isDark, theme, columns, selectedRow],
  );

  // Header style para dark mode
  const headerStyle = useCallback(
    (): Record<string, any> => {
      if (isDark) {
        return {
          color: theme.colors.dark[0],
          backgroundColor: theme.colors.dark[6],
          fontWeight: 600,
        };
      }
      return {
        fontWeight: 600,
      };
    },
    [isDark, theme],
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const containerStyle: CSSProperties = {
    width,
    height,
    display: 'flex',
    flexDirection: 'column',
    ...style,
  };

  return (
    <Box className={className} style={containerStyle}>
      {label && (
        <Text fw={500} size="sm" mb={2}>
          {label}
        </Text>
      )}
      {description && (
        <Text size="xs" c="dimmed" mb={4}>
          {description}
        </Text>
      )}
      <Box style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Sheet
          sourceData={sourceData}
          editData={editData}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          columnHeaders={headerData}
          cellStyle={cellStyle}
          readOnly={isReadOnly}
          onChange={handleCellChanges}
          onSelectionChanged={onSelectionChanged}
          sheetStyle={{
            freezeColumns: frozenCols,
          } as any}
        />
      </Box>
    </Box>
  );
}

export const ArchbaseLightGrid = React.memo(ArchbaseLightGridInner) as typeof ArchbaseLightGridInner;

(ArchbaseLightGrid as any).displayName = 'ArchbaseLightGrid';
