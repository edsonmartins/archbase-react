import React, { useCallback, useState } from 'react';
import { Button, ActionIcon, Tooltip, MantineSize, MantineColor } from '@mantine/core';
import { IconFileSpreadsheet, IconDownload } from '@tabler/icons-react';
import * as XLSX from 'xlsx';
import { getI18nextInstance } from '@archbase/core';

export interface ExcelExportColumn {
  /** Campo/key do dado */
  field: string;
  /** Label do cabeçalho */
  header: string;
  /** Largura da coluna em caracteres */
  width?: number;
  /** Formatador de valor */
  formatter?: (value: any, row: any) => string | number;
  /** Se a coluna deve ser incluída na exportação */
  visible?: boolean;
}

export interface ArchbaseDataGridExcelExportProps<T = any> {
  /** Dados a serem exportados */
  data: T[];
  /** Colunas a serem exportadas */
  columns: ExcelExportColumn[];
  /** Nome do arquivo (sem extensão) */
  filename?: string;
  /** Nome da planilha */
  sheetName?: string;
  /** Se deve incluir apenas dados filtrados (se aplicável) */
  includeFiltered?: boolean;
  /** Formato de data para colunas de data */
  dateFormat?: string;
  /** Formato de número para colunas numéricas */
  numberFormat?: string;
  /** Se deve incluir cabeçalhos */
  includeHeaders?: boolean;
  /** Callback antes da exportação */
  onBeforeExport?: (data: T[]) => T[] | Promise<T[]>;
  /** Callback após exportação bem sucedida */
  onExportSuccess?: () => void;
  /** Callback em caso de erro */
  onExportError?: (error: Error) => void;
  /** Variante do botão */
  variant?: 'button' | 'icon';
  /** Label do botão */
  label?: string;
  /** Tamanho do botão */
  size?: MantineSize;
  /** Cor do botão */
  color?: MantineColor;
  /** Se o botão está desabilitado */
  disabled?: boolean;
  /** Tooltip */
  tooltip?: string;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export function ArchbaseDataGridExcelExport<T = any>({
  data,
  columns,
  filename = 'export',
  sheetName = 'Dados',
  includeFiltered = true,
  dateFormat = 'dd/mm/yyyy',
  numberFormat,
  includeHeaders = true,
  onBeforeExport,
  onExportSuccess,
  onExportError,
  variant = 'button',
  label,
  size = 'sm',
  color,
  disabled = false,
  tooltip,
  className,
  style,
}: ArchbaseDataGridExcelExportProps<T>) {
  const t = getI18nextInstance().t;
  const [isExporting, setIsExporting] = useState(false);

  const formatValue = useCallback(
    (value: any, column: ExcelExportColumn, row: T): any => {
      if (value === null || value === undefined) {
        return '';
      }

      // Usa formatador customizado se disponível
      if (column.formatter) {
        return column.formatter(value, row);
      }

      // Formata datas
      if (value instanceof Date) {
        return value.toLocaleDateString('pt-BR');
      }

      // Formata booleanos
      if (typeof value === 'boolean') {
        return value ? 'Sim' : 'Não';
      }

      // Retorna valor como está
      return value;
    },
    []
  );

  const exportToExcel = useCallback(async () => {
    setIsExporting(true);

    try {
      // Filtra colunas visíveis
      const visibleColumns = columns.filter((col) => col.visible !== false);

      // Prepara dados
      let exportData = data;
      if (onBeforeExport) {
        exportData = await onBeforeExport(data);
      }

      // Cria array de arrays para o worksheet
      const wsData: any[][] = [];

      // Adiciona cabeçalhos
      if (includeHeaders) {
        wsData.push(visibleColumns.map((col) => col.header));
      }

      // Adiciona dados
      exportData.forEach((row) => {
        const rowData = visibleColumns.map((col) => {
          const value = (row as any)[col.field];
          return formatValue(value, col, row);
        });
        wsData.push(rowData);
      });

      // Cria worksheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Define larguras das colunas
      const colWidths = visibleColumns.map((col) => ({
        wch: col.width || Math.max(col.header.length, 15),
      }));
      ws['!cols'] = colWidths;

      // Cria workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Gera arquivo e faz download
      const timestamp = new Date().toISOString().slice(0, 10);
      const finalFilename = `${filename}_${timestamp}.xlsx`;

      XLSX.writeFile(wb, finalFilename);

      onExportSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erro ao exportar');
      onExportError?.(err);
    } finally {
      setIsExporting(false);
    }
  }, [
    columns,
    data,
    filename,
    formatValue,
    includeHeaders,
    onBeforeExport,
    onExportError,
    onExportSuccess,
    sheetName,
  ]);

  const buttonLabel = label || t('archbase:Exportar Excel');
  const tooltipText = tooltip || t('archbase:Exportar dados para Excel');

  if (variant === 'icon') {
    return (
      <Tooltip label={tooltipText}>
        <ActionIcon
          variant="subtle"
          size={size}
          color={color}
          onClick={exportToExcel}
          loading={isExporting}
          disabled={disabled || data.length === 0}
          className={className}
          style={style}
          aria-label={buttonLabel}
        >
          <IconFileSpreadsheet size={18} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={tooltipText} disabled={!tooltip}>
      <Button
        variant="light"
        size={size}
        color={color}
        leftSection={<IconFileSpreadsheet size={18} />}
        onClick={exportToExcel}
        loading={isExporting}
        disabled={disabled || data.length === 0}
        className={className}
        style={style}
      >
        {buttonLabel}
      </Button>
    </Tooltip>
  );
}

ArchbaseDataGridExcelExport.displayName = 'ArchbaseDataGridExcelExport';

// Hook para usar a exportação programaticamente
export function useArchbaseExcelExport<T = any>() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportToExcel = useCallback(
    async (
      data: T[],
      columns: ExcelExportColumn[],
      options: {
        filename?: string;
        sheetName?: string;
        includeHeaders?: boolean;
      } = {}
    ) => {
      const { filename = 'export', sheetName = 'Dados', includeHeaders = true } = options;

      setIsExporting(true);
      setError(null);

      try {
        const visibleColumns = columns.filter((col) => col.visible !== false);
        const wsData: any[][] = [];

        if (includeHeaders) {
          wsData.push(visibleColumns.map((col) => col.header));
        }

        data.forEach((row) => {
          const rowData = visibleColumns.map((col) => {
            const value = (row as any)[col.field];
            if (col.formatter) {
              return col.formatter(value, row);
            }
            if (value instanceof Date) {
              return value.toLocaleDateString('pt-BR');
            }
            if (typeof value === 'boolean') {
              return value ? 'Sim' : 'Não';
            }
            return value ?? '';
          });
          wsData.push(rowData);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = visibleColumns.map((col) => ({
          wch: col.width || Math.max(col.header.length, 15),
        }));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        const timestamp = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `${filename}_${timestamp}.xlsx`);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro ao exportar');
        setError(error);
        return false;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportToExcel, isExporting, error };
}
