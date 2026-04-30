import {
  Box,
  Button,
  Group,
  Input,
  MantineSize,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core';
import {
  IconChevronRight,
  IconChevronLeft,
  IconChevronsRight,
  IconChevronsLeft,
  IconSearch,
} from '@tabler/icons-react';
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DataSourceEvent,
  DataSourceEventNames,
  IArchbaseDataSourceBase,
  useArchbaseDidUpdate,
  useArchbaseV1V2Compatibility,
} from '@archbase/data';
import { useForceUpdate } from '@mantine/hooks';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseDualListboxOption {
  value: any;
  label: string;
  group?: string;
  disabled?: boolean;
}

export interface ArchbaseDualListboxProps<T, ID, O> {
  /** Fonte de dados onde sera atribuido o valor (V1 ou V2) */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Campo onde devera ser atribuido o valor na fonte de dados */
  dataField?: string;
  /** Valor de entrada controlado */
  value?: any[];
  /** Valor padrao de entrada nao controlado */
  defaultValue?: any[];
  /** Opcoes disponiveis para selecao */
  options: ArchbaseDualListboxOption[];
  /** Titulo do componente */
  label?: string;
  /** Descricao do componente */
  description?: string;
  /** Ultimo erro ocorrido */
  error?: string;
  /** Indicador se o campo e obrigatorio */
  required?: boolean;
  /** Indicador se o componente esta desabilitado */
  disabled?: boolean;
  /** Indicador se o componente e somente leitura */
  readOnly?: boolean;
  /** Titulo da lista de itens disponiveis */
  availableLabel?: string;
  /** Titulo da lista de itens selecionados */
  selectedLabel?: string;
  /** Exibir campo de busca em cada lista */
  showSearch?: boolean;
  /** Exibir botoes para mover todos os itens */
  showMoveAll?: boolean;
  /** Altura das listas */
  height?: number;
  /** Evento quando o valor muda */
  onChangeValue?: (value: any[]) => void;
  /** Evento quando o componente recebe o foco */
  onFocusEnter?: (event: React.FocusEvent) => void;
  /** Evento quando o foco sai do componente */
  onFocusExit?: (event: React.FocusEvent) => void;
  /** Estilo do componente */
  style?: CSSProperties;
  /** Classe CSS do componente */
  className?: string;
  /** Largura do componente */
  width?: string | number;
  /** Tamanho do componente */
  size?: MantineSize;
}

