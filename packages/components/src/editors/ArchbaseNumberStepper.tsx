import React, { forwardRef, useCallback, useState, useRef } from 'react';
import {
  NumberInput,
  NumberInputProps,
  MantineSize,
} from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/core';

export interface ArchbaseNumberStepperProps<T extends object, ID>
  extends Omit<NumberInputProps, 'value' | 'onChange'> {
  /** Fonte de dados */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo do DataSource */
  dataField?: string;
  /** Valor controlado */
  value?: number | string;
  /** Valor padrão */
  defaultValue?: number | string;
  /** Callback de mudança */
  onChange?: (value: number | string) => void;
  /** Valor mínimo */
  min?: number;
  /** Valor máximo */
  max?: number;
  /** Passo de incremento */
  step?: number;
  /** Número de casas decimais */
  decimalScale?: number;
  /** Se deve fixar casas decimais */
  fixedDecimalScale?: boolean;
  /** Separador de milhar */
  thousandSeparator?: string | boolean;
  /** Separador decimal */
  decimalSeparator?: string;
  /** Prefixo */
  prefix?: string;
  /** Sufixo */
  suffix?: string;
  /** Comportamento ao atingir limite */
  clampBehavior?: 'strict' | 'blur' | 'none';
  /** Se permite valores negativos */
  allowNegative?: boolean;
  /** Se permite entrada decimal */
  allowDecimal?: boolean;
  /** Se deve esconder controles */
  hideControls?: boolean;
  /** Tamanho */
  size?: MantineSize;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se é somente leitura */
  readOnly?: boolean;
  /** Label */
  label?: string;
  /** Descrição */
  description?: string;
  /** Erro */
  error?: string | boolean;
  /** Se é obrigatório */
  required?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Largura */
  width?: number | string;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

function ArchbaseNumberStepperInner<T extends object, ID>(
  {
    dataSource,
    dataField,
    value: controlledValue,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    decimalScale = 0,
    fixedDecimalScale = false,
    thousandSeparator = '.',
    decimalSeparator = ',',
    prefix,
    suffix,
    clampBehavior = 'blur',
    allowNegative = true,
    allowDecimal = true,
    hideControls = false,
    size = 'sm',
    disabled = false,
    readOnly = false,
    label,
    description,
    error,
    required,
    placeholder,
    width,
    className,
    style,
    ...rest
  }: ArchbaseNumberStepperProps<T, ID>,
  ref: React.Ref<HTMLInputElement>
) {
  const [internalValue, setInternalValue] = useState<number | string>(defaultValue ?? '');
  const innerComponentRef = useRef<any>(null);

  // Determina o valor atual
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const loadDataSourceFieldValue = useCallback(() => {
    if (dataSource && dataField) {
      const fieldValue = dataSource.getFieldValue(dataField);
      setInternalValue(fieldValue ?? '');
    }
  }, [dataSource, dataField]);

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
          event.type === DataSourceEventNames.afterCancel
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
    (val: number | string) => {
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

  const isReadOnly = readOnly || (dataSource ? dataSource.isBrowsing() : false);

  return (
    <NumberInput
      ref={ref}
      value={currentValue}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      decimalScale={decimalScale}
      fixedDecimalScale={fixedDecimalScale}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      prefix={prefix}
      suffix={suffix}
      clampBehavior={clampBehavior}
      allowNegative={allowNegative}
      allowDecimal={allowDecimal}
      hideControls={hideControls}
      size={size}
      disabled={disabled}
      readOnly={isReadOnly}
      label={label}
      description={description}
      error={error}
      required={required}
      placeholder={placeholder}
      className={className}
      style={{ ...style, width }}
      {...rest}
    />
  );
}

export const ArchbaseNumberStepper = forwardRef(ArchbaseNumberStepperInner) as <
  T extends object = any,
  ID = string
>(
  props: ArchbaseNumberStepperProps<T, ID> & { ref?: React.Ref<HTMLInputElement> }
) => React.ReactElement;

(ArchbaseNumberStepper as any).displayName = 'ArchbaseNumberStepper';
