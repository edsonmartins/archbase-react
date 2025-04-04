import { CloseButton, CloseButtonProps, MantineSize, TextInput, TextInputProps } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@components/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

function useArchbasePrevious(value) {
  // O objeto ref é um contêiner genérico cuja propriedade atual é mutável ...
  // ... e pode conter qualquer valor, semelhante a uma propriedade de instância em uma classe
  const ref = useRef()
  // Armazena o valor atual na ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Executa novamente apenas se o valor mudar
  // Retorna o valor anterior (acontece antes da atualização no useEffect acima)
  return ref.current
}

function formatNumber(
  value,
  precision = 2,
  decimalSeparator = '.',
  thousandSeparator = ',',
  allowNegative = false,
  prefix = '',
  suffix = '',
  minValue = Number.MIN_SAFE_INTEGER,
  maxValue = Number.MAX_SAFE_INTEGER,
  isUserInput = false
) {
  if (value === null || value === undefined || value === '') {
    return {
      value: null,
      maskedValue: '',
    };
  }

  // Normaliza o valor para string, convertendo ponto para o separador decimal correto
  let strValue = typeof value === 'number'
    ? String(value).replace('.', decimalSeparator)
    : String(value).replace(new RegExp(`[^0-9${decimalSeparator}\\-]`, 'g'), '');

  // Trata número negativo
  let isNegative = false;
  if (allowNegative && strValue.includes('-')) {
    isNegative = true;
    strValue = strValue.replace(/-/g, '');
  }

  // Separa parte inteira e decimal
  let [intPart, decPart = ''] = strValue.split(decimalSeparator);

  if (isUserInput) {
    // Para entrada do usuário, tratamos como uma string contínua
    // e ajustamos a posição do separador decimal
    const fullNumber = (intPart + decPart).replace(/^0+/, '') || '0'; // Remove zeros à esquerda
    const totalLength = fullNumber.length;

    if (totalLength <= precision) {
      // Se o número total de dígitos é menor ou igual à precisão,
      // todos os dígitos vão para a parte decimal
      intPart = '0';
      decPart = fullNumber.padStart(precision, '0');
    } else {
      // Caso contrário, dividimos apropriadamente
      intPart = fullNumber.slice(0, totalLength - precision);
      decPart = fullNumber.slice(totalLength - precision);
    }
  }

  // Garante que temos uma parte inteira
  intPart = intPart || '0';

  // Aplica a precisão na parte decimal
  decPart = decPart.slice(0, precision).padEnd(precision, '0');

  // Converte para número para aplicar min/max
  let numValue = Number(`${isNegative ? '-' : ''}${intPart}.${decPart}`);
  numValue = Math.min(Math.max(numValue, minValue), maxValue);

  // Se o número é zero, não deve ser negativo
  if (numValue === 0) {
    isNegative = false;
  }

  // Formata o número com separadores
  let formattedValue = Math.abs(numValue).toFixed(precision);
  [intPart, decPart] = formattedValue.split('.');

  // Adiciona separadores de milhar
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  // Monta o valor final
  let maskedValue = `${prefix}${isNegative ? '-' : ''}${intPart}${precision > 0 ? decimalSeparator + decPart : ''
    }${suffix}`;

  return {
    value: numValue,
    maskedValue: maskedValue.trim(),
  };
}

export interface ArchbaseNumberEditProps<T, ID>
  extends TextInputProps,
  Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'>,
  React.RefAttributes<HTMLInputElement> {
  clearable?: boolean;
  clearButtonProps?: CloseButtonProps;
  dataSource?: ArchbaseDataSource<T, ID>;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
  size?: MantineSize;
  width?: string | number | undefined;
  className?: string;
  error?: string;
  onFocusExit?: FocusEventHandler<HTMLInputElement>;
  onFocusEnter?: FocusEventHandler<HTMLInputElement>;
  onChangeValue?: (maskValue: string, value: number | null, event: any) => void;
  value?: number | string;
  decimalSeparator?: string;
  thousandSeparator?: string;
  precision?: number;
  allowNegative?: boolean;
  allowEmpty?: boolean;
  prefix?: string;
  suffix?: string;
  integer?: boolean;
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
  onClear?: () => void;
  minValue?: number;
  maxValue?: number;
}