export function ArchbaseDualListbox<T, ID, O>({
  dataSource,
  dataField,
  value,
  defaultValue,
  options,
  label,
  description,
  error,
  required,
  disabled = false,
  readOnly = false,
  availableLabel = 'Disponiveis',
  selectedLabel = 'Selecionados',
  showSearch = true,
  showMoveAll = true,
  height = 300,
  onChangeValue,
  onFocusEnter,
  onFocusExit,
  style,
  className,
  width,
  size,
}: ArchbaseDualListboxProps<T, ID, O>) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';
  const forceUpdate = useForceUpdate();

  // Compatibilidade V1/V2
  const v1v2Compatibility = useArchbaseV1V2Compatibility<any[]>(
    'ArchbaseDualListbox',
    dataSource,
    dataField,
    [],
  );

  // Contexto de validacao
  const validationContext = useValidationErrors();
  const fieldKey = `${dataField}`;
  const contextError = validationContext?.getError(fieldKey);

  // Estado interno
  const [currentValue, setCurrentValue] = useState<any[]>(
    value ?? defaultValue ?? [],
  );
  const [selectedInAvailable, setSelectedInAvailable] = useState<Set<any>>(
    new Set(),
  );
  const [selectedInChosen, setSelectedInChosen] = useState<Set<any>>(
    new Set(),
  );
  const [searchAvailable, setSearchAvailable] = useState('');
  const [searchChosen, setSearchChosen] = useState('');
  const [internalError, setInternalError] = useState<string | undefined>(error);

  // Sincronizar prop error
  useEffect(() => {
    if (error !== undefined && error !== internalError) {
      setInternalError(error);
    }
  }, [error]);

  // Sincronizar prop value
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  // Carregar valor do datasource
  const loadDataSourceFieldValue = useCallback(() => {
    let initialValue: any[] = value ?? defaultValue ?? [];
    if (dataSource && dataField && !dataSource.isEmpty()) {
      const fieldValue = dataSource.getFieldValue(dataField);
      if (Array.isArray(fieldValue)) {
        initialValue = fieldValue;
      } else if (fieldValue !== undefined && fieldValue !== null) {
        initialValue = [fieldValue];
      } else {
        initialValue = [];
      }
    }
    setCurrentValue(initialValue);
  }, [dataSource, dataField, value, defaultValue]);

  const fieldChangedListener = useCallback(() => {
    loadDataSourceFieldValue();
  }, [loadDataSourceFieldValue]);

  const dataSourceEvent = useCallback(
    (event: DataSourceEvent<T>) => {
      if (dataSource && dataField) {
        if (
          event.type === DataSourceEventNames.dataChanged ||
          event.type === DataSourceEventNames.recordChanged ||
          event.type === DataSourceEventNames.afterScroll ||
          event.type === DataSourceEventNames.afterCancel ||
          event.type === DataSourceEventNames.afterEdit
        ) {
          loadDataSourceFieldValue();
          if (!v1v2Compatibility.isDataSourceV2) {
            forceUpdate();
          }
        }
        if (
          event.type === DataSourceEventNames.onFieldError &&
          event.fieldName === dataField
        ) {
          setInternalError(event.error);
          validationContext?.setError(fieldKey, event.error);
        }
      }
    },
    [v1v2Compatibility.isDataSourceV2, validationContext, fieldKey, loadDataSourceFieldValue],
  );

  // Ref para manter callback atualizado
  const dataSourceEventRef = useRef(dataSourceEvent);
  useEffect(() => {
    dataSourceEventRef.current = dataSourceEvent;
  }, [dataSourceEvent]);

  const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    dataSourceEventRef.current(event);
  }, []);

  // Registrar listeners
  useEffect(() => {
    loadDataSourceFieldValue();
    if (dataSource && dataField) {
      const hasFieldListener =
        typeof (dataSource as any).addFieldChangeListener === 'function';
      dataSource.addListener(stableDataSourceEvent);
      if (hasFieldListener) {
        (dataSource as any).addFieldChangeListener(
          dataField,
          fieldChangedListener,
        );
      }
      return () => {
        dataSource.removeListener(stableDataSourceEvent);
        if (hasFieldListener) {
          (dataSource as any).removeFieldChangeListener(
            dataField,
            fieldChangedListener,
          );
        }
      };
    }
  }, [dataSource, dataField, stableDataSourceEvent, fieldChangedListener]);

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const isReadOnly = readOnly || v1v2Compatibility.isReadOnly;
  const isDisabled = disabled;

  // Listas computadas
  const availableItems = useMemo(() => {
    const valueSet = new Set(currentValue);
    return options.filter((opt) => {
      if (valueSet.has(opt.value)) return false;
      if (searchAvailable) {
        return opt.label
          .toLowerCase()
          .includes(searchAvailable.toLowerCase());
      }
      return true;
    });
  }, [options, currentValue, searchAvailable]);

  const chosenItems = useMemo(() => {
    const valueSet = new Set(currentValue);
    const matched = options.filter((opt) => {
      if (!valueSet.has(opt.value)) return false;
      if (searchChosen) {
        return opt.label
          .toLowerCase()
          .includes(searchChosen.toLowerCase());
      }
      return true;
    });
    return matched;
  }, [options, currentValue, searchChosen]);

  // Propagar mudanca de valor
  const propagateChange = useCallback(
    (newValue: any[]) => {
      // Limpar erro
      if (internalError || contextError) {
        setInternalError(undefined);
        validationContext?.clearError(fieldKey);
      }

      setCurrentValue(newValue);

      if (dataSource && dataField && !dataSource.isBrowsing()) {
        v1v2Compatibility.handleValueChange(newValue);
      }

      if (onChangeValue) {
        onChangeValue(newValue);
      }
    },
    [
      dataSource,
      dataField,
      v1v2Compatibility,
      onChangeValue,
      internalError,
      contextError,
      validationContext,
      fieldKey,
    ],
  );

  // Acoes de mover
  const moveRight = useCallback(() => {
    if (isReadOnly || isDisabled || selectedInAvailable.size === 0) return;
    const toMove = Array.from(selectedInAvailable).filter((v) => {
      const opt = options.find((o) => o.value === v);
      return opt && !opt.disabled;
    });
    const newValue = [...currentValue, ...toMove];
    setSelectedInAvailable(new Set());
    propagateChange(newValue);
  }, [selectedInAvailable, currentValue, options, isReadOnly, isDisabled, propagateChange]);

  const moveAllRight = useCallback(() => {
    if (isReadOnly || isDisabled) return;
    const allAvailableValues = availableItems
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.value);
    const newValue = [...currentValue, ...allAvailableValues];
    setSelectedInAvailable(new Set());
    propagateChange(newValue);
  }, [availableItems, currentValue, isReadOnly, isDisabled, propagateChange]);

  const moveLeft = useCallback(() => {
    if (isReadOnly || isDisabled || selectedInChosen.size === 0) return;
    const toRemove = new Set(
      Array.from(selectedInChosen).filter((v) => {
        const opt = options.find((o) => o.value === v);
        return opt && !opt.disabled;
      }),
    );
    const newValue = currentValue.filter((v) => !toRemove.has(v));
    setSelectedInChosen(new Set());
    propagateChange(newValue);
  }, [selectedInChosen, currentValue, options, isReadOnly, isDisabled, propagateChange]);

  const moveAllLeft = useCallback(() => {
    if (isReadOnly || isDisabled) return;
    const chosenDisabledValues = new Set(
      chosenItems.filter((opt) => opt.disabled).map((opt) => opt.value),
    );
    const newValue = currentValue.filter((v) => chosenDisabledValues.has(v));
    setSelectedInChosen(new Set());
    propagateChange(newValue);
  }, [chosenItems, currentValue, isReadOnly, isDisabled, propagateChange]);

  // Toggle selecao em lista
  const toggleAvailableItem = useCallback(
    (itemValue: any) => {
      if (isReadOnly || isDisabled) return;
      setSelectedInAvailable((prev) => {
        const next = new Set(prev);
        if (next.has(itemValue)) {
          next.delete(itemValue);
        } else {
          next.add(itemValue);
        }
        return next;
      });
    },
    [isReadOnly, isDisabled],
  );

  const toggleChosenItem = useCallback(
    (itemValue: any) => {
      if (isReadOnly || isDisabled) return;
      setSelectedInChosen((prev) => {
        const next = new Set(prev);
        if (next.has(itemValue)) {
          next.delete(itemValue);
        } else {
          next.add(itemValue);
        }
        return next;
      });
    },
    [isReadOnly, isDisabled],
  );

  // Estilos
  const borderColor = isDark ? theme.colors.dark[4] : theme.colors.gray[4];
  const bgColor = isDark ? theme.colors.dark[6] : theme.white;
  const headerBg = isDark ? theme.colors.dark[5] : theme.colors.gray[1];
  const hoverBg = isDark ? theme.colors.dark[4] : theme.colors.gray[1];
  const selectedBg = isDark
    ? theme.colors[theme.primaryColor][9]
    : theme.colors[theme.primaryColor][1];
  const selectedColor = isDark
    ? theme.white
    : theme.colors[theme.primaryColor][9];
  const disabledColor = isDark ? theme.colors.dark[3] : theme.colors.gray[5];

  const displayError = internalError || contextError;

  const renderListItem = (
    item: ArchbaseDualListboxOption,
    isSelected: boolean,
    onToggle: (value: any) => void,
  ) => {
    const itemDisabled = item.disabled || isDisabled || isReadOnly;
    return (
      <UnstyledButton
        key={String(item.value)}
        onClick={() => !itemDisabled && onToggle(item.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '6px 10px',
          borderRadius: theme.radius.sm as any,
          backgroundColor: isSelected ? selectedBg : 'transparent',
          color: itemDisabled
            ? disabledColor
            : isSelected
              ? selectedColor
              : undefined,
          cursor: itemDisabled ? 'not-allowed' : 'pointer',
          opacity: itemDisabled ? 0.6 : 1,
          transition: 'background-color 150ms ease',
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !itemDisabled) {
            (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              'transparent';
          }
        }}
      >
        <Text size={size ?? 'sm'} truncate>
          {item.label}
        </Text>
      </UnstyledButton>
    );
  };

  const renderList = (
    items: ArchbaseDualListboxOption[],
    selectedSet: Set<any>,
    onToggle: (value: any) => void,
    listLabel: string,
    searchValue: string,
    onSearchChange: (value: string) => void,
  ) => {
    // Agrupar itens
    const grouped = new Map<string, ArchbaseDualListboxOption[]>();
    const ungrouped: ArchbaseDualListboxOption[] = [];
    for (const item of items) {
      if (item.group) {
        if (!grouped.has(item.group)) {
          grouped.set(item.group, []);
        }
        grouped.get(item.group)!.push(item);
      } else {
        ungrouped.push(item);
      }
    }

    return (
      <Box
        style={{
          flex: 1,
          border: `1px solid ${borderColor}`,
          borderRadius: theme.radius.sm as any,
          backgroundColor: bgColor,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          style={{
            padding: '8px 10px',
            backgroundColor: headerBg,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <Text fw={600} size={size ?? 'sm'}>
            {listLabel}
          </Text>
          <Text size="xs" c="dimmed">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Text>
        </Box>

        {/* Busca */}
        {showSearch && (
          <Box style={{ padding: '6px 8px', borderBottom: `1px solid ${borderColor}` }}>
            <TextInput
              size="xs"
              placeholder="Buscar..."
              leftSection={<IconSearch size={14} />}
              value={searchValue}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
              disabled={isDisabled}
              readOnly={isReadOnly}
            />
          </Box>
        )}

        {/* Itens */}
        <ScrollArea style={{ flex: 1 }} h={height} offsetScrollbars>
          <Box style={{ padding: '4px' }}>
            {items.length === 0 && (
              <Text
                size="sm"
                c="dimmed"
                ta="center"
                style={{ padding: '20px 10px' }}
              >
                Nenhum item
              </Text>
            )}
            {ungrouped.map((item) =>
              renderListItem(item, selectedSet.has(item.value), onToggle),
            )}
            {Array.from(grouped.entries()).map(([groupName, groupItems]) => (
              <Box key={groupName} style={{ marginTop: ungrouped.length > 0 ? 8 : 0 }}>
                <Text
                  size="xs"
                  fw={700}
                  tt="uppercase"
                  c="dimmed"
                  style={{ padding: '4px 10px 2px' }}
                >
                  {groupName}
                </Text>
                {groupItems.map((item) =>
                  renderListItem(
                    item,
                    selectedSet.has(item.value),
                    onToggle,
                  ),
                )}
              </Box>
            ))}
          </Box>
        </ScrollArea>
      </Box>
    );
  };

  const buttonSize = size === 'xs' ? 'xs' : size === 'sm' ? 'xs' : 'sm';
  const iconSize = size === 'xs' ? 14 : size === 'sm' ? 16 : 18;

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={displayError}
      required={required}
      className={className}
      style={{ width, ...style }}
    >
      <Group
        align="stretch"
        gap="xs"
        wrap="nowrap"
        style={{ marginTop: label || description ? 4 : 0 }}
        onFocus={onFocusEnter}
        onBlur={onFocusExit}
      >
        {/* Lista de disponiveis */}
        {renderList(
          availableItems,
          selectedInAvailable,
          toggleAvailableItem,
          availableLabel,
          searchAvailable,
          setSearchAvailable,
        )}

        {/* Botoes de acao */}
        <Stack
          align="center"
          justify="center"
          gap={6}
          style={{ minWidth: 40 }}
        >
          <Button
            variant="light"
            size={buttonSize}
            onClick={moveRight}
            disabled={
              isDisabled ||
              isReadOnly ||
              selectedInAvailable.size === 0
            }
            title="Mover selecionados para a direita"
            px={6}
          >
            <IconChevronRight size={iconSize} />
          </Button>

          {showMoveAll && (
            <Button
              variant="light"
              size={buttonSize}
              onClick={moveAllRight}
              disabled={
                isDisabled || isReadOnly || availableItems.length === 0
              }
              title="Mover todos para a direita"
              px={6}
            >
              <IconChevronsRight size={iconSize} />
            </Button>
          )}

          {showMoveAll && (
            <Button
              variant="light"
              size={buttonSize}
              onClick={moveAllLeft}
              disabled={
                isDisabled || isReadOnly || chosenItems.length === 0
              }
              title="Mover todos para a esquerda"
              px={6}
            >
              <IconChevronsLeft size={iconSize} />
            </Button>
          )}

          <Button
            variant="light"
            size={buttonSize}
            onClick={moveLeft}
            disabled={
              isDisabled ||
              isReadOnly ||
              selectedInChosen.size === 0
            }
            title="Mover selecionados para a esquerda"
            px={6}
          >
            <IconChevronLeft size={iconSize} />
          </Button>
        </Stack>

        {/* Lista de selecionados */}
        {renderList(
          chosenItems,
          selectedInChosen,
          toggleChosenItem,
          selectedLabel,
          searchChosen,
          setSearchChosen,
        )}
      </Group>
    </Input.Wrapper>
  );
}

ArchbaseDualListbox.displayName = 'ArchbaseDualListbox';
