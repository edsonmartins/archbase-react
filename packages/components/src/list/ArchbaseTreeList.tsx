import React, { forwardRef, useCallback, useMemo, useState, ReactNode } from 'react';
import {
  Box,
  Table,
  Checkbox,
  Text,
  ActionIcon,
  Group,
  ScrollArea,
  MantineColor,
  MantineSize,
} from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/core';

export interface ArchbaseTreeListColumn<T> {
  /** ID da coluna */
  id: string;
  /** Header da coluna */
  header: string;
  /** Accessor do campo */
  accessor: keyof T | ((row: T) => any);
  /** Largura da coluna */
  width?: number | string;
  /** Alinhamento */
  align?: 'left' | 'center' | 'right';
  /** Renderizador customizado */
  render?: (value: any, row: T, index: number) => ReactNode;
  /** Se é a coluna de árvore (com indent e expand) */
  isTreeColumn?: boolean;
}

export interface ArchbaseTreeListProps<T extends object, ID> {
  /** Dados da árvore */
  data?: T[];
  /** Fonte de dados */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Colunas */
  columns: ArchbaseTreeListColumn<T>[];
  /** Função para obter filhos de um item */
  getSubRows?: (row: T) => T[] | undefined;
  /** Campo que contém os filhos */
  childrenField?: string;
  /** Campo de ID único */
  idField?: keyof T;
  /** IDs expandidos (controlado) */
  expandedIds?: Set<any>;
  /** IDs expandidos por padrão */
  defaultExpandedIds?: Set<any>;
  /** Se deve expandir todos por padrão */
  defaultExpandAll?: boolean;
  /** Callback ao expandir/colapsar */
  onExpandChange?: (expandedIds: Set<any>) => void;
  /** Profundidade máxima */
  maxDepth?: number;
  /** Indentação por nível em pixels */
  indentSize?: number;
  /** Se deve mostrar linhas de conexão */
  showLines?: boolean;
  /** Se permite seleção */
  selectable?: boolean;
  /** Modo de seleção */
  selectionMode?: 'single' | 'multiple';
  /** IDs selecionados */
  selectedIds?: Set<any>;
  /** Callback ao selecionar */
  onSelectionChange?: (selectedIds: Set<any>) => void;
  /** Cor de destaque */
  highlightColor?: MantineColor;
  /** Altura da linha */
  rowHeight?: number;
  /** Altura máxima (scroll) */
  maxHeight?: number | string;
  /** Tamanho */
  size?: MantineSize;
  /** Se deve ter bordas */
  withBorder?: boolean;
  /** Se deve ter listras */
  striped?: boolean;
  /** Se deve destacar no hover */
  highlightOnHover?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

interface FlattenedRow<T> {
  data: T;
  id: any;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  parentId: any | null;
}

function ArchbaseTreeListInner<T extends object, ID>(
  {
    data: controlledData,
    dataSource,
    columns,
    getSubRows,
    childrenField = 'children',
    idField = 'id' as keyof T,
    expandedIds: controlledExpandedIds,
    defaultExpandedIds,
    defaultExpandAll = false,
    onExpandChange,
    maxDepth = Infinity,
    indentSize = 24,
    showLines = false,
    selectable = false,
    selectionMode = 'single',
    selectedIds: controlledSelectedIds,
    onSelectionChange,
    highlightColor = 'blue',
    rowHeight = 40,
    maxHeight,
    size = 'sm',
    withBorder = true,
    striped = false,
    highlightOnHover = true,
    className,
    style,
  }: ArchbaseTreeListProps<T, ID>,
  ref: React.Ref<HTMLDivElement>
) {
  const [internalData, setInternalData] = useState<T[]>([]);
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<any>>(
    defaultExpandedIds || new Set()
  );
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<any>>(new Set());

  // Dados atuais
  const currentData = controlledData || internalData;
  const expandedIds = controlledExpandedIds || internalExpandedIds;
  const selectedIds = controlledSelectedIds || internalSelectedIds;

  // Carrega dados do DataSource
  const loadDataSourceData = useCallback(() => {
    if (dataSource) {
      const records = dataSource.browseRecords();
      setInternalData(records as T[]);
    }
  }, [dataSource]);

  const dataSourceEvent = useCallback(
    (event: DataSourceEvent<T>) => {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll
      ) {
        loadDataSourceData();
      }
    },
    [loadDataSourceData]
  );

  useArchbaseDidMount(() => {
    loadDataSourceData();
    if (dataSource) {
      dataSource.addListener(dataSourceEvent);
    }

    // Expande todos se defaultExpandAll
    if (defaultExpandAll && currentData.length > 0) {
      const allIds = new Set<any>();
      const collectIds = (items: T[]) => {
        items.forEach((item) => {
          allIds.add(item[idField]);
          const children = getSubRows?.(item) || (item as any)[childrenField];
          if (children?.length) {
            collectIds(children);
          }
        });
      };
      collectIds(currentData);
      setInternalExpandedIds(allIds);
    }
  });

