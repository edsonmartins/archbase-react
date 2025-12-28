import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  TextInput,
  Popover,
  ScrollArea,
  Group,
  Button,
  ActionIcon,
  Tooltip,
  Stack,
  Text,
  Badge,
  Paper,
  Menu,
  rem,
} from '@mantine/core';
import { useClickOutside, useDisclosure, useMergedRef } from '@mantine/hooks';
import { IconFilter, IconX, IconChevronDown, IconHistory, IconStar, IconBolt } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import type {
  ArchbaseActiveFilter,
  ArchbaseFilterDefinition,
  ArchbaseFilterOperator,
  ArchbaseCompositeFiltersProps,
  InputStep,
} from './ArchbaseCompositeFilters.types';
import { FilterPill } from './components/FilterPill';
import {
  getOperatorsForType,
  getDefaultOperatorForType,
  generateFilterId,
  getDisplayValue,
} from './ArchbaseCompositeFilters.utils';

/**
 * Componente principal de filtros compostos com saída RSQL
 *
 * @example
 * ```tsx
 * const filters: ArchbaseFilterDefinition[] = [
 *   { key: 'nome', label: 'Nome', type: 'text' },
 *   { key: 'idade', label: 'Idade', type: 'integer' },
 *   { key: 'ativo', label: 'Ativo', type: 'boolean' }
 * ];
 *
 * <ArchbaseCompositeFilters
 *   filters={filters}
 *   value={activeFilters}
 *   onChange={(filters, rsql) => {
 *     console.log('RSQL:', rsql); // "nome=like=*João*;idade>18"
 *   }}
 * />
 * ```
 */
