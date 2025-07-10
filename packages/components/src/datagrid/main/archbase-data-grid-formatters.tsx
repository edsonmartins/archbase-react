import React, { ReactNode } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@mantine/core';
import { ArchbaseMasker, MaskOptions, convertISOStringToDate } from '@archbase/core';


/**
 * Renderers padrão para cada tipo de dados no ArchbaseDataGrid
 */

/**
 * Renderiza texto com máscara opcional
 */
export const renderText = (cell: any, maskOptions?: MaskOptions): ReactNode => {
  const value = cell.getValue();
  if (value === null || value === undefined) {
    return <span></span>;
  }

  let displayValue = String(value);

  if (maskOptions) {
    displayValue = ArchbaseMasker.toPattern(displayValue, maskOptions);
  }

  return <span>{displayValue}</span>;
};

/**
 * Renderiza números inteiros
 */
export const renderInteger = (cell: any): ReactNode => {
  const value = cell.getValue();
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
};

/**
 * Renderiza valores monetários
 */
export const renderCurrency = (cell: any): ReactNode => {
  const value = cell.getValue();
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  try {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);

    return <span style={{ textAlign: 'right', display: 'block' }}>{formatted}</span>;
  } catch (e) {
    console.error('Erro ao formatar moeda:', e);
    return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
  }
};

/**
 * Renderiza valores com decimais
 */
export const renderFloat = (cell: any): ReactNode => {
  const value = cell.getValue();
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  try {
    return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
  } catch (e) {
    console.error('Erro ao formatar moeda:', e);
    return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
  }
};

/**
 * Renderiza valores percentuais
 */
export const renderPercent = (cell: any, decimalPlaces: number = 2): ReactNode => {
  const value = cell.getValue();
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  try {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(numValue / 100); // Divide por 100 pois o style:'percent' já multiplica por 100

    return <span style={{ textAlign: 'right', display: 'block' }}>{formatted}</span>;
  } catch (e) {
    console.error('Erro ao formatar percentual:', e);
    return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}%</span>;
  }
};

/**
 * Renderiza valores booleanos com checkbox
 */
export const renderBoolean = (cell: any): ReactNode => {
  const value = cell.getValue();
  const checked = Boolean(value);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Checkbox readOnly checked={checked} />
    </div>
  );
};

/**
 * Renderiza datas
 */
export const renderDate = (cell: any, dateFormat: string = 'dd/MM/yyyy'): ReactNode => {
  const value = cell.getValue();
  if (!value) {
    return <span></span>;
  }

  try {
    const date = convertISOStringToDate(value);
    const formatted = format(date, dateFormat);

    return (
      <span style={{ textAlign: 'center', display: 'block' }}>
        {formatted}
      </span>
    );
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return <span>Data inválida</span>;
  }
};

/**
 * Renderiza data e hora
 */
export const renderDateTime = (cell: any, dateTimeFormat: string = 'dd/MM/yyyy HH:mm:ss'): ReactNode => {
  const value = cell.getValue();
  if (!value) {
    return <span></span>;
  }

  try {
    const date = convertISOStringToDate(value);
    const formatted = format(date, dateTimeFormat);

    return (
      <span style={{ textAlign: 'center', display: 'block' }}>
        {formatted}
      </span>
    );
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return <span>Data/hora inválida</span>;
  }
};

/**
 * Renderiza valores de hora
 */
export const renderTime = (cell: any, timeFormat: string = 'HH:mm:ss'): ReactNode => {
  const value = cell.getValue();
  if (!value) {
    return <span></span>;
  }

  try {
    if (typeof value === 'string') {
      // Se já for uma string de hora formatada, retorna como está
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return <span>{value}</span>;
      }

      // Tenta converter para Date
      const date = new Date(value);
      return <span>{format(date, timeFormat)}</span>;
    }

    if (value instanceof Date) {
      return <span>{format(value, timeFormat)}</span>;
    }

    // Se for número, assume milissegundos desde meia-noite
    if (typeof value === 'number') {
      const hours = Math.floor(value / 3600000);
      const minutes = Math.floor((value % 3600000) / 60000);
      const seconds = Math.floor((value % 60000) / 1000);

      return <span>{
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }</span>;
    }

    return <span>{String(value)}</span>;
  } catch (error) {
    console.error('Erro ao formatar hora:', error);
    return <span>Hora inválida</span>;
  }
};

/**
 * Renderiza valores de enum/lista
 */
export const renderEnum = (cell: any, enumValues: Array<{ label: string; value: string }>): ReactNode => {
  const value = cell.getValue();
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const option = enumValues.find(opt => opt.value === value);
  return <span>{option ? option.label : String(value)}</span>;
};

/**
 * Renderiza UUID formatado
 */
export const renderUUID = (cell: any): ReactNode => {
  const value = cell.getValue();
  if (!value) {
    return <span></span>;
  }

  const str = String(value);

  // Verifica se já é um UUID formatado
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return <span>{str}</span>;
  }

  // Tenta formatar se for um UUID sem formatação
  if (/^[0-9a-f]{32}$/i.test(str)) {
    const formatted = `${str.substring(0, 8)}-${str.substring(8, 12)}-${str.substring(12, 16)}-${str.substring(16, 20)}-${str.substring(20)}`;
    return <span>{formatted}</span>;
  }

  return <span>{str}</span>;
};

/**
 * Retorna o renderer adequado com base no tipo de dado
 */
export const getRendererByDataType = (
  dataType: string,
  customRender?: (data: any) => ReactNode,
  options?: any
): ((cell: any) => ReactNode) => {
  // Se tiver um renderer personalizado, use-o
  if (customRender) {
    return customRender;
  }

  // Caso contrário, use o renderer padrão para o tipo de dado
  switch (dataType) {
    case 'text':
      return (cell) => renderText(cell, options?.maskOptions);
    case 'integer':
      return renderInteger;
    case 'float':
      return renderFloat;
    case 'currency':
      return renderCurrency;
    case 'percent':
      return (cell) => renderPercent(cell, options?.decimalPlaces);
    case 'boolean':
      return renderBoolean;
    case 'date':
      return (cell) => renderDate(cell, options?.dateFormat);
    case 'datetime':
      return (cell) => renderDateTime(cell, options?.dateTimeFormat);
    case 'time':
      return (cell) => renderTime(cell, options?.timeFormat);
    case 'enum':
      return (cell) => renderEnum(cell, options?.enumValues);
    case 'uuid':
      return renderUUID;
    default:
      return renderText;
  }
};

/**
 * Retorna o alinhamento recomendado com base no tipo de dado
 */
export const getAlignmentByDataType = (dataType: string, customAlign?: string): string => {
  // Se um alinhamento personalizado for fornecido, use-o
  if (customAlign) {
    return customAlign;
  }

  // Caso contrário, use o alinhamento padrão para o tipo de dado
  switch (dataType) {
    case 'integer':
      return 'right';
    case 'currency':
      return 'right';
    case 'float':
      return 'right';
    case 'percent':
      return 'right';
    case 'boolean':
      return 'center';
    case 'date':
      return 'center';
    case 'datetime':
      return 'center';
    case 'time':
      return 'center';
    default:
      return 'left';
  }
};