  useArchbaseWillUnmount(() => {
    if (dataSource) {
      dataSource.removeListener(dataSourceEvent);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceData();
  }, []);

  // Função para obter filhos
  const getChildren = useCallback(
    (row: T): T[] | undefined => {
      if (getSubRows) {
        return getSubRows(row);
      }
      return (row as any)[childrenField];
    },
    [childrenField, getSubRows]
  );

  // Achata a árvore para renderização
  const flattenedRows = useMemo((): FlattenedRow<T>[] => {
    const result: FlattenedRow<T>[] = [];

    const flatten = (items: T[], depth: number, parentId: any | null) => {
      if (depth > maxDepth) return;

      items.forEach((item) => {
        const id = item[idField];
        const children = getChildren(item);
        const hasChildren = children && children.length > 0;
        const isExpanded = expandedIds.has(id);

        result.push({
          data: item,
          id,
          depth,
          hasChildren,
          isExpanded,
          parentId,
        });

        if (hasChildren && isExpanded) {
          flatten(children, depth + 1, id);
        }
      });
    };

    flatten(currentData, 0, null);
    return result;
  }, [currentData, expandedIds, getChildren, idField, maxDepth]);

  // Toggle expand
  const toggleExpand = useCallback(
    (id: any) => {
      const newExpanded = new Set(expandedIds);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }

      if (controlledExpandedIds === undefined) {
        setInternalExpandedIds(newExpanded);
      }
      onExpandChange?.(newExpanded);
    },
    [controlledExpandedIds, expandedIds, onExpandChange]
  );

  // Toggle seleção
  const toggleSelection = useCallback(
    (id: any) => {
      let newSelected: Set<any>;

      if (selectionMode === 'single') {
        newSelected = selectedIds.has(id) ? new Set() : new Set([id]);
      } else {
        newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
      }

      if (controlledSelectedIds === undefined) {
        setInternalSelectedIds(newSelected);
      }
      onSelectionChange?.(newSelected);
    },
    [controlledSelectedIds, onSelectionChange, selectedIds, selectionMode]
  );

  // Obtém valor de uma coluna
  const getCellValue = useCallback((row: T, column: ArchbaseTreeListColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  }, []);

  // Encontra a coluna de árvore
  const treeColumnIndex = useMemo(() => {
    const index = columns.findIndex((col) => col.isTreeColumn);
    return index >= 0 ? index : 0;
  }, [columns]);

  return (
    <Box ref={ref} className={className} style={style}>
      <ScrollArea style={{ maxHeight }}>
        <Table
          withTableBorder={withBorder}
          withColumnBorders
          striped={striped}
          highlightOnHover={highlightOnHover}
          verticalSpacing="xs"
          horizontalSpacing="sm"
        >
          <Table.Thead>
            <Table.Tr>
              {selectable && <Table.Th style={{ width: 40 }} />}
              {columns.map((column) => (
                <Table.Th
                  key={column.id}
                  style={{
                    width: column.width,
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {flattenedRows.map((row, rowIndex) => {
              const isSelected = selectedIds.has(row.id);

              return (
                <Table.Tr
                  key={row.id}
                  style={{
                    height: rowHeight,
                    backgroundColor: isSelected
                      ? `var(--mantine-color-${highlightColor}-1)`
                      : undefined,
                  }}
                >
                  {selectable && (
                    <Table.Td>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleSelection(row.id)}
                        size={size}
                      />
                    </Table.Td>
                  )}
                  {columns.map((column, colIndex) => {
                    const value = getCellValue(row.data, column);
                    const isTreeCol = colIndex === treeColumnIndex;

                    return (
                      <Table.Td
                        key={column.id}
                        style={{
                          textAlign: column.align || 'left',
                        }}
                      >
                        <Group gap={4} wrap="nowrap">
                          {isTreeCol && (
                            <>
                              {/* Indent spacer */}
                              <Box style={{ width: row.depth * indentSize }} />

                              {/* Lines (optional) */}
                              {showLines && row.depth > 0 && (
                                <Box
                                  style={{
                                    position: 'absolute',
                                    left: row.depth * indentSize - indentSize / 2,
                                    top: 0,
                                    bottom: '50%',
                                    width: 1,
                                    borderLeft: '1px solid var(--mantine-color-gray-4)',
                                  }}
                                />
                              )}

                              {/* Expand button */}
                              {row.hasChildren ? (
                                <ActionIcon
                                  variant="subtle"
                                  size="xs"
                                  onClick={() => toggleExpand(row.id)}
                                >
                                  {row.isExpanded ? (
                                    <IconChevronDown size={14} />
                                  ) : (
                                    <IconChevronRight size={14} />
                                  )}
                                </ActionIcon>
                              ) : (
                                <Box style={{ width: 22 }} />
                              )}
                            </>
                          )}

                          {/* Cell content */}
                          {column.render ? (
                            column.render(value, row.data, rowIndex)
                          ) : (
                            <Text size={size} truncate>
                              {value?.toString() || ''}
                            </Text>
                          )}
                        </Group>
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}

export const ArchbaseTreeList = forwardRef(ArchbaseTreeListInner) as unknown as <
  T extends object = any,
  ID = string
>(
  props: ArchbaseTreeListProps<T, ID> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

(ArchbaseTreeList as any).displayName = 'ArchbaseTreeList';
