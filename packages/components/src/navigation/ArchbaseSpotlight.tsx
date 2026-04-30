import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import {
  Modal,
  TextInput,
  Stack,
  Group,
  Text,
  UnstyledButton,
  ThemeIcon,
  Badge,
  Kbd,
  Box,
  ScrollArea,
  Divider,
  Center,
  Loader,
} from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export interface SpotlightAction {
  /** ID único da ação */
  id: string;
  /** Título da ação */
  title: string;
  /** Descrição opcional */
  description?: string;
  /** Ícone */
  icon?: ReactNode;
  /** Grupo/categoria */
  group?: string;
  /** Atalho de teclado */
  shortcut?: string[];
  /** Callback ao selecionar */
  onTrigger: () => void;
  /** Desabilitado */
  disabled?: boolean;
  /** Palavras-chave para busca */
  keywords?: string[];
  /** Badge */
  badge?: string;
  /** Cor do badge */
  badgeColor?: string;
}

export interface ArchbaseSpotlightProps {
  /** Array de ações */
  actions: SpotlightAction[];
  /** Atalho para abrir (padrão: mod+K) */
  shortcut?: string;
  /** Placeholder da busca */
  searchPlaceholder?: string;
  /** Mensagem quando não encontra resultados */
  nothingFoundMessage?: string;
  /** Limite de resultados exibidos */
  limit?: number;
  /** Filtrar ações por permissão */
  filterByPermission?: (action: SpotlightAction) => boolean;
  /** Agrupar ações */
  groupActions?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Aberto (controlado) */
  opened?: boolean;
  /** Callback ao mudar estado */
  onOpenChange?: (opened: boolean) => void;
  /** Fechar ao selecionar ação */
  closeOnActionTrigger?: boolean;
  /** Destacar match na busca */
  highlightQuery?: boolean;
  /** Ações recentes */
  recentActions?: string[];
  /** Callback ao usar ação (para rastrear recentes) */
  onActionUsed?: (actionId: string) => void;
  /** Máximo de ações recentes */
  maxRecentActions?: number;
}

// =============================================================================
// Fuzzy Search
// =============================================================================

function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

function searchActions(actions: SpotlightAction[], query: string): SpotlightAction[] {
  if (!query.trim()) return actions;

  const queryLower = query.toLowerCase();

  return actions.filter((action) => {
    // Match title
    if (action.title.toLowerCase().includes(queryLower)) return true;
    if (fuzzyMatch(action.title, query)) return true;

    // Match description
    if (action.description?.toLowerCase().includes(queryLower)) return true;

    // Match keywords
    if (action.keywords?.some((kw) => kw.toLowerCase().includes(queryLower))) return true;

    // Match group
    if (action.group?.toLowerCase().includes(queryLower)) return true;

    return false;
  });
}

// =============================================================================
// Highlight Component
// =============================================================================

interface HighlightTextProps {
  text: string;
  query: string;
  highlight?: boolean;
}

function HighlightText({ text, query, highlight = true }: HighlightTextProps) {
  if (!highlight || !query.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text key={index} span fw={700} c="blue">
            {part}
          </Text>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

// =============================================================================
// Action Item Component
// =============================================================================

interface ActionItemProps {
  action: SpotlightAction;
  query: string;
  isSelected: boolean;
  highlightQuery: boolean;
  onClick: () => void;
}

function ActionItem({ action, query, isSelected, highlightQuery, onClick }: ActionItemProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      disabled={action.disabled}
      style={{
        display: 'block',
        width: '100%',
        padding: '10px 12px',
        borderRadius: 'var(--mantine-radius-sm)',
        backgroundColor: isSelected
          ? 'var(--mantine-color-blue-light)'
          : 'transparent',
        opacity: action.disabled ? 0.5 : 1,
        cursor: action.disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <Group gap="sm" wrap="nowrap">
        {action.icon && (
          <ThemeIcon variant="light" size="md" color="blue">
            {action.icon}
          </ThemeIcon>
        )}
        <Box style={{ flex: 1 }}>
          <Group gap="xs">
            <Text size="sm" fw={500}>
              <HighlightText
                text={action.title}
                query={query}
                highlight={highlightQuery}
              />
            </Text>
            {action.badge && (
              <Badge size="xs" color={action.badgeColor}>
                {action.badge}
              </Badge>
            )}
          </Group>
          {action.description && (
            <Text size="xs" c="dimmed">
              <HighlightText
                text={action.description}
                query={query}
                highlight={highlightQuery}
              />
            </Text>
          )}
        </Box>
        {action.shortcut && (
          <Group gap={4}>
            {action.shortcut.map((key, index) => (
              <Kbd key={index} size="xs">
                {key}
              </Kbd>
            ))}
          </Group>
        )}
        {isSelected && <IconArrowRight size={16} style={{ opacity: 0.5 }} />}
      </Group>
    </UnstyledButton>
  );
}

// =============================================================================
// ArchbaseSpotlight Component
// =============================================================================

export function ArchbaseSpotlight({
  actions,
  shortcut = 'mod+K',
  searchPlaceholder = 'Buscar ações...',
  nothingFoundMessage = 'Nenhuma ação encontrada',
  limit = 10,
  filterByPermission,
  groupActions = true,
  loading = false,
  opened: controlledOpened,
  onOpenChange,
  closeOnActionTrigger = true,
  highlightQuery = true,
  recentActions = [],
  onActionUsed,
  maxRecentActions = 5,
}: ArchbaseSpotlightProps) {
  const [internalOpened, setInternalOpened] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isControlled = controlledOpened !== undefined;
  const opened = isControlled ? controlledOpened : internalOpened;

  const setOpened = useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setInternalOpened(value);
      }
      if (!value) {
        setQuery('');
        setSelectedIndex(0);
      }
    },
    [isControlled, onOpenChange]
  );

  // Register global shortcut
  useHotkeys([[shortcut, () => setOpened(true)]]);

  // Filter and search actions
  const filteredActions = useMemo(() => {
    let result = actions;

    // Apply permission filter
    if (filterByPermission) {
      result = result.filter(filterByPermission);
    }

    // Apply search
    result = searchActions(result, query);

    // Apply limit
    return result.slice(0, limit);
  }, [actions, filterByPermission, query, limit]);

  // Group actions
  const groupedActions = useMemo(() => {
    if (!groupActions) return { '': filteredActions };

    const groups: Record<string, SpotlightAction[]> = {};

    // Add recent actions group
    if (!query && recentActions.length > 0) {
      const recent = actions
        .filter((a) => recentActions.includes(a.id))
        .slice(0, maxRecentActions);
      if (recent.length > 0) {
        groups['Recentes'] = recent;
      }
    }

    // Group remaining actions
    filteredActions.forEach((action) => {
      const group = action.group || 'Ações';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(action);
    });

    return groups;
  }, [filteredActions, groupActions, query, recentActions, actions, maxRecentActions]);

  // Flat list for keyboard navigation
  const flatActions = useMemo(() => {
    return Object.values(groupedActions).flat();
  }, [groupedActions]);

  // Handle action trigger
  const handleActionTrigger = useCallback(
    (action: SpotlightAction) => {
      if (action.disabled) return;

      action.onTrigger();
      onActionUsed?.(action.id);

      if (closeOnActionTrigger) {
        setOpened(false);
      }
    },
    [closeOnActionTrigger, setOpened, onActionUsed]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatActions.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const action = flatActions[selectedIndex];
        if (action) {
          handleActionTrigger(action);
        }
      }
    },
    [flatActions, selectedIndex, handleActionTrigger]
  );

  // Reset selection on query change
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      withCloseButton={false}
      padding={0}
      size="lg"
      radius="md"
      centered
      overlayProps={{ backgroundOpacity: 0.5, blur: 3 }}
    >
      <Box p="sm" onKeyDown={handleKeyDown}>
        <TextInput
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          leftSection={<IconSearch size={18} />}
          rightSection={loading ? <Loader size="xs" /> : null}
          size="md"
          autoFocus
          data-autofocus
        />
      </Box>

      <Divider />

      <ScrollArea.Autosize mah={400} type="scroll">
        <Box p="xs">
          {flatActions.length === 0 ? (
            <Center py="xl">
              <Text c="dimmed" size="sm">
                {nothingFoundMessage}
              </Text>
            </Center>
          ) : (
            <Stack gap={4}>
              {Object.entries(groupedActions).map(([group, groupActionsList]) => (
                <Box key={group}>
                  {group && groupActions && (
                    <Text size="xs" fw={500} c="dimmed" px="xs" py={4}>
                      {group}
                    </Text>
                  )}
                  {groupActionsList.map((action) => {
                    const globalIndex = flatActions.findIndex((a) => a.id === action.id);
                    return (
                      <ActionItem
                        key={action.id}
                        action={action}
                        query={query}
                        isSelected={globalIndex === selectedIndex}
                        highlightQuery={highlightQuery}
                        onClick={() => handleActionTrigger(action)}
                      />
                    );
                  })}
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </ScrollArea.Autosize>

      <Divider />

      <Group justify="space-between" p="xs">
        <Group gap="xs">
          <Kbd size="xs">↑↓</Kbd>
          <Text size="xs" c="dimmed">
            navegar
          </Text>
        </Group>
        <Group gap="xs">
          <Kbd size="xs">Enter</Kbd>
          <Text size="xs" c="dimmed">
            selecionar
          </Text>
        </Group>
        <Group gap="xs">
          <Kbd size="xs">Esc</Kbd>
          <Text size="xs" c="dimmed">
            fechar
          </Text>
        </Group>
      </Group>
    </Modal>
  );
}

// =============================================================================
// Hook useArchbaseSpotlight
// =============================================================================

export interface UseArchbaseSpotlightOptions {
  shortcut?: string;
}

export function useArchbaseSpotlight(options: UseArchbaseSpotlightOptions = {}) {
  const { shortcut = 'mod+K' } = options;
  const [opened, setOpened] = useState(false);

  useHotkeys([[shortcut, () => setOpened(true)]]);

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened((prev) => !prev), []);

  return {
    opened,
    open,
    close,
    toggle,
    setOpened,
  };
}

export default ArchbaseSpotlight;
