import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconFilter, IconFilterFilled } from '@tabler/icons-react';

export interface ValueFilterMenuProps {
  member: string;
  label: string;
  /** Valores atualmente incluidos (filtro `equals`); `undefined` = sem filtro. */
  selectedValues?: string[];
  /** Distintos do membro; sem ela, o menu nao tem o que listar. */
  onSuggestValues?: (member: string) => Promise<string[]>;
  /** `null` limpa o filtro; lista aplica um `equals` com os valores marcados. */
  onApply: (values: string[] | null) => void;
  labels?: { search?: string; all?: string; none?: string; apply?: string; clear?: string };
}

/**
 * Filtro rapido por valor (inspirado no react-pivottable): um popover com a lista
 * de distintos do membro em checkboxes. Marcar/desmarcar inclui/exclui; aplicar
 * grava um filtro `equals`. Marcar todos equivale a sem filtro (limpa).
 */
export function ValueFilterMenu({
  member,
  label,
  selectedValues,
  onSuggestValues,
  onApply,
  labels,
}: ValueFilterMenuProps) {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [todos, setTodos] = useState<string[]>([]);
  const [marcados, setMarcados] = useState<Set<string>>(new Set());
  const [busca, setBusca] = useState('');

  const ativo = selectedValues !== undefined && selectedValues.length > 0;

  const abrir = () => {
    setAberto(true);
    if (!onSuggestValues) return;
    setCarregando(true);
    onSuggestValues(member)
      .then((valores) => {
        setTodos(valores);
        // Reflete o filtro atual; sem filtro, tudo marcado.
        setMarcados(new Set(selectedValues ?? valores));
      })
      .catch(() => setTodos([]))
      .finally(() => setCarregando(false));
  };

  const alterna = (valor: string, on: boolean) => {
    setMarcados((atual) => {
      const proximo = new Set(atual);
      if (on) proximo.add(valor);
      else proximo.delete(valor);
      return proximo;
    });
  };

  const aplicar = () => {
    // Todos marcados (ou nenhum listado) => sem restricao.
    const restringe = marcados.size > 0 && marcados.size < todos.length;
    onApply(restringe ? todos.filter((v) => marcados.has(v)) : null);
    setAberto(false);
  };

  const limpar = () => {
    onApply(null);
    setAberto(false);
  };

  const visiveis = busca.trim()
    ? todos.filter((v) => v.toLowerCase().includes(busca.trim().toLowerCase()))
    : todos;

  return (
    <Popover opened={aberto} onChange={setAberto} position="right-start" withArrow shadow="md" width={240}>
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant={ativo ? 'light' : 'subtle'}
          color={ativo ? 'blue' : 'gray'}
          aria-label={`Filtrar ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            aberto ? setAberto(false) : abrir();
          }}
        >
          {ativo ? <IconFilterFilled size={14} /> : <IconFilter size={14} />}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown onClick={(e) => e.stopPropagation()}>
        <Stack gap="xs">
          <Text size="xs" fw={600}>
            {label}
          </Text>
          <TextInput
            size="xs"
            placeholder={labels?.search ?? 'Buscar valor'}
            value={busca}
            onChange={(e) => setBusca(e.currentTarget.value)}
          />
          <Group gap="xs">
            <Button
              size="compact-xs"
              variant="subtle"
              onClick={() => setMarcados(new Set(todos))}
            >
              {labels?.all ?? 'Todos'}
            </Button>
            <Button size="compact-xs" variant="subtle" onClick={() => setMarcados(new Set())}>
              {labels?.none ?? 'Nenhum'}
            </Button>
          </Group>

          <ScrollArea.Autosize mah={200}>
            {carregando ? (
              <Text size="xs" c="dimmed">
                Carregando…
              </Text>
            ) : visiveis.length === 0 ? (
              <Text size="xs" c="dimmed">
                Sem valores.
              </Text>
            ) : (
              <Stack gap={4}>
                {visiveis.map((valor) => (
                  <Checkbox
                    key={valor}
                    size="xs"
                    label={valor}
                    checked={marcados.has(valor)}
                    onChange={(e) => alterna(valor, e.currentTarget.checked)}
                  />
                ))}
              </Stack>
            )}
          </ScrollArea.Autosize>

          <Group gap="xs" justify="flex-end">
            {ativo && (
              <Button size="compact-xs" variant="subtle" color="gray" onClick={limpar}>
                {labels?.clear ?? 'Limpar'}
              </Button>
            )}
            <Button size="compact-xs" onClick={aplicar}>
              {labels?.apply ?? 'Aplicar'}
            </Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