export function ArchbaseNumberEdit<T, ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly,
  style,
  className = '',
  onFocusExit = () => { },
  onFocusEnter = () => { },
  onChangeValue = () => { },
  value = 0,
  decimalSeparator = ',',
  thousandSeparator = '.',
  precision = 2,
  allowNegative = false,
  allowEmpty = false,
  clearable = true,
  prefix = '',
  suffix = '',
  integer = false,
  wrapperProps,
  clearButtonProps,
  rightSection,
  unstyled,
  classNames,
  width,
  size,
  error,
  innerRef,
  onClear,
  minValue = Number.MIN_SAFE_INTEGER,
  maxValue = Number.MAX_SAFE_INTEGER,
  ...others
}: ArchbaseNumberEditProps<T, ID>) {
  const [maskedValue, setMaskedValue] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<number | null>(0);
  const maskedValuePrev = useArchbasePrevious(maskedValue);
  const innerComponentRef = innerRef || useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | undefined>(error);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setInternalError(undefined);
  }, [maskedValue, currentValue]);

  const prepareProps = useCallback(() => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
    }

    // Se o valor é nulo/undefined/vazio
    if (!initialValue && initialValue !== 0) {
      return {
        maskedValue: '',
        value: allowEmpty ? null : 0
      };
    }

    // Converte string para número
    if (typeof initialValue === 'string') {
      initialValue = initialValue
        .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
        .replace(decimalSeparator, '.')
        .replace(/[^0-9-.]/g, '');
      initialValue = Number.parseFloat(initialValue);
    }

    // Aplica precisão se for número inteiro
    if (integer) {
      precision = 0;
    }

    return formatNumber(
      initialValue,
      precision,
      decimalSeparator,
      thousandSeparator,
      allowNegative,
      prefix,
      suffix,
      minValue,
      maxValue
    );
  }, [value, dataSource, dataField, precision, decimalSeparator, thousandSeparator, allowNegative, prefix, suffix, minValue, maxValue, integer, allowEmpty]);

  const loadDataSourceFieldValue = useCallback(() => {
    if (dataSource && dataField) {
      const result = prepareProps();
      setMaskedValue(result.maskedValue);
      setCurrentValue(result.value);
    }
  }, [dataSource, dataField, prepareProps]);

  const fieldChangedListener = useCallback(() => {
    loadDataSourceFieldValue();
  }, [loadDataSourceFieldValue]);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel ||
        event.type === DataSourceEventNames.afterEdit ||
        event.type === DataSourceEventNames.afterSave
      ) {
        loadDataSourceFieldValue();
        forceUpdate();
      }
      if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
        setInternalError(event.error);
      }
    }
  }, [dataSource, dataField, loadDataSourceFieldValue, forceUpdate]);

  useArchbaseDidMount(() => {
    const result = prepareProps();
    setMaskedValue(result.maskedValue);
    setCurrentValue(result.value);

    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    const result = prepareProps();
    setMaskedValue(result.maskedValue);
    setCurrentValue(result.value);
  }, [value]);

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent);
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let inputValue = event.target.value;
    const previousValue = maskedValue;

    // Se não permite números negativos e o usuário tentou digitar um sinal de menos,
    // mantém o valor anterior
    if (!allowNegative && inputValue.includes('-')) {
      inputValue = previousValue;
    } else if (allowNegative) {
      // When negative numbers are allowed, handle the minus sign special case
      const hasMinusSign = inputValue.includes('-');
      const valueWithoutMinus = inputValue.replace(/-/g, '');

      // If a minus sign exists, make the entire number negative
      if (hasMinusSign) {
        inputValue = '-' + valueWithoutMinus;
      } else {
        inputValue = valueWithoutMinus;
      }
    }

    const { maskedValue: newMaskedValue, value: newValue } = formatNumber(
      inputValue,
      precision,
      decimalSeparator,
      thousandSeparator,
      allowNegative,
      prefix,
      suffix,
      minValue,
      maxValue,
      true
    );

    setMaskedValue(newMaskedValue);
    setCurrentValue(newValue);

    if (dataSource && !dataSource.isBrowsing() && dataField) {
      dataSource.setFieldValue(dataField, newValue);
    }

    if (onChangeValue) {
      onChangeValue(newMaskedValue, newValue, event);
    }
  };

  const handleFocusEnter = (event: React.FocusEvent<HTMLInputElement>) => {
    if (innerComponentRef.current) {
      const value = innerComponentRef.current.value;
      const selectionStart = prefix.length;
      const selectionEnd = value.length - suffix.length;
      innerComponentRef.current.setSelectionRange(selectionStart, selectionEnd);
    }

    if (onFocusEnter) {
      onFocusEnter(event);
    }
  };

  const handleFocusExit = (event: React.FocusEvent<HTMLInputElement>) => {
    // Revalida o valor no blur
    const result = formatNumber(
      maskedValue,
      precision,
      decimalSeparator,
      thousandSeparator,
      allowNegative,
      prefix,
      suffix,
      minValue,
      maxValue
    );

    setMaskedValue(result.maskedValue);
    setCurrentValue(result.value);

    if (onFocusExit) {
      onFocusExit(event);
    }
  };

  const handleClear = () => {
    const result = formatNumber(
      '',
      precision,
      decimalSeparator,
      thousandSeparator,
      allowNegative,
      prefix,
      suffix,
      minValue,
      maxValue
    );

    setMaskedValue(result.maskedValue);
    setCurrentValue(result.value);

    if (dataSource && !dataSource.isBrowsing() && dataField) {
      dataSource.setFieldValue(dataField, allowEmpty ? null : 0);
    }

    if (onClear) {
      onClear();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;
    const value = input.value;

    // Handle minus key press - ignora completamente se allowNegative é false
    if (event.key === '-') {
      event.preventDefault();

      // Se não permite números negativos, simplesmente retorna mantendo o valor atual
      if (!allowNegative) {
        return;
      }

      // Remove prefix/suffix and any existing minus signs
      let numericValue = value
        .replace(prefix, '')
        .replace(suffix, '')
        .replace(/-/g, '');

      // Always make the number negative when pressing minus
      const newValue = numericValue === '0' || numericValue === ''
        ? '-0'
        : '-' + numericValue;

      const { maskedValue: newMaskedValue, value: newNumericValue } = formatNumber(
        newValue,
        precision,
        decimalSeparator,
        thousandSeparator,
        allowNegative,
        prefix,
        suffix,
        minValue,
        maxValue,
        true
      );

      setMaskedValue(newMaskedValue);
      setCurrentValue(newNumericValue);

      if (dataSource && !dataSource.isBrowsing() && dataField) {
        dataSource.setFieldValue(dataField, newNumericValue);
      }

      if (onChangeValue) {
        onChangeValue(newMaskedValue, newNumericValue, event);
      }

      // Restore cursor position
      setTimeout(() => {
        const newCursorPos = selectionStart;
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);

      return;
    }

    // Handle backspace
    if (event.key === 'Backspace' && suffix) {
      const valueWithoutSuffix = value.slice(0, -suffix.length);

      if (selectionStart !== selectionEnd) {
        return;
      }

      event.preventDefault();

      const distanceFromEnd = value.length - selectionStart;
      const adjustedCursorPos = Math.min(selectionStart, valueWithoutSuffix.length);
      const beforeCursor = valueWithoutSuffix.slice(0, adjustedCursorPos - 1);
      const afterCursor = valueWithoutSuffix.slice(adjustedCursorPos);
      const valueWithBackspace = beforeCursor + afterCursor;

      const { maskedValue: newMaskedValue, value: newValue } = formatNumber(
        valueWithBackspace,
        precision,
        decimalSeparator,
        thousandSeparator,
        allowNegative,
        prefix,
        suffix,
        minValue,
        maxValue,
        true
      );

      setMaskedValue(newMaskedValue);
      setCurrentValue(newValue);

      if (dataSource && !dataSource.isBrowsing() && dataField) {
        dataSource.setFieldValue(dataField, newValue);
      }

      if (onChangeValue) {
        onChangeValue(newMaskedValue, newValue, event);
      }

      // Reposiciona o cursor mantendo a mesma distância do final
      setTimeout(() => {
        const newCursorPos = selectionStart > valueWithoutSuffix.length
          ? newMaskedValue.length - distanceFromEnd // Mantém a mesma distância do final
          : Math.max(prefix.length, selectionStart - 1); // Posição normal para cursor dentro do número

        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const isReadOnly = () => {
    if (readOnly !== undefined) {
      return readOnly
    }
    if (dataSource) {
      return dataSource.isBrowsing();
    }
    return false
  };

  const _rightSection =
    rightSection ||
    (clearable && maskedValue && !isReadOnly() ? (
      <CloseButton
        variant="transparent"
        onMouseDown={(event) => event.preventDefault()}
        tabIndex={-1}
        onClick={handleClear}
        unstyled={unstyled}
        {...clearButtonProps}
      />
    ) : null);

  return (
    <TextInput
      {...others}
      disabled={disabled}
      className={className}
      ref={innerComponentRef}
      type="text"
      value={maskedValue}
      rightSection={_rightSection}
      size={size}
      error={internalError}
      style={{
        width,
        ...style,
      }}
      readOnly={isReadOnly()}
      onChange={handleChange}
      onBlur={handleFocusExit}
      onFocus={handleFocusEnter}
      onKeyDown={handleKeyDown}
      styles={{
        input: {
          textAlign: 'right',
        },
      }}
    />
  );
}

ArchbaseNumberEdit.defaultProps = {
  decimalSeparator: ',',
  thousandSeparator: '.',
  precision: 2,
  allowNegative: false,
  prefix: '',
  suffix: '',
  integer: false,
  disabled: false,
  allowEmpty: true,
  clearable: true,
  value: '0',
};

ArchbaseNumberEdit.displayName = 'ArchbaseNumberEdit';