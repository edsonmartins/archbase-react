import type { ReactNode } from 'react';
import { Group, Pill, Stack, Text } from '@mantine/core';
import type { AnalyticsMeta, AnalyticsQuery, MemberLabeler } from '@archbase/analytics-core';

export interface QueryCanvasProps {
  query: AnalyticsQuery;
  meta: AnalyticsMeta;
  labeler: MemberLabeler;
  locale: string;
  onRemoveMeasure: (member: string) => void;
  onRemoveDimension: (member: string) => void;
  onRemoveTimeDimension: () => void;
  labels?: { measures?: string; dimensions?: string; time?: string; empty?: string };
}

/**
 * Superficie que mostra a consulta corrente e permite retirar membros dela.
 *
 * Controlado: nao guarda estado de consulta. Toda alteracao sobe para o hook de
 * exploracao, que e a fonte unica — a mesma que alimenta o deep link e a
 * consulta salva.
 */
export function QueryCanvas({
  query,
  meta,
  labeler,
  locale,
  onRemoveMeasure,
  onRemoveDimension,
  onRemoveTimeDimension,
  labels,
}: QueryCanvasProps) {
  const label = (name: string): string => {
    const member = meta.byName.get(name);
    return member ? labeler.label(member, locale) : name;
  };

  const measures = query.measures ?? [];
  const dimensions = query.dimensions ?? [];
  const timeDimension = query.timeDimensions?.[0];
  const vazio = measures.length === 0 && dimensions.length === 0 && timeDimension === undefined;

  if (vazio) {
    return (
      <Text size="sm" c="dimmed">
        {labels?.empty ?? 'Selecione uma metrica ou dimensao para comecar.'}
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      {measures.length > 0 && (
        <Row title={labels?.measures ?? 'Metricas'}>
          {measures.map((member) => (
            <Pill key={member} withRemoveButton onRemove={() => onRemoveMeasure(member)}>
              {label(member)}
            </Pill>
          ))}
        </Row>
      )}

      {dimensions.length > 0 && (
        <Row title={labels?.dimensions ?? 'Dimensoes'}>
          {dimensions.map((member) => (
            <Pill key={member} withRemoveButton onRemove={() => onRemoveDimension(member)}>
              {label(member)}
            </Pill>
          ))}
        </Row>
      )}

      {timeDimension && (
        <Row title={labels?.time ?? 'Tempo'}>
          <Pill withRemoveButton onRemove={onRemoveTimeDimension}>
            {label(timeDimension.dimension)}
            {timeDimension.granularity ? ` · ${timeDimension.granularity}` : ''}
          </Pill>
        </Row>
      )}
    </Stack>
  );
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Group gap="xs" align="center">
      <Text size="xs" c="dimmed" w={80}>
        {title}
      </Text>
      <Group gap={4}>{children}</Group>
    </Group>
  );
}
