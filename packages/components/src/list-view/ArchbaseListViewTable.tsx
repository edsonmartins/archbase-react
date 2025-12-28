import React, { ReactNode } from 'react';
import { ListViewTable } from '@gfazioli/mantine-list-view-table';

export interface ArchbaseListViewColumn<T = any> {
  /**
   * Identificador único da coluna (key)
   */
  key: keyof T | (string & NonNullable<unknown>);
  /**
   * Título da coluna
   */
  title?: ReactNode;
  /**
   * Largura da coluna em pixels
   */
  width?: string | number;
  /**
   * Renderizador customizado para a célula
   */
  renderCell?: (record: T, index: number) => ReactNode;
  /**
   * Alinhamento do conteúdo
   */
  textAlign?: 'left' | 'center' | 'right';
  /**
   * Se a coluna é ordenável
   */
  sortable?: boolean;
  /**
   * Se a coluna é redimensionável
   */
  resizable?: boolean;
}

export interface ArchbaseListViewProps<T = any> {
  /**
   * Dados a serem exibidos
   */
  data: T[];
  /**
   * Colunas da tabela
   */
  columns: ArchbaseListViewColumn<T>[];
  /**
   * Callback quando uma linha é clicada
   */
  onRowClick?: (record: T, index: number) => void;
  /**
   * Callback quando uma linha é duplamente clicada
   */
  onRowDoubleClick?: (record: T, index: number) => void;
  /**
   * Altura da tabela em pixels
   */
  height?: number | string;
  /**
   * Largura da tabela
   */
  width?: number | string;
  /**
   * Borda ao redor da tabela
   */
  withTableBorder?: boolean;
  /**
   * Borda nas colunas
   */
  withColumnBorders?: boolean;
  /**
   * Borda nas linhas
   */
  withRowBorders?: boolean;
  /**
   * Row key (para identificar linhas únicas)
   */
  rowKey?: keyof T | ((record: T, index: number) => React.Key);
  /**
   * Estilo adicional do container
   */
  style?: React.CSSProperties;
  /**
   * ClassName adicional
   */
  className?: string;
}

/**
 * Componente ArchbaseListViewTable
 *
 * Wrapper sobre @gfazioli/mantine-list-view-table para criar tabelas no estilo
 * Finder do macOS, com suporte a ordenação, redimensionamento de colunas e mais.
 *
 * @example
 * ```tsx
 * interface FileSystemItem {
 *   id: string;
 *   name: string;
 *   size: number;
 *   type: 'file' | 'folder';
 * }
 *
 * const columns: ArchbaseListViewColumn<FileSystemItem>[] = [
 *   { key: 'name', title: 'Nome', width: 200 },
 *   { key: 'size', title: 'Tamanho', width: 100, textAlign: 'right' },
 *   { key: 'type', title: 'Tipo', width: 100 },
 * ];
 *
 * <ArchbaseListViewTable
 *   data={fileSystemData}
 *   columns={columns}
 *   onRowClick={(item, index) => console.log('Clicked:', item)}
 *   height={400}
 * />
 * ```
 */
export function ArchbaseListViewTable<T = any>({
  data,
  columns,
  onRowClick,
  onRowDoubleClick,
  height,
  width,
  withTableBorder = true,
  withColumnBorders = true,
  withRowBorders = false,
  rowKey,
  style,
  className,
}: ArchbaseListViewProps<T>) {
  // Converter colunas para o formato esperado pelo ListViewTable
  const listViewColumns = columns.map((col) => ({
    ...col,
  }));

  return (
    <ListViewTable
      columns={listViewColumns}
      data={data}
      onRowClick={onRowClick}
      onRowDoubleClick={onRowDoubleClick}
      height={height}
      width={width}
      withTableBorder={withTableBorder}
      withColumnBorders={withColumnBorders}
      withRowBorders={withRowBorders}
      rowKey={rowKey}
      style={style}
      className={className}
    />
  );
}
