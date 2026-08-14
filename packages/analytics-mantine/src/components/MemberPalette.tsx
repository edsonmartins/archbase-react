import { useMemo, useState } from 'react';
import { Badge, Group, ScrollArea, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import type {
  AnalyticsMember,
  AnalyticsMeta,
  MemberLabeler,
  ValueFormatter,
} from '@archbase/analytics-core';

const SEM_GRUPO = '—';

export interface MemberPaletteProps {
  meta: AnalyticsMeta;
  /** Membros ja presentes na consulta. */
  selected: string[];
  onToggle: (member: AnalyticsMember) => void;
  labeler: MemberLabeler;
  formatter: ValueFormatter;
  locale: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
}

/**
 * Paleta de membros, com busca e agrupamento pelo metadado de grupo.
 *
 * Renderiza exatamente o que a introspeccao trouxe. Nao ha filtro de
 * visibilidade aqui: membro fora do escopo do usuario nao chega, e ocultar por
 * logica propria seria assumir uma responsabilidade que e da camada semantica.
 */
export function MemberPalette({
  meta,
  selected,
  onToggle,
  labeler,
  formatter,
  locale,
  searchPlaceholder = 'Buscar',
  emptyLabel = 'Nenhum membro encontrado.',
}: MemberPaletteProps) {
  const [search, setSearch] = useState('');
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const groups = useMemo(() => {
    const term = search.trim().toLocaleLowerCase(locale);
    const context = { format: 'text' as const, memberName: '', locale };

    const matches = meta.members.filter((member) => {
      if (member.kind === 'segment') return false;
      if (term === '') return true;
      return labeler.label(member, locale).toLocaleLowerCase(locale).includes(term);
    });

    const byGroup = new Map<string, AnalyticsMember[]>();
    for (const member of matches) {
      const key = member.group ?? SEM_GRUPO;
      const bucket = byGroup.get(key);
      if (bucket) bucket.push(member);
      else byGroup.set(key, [member]);
    }

    // Ordenacao pela porta: comparacao crua erraria a acentuacao em pt-BR.
    return [...byGroup.entries()]
      .sort(([a], [b]) => formatter.compare(a, b, context))
      .map(([group, members]) => ({
        group,
        members: [...members].sort((a, b) =>
          formatter.compare(labeler.label(a, locale), labeler.label(b, locale), context),
        ),
      }));
  }, [meta, search, labeler, formatter, locale]);

  return (
    <Stack gap="xs" h="100%">
      <TextInput
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        placeholder={searchPlaceholder}
        size="xs"
      />

      <ScrollArea style={{ flex: 1 }}>
        {groups.length === 0 ? (
          <Text size="xs" c="dimmed" p="xs">
            {emptyLabel}
          </Text>
        ) : (
          <Stack gap="sm">
            {groups.map(({ group, members }) => (
              <Stack key={group} gap={2}>
                <Text size="xs" fw={600} c="dimmed" tt="uppercase">
                  {group}
                </Text>
                {members.map((member) => (
                  <MemberRow
                    key={member.name}
                    member={member}
                    label={labeler.label(member, locale)}
                    description={labeler.description?.(member, locale)}
                    active={selectedSet.has(member.name)}
                    onToggle={onToggle}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Stack>
  );
}

interface MemberRowProps {
  member: AnalyticsMember;
  label: string;
  description: string | undefined;
  active: boolean;
  onToggle: (member: AnalyticsMember) => void;
}

function MemberRow({ member, label, description, active, onToggle }: MemberRowProps) {
  return (
    <UnstyledButton
      onClick={() => onToggle(member)}
      title={description}
      px="xs"
      py={4}
      style={(theme) => ({
        borderRadius: theme.radius.sm,
        backgroundColor: active ? theme.colors.blue[0] : undefined,
      })}
    >
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Text size="sm" truncate>
          {label}
        </Text>
        <Badge size="xs" variant="light" color={member.kind === 'measure' ? 'blue' : 'gray'}>
          {member.kind === 'measure' ? 'M' : member.kind === 'timeDimension' ? 'T' : 'D'}
        </Badge>
      </Group>
    </UnstyledButton>
  );
}
