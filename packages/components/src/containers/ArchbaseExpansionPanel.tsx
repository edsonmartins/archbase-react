import React, { ReactNode } from 'react';
import {
  Accordion,
  AccordionProps,
  AccordionControlProps,
  AccordionItemProps,
  AccordionPanelProps,
  ThemeIcon,
  Group,
  Text,
  Badge,
} from '@mantine/core';

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseExpansionPanelItem {
  /** ID único do painel */
  id: string;
  /** Título do painel */
  title: string;
  /** Descrição opcional */
  description?: string;
  /** Ícone opcional */
  icon?: ReactNode;
  /** Badge opcional */
  badge?: string | number;
  /** Cor do badge */
  badgeColor?: string;
  /** Conteúdo do painel */
  content: ReactNode;
  /** Se o painel está desabilitado */
  disabled?: boolean;
}

export interface ArchbaseExpansionPanelProps extends Omit<AccordionProps<true>, 'children' | 'multiple' | 'value' | 'defaultValue' | 'onChange'> {
  /** Array de painéis */
  panels: ArchbaseExpansionPanelItem[];
  /** Permitir múltiplos painéis abertos */
  multiple?: boolean;
  /** Valor padrão (IDs dos painéis abertos) */
  defaultValue?: string | string[];
  /** Valor controlado */
  value?: string | string[] | null;
  /** Callback ao mudar */
  onChange?: (value: string | string[] | null) => void;
  /** Variante visual */
  variant?: 'default' | 'contained' | 'filled' | 'separated';
  /** Tamanho do chevron */
  chevronSize?: number;
  /** Posição do chevron */
  chevronPosition?: 'left' | 'right';
  /** Duração da transição em ms */
  transitionDuration?: number;
  /** Desabilitar todos os painéis */
  disabled?: boolean;
}

// =============================================================================
// ArchbaseExpansionPanel Component
// =============================================================================

export function ArchbaseExpansionPanel({
  panels,
  multiple = false,
  defaultValue,
  value,
  onChange,
  variant = 'default',
  chevronSize = 20,
  chevronPosition = 'right',
  transitionDuration = 200,
  disabled = false,
  ...mantineProps
}: ArchbaseExpansionPanelProps) {
  // Render control with icon, title, description and badge
  const renderControl = (panel: ArchbaseExpansionPanelItem) => (
    <Accordion.Control disabled={disabled || panel.disabled}>
      <Group gap="sm" wrap="nowrap">
        {panel.icon && (
          <ThemeIcon variant="light" size="md">
            {panel.icon}
          </ThemeIcon>
        )}
        <div style={{ flex: 1 }}>
          <Group gap="xs">
            <Text fw={500}>{panel.title}</Text>
            {panel.badge !== undefined && (
              <Badge size="sm" color={panel.badgeColor}>
                {panel.badge}
              </Badge>
            )}
          </Group>
          {panel.description && (
            <Text size="sm" c="dimmed">
              {panel.description}
            </Text>
          )}
        </div>
      </Group>
    </Accordion.Control>
  );

  // Handle props based on multiple mode
  const accordionProps = multiple
    ? {
        multiple: true as const,
        defaultValue: defaultValue as string[] | undefined,
        value: value as string[] | undefined,
        onChange: onChange as ((value: string[]) => void) | undefined,
      }
    : {
        multiple: false as const,
        defaultValue: defaultValue as string | undefined,
        value: value as string | null | undefined,
        onChange: onChange as ((value: string | null) => void) | undefined,
      };

  return (
    <Accordion
      variant={variant}
      chevronSize={chevronSize}
      chevronPosition={chevronPosition}
      transitionDuration={transitionDuration}
      {...accordionProps}
      {...mantineProps}
    >
      {panels.map((panel) => (
        <Accordion.Item key={panel.id} value={panel.id}>
          {renderControl(panel)}
          <Accordion.Panel>{panel.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

// =============================================================================
// ArchbaseExpansionPanelControlled (Wrapper simplificado para uso controlado)
// =============================================================================

export interface ArchbaseExpansionPanelControlledProps
  extends Omit<ArchbaseExpansionPanelProps, 'value' | 'onChange' | 'defaultValue'> {
  /** IDs dos painéis abertos */
  openPanels: string[];
  /** Callback ao abrir/fechar painéis */
  onOpenPanelsChange: (panels: string[]) => void;
}

export function ArchbaseExpansionPanelControlled({
  openPanels,
  onOpenPanelsChange,
  ...props
}: ArchbaseExpansionPanelControlledProps) {
  return (
    <ArchbaseExpansionPanel
      multiple
      value={openPanels}
      onChange={(value) => onOpenPanelsChange(value as string[])}
      {...props}
    />
  );
}

// =============================================================================
// ArchbaseExpansionPanelSingle (Wrapper para accordion único)
// =============================================================================

export interface ArchbaseExpansionPanelSingleProps
  extends Omit<ArchbaseExpansionPanelProps, 'multiple' | 'value' | 'onChange' | 'defaultValue'> {
  /** ID do painel aberto */
  openPanel?: string | null;
  /** Callback ao abrir/fechar */
  onOpenPanelChange?: (panel: string | null) => void;
  /** Painel aberto por padrão */
  defaultOpenPanel?: string;
}

export function ArchbaseExpansionPanelSingle({
  openPanel,
  onOpenPanelChange,
  defaultOpenPanel,
  ...props
}: ArchbaseExpansionPanelSingleProps) {
  return (
    <ArchbaseExpansionPanel
      multiple={false}
      value={openPanel}
      onChange={onOpenPanelChange}
      defaultValue={defaultOpenPanel}
      {...props}
    />
  );
}

export default ArchbaseExpansionPanel;
