import React, { forwardRef, useCallback, useState } from 'react';
import {
  ColorPicker,
  ColorPickerProps,
  ColorSwatch,
  HueSlider,
  AlphaSlider,
  TextInput,
  Group,
  Stack,
  Text,
  Box,
  Popover,
  ActionIcon,
  SimpleGrid,
  MantineSize,
} from '@mantine/core';
import { IconPalette, IconColorPicker, IconCheck } from '@tabler/icons-react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/core';

export type ArchbaseColorFormat = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export interface ArchbaseColorGradientPickerProps extends Omit<ColorPickerProps, 'value' | 'onChange'> {
  /** Fonte de dados */
  dataSource?: ArchbaseDataSource<any, any>;
  /** Campo do DataSource */
  dataField?: string;
  /** Valor controlado */
  value?: string;
  /** Valor padrão */
  defaultValue?: string;
  /** Callback de mudança */
  onChange?: (value: string) => void;
  /** Formato do valor */
  format?: ArchbaseColorFormat;
  /** Swatches de cores */
  swatches?: string[];
  /** Se deve mostrar swatches */
  showSwatches?: boolean;
  /** Se deve mostrar hue slider */
  showHueSlider?: boolean;
  /** Se deve mostrar alpha slider */
  showAlphaSlider?: boolean;
  /** Se deve mostrar input de texto */
  showInput?: boolean;
  /** Se deve mostrar eyedropper (quando suportado) */
  showEyeDropper?: boolean;
  /** Label */
  label?: string;
  /** Descrição */
  description?: string;
  /** Erro */
  error?: string | boolean;
  /** Tamanho */
  size?: MantineSize;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se é somente leitura */
  readOnly?: boolean;
  /** Largura */
  width?: number | string;
  /** Se deve usar popover */
  withPopover?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

// Swatches padrão com cores comuns
const DEFAULT_SWATCHES = [
  '#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb',
  '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886',
  '#40c057', '#82c91e', '#fab005', '#fd7e14', '#ffffff',
];

export const ArchbaseColorGradientPicker = forwardRef<HTMLDivElement, ArchbaseColorGradientPickerProps>(
  (
    {
      dataSource,
      dataField,
      value: controlledValue,
      defaultValue = '#228be6',
      onChange,
      format = 'hex',
      swatches = DEFAULT_SWATCHES,
      showSwatches = true,
      showHueSlider = true,
      showAlphaSlider = false,
      showInput = true,
      showEyeDropper = true,
      label,
      description,
      error,
      size = 'sm',
      disabled = false,
      readOnly = false,
      width,
      withPopover = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [popoverOpened, setPopoverOpened] = useState(false);

    // Determina o valor atual
    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

    const loadDataSourceFieldValue = useCallback(() => {
      if (dataSource && dataField) {
        const fieldValue = dataSource.getFieldValue(dataField);
        setInternalValue(fieldValue ?? defaultValue);
      }
    }, [dataSource, dataField, defaultValue]);

    const fieldChangedListener = useCallback(() => {
      loadDataSourceFieldValue();
    }, [loadDataSourceFieldValue]);

    const dataSourceEvent = useCallback(
      (event: DataSourceEvent<any>) => {
        if (dataSource && dataField) {
          if (
            event.type === DataSourceEventNames.dataChanged ||
            event.type === DataSourceEventNames.recordChanged ||
            event.type === DataSourceEventNames.afterScroll ||
            event.type === DataSourceEventNames.afterCancel ||
            event.type === DataSourceEventNames.afterInsert
          ) {
            loadDataSourceFieldValue();
          }
        }
      },
      [dataSource, dataField, loadDataSourceFieldValue]
    );

    useArchbaseDidMount(() => {
      loadDataSourceFieldValue();
      if (dataSource && dataField) {
        dataSource.addListener(dataSourceEvent);
        dataSource.addFieldChangeListener(dataField, fieldChangedListener);
      }
    });

    useArchbaseWillUnmount(() => {
      if (dataSource && dataField) {
        dataSource.removeListener(dataSourceEvent);
        dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
      }
    });

    useArchbaseDidUpdate(() => {
      loadDataSourceFieldValue();
    }, []);

    const handleChange = useCallback(
      (val: string) => {
        // Atualiza DataSource se disponível
        if (dataSource && dataField && !dataSource.isBrowsing()) {
          dataSource.setFieldValue(dataField, val);
        }

        // Atualiza valor interno se não controlado
        if (controlledValue === undefined) {
          setInternalValue(val);
        }

        // Callback
        onChange?.(val);
      },
      [controlledValue, dataField, dataSource, onChange]
    );

    const handleEyeDropper = useCallback(async () => {
      if (!('EyeDropper' in window)) return;

      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        handleChange(result.sRGBHex);
      } catch (e) {
        // Usuário cancelou
      }
    }, [handleChange]);

    const isReadOnly = readOnly || (dataSource ? dataSource.isBrowsing() : false);

    const pickerContent = (
      <Stack gap="sm">
        {/* Color picker principal */}
        <ColorPicker
          value={currentValue}
          onChange={handleChange}
          format={format}
          size={size}
          {...rest}
        />

        {/* Hue slider */}
        {showHueSlider && (
          <Box>
            <Text size="xs" c="dimmed" mb={4}>
              Matiz
            </Text>
            <HueSlider
              value={0} // Controlled by ColorPicker internally
              onChange={() => {}}
              size={size}
            />
          </Box>
        )}

        {/* Alpha slider */}
        {showAlphaSlider && (format === 'hexa' || format === 'rgba' || format === 'hsla') && (
          <Box>
            <Text size="xs" c="dimmed" mb={4}>
              Opacidade
            </Text>
            <AlphaSlider
              color={currentValue}
              value={1}
              onChange={() => {}}
              size={size}
            />
          </Box>
        )}

        {/* Swatches */}
        {showSwatches && swatches.length > 0 && (
          <Box>
            <Text size="xs" c="dimmed" mb={4}>
              Cores
            </Text>
            <SimpleGrid cols={5} spacing={4}>
              {swatches.map((swatch) => (
                <ColorSwatch
                  key={swatch}
                  color={swatch}
                  size={24}
                  style={{ cursor: isReadOnly || disabled ? 'default' : 'pointer' }}
                  onClick={() => !isReadOnly && !disabled && handleChange(swatch)}
                >
                  {currentValue.toLowerCase() === swatch.toLowerCase() && (
                    <IconCheck size={12} color="white" style={{ mixBlendMode: 'difference' }} />
                  )}
                </ColorSwatch>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Input e eye dropper */}
        {showInput && (
          <Group gap="xs">
            <TextInput
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              size={size}
              disabled={disabled}
              readOnly={isReadOnly}
              style={{ flex: 1 }}
              leftSection={<ColorSwatch color={currentValue} size={16} />}
            />
            {showEyeDropper && 'EyeDropper' in window && (
              <ActionIcon
                variant="subtle"
                color="gray"
                size={size === 'xs' ? 'sm' : size}
                onClick={handleEyeDropper}
                disabled={disabled || isReadOnly}
                title="Selecionar cor da tela"
              >
                <IconColorPicker size={16} />
              </ActionIcon>
            )}
          </Group>
        )}
      </Stack>
    );

    // Com popover
    if (withPopover) {
      return (
        <Stack ref={ref} gap={4} className={className} style={{ ...style, width }}>
          {label && (
            <Text size={size} fw={500}>
              {label}
            </Text>
          )}
          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}

          <Popover opened={popoverOpened} onChange={setPopoverOpened} position="bottom-start">
            <Popover.Target>
              <Group
                gap="xs"
                style={{
                  cursor: disabled || isReadOnly ? 'default' : 'pointer',
                  padding: '8px 12px',
                  border: '1px solid var(--mantine-color-gray-4)',
                  borderRadius: 'var(--mantine-radius-sm)',
                  backgroundColor: 'var(--mantine-color-body)',
                }}
                onClick={() => !disabled && !isReadOnly && setPopoverOpened(true)}
              >
                <ColorSwatch color={currentValue} size={24} />
                <Text size={size}>{currentValue}</Text>
              </Group>
            </Popover.Target>
            <Popover.Dropdown>
              {pickerContent}
            </Popover.Dropdown>
          </Popover>

          {error && typeof error === 'string' && (
            <Text size="xs" c="red">
              {error}
            </Text>
          )}
        </Stack>
      );
    }

    // Sem popover
    return (
      <Stack ref={ref} gap={4} className={className} style={{ ...style, width }}>
        {label && (
          <Text size={size} fw={500}>
            {label}
          </Text>
        )}
        {description && (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        )}

        {pickerContent}

        {error && typeof error === 'string' && (
          <Text size="xs" c="red">
            {error}
          </Text>
        )}
      </Stack>
    );
  }
);

ArchbaseColorGradientPicker.displayName = 'ArchbaseColorGradientPicker';

// ================== Flat Color Picker (apenas swatches) ==================

export interface ArchbaseFlatColorPickerProps {
  /** Fonte de dados */
  dataSource?: ArchbaseDataSource<any, any>;
  /** Campo do DataSource */
  dataField?: string;
  /** Valor controlado */
  value?: string;
  /** Valor padrão */
  defaultValue?: string;
  /** Callback de mudança */
  onChange?: (value: string) => void;
  /** Swatches de cores */
  swatches?: string[];
  /** Número de colunas */
  columns?: number;
  /** Tamanho do swatch */
  swatchSize?: number;
  /** Espaçamento entre swatches */
  spacing?: number;
  /** Label */
  label?: string;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseFlatColorPicker = forwardRef<HTMLDivElement, ArchbaseFlatColorPickerProps>(
  (
    {
      dataSource,
      dataField,
      value: controlledValue,
      defaultValue,
      onChange,
      swatches = DEFAULT_SWATCHES,
      columns = 5,
      swatchSize = 28,
      spacing = 4,
      label,
      disabled = false,
      className,
      style,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || swatches[0]);

    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = useCallback(
      (val: string) => {
        if (dataSource && dataField && !dataSource.isBrowsing()) {
          dataSource.setFieldValue(dataField, val);
        }

        if (controlledValue === undefined) {
          setInternalValue(val);
        }

        onChange?.(val);
      },
      [controlledValue, dataField, dataSource, onChange]
    );

    return (
      <Stack ref={ref} gap={4} className={className} style={style}>
        {label && (
          <Text size="sm" fw={500}>
            {label}
          </Text>
        )}

        <SimpleGrid cols={columns} spacing={spacing}>
          {swatches.map((swatch) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              size={swatchSize}
              style={{
                cursor: disabled ? 'default' : 'pointer',
                boxShadow: currentValue.toLowerCase() === swatch.toLowerCase()
                  ? `0 0 0 2px var(--mantine-color-blue-5)`
                  : undefined,
              }}
              onClick={() => !disabled && handleChange(swatch)}
            >
              {currentValue.toLowerCase() === swatch.toLowerCase() && (
                <IconCheck size={14} color="white" style={{ mixBlendMode: 'difference' }} />
              )}
            </ColorSwatch>
          ))}
        </SimpleGrid>
      </Stack>
    );
  }
);

ArchbaseFlatColorPicker.displayName = 'ArchbaseFlatColorPicker';
