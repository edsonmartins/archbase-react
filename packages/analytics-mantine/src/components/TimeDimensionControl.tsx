import { ActionIcon, Button, Group, Select, Stack, Text } from '@mantine/core';
import {
  GRANULARITIES,
  type AnalyticsMeta,
  type DateRange,
  type Granularity,
  type MemberLabeler,
  type QueryTimeDimension,
} from '@archbase/analytics-core';

const INTERVALOS_RELATIVOS = [
  'today',
  'yesterday',
  'this week',
  'this month',
  'this quarter',
  'this year',
  'last 7 days',
  'last 30 days',
  'last 90 days',
  'last month',
  'last quarter',
  'last year',
];

const ROTULO_GRANULARIDADE: Record<Granularity, string> = {
  second: 'segundo',
  minute: 'minuto',
  hour: 'hora',
  day: 'dia',
  week: 'semana',
  month: 'mes',
  quarter: 'trimestre',
  year: 'ano',
};

export interface TimeDimensionControlProps {
  timeDimension: QueryTimeDimension | undefined;
  meta: AnalyticsMeta;
  labeler: MemberLabeler;
  locale: string;
  onChange: (dimension: string | null, granularity?: Granularity, dateRange?: DateRange) => void;
  onChangeCompare: (ranges: DateRange[]) => void;
  /** Falso quando a consulta nao tem dimensao temporal. */
  canCompare: boolean;
  labels?: { dimension?: string; granularity?: string; period?: string; addCompare?: string };
}

/**
 * Controle de dimensao temporal, granularidade e intervalos de comparacao.
 *
 * A comparacao e emitida como multiplos intervalos na mesma consulta — e
 * propriedade da consulta, nao do modelo. A biblioteca nao procura measure de
 * comparacao declarada nem infere vinculo entre membros por convencao de nome.
 */
export function TimeDimensionControl({
  timeDimension,
  meta,
  labeler,
  locale,
  onChange,
  onChangeCompare,
  canCompare,
  labels,
}: TimeDimensionControlProps) {
  const opcoes = meta.timeDimensions.map((member) => ({
    value: member.name,
    label: labeler.label(member, locale),
  }));

  const comparacoes = timeDimension?.compareDateRange ?? [];

  const rotuloDeIntervalo = (range: DateRange): string =>
    Array.isArray(range) ? `${range[0]} - ${range[1]}` : range;

  return (
    <Stack gap="xs">
      <Group gap="xs" align="flex-end" wrap="nowrap">
        <Select
          size="xs"
          label={labels?.dimension ?? 'Dimensao temporal'}
          data={opcoes}
          value={timeDimension?.dimension ?? null}
          clearable
          w={180}
          onChange={(value) =>
            onChange(value, timeDimension?.granularity, timeDimension?.dateRange)
          }
        />

        <Select
          size="xs"
          label={labels?.granularity ?? 'Granularidade'}
          data={GRANULARITIES.map((granularity) => ({
            value: granularity,
            label: ROTULO_GRANULARIDADE[granularity],
          }))}
          value={timeDimension?.granularity ?? null}
          disabled={!timeDimension}
          clearable
          w={130}
          onChange={(value) =>
            timeDimension &&
            onChange(
              timeDimension.dimension,
              (value ?? undefined) as Granularity | undefined,
              timeDimension.dateRange,
            )
          }
        />

        <Select
          size="xs"
          label={labels?.period ?? 'Periodo'}
          data={INTERVALOS_RELATIVOS}
          value={typeof timeDimension?.dateRange === 'string' ? timeDimension.dateRange : null}
          disabled={!timeDimension}
          clearable
          searchable
          w={160}
          onChange={(value) =>
            timeDimension &&
            onChange(timeDimension.dimension, timeDimension.granularity, value ?? undefined)
          }
        />
      </Group>

      {/* Sem dimensao temporal nao ha o que comparar, e a ausencia da opcao
          nao e um erro a ser explicado. */}
      {canCompare && (
        <Stack gap={4}>
          {comparacoes.map((range, index) => (
            <Group key={index} gap="xs">
              <Select
                size="xs"
                data={INTERVALOS_RELATIVOS}
                value={typeof range === 'string' ? range : null}
                searchable
                w={180}
                onChange={(value) =>
                  value &&
                  onChangeCompare(comparacoes.map((item, i) => (i === index ? value : item)))
                }
              />
              <Text size="xs" c="dimmed">
                {rotuloDeIntervalo(range)}
              </Text>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                aria-label="Remover comparacao"
                onClick={() => onChangeCompare(comparacoes.filter((_, i) => i !== index))}
              >
                ×
              </ActionIcon>
            </Group>
          ))}

          <Group>
            <Button
              size="xs"
              variant="subtle"
              onClick={() => onChangeCompare([...comparacoes, 'last month'])}
            >
              {labels?.addCompare ?? 'Comparar com outro periodo'}
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
