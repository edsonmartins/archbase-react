import { useState } from 'react';
import { ActionIcon, Button, Group, Select, Stack, TagsInput, Text } from '@mantine/core';
import type {
  AnalyticsMeta,
  FilterOperator,
  MemberLabeler,
  QueryFilter,
} from '@archbase/analytics-core';

/** Operadores que dispensam valor. */
const SEM_VALOR: readonly FilterOperator[] = ['set', 'notSet'];

const OPERADORES: Array<{ value: FilterOperator; label: string }> = [
  { value: 'equals', label: 'igual a' },
  { value: 'notEquals', label: 'diferente de' },
  { value: 'contains', label: 'contem' },
  { value: 'notContains', label: 'nao contem' },
  { value: 'startsWith', label: 'comeca com' },
  { value: 'endsWith', label: 'termina com' },
  { value: 'gt', label: 'maior que' },
  { value: 'gte', label: 'maior ou igual a' },
  { value: 'lt', label: 'menor que' },
  { value: 'lte', label: 'menor ou igual a' },
  { value: 'set', label: 'preenchido' },
  { value: 'notSet', label: 'vazio' },
];

export interface FilterBuilderProps {
  filters: QueryFilter[];
  meta: AnalyticsMeta;
  labeler: MemberLabeler;
  locale: string;
  onAdd: (filter: QueryFilter) => void;
  onUpdate: (index: number, filter: QueryFilter) => void;
  onRemove: (index: number) => void;
  /**
   * Sugestao de valores para um membro. Opcional: sem ela o campo continua
   * aceitando digitacao livre, apenas sem sugerir.
   */
  onSuggestValues?: (member: string) => Promise<string[]>;
  addLabel?: string;
  emptyLabel?: string;
}

export function FilterBuilder({
  filters,
  meta,
  labeler,
  locale,
  onAdd,
  onUpdate,
  onRemove,
  onSuggestValues,
  addLabel = 'Adicionar filtro',
  emptyLabel = 'Nenhum filtro aplicado.',
}: FilterBuilderProps) {
  const filtraveis = meta.members.filter((member) => member.kind !== 'measure');

  const opcoesDeMembro = filtraveis.map((member) => ({
    value: member.name,
    label: labeler.label(member, locale),
  }));

  const primeiro = filtraveis[0];

  return (
    <Stack gap="xs">
      {filters.length === 0 && (
        <Text size="xs" c="dimmed">
          {emptyLabel}
        </Text>
      )}

      {filters.map((filter, index) => (
        <FilterRow
          key={`${filter.member}-${index}`}
          filter={filter}
          options={opcoesDeMembro}
          onChange={(next) => onUpdate(index, next)}
          onRemove={() => onRemove(index)}
          onSuggestValues={onSuggestValues}
        />
      ))}

      <Group>
        <Button
          size="xs"
          variant="light"
          disabled={primeiro === undefined}
          onClick={() =>
            primeiro && onAdd({ member: primeiro.name, operator: 'equals', values: [] })
          }
        >
          {addLabel}
        </Button>
      </Group>
    </Stack>
  );
}

interface FilterRowProps {
  filter: QueryFilter;
  options: Array<{ value: string; label: string }>;
  onChange: (filter: QueryFilter) => void;
  onRemove: () => void;
  onSuggestValues?: (member: string) => Promise<string[]>;
}

function FilterRow({ filter, options, onChange, onRemove, onSuggestValues }: FilterRowProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const carregarSugestoes = () => {
    if (!onSuggestValues) return;
    // Falha de sugestao nao pode derrubar o filtro: o campo segue aceitando
    // digitacao livre e o usuario nao fica bloqueado.
    onSuggestValues(filter.member)
      .then(setSuggestions)
      .catch(() => setSuggestions([]));
  };

  const precisaDeValor = !SEM_VALOR.includes(filter.operator);

  return (
    <Group gap="xs" align="flex-start" wrap="nowrap">
      <Select
        size="xs"
        data={options}
        value={filter.member}
        searchable
        w={180}
        onChange={(value) =>
          value && onChange({ ...filter, member: value, values: [] })
        }
      />

      <Select
        size="xs"
        data={OPERADORES}
        value={filter.operator}
        w={150}
        onChange={(value) =>
          value && onChange({ ...filter, operator: value as FilterOperator })
        }
      />

      {precisaDeValor && (
        <TagsInput
          size="xs"
          style={{ flex: 1 }}
          data={suggestions}
          value={filter.values ?? []}
          onFocus={carregarSugestoes}
          onChange={(values) => onChange({ ...filter, values })}
          placeholder="Valores"
        />
      )}

      <ActionIcon size="sm" variant="subtle" color="gray" onClick={onRemove} aria-label="Remover">
        ×
      </ActionIcon>
    </Group>
  );
}
