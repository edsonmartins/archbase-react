import { Flex, Input, MantineNumberSize, MantineSize } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { IconArrowRight, IconCalendar } from '@tabler/icons-react';
import React, { useState } from 'react';
import { CSSProperties, ReactNode } from 'react';
import { ArchbaseDateTimePickerEdit } from './ArchbaseDateTimePickerEdit';

export interface ArchbaseDateTimePickerRangeProps {
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
  /** Evento quando o valor do range do date picker range é alterado */
  onSelectDateRange?: (value: DateValue[]) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  /** Referência para o componente interno data inicial*/
  innerRefStart?: React.RefObject<HTMLInputElement> | undefined;
  /** Referência para o componente interno data final*/
  innerRefEnd?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseDateTimePickerRange({
  label,
  disabled,
  readOnly,
  size,
  width,
  style,
  description,
  onSelectDateRange,
  placeholderStart,
  placeholderEnd,
  onFocusExit,
  onFocusEnter,
  icon,
  innerRefStart,
  innerRefEnd,
  error,
}: ArchbaseDateTimePickerRangeProps) {
  const [startDate, setStartDate] = useState<DateValue>();
  const [endDate, setEndDate] = useState<DateValue>();
  const [internalError, setInternalError] = useState<string | undefined>(error);

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
      description={description}
      style={{
        width,
        ...style,
      }}
    >
      <Flex gap="sm" justify="flex-start" align="center" direction="row">
        <ArchbaseDateTimePickerEdit
          clearable={true}
          rightSection={icon ? icon : <IconCalendar />}
          readOnly={readOnly}
          placeholder={placeholderStart}
          disabled={disabled}
          ref={innerRefStart}
          onFocusEnter={onFocusEnter}
          onFocusExit={onFocusExit}
          onChange={(value: DateValue) => handleSelectRange(value, endDate)}
          style={{ width: width ? width : 180 }}
        />
        <IconArrowRight size={'1rem'} />
        <ArchbaseDateTimePickerEdit
          clearable={true}
          rightSection={icon ? icon : <IconCalendar />}
          placeholder={placeholderEnd}
          readOnly={readOnly}
          disabled={disabled}
          ref={innerRefEnd}
          onFocusEnter={onFocusEnter}
          onFocusExit={onFocusExit}
          onChange={(value: DateValue) => handleSelectRange(startDate, value)}
          style={{ width: width ? width : 180 }}
        />
      </Flex>
    </Input.Wrapper>
  );
}
