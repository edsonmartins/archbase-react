import { useMemo, useState } from 'react';
import { Group, Table, Text, UnstyledButton } from '@mantine/core';
import type {
  MemberLabeler,
  NormalizedResult,
  ResultCell,
  ResultColumn,
  ResultRow,
  AnalyticsMeta,
  ValueFormatter,
} from '@archbase/analytics-core';
import { useVirtualRows } from './useVirtualRows';

const ALTURA_LINHA = 34;

export interface ResultTableProps {
  result: NormalizedResult;
  meta: AnalyticsMeta;
  formatter: ValueFormatter;
  labeler: MemberLabeler;
  locale: string;
  height?: number;
  /**
   * Detalhamento de uma celula. A biblioteca oferece a afordancia; o que
   * "detalhar" significa pertence ao produto consumidor, que conhece o modelo.
   */
  onDrill?: (row: ResultRow, column: ResultColumn) => void;
}

export function ResultTable({
  result,
  meta,
  formatter,
  labeler,
  locale,
  height = 420,
  onDrill,
}: ResultTableProps) {
  const [sort, setSort] = useState<{ column: string; desc: boolean } | null>(null);

  const rows = useMemo(() => {
    if (!sort) return result.rows;
    const column = result.columns.find((item) => item.member === sort.column);
    if (!column) return result.rows;

    // Ordenacao pela porta, sobre o valor bruto: ordenar pelo texto formatado
    // colocaria "R$ 1.000,00" antes de "R$ 9,00".
    const context = {
      format: column.format,
      precision: column.precision,
      memberName: column.member,
      locale,
    };
    return [...result.rows].sort((a, b) => {
      const order = formatter.compare(a[sort.column], b[sort.column], context);
      return sort.desc ? -order : order;
    });
  }, [result.rows, result.columns, sort, formatter, locale]);

  const virtual = useVirtualRows({
    rowCount: rows.length,
    rowHeight: ALTURA_LINHA,
    estimatedViewport: height,
  });

  const headerLabel = (column: ResultColumn): string => {
    const member = meta.byName.get(column.member);
    const base = member ? labeler.label(member, locale) : column.title;
    return column.granularity ? `${base} (${column.granularity})` : base;
  };

  const cell = (value: ResultCell, column: ResultColumn): string =>
    formatter.format(value, {
      format: column.format,
      precision: column.precision,
      memberName: column.member,
      locale,
    });

  return (
    <div ref={virtual.scrollRef} style={{ height, overflow: 'auto' }}>
      <Table stickyHeader highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {result.columns.map((column) => (
              <Table.Th key={column.member}>
                <UnstyledButton
                  onClick={() =>
                    setSort((current) =>
                      current?.column === column.member
                        ? { column: column.member, desc: !current.desc }
                        : { column: column.member, desc: false },
                    )
                  }
                >
                  <Group gap={4} wrap="nowrap">
                    <Text size="xs" fw={600}>
                      {headerLabel(column)}
                    </Text>
                    {sort?.column === column.member && (
                      <Text size="xs" c="dimmed">
                        {sort.desc ? '▾' : '▴'}
                      </Text>
                    )}
                  </Group>
                </UnstyledButton>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {virtual.paddingTop > 0 && (
            <Table.Tr style={{ height: virtual.paddingTop }} aria-hidden>
              <Table.Td colSpan={result.columns.length} p={0} />
            </Table.Tr>
          )}

          {rows.slice(virtual.startIndex, virtual.endIndex).map((row, index) => (
            <Table.Tr key={virtual.startIndex + index} style={{ height: ALTURA_LINHA }}>
              {result.columns.map((column) => (
                <Table.Td
                  key={column.member}
                  onClick={onDrill ? () => onDrill(row, column) : undefined}
                  style={{
                    cursor: onDrill ? 'pointer' : undefined,
                    textAlign: column.kind === 'measure' ? 'right' : 'left',
                  }}
                >
                  {cell(row[column.member] ?? null, column)}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}

          {virtual.paddingBottom > 0 && (
            <Table.Tr style={{ height: virtual.paddingBottom }} aria-hidden>
              <Table.Td colSpan={result.columns.length} p={0} />
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
}