export function ArchbaseCompositeFilters({
  filters: filterDefinitions,
  value: controlledValue,
  onChange,
  rsqlOutput = 'controlled',
  onRSQLChange,
  placeholder,
  maxFilters = 10,
  variant = 'default',
  enablePresets = true,
  enableHistory = true,
  enableQuickFilters = true,
  quickFilters = [],
  storageKeyPrefix = 'archbase-composite-filters',
  customRenderPill,
  styles,
  classNames,
  onFilterAdd,
  onFilterRemove,
  onFiltersCleared,
}: ArchbaseCompositeFiltersProps) {
  const { t } = useArchbaseTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Estado interno para modo não controlado
  const [internalFilters, setInternalFilters] = useState<ArchbaseActiveFilter[]>([]);
  const activeFilters = controlledValue !== undefined ? controlledValue : internalFilters;

  // Estado do input
  const [inputStep, setInputStep] = useState<InputStep>('field');
  const [selectedField, setSelectedField] = useState<ArchbaseFilterDefinition | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<ArchbaseFilterOperator | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, { close: closeDropdown, toggle: toggleDropdown }] = useDisclosure(false);

  // Atualiza o callback de RSQL quando os filtros mudam
  useEffect(() => {
    if (rsqlOutput === 'uncontrolled' && onRSQLChange) {
      // Gera RSQL a partir dos filtros ativos
      const rsql = activeFilters.length > 0
        ? activeFilters.map(f => {
            const { key, operator, value, type } = f;

            if (operator === 'is_null') return `${key}=null=true`;
            if (operator === 'is_not_null') return `${key}=null=false`;

            let formattedValue = String(value);
            if (type === 'date' || type === 'datetime') {
              if (value instanceof Date) {
                formattedValue = value.toISOString();
              }
            }

            if (operator === 'contains') return `${key}=like=*${formattedValue}*`;
            if (operator === 'starts_with') return `${key}=like=${formattedValue}*`;
            if (operator === 'ends_with') return `${key}=like=*${formattedValue}`;
            if (operator === '=') return `${key}==${formattedValue}`;
            if (operator === '!=') return `${key}!=${formattedValue}`;
            if (operator === '>') return `${key}>${formattedValue}`;
            if (operator === '<') return `${key}<${formattedValue}`;
            if (operator === '>=') return `${key}>=${formattedValue}`;
            if (operator === '<=') return `${key}<=${formattedValue}`;

            return `${key}==${formattedValue}`;
          }).join(';')
        : undefined;

      onRSQLChange(rsql);
    }
  }, [activeFilters, rsqlOutput, onRSQLChange]);

  // Filtros disponíveis (excluindo campos já filtrados)
  const availableFields = useMemo(() => {
    if (maxFilters === 1) {
      return filterDefinitions;
    }
    return filterDefinitions.filter(
      f => !activeFilters.some(af => af.key === f.key)
    );
  }, [filterDefinitions, activeFilters, maxFilters]);

  // Campos filtrados pelo input
  const filteredFields = useMemo(() => {
    if (!inputValue || inputStep !== 'field') return availableFields;
    return availableFields.filter(f =>
      f.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      f.key.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [availableFields, inputValue, inputStep]);

  // Operadores disponíveis para o campo selecionado
  const availableOperators = useMemo(() => {
    if (!selectedField) return [];
    return selectedField.operators || getOperatorsForType(selectedField.type);
  }, [selectedField]);

  // Opções para select (se aplicável)
  const selectOptions = useMemo(() => {
    return selectedField?.options || [];
  }, [selectedField]);

  // Opções filtradas pelo input
  const filteredOptions = useMemo(() => {
    if (!inputValue || inputStep !== 'value') return selectOptions;
    return selectOptions.filter(opt =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [selectOptions, inputValue, inputStep]);

  // Reseta o input
  const resetInput = useCallback(() => {
    setInputStep('field');
    setSelectedField(null);
    setSelectedOperator(null);
    setInputValue('');
  }, []);

  // Adiciona um filtro
  const addFilter = useCallback(() => {
    if (!selectedField || !selectedOperator) {
      return;
    }

    // Valida o valor
    let finalValue: string | number | boolean | Date | (string | number)[] = inputValue;

    // Conteúdo o valor baseado no tipo
    switch (selectedField.type) {
      case 'integer':
        finalValue = parseInt(inputValue) || 0;
        break;
      case 'float':
      case 'currency':
        finalValue = parseFloat(inputValue) || 0;
        break;
      case 'boolean':
        finalValue = inputValue === 'true' || inputValue === 'yes';
        break;
      case 'date':
      case 'datetime':
        if (inputValue) {
          finalValue = new Date(inputValue);
        }
        break;
    }

    const newFilter: ArchbaseActiveFilter = {
      id: generateFilterId(),
      key: selectedField.key,
      label: selectedField.label,
      type: selectedField.type,
      operator: selectedOperator,
      value: finalValue,
      displayValue: getDisplayValue(finalValue, selectedField.type, selectedOperator, selectedField.options),
      icon: selectedField.icon,
    };

    const newFilters = [...activeFilters, newFilter];
    handleFiltersChange(newFilters);
    onFilterAdd?.(newFilter);

    resetInput();
    closeDropdown();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedField, selectedOperator, inputValue, activeFilters, resetInput, closeDropdown, onFilterAdd]);

  // Remove um filtro
  const removeFilter = useCallback((id: string) => {
    const newFilters = activeFilters.filter(f => f.id !== id);
    handleFiltersChange(newFilters);
    onFilterRemove?.(id);
  }, [activeFilters, onFilterRemove]);

  // Limpa todos os filtros
  const clearAllFilters = useCallback(() => {
    handleFiltersChange([]);
    onFiltersCleared?.();
  }, [onFiltersCleared]);

  // Manipula mudança nos filtros
  const handleFiltersChange = useCallback((newFilters: ArchbaseActiveFilter[]) => {
    if (onChange) {
      // Gera RSQL para passar no callback
      const rsql = newFilters.length > 0
        ? newFilters.map(f => {
            const { key, operator, value, type } = f;

            if (operator === 'is_null') return `${key}=null=true`;
            if (operator === 'is_not_null') return `${key}=null=false`;

            let formattedValue = String(value);
            if (type === 'date' || type === 'datetime') {
              if (value instanceof Date) {
                formattedValue = value.toISOString();
              }
            }

            if (operator === 'contains') return `${key}=like=*${formattedValue}*`;
            if (operator === 'starts_with') return `${key}=like=${formattedValue}*`;
            if (operator === 'ends_with') return `${key}=like=*${formattedValue}`;
            if (operator === '=') return `${key}==${formattedValue}`;
            if (operator === '!=') return `${key}!=${formattedValue}`;
            if (operator === '>') return `${key}>${formattedValue}`;
            if (operator === '<') return `${key}<${formattedValue}`;
            if (operator === '>=') return `${key}>=${formattedValue}`;
            if (operator === '<=') return `${key}<=${formattedValue}`;

            return `${key}==${formattedValue}`;
          }).join(';')
        : undefined;

      onChange(newFilters, rsql);
    } else {
      setInternalFilters(newFilters);
    }
  }, [onChange]);

  // Manipula teclas no input
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !inputValue && activeFilters.length > 0) {
      // Remove o último filtro
      const lastFilter = activeFilters[activeFilters.length - 1];
      removeFilter(lastFilter.id);
    } else if (e.key === 'Escape') {
      closeDropdown();
      resetInput();
    }
  }, [inputValue, activeFilters, removeFilter, closeDropdown, resetInput]);

  // Manipula foco no input
  const handleInputFocus = useCallback(() => {
    if (!isDropdownOpen && availableFields.length > 0) {
      setInputStep('field');
      toggleDropdown();
    }
  }, [isDropdownOpen, availableFields.length, toggleDropdown]);

  // Manipula mudança no input
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);

    if (inputStep === 'field' && value) {
      // Busca campo correspondente
      const match = filteredFields.find(f =>
        f.key.toLowerCase() === value.toLowerCase() ||
        f.label.toLowerCase() === value.toLowerCase()
      );

      if (match) {
        setSelectedField(match);
        setInputValue('');
        setInputStep('operator');
      }
    } else if (inputStep === 'operator' && value) {
      // Busca operador correspondente
      const op = availableOperators.find(o =>
        o.toLowerCase().includes(value.toLowerCase())
      );

      if (op) {
        setSelectedOperator(op);
        setInputValue('');

        // Para is_null e is_not_null, não precisa de valor
        if (op === 'is_null' || op === 'is_not_null') {
          addFilter();
        } else {
          setInputStep('value');
        }
      }
    }
  }, [inputStep, filteredFields, availableOperators, addFilter]);

  // Seleciona um campo
  const handleFieldSelect = useCallback((field: ArchbaseFilterDefinition) => {
    setSelectedField(field);
    setSelectedOperator(getDefaultOperatorForType(field.type));
    setInputValue('');
    setInputStep('value');
  }, []);

  // Seleciona um operador
  const handleOperatorSelect = useCallback((operator: ArchbaseFilterOperator) => {
    setSelectedOperator(operator);
    setInputValue('');

    if (operator === 'is_null' || operator === 'is_not_null') {
      addFilter();
    } else {
      setInputStep('value');
    }
  }, [addFilter]);

  // Seleciona uma opção (para selects)
  const handleOptionSelect = useCallback((value: string) => {
    setInputValue(value);
    if (inputRef.current) {
      setTimeout(() => addFilter(), 100);
    }
  }, [addFilter]);

  // Renderiza o conteúdo do dropdown
  const renderDropdownContent = () => {
    switch (inputStep) {
      case 'field':
        return (
          <>
            {filteredFields.length === 0 ? (
              <Text p="md" c="dimmed" size="sm">
                {String(t('No fields found'))}
              </Text>
            ) : (
              <ScrollArea.Autosize mah={300}>
                <Stack gap={0}>
                  {filteredFields.map(field => (
                    <Button
                      key={field.key}
                      variant="subtle"
                      fullWidth
                      leftSection={field.icon}
                      onClick={() => handleFieldSelect(field)}
                      styles={{
                        inner: { justifyContent: 'flex-start' },
                        root: { borderRadius: 4 },
                      }}
                    >
                      <Text size="sm">{field.label}</Text>
                      <Text size="xs" c="dimmed" ml="auto">
                        {field.type}
                      </Text>
                    </Button>
                  ))}
                </Stack>
              </ScrollArea.Autosize>
            )}
          </>
        );

      case 'operator':
        return (
          <>
            {availableOperators.length === 0 ? (
              <Text p="md" c="dimmed" size="sm">
                {String(t('No operators available'))}
              </Text>
            ) : (
              <ScrollArea.Autosize mah={300}>
                <Stack gap={0}>
                  {availableOperators.map(op => (
                    <Button
                      key={op}
                      variant="subtle"
                      fullWidth
                      onClick={() => handleOperatorSelect(op)}
                      styles={{
                        inner: { justifyContent: 'flex-start' },
                        root: { borderRadius: 4 },
                      }}
                    >
                      <Text size="sm">{getOperatorLabel(op)}</Text>
                    </Button>
                  ))}
                </Stack>
              </ScrollArea.Autosize>
            )}
          </>
        );

      case 'value':
        // Para select/multi_select, mostra opções
        if (selectedField && (selectedField.type === 'enum' || selectOptions.length > 0)) {
          return (
            <>
              {filteredOptions.length === 0 ? (
                <Text p="md" c="dimmed" size="sm">
                  {String(t('No options found'))}
                </Text>
              ) : (
                <ScrollArea.Autosize mah={300}>
                  <Stack gap={0}>
                    {filteredOptions.map(opt => (
                      <Button
                        key={opt.value}
                        variant="subtle"
                        fullWidth
                        onClick={() => handleOptionSelect(opt.value)}
                        styles={{
                          inner: { justifyContent: 'flex-start' },
                          root: { borderRadius: 4 },
                        }}
                      >
                        <Text size="sm">{opt.label}</Text>
                      </Button>
                    ))}
                  </Stack>
                </ScrollArea.Autosize>
              )}
            </>
          );
        }

        // Para outros tipos, mostra instruções
        const valuePlaceholder = selectedField?.placeholder || String(t('Enter value'));
        return (
          <Stack p="md" gap="xs">
            <Text size="sm" c="dimmed">
              {valuePlaceholder}
            </Text>
            <Text size="xs" c="dimmed">
              {String(t('Press Enter to add filter'))}
            </Text>
            {selectedField?.type === 'integer' || selectedField?.type === 'float' || selectedField?.type === 'currency' ? (
              <Text size="xs" c="blue">
                {selectedField.type === 'integer' ? String(t('Enter a number')) : String(t('Enter a decimal'))}
              </Text>
            ) : null}
            {selectedField?.type === 'date' || selectedField?.type === 'datetime' ? (
              <Text size="xs" c="blue">
                {String(t('Enter a date (YYYY-MM-DD)'))}
              </Text>
            ) : null}
          </Stack>
        );

      default:
        return null;
    }
  };

  const isCompact = variant === 'compact' || variant === 'minimal';
  const isMaxReached = maxFilters > 0 && activeFilters.length >= maxFilters;

  return (
    <Box style={styles?.root} className={classNames?.root}>
      <Paper
        withBorder
        p={isCompact ? 'xs' : 'sm'}
        radius="md"
        style={{
          ...styles?.container,
        }}
        className={classNames?.container}
      >
        <Group gap="xs" wrap="wrap">
          {/* Ícone de filtro */}
          {!isCompact && (
            <IconFilter size={18} style={{ flexShrink: 0 }} />
          )}

          {/* Pills de filtros ativos */}
          <Box style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {activeFilters.map(filter => (
              customRenderPill ? (
                <React.Fragment key={filter.id}>
                  {customRenderPill(filter, () => removeFilter(filter.id))}
                </React.Fragment>
              ) : (
                <FilterPill
                  key={filter.id}
                  filter={filter}
                  onRemove={() => removeFilter(filter.id)}
                  compact={isCompact}
                  styles={styles?.pill}
                />
              )
            ))}
          </Box>

          {/* Input */}
          {!isMaxReached && (
            <Popover
              opened={isDropdownOpen}
              position="bottom-start"
              withArrow
              shadow="md"
              width={200}
              onClose={closeDropdown}
            >
              <Popover.Target>
                <TextInput
                  ref={inputRef}
                  placeholder={
                    activeFilters.length === 0
                      ? placeholder || String(t('Add filter'))
                      : String(t('Add another filter'))
                  }
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.currentTarget.value)}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  size={isCompact ? 'xs' : 'sm'}
                  styles={{
                input: {
                  minWidth: isCompact ? 100 : 150,
                  ...styles?.input,
                },
              }}
                  className={classNames?.input}
                  rightSection={
                    inputValue || isDropdownOpen ? (
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={() => {
                          setInputValue('');
                          resetInput();
                          closeDropdown();
                        }}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={toggleDropdown}
                      >
                        <IconChevronDown size={14} />
                      </ActionIcon>
                    )
                  }
                />
              </Popover.Target>

              <Popover.Dropdown p={0}>
                {renderDropdownContent()}
              </Popover.Dropdown>
            </Popover>
          )}

          {/* Botão de limpar tudo */}
          {activeFilters.length > 0 && !isCompact && (
            <Tooltip label={String(t('Clear all'))}>
              <ActionIcon
                variant="subtle"
                onClick={clearAllFilters}
                style={styles?.clearButton}
              >
                <IconX size={16} />
              </ActionIcon>
            </Tooltip>
          )}

          {/* Menu de ações */}
          {!isCompact && (enablePresets || enableHistory || enableQuickFilters) && (
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle">
                  <IconChevronDown size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {enableQuickFilters && quickFilters.length > 0 && (
                  <>
                    <Menu.Label>{String(t('Quick filters'))}</Menu.Label>
                    {quickFilters.map(qf => (
                      <Menu.Item
                        key={qf.id}
                        leftSection={<IconBolt size={14} />}
                        onClick={() => {
                          const newFilters = qf.filters.map(f => ({
                            ...f,
                            id: generateFilterId(),
                          }));
                          handleFiltersChange(newFilters);
                        }}
                      >
                        {qf.name}
                      </Menu.Item>
                    ))}
                  </>
                )}

                {enableHistory && (
                  <Menu.Item leftSection={<IconHistory size={14} />}>
                    {String(t('History'))}
                  </Menu.Item>
                )}

                {enablePresets && (
                  <Menu.Item leftSection={<IconStar size={14} />}>
                    {String(t('Save preset'))}
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Paper>

      {/* Contador de filtros (modo minimal) */}
      {variant === 'minimal' && activeFilters.length > 0 && (
        <Badge size="xs" circle style={{ marginLeft: 8 }}>
          {activeFilters.length}
        </Badge>
      )}
    </Box>
  );
}

/**
 * Retorna o label do operador para exibição
 */
function getOperatorLabel(operator: ArchbaseFilterOperator): string {
  const labels: Record<ArchbaseFilterOperator, string> = {
    'contains': 'Contains',
    'starts_with': 'Starts with',
    'ends_with': 'Ends with',
    '=': 'Equals',
    '!=': 'Not equals',
    '>': 'Greater than',
    '<': 'Less than',
    '>=': 'Greater or equal',
    '<=': 'Less or equal',
    'is_null': 'Is null',
    'is_not_null': 'Is not null',
    'between': 'Between',
    'date_before': 'Before',
    'date_after': 'After',
    'date_between': 'Between',
    'in': 'In',
    'not_in': 'Not in',
  };

  return labels[operator] || operator;
}

// Exporta tipos e componentes auxiliares
export type {
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
  ArchbaseFilterOperator,
  FilterValue,
  SavedFilterPreset,
  FilterHistoryEntry,
  QuickFilterPreset,
} from './ArchbaseCompositeFilters.types';
