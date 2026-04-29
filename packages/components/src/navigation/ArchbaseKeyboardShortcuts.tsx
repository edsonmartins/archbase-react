import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  Modal,
  Table,
  Text,
  Badge,
  Group,
  Stack,
  Kbd,
  Box,
  TextInput,
  ScrollArea,
  Title,
} from '@mantine/core';
import { useHotkeys, useDisclosure } from '@mantine/hooks';
import { IconKeyboard, IconSearch } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export interface KeyboardShortcut {
  /** Identificador único */
  id: string;
  /** Combinação de teclas (formato Mantine: 'mod+K', 'shift+Enter', etc.) */
  keys: string;
  /** Handler do atalho */
  handler: () => void;
  /** Descrição do atalho */
  description: string;
  /** Grupo do atalho */
  group?: string;
  /** Se o atalho está desabilitado */
  disabled?: boolean;
  /** Escopo (global ou específico) */
  scope?: string;
}

export interface ArchbaseKeyboardShortcutsContextValue {
  /** Atalhos registrados */
  shortcuts: KeyboardShortcut[];
  /** Registrar um atalho */
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  /** Remover um atalho */
  unregisterShortcut: (id: string) => void;
  /** Atualizar um atalho */
  updateShortcut: (id: string, updates: Partial<KeyboardShortcut>) => void;
  /** Abrir modal de ajuda */
  openHelpModal: () => void;
  /** Fechar modal de ajuda */
  closeHelpModal: () => void;
  /** Se o modal está aberto */
  isHelpModalOpen: boolean;
}

export interface ArchbaseKeyboardShortcutsProviderProps {
  children: ReactNode;
  /** Tecla para abrir o modal de ajuda (padrão: '?') */
  helpKey?: string;
  /** Desabilitar modal de ajuda */
  disableHelpModal?: boolean;
  /** Atalhos iniciais */
  initialShortcuts?: Omit<KeyboardShortcut, 'id'>[];
}

export interface ArchbaseKeyboardShortcutsModalProps {
  /** Se o modal está aberto */
  opened: boolean;
  /** Callback ao fechar */
  onClose: () => void;
  /** Atalhos a exibir */
  shortcuts: KeyboardShortcut[];
  /** Título do modal */
  title?: string;
  /** Mostrar campo de busca */
  searchable?: boolean;
}

export interface UseArchbaseRegisterShortcutOptions {
  /** Descrição do atalho */
  description: string;
  /** Grupo do atalho */
  group?: string;
  /** Se o atalho está desabilitado */
  disabled?: boolean;
  /** Escopo do atalho */
  scope?: string;
}

// =============================================================================
// Context
// =============================================================================

const ArchbaseKeyboardShortcutsContext = createContext<ArchbaseKeyboardShortcutsContextValue | null>(null);

export function useArchbaseKeyboardShortcuts(): ArchbaseKeyboardShortcutsContextValue {
  const context = useContext(ArchbaseKeyboardShortcutsContext);
  if (!context) {
    throw new Error('useArchbaseKeyboardShortcuts must be used within ArchbaseKeyboardShortcutsProvider');
  }
  return context;
}

// =============================================================================
// Utilities
// =============================================================================

let shortcutIdCounter = 0;
function generateShortcutId(): string {
  return `shortcut-${++shortcutIdCounter}`;
}

function parseKeys(keys: string): string[] {
  return keys.split('+').map((key) => {
    const lowerKey = key.toLowerCase().trim();
    switch (lowerKey) {
      case 'mod':
        return navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl';
      case 'ctrl':
        return 'Ctrl';
      case 'alt':
        return 'Alt';
      case 'shift':
        return 'Shift';
      case 'enter':
        return 'Enter';
      case 'escape':
      case 'esc':
        return 'Esc';
      case 'space':
        return 'Space';
      case 'backspace':
        return 'Backspace';
      case 'delete':
        return 'Del';
      case 'arrowup':
        return '↑';
      case 'arrowdown':
        return '↓';
      case 'arrowleft':
        return '←';
      case 'arrowright':
        return '→';
      default:
        return key.toUpperCase();
    }
  });
}

