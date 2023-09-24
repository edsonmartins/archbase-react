import { Flex, Input, MantineNumberSize, MantineSize } from '@mantine/core';
import { IconArrowRight, IconCalendar } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { CSSProperties, ReactNode } from 'react';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';
import { DateValue } from '@mantine/dates';

export interface ArchbaseDatePickerRangeProps {
  /** Indicador se o date picker range está desabilitado */
  disabled?: boolean;
  /** Indicador se o date picker range é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do date picker range é obrigatório */
  required?: boolean;
  /** Valor inicial */
  value?: string;
  /** Estilo do date picker range */
  style?: CSSProperties;
  /** Tamanho do date picker range */
  size?: MantineSize;
  /** Largura do date picker range */
  width?: MantineNumberSize;
  /** Icone à direita */
  icon?: ReactNode;
  /** Texto sugestão do date picker range */
  placeholderStart?: string;
  /** Texto sugestão do date picker range */
  placeholderEnd?: string;
  /** Título do date picker range */
  label?: string;
  /** Descrição do date picker range */
  description?: string;
  /** Último erro ocorrido no date picker range */
  error?: string;
  /** Evento quando o foco sai do date picker range */
  onFocusExit?: React.FocusEvent<HTMLInputElement>;
  /** Evento quando o date picker range recebe o foco */
  onFocusEnter?: React.FocusEvent<HTMLInputElement>;
  /** Evento quando o valor do date picker range é alterado */
  onChangeValue?: (value: any, event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  /** Evento quando o valor do range do date picker range é alterado */
  onSelectDateRange?: (value: DateValue[]) => void;
  /** Referência para o componente interno data inicial*/
  innerRefStart?: React.RefObject<HTMLInputElement> | undefined;
  /** Referência para o componente interno data final*/
  innerRefEnd?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseDatePickerRange({
  label,
  disabled,
  readOnly,
  size,
  width,
  style,
  onSelectDateRange,
  onFocusEnter,
  onFocusExit,
  placeholderStart,
  placeholderEnd,
  error,
}: ArchbaseDatePickerRangeProps) {
  const [startDate, setStartDate] = useState<DateValue>();
  const [endDate, setEndDate] = useState<DateValue>();
  const [internalError, setInternalError] = useState<string | undefined>(error);

  useEffect(() => {
    setInternalError(undefined);
  }, [startDate, endDate]);

  const handleSelectRange = (sDt?: DateValue, eDt?: DateValue) => {
    setStartDate(sDt);
    setEndDate(eDt);
    if (onSelectDateRange && sDt && eDt) {
      onSelectDateRange([sDt, eDt]);
    }
  };

  return (
    <Input.Wrapper
      label={label}
      size={size!}
      error={internalError}
      style={{
        width,
        ...style,
      }}
    >
      <Flex gap="sm" justify="flex-start" align="center" direction="row">
        <ArchbaseDatePickerEdit
          clearable={true}
          rightSection={<IconCalendar />}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholderStart}
          onFocusEnter={onFocusEnter}
          onFocusExit={onFocusExit}
          onChange={(value: DateValue) => handleSelectRange(value, endDate)}
          style={{ width: width ? width : 180 }}
        />
        <IconArrowRight size={'1rem'} />
        <ArchbaseDatePickerEdit
          clearable={true}
          rightSection={<IconCalendar />}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholderEnd}
          onFocusEnter={onFocusEnter}
          onFocusExit={onFocusExit}
          onChange={(value: DateValue) => handleSelectRange(startDate, value)}
          style={{ width: width ? width : 180 }}
        />
      </Flex>
    </Input.Wrapper>
  );
}