function KeyDisplay({ keys }: { keys: string }) {
  const parsedKeys = parseKeys(keys);

  return (
    <Group gap={4}>
      {parsedKeys.map((key, index) => (
        <React.Fragment key={index}>
          <Kbd size="sm">{key}</Kbd>
          {index < parsedKeys.length - 1 && (
            <Text size="xs" c="dimmed">+</Text>
          )}
        </React.Fragment>
      ))}
    </Group>
  );
}

// =============================================================================
// ArchbaseKeyboardShortcutsProvider
// =============================================================================

export function ArchbaseKeyboardShortcutsProvider({
  children,
  helpKey = 'shift+?',
  disableHelpModal = false,
  initialShortcuts = [],
}: ArchbaseKeyboardShortcutsProviderProps) {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>(() =>
    initialShortcuts.map((s) => ({ ...s, id: generateShortcutId() }))
  );
  const [helpModalOpened, { open: openHelpModal, close: closeHelpModal }] = useDisclosure(false);

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    setShortcuts((prev) => {
      // Remove existing shortcut with same id
      const filtered = prev.filter((s) => s.id !== shortcut.id);
      return [...filtered, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateShortcut = useCallback((id: string, updates: Partial<KeyboardShortcut>) => {
    setShortcuts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  // Register help modal shortcut
  useHotkeys([
    [helpKey, () => !disableHelpModal && openHelpModal()],
  ]);

  // Register all shortcuts with useHotkeys
  const hotkeyBindings = useMemo(() => {
    return shortcuts
      .filter((s) => !s.disabled)
      .map((s) => [s.keys, s.handler] as [string, () => void]);
  }, [shortcuts]);

  useHotkeys(hotkeyBindings);

  const contextValue = useMemo<ArchbaseKeyboardShortcutsContextValue>(
    () => ({
      shortcuts,
      registerShortcut,
      unregisterShortcut,
      updateShortcut,
      openHelpModal,
      closeHelpModal,
      isHelpModalOpen: helpModalOpened,
    }),
    [shortcuts, registerShortcut, unregisterShortcut, updateShortcut, openHelpModal, closeHelpModal, helpModalOpened]
  );

  return (
    <ArchbaseKeyboardShortcutsContext.Provider value={contextValue}>
      {children}
      {!disableHelpModal && (
        <ArchbaseKeyboardShortcutsModal
          opened={helpModalOpened}
          onClose={closeHelpModal}
          shortcuts={shortcuts}
        />
      )}
    </ArchbaseKeyboardShortcutsContext.Provider>
  );
}

// =============================================================================
// ArchbaseKeyboardShortcutsModal
// =============================================================================

export function ArchbaseKeyboardShortcutsModal({
  opened,
  onClose,
  shortcuts,
  title = 'Atalhos de Teclado',
  searchable = true,
}: ArchbaseKeyboardShortcutsModalProps) {
  const [search, setSearch] = useState('');

  // Group shortcuts
  const groupedShortcuts = useMemo(() => {
    const filtered = search
      ? shortcuts.filter(
          (s) =>
            s.description.toLowerCase().includes(search.toLowerCase()) ||
            s.keys.toLowerCase().includes(search.toLowerCase()) ||
            s.group?.toLowerCase().includes(search.toLowerCase())
        )
      : shortcuts;

    const groups: Record<string, KeyboardShortcut[]> = {};
    filtered.forEach((shortcut) => {
      const group = shortcut.group || 'Geral';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(shortcut);
    });

    return groups;
  }, [shortcuts, search]);

  const groupNames = Object.keys(groupedShortcuts).sort();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconKeyboard size={20} />
          <Title order={4}>{title}</Title>
        </Group>
      }
      size="lg"
      centered
    >
      <Stack gap="md">
        {searchable && (
          <TextInput
            placeholder="Buscar atalhos..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        <ScrollArea.Autosize mah={400}>
          {groupNames.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              Nenhum atalho encontrado
            </Text>
          ) : (
            <Stack gap="lg">
              {groupNames.map((groupName) => (
                <Box key={groupName}>
                  <Badge variant="light" mb="xs">
                    {groupName}
                  </Badge>
                  <Table striped highlightOnHover withTableBorder>
                    <Table.Tbody>
                      {groupedShortcuts[groupName].map((shortcut) => (
                        <Table.Tr
                          key={shortcut.id}
                          style={{
                            opacity: shortcut.disabled ? 0.5 : 1,
                          }}
                        >
                          <Table.Td style={{ width: 140 }}>
                            <KeyDisplay keys={shortcut.keys} />
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{shortcut.description}</Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Box>
              ))}
            </Stack>
          )}
        </ScrollArea.Autosize>

        <Text size="xs" c="dimmed" ta="center">
          Pressione <Kbd size="xs">Shift</Kbd> + <Kbd size="xs">?</Kbd> para abrir esta ajuda
        </Text>
      </Stack>
    </Modal>
  );
}

// =============================================================================
// useArchbaseRegisterShortcut Hook
// =============================================================================

export function useArchbaseRegisterShortcut(
  keys: string,
  handler: () => void,
  options: UseArchbaseRegisterShortcutOptions
): void {
  const { registerShortcut, unregisterShortcut } = useArchbaseKeyboardShortcuts();

  useEffect(() => {
    const id = generateShortcutId();
    const shortcut: KeyboardShortcut = {
      id,
      keys,
      handler,
      description: options.description,
      group: options.group,
      disabled: options.disabled,
      scope: options.scope,
    };

    registerShortcut(shortcut);

    return () => {
      unregisterShortcut(id);
    };
  }, [keys, handler, options.description, options.group, options.disabled, options.scope, registerShortcut, unregisterShortcut]);
}

// =============================================================================
// useArchbaseShortcutScope Hook
// =============================================================================

export interface UseArchbaseShortcutScopeReturn {
  /** Registrar atalho no escopo */
  register: (keys: string, handler: () => void, description: string, group?: string) => () => void;
  /** Desabilitar todos os atalhos do escopo */
  disable: () => void;
  /** Habilitar todos os atalhos do escopo */
  enable: () => void;
}

export function useArchbaseShortcutScope(scope: string): UseArchbaseShortcutScopeReturn {
  const { registerShortcut, unregisterShortcut, updateShortcut, shortcuts } = useArchbaseKeyboardShortcuts();
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const register = useCallback(
    (keys: string, handler: () => void, description: string, group?: string) => {
      const id = generateShortcutId();
      const shortcut: KeyboardShortcut = {
        id,
        keys,
        handler,
        description,
        group,
        scope,
      };

      registerShortcut(shortcut);
      setRegisteredIds((prev) => [...prev, id]);

      return () => {
        unregisterShortcut(id);
        setRegisteredIds((prev) => prev.filter((i) => i !== id));
      };
    },
    [scope, registerShortcut, unregisterShortcut]
  );

  const disable = useCallback(() => {
    registeredIds.forEach((id) => updateShortcut(id, { disabled: true }));
  }, [registeredIds, updateShortcut]);

  const enable = useCallback(() => {
    registeredIds.forEach((id) => updateShortcut(id, { disabled: false }));
  }, [registeredIds, updateShortcut]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      registeredIds.forEach((id) => unregisterShortcut(id));
    };
  }, []);

  return { register, disable, enable };
}

// =============================================================================
// Convenience Components
// =============================================================================

export interface ArchbaseShortcutHintProps {
  /** Combinação de teclas */
  keys: string;
  /** Tamanho */
  size?: 'xs' | 'sm' | 'md';
}

export function ArchbaseShortcutHint({ keys, size = 'sm' }: ArchbaseShortcutHintProps) {
  const parsedKeys = parseKeys(keys);

  return (
    <Group gap={2}>
      {parsedKeys.map((key, index) => (
        <React.Fragment key={index}>
          <Kbd size={size}>{key}</Kbd>
          {index < parsedKeys.length - 1 && (
            <Text size="xs" c="dimmed">+</Text>
          )}
        </React.Fragment>
      ))}
    </Group>
  );
}

export default ArchbaseKeyboardShortcutsProvider;
