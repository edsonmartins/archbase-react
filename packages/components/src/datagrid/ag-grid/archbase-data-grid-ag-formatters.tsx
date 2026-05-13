/**
 * ArchbaseDataGridAG Cell Renderers
 *
 * AG Grid cell renderer components for various data types.
 */
import React, { ReactNode } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@mantine/core';
import { ArchbaseMasker, MaskOptions, convertISOStringToDate } from '@archbase/core';
import type { ICellRendererParams } from 'ag-grid-community';
import type { FieldDataType } from './archbase-data-grid-ag-types';

/**
 * Check if string is valid base64
 */
const isBase64 = (str: string): boolean => {
  if (!str || typeof str !== 'string' || str.length < 4) {
    return false;
  }

  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(str)) {
    return false;
  }

  try {
    const decoded = atob(str);
    const printableRatio =
      decoded.split('').filter((c) => {
        const code = c.charCodeAt(0);
        return (code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9;
      }).length / decoded.length;

    return printableRatio > 0.9;
  } catch {
    return false;
  }
};

/**
 * Decode base64 to UTF-8 text
 */
const decodeBase64 = (str: string): string => {
  try {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return str;
  }
};

/**
 * Text cell renderer with optional mask and auto base64 decoding
 */
export const TextCellRenderer = (
  params: ICellRendererParams,
  maskOptions?: MaskOptions
): ReactNode => {
  const value = params.value;
  if (value === null || value === undefined) {
    return <span></span>;
  }

  let displayValue = String(value);

  if (isBase64(displayValue)) {
    displayValue = decodeBase64(displayValue);
  }

  if (maskOptions) {
    displayValue = ArchbaseMasker.toPattern(displayValue, maskOptions);
  }

  return <span>{displayValue}</span>;
};

/**
 * Integer cell renderer
 */
export const IntegerCellRenderer = (params: ICellRendererParams): ReactNode => {
  const value = params.value;
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
};

/**
 * Float cell renderer
 */
export const FloatCellRenderer = (params: ICellRendererParams): ReactNode => {
  const value = params.value;
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
};

/**
 * Currency cell renderer (BRL format)
 */
export const CurrencyCellRenderer = (params: ICellRendererParams): ReactNode => {
  const value = params.value;
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  try {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);

    return <span style={{ textAlign: 'right', display: 'block' }}>{formatted}</span>;
  } catch (e) {
    console.error('Error formatting currency:', e);
    return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}</span>;
  }
};

/**
 * Percent cell renderer
 */
export const PercentCellRenderer = (
  params: ICellRendererParams,
  decimalPlaces: number = 2
): ReactNode => {
  const value = params.value;
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const numValue = Number.isNaN(Number(value)) ? 0 : Number(value);

  try {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(numValue / 100);

    return <span style={{ textAlign: 'right', display: 'block' }}>{formatted}</span>;
  } catch (e) {
    console.error('Error formatting percent:', e);
    return <span style={{ textAlign: 'right', display: 'block' }}>{numValue}%</span>;
  }
};

/**
 * Boolean cell renderer with Mantine checkbox
 */
export const BooleanCellRenderer = (params: ICellRendererParams): ReactNode => {
  const value = params.value;
  const checked = Boolean(value);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Checkbox readOnly checked={checked} />
    </div>
  );
};

/**
 * Date cell renderer
 */
export const DateCellRenderer = (
  params: ICellRendererParams,
  dateFormat: string = 'dd/MM/yyyy'
): ReactNode => {
  const value = params.value;
  if (!value) {
    return <span></span>;
  }

  try {
    const date = convertISOStringToDate(value);
    const formatted = format(date, dateFormat);

    return <span style={{ textAlign: 'center', display: 'block' }}>{formatted}</span>;
  } catch (error) {
    console.error('Error formatting date:', error);
    return <span>Data inválida</span>;
  }
};

/**
 * DateTime cell renderer
 */
export const DateTimeCellRenderer = (
  params: ICellRendererParams,
  dateTimeFormat: string = 'dd/MM/yyyy HH:mm:ss'
): ReactNode => {
  const value = params.value;
  if (!value) {
    return <span></span>;
  }

  try {
    const date = convertISOStringToDate(value);
    const formatted = format(date, dateTimeFormat);

    return <span style={{ textAlign: 'center', display: 'block' }}>{formatted}</span>;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return <span>Data/hora inválida</span>;
  }
};

/**
 * Time cell renderer
 */
export const TimeCellRenderer = (
  params: ICellRendererParams,
  timeFormat: string = 'HH:mm:ss'
): ReactNode => {
  const value = params.value;
  if (!value) {
    return <span></span>;
  }

  try {
    if (typeof value === 'string') {
      if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        return <span style={{ textAlign: 'center', display: 'block' }}>{value}</span>;
      }

      const date = new Date(value);
      return <span style={{ textAlign: 'center', display: 'block' }}>{format(date, timeFormat)}</span>;
    }

    if (value instanceof Date) {
      return <span style={{ textAlign: 'center', display: 'block' }}>{format(value, timeFormat)}</span>;
    }

    if (typeof value === 'number') {
      const hours = Math.floor(value / 3600000);
      const minutes = Math.floor((value % 3600000) / 60000);
      const seconds = Math.floor((value % 60000) / 1000);

      return (
        <span style={{ textAlign: 'center', display: 'block' }}>
          {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
        </span>
      );
    }

    return <span style={{ textAlign: 'center', display: 'block' }}>{String(value)}</span>;
  } catch (error) {
    console.error('Error formatting time:', error);
    return <span>Hora inválida</span>;
  }
};

/**
 * Enum cell renderer
 */
export const EnumCellRenderer = (
  params: ICellRendererParams,
  enumValues: Array<{ label: string; value: string }>
): ReactNode => {
  const value = params.value;
  if (value === null || value === undefined) {
    return <span></span>;
  }

  const option = enumValues.find((opt) => opt.value === value);
  return <span>{option ? option.label : String(value)}</span>;
};

/**
 * UUID cell renderer
 */
export const UUIDCellRenderer = (params: ICellRendererParams): ReactNode => {
  const value = params.value;
  if (!value) {
    return <span></span>;
  }

  const str = String(value);

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)) {
    return <span>{str}</span>;
  }

  if (/^[0-9a-f]{32}$/i.test(str)) {
    const formatted = `${str.substring(0, 8)}-${str.substring(8, 12)}-${str.substring(12, 16)}-${str.substring(16, 20)}-${str.substring(20)}`;
    return <span>{formatted}</span>;
  }

  return <span>{str}</span>;
};

/**
 * Image cell renderer
 */
export const ImageCellRenderer = (
  params: ICellRendererParams,
  options?: { maxWidth?: number; maxHeight?: number }
): ReactNode => {
  const value = params.value;
  if (!value) {
    return <span></span>;
  }

  const { maxWidth = 40, maxHeight = 40 } = options || {};
  let src = String(value);

  // If it's base64 data without prefix, add it
  if (isBase64(src) && !src.startsWith('data:')) {
    src = `data:image/png;base64,${src}`;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <img
        src={src}
        alt=""
        style={{
          maxWidth,
          maxHeight,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

/**
 * Get cell renderer by data type
 */
export const getCellRendererByDataType = (
  dataType: FieldDataType,
  customRender?: (params: ICellRendererParams) => ReactNode,
  options?: {
    maskOptions?: MaskOptions;
    dateFormat?: string;
    dateTimeFormat?: string;
    timeFormat?: string;
    enumValues?: Array<{ label: string; value: string }>;
    decimalPlaces?: number;
  }
): ((params: ICellRendererParams) => ReactNode) => {
  if (customRender) {
    return customRender;
  }

  switch (dataType) {
    case 'text':
      return (params) => TextCellRenderer(params, options?.maskOptions);
    case 'integer':
      return IntegerCellRenderer;
    case 'float':
      return FloatCellRenderer;
    case 'currency':
      return CurrencyCellRenderer;
    case 'boolean':
      return BooleanCellRenderer;
    case 'date':
      return (params) => DateCellRenderer(params, options?.dateFormat);
    case 'datetime':
      return (params) => DateTimeCellRenderer(params, options?.dateTimeFormat);
    case 'time':
      return (params) => TimeCellRenderer(params, options?.timeFormat);
    case 'enum':
      return (params) => EnumCellRenderer(params, options?.enumValues || []);
    case 'uuid':
      return UUIDCellRenderer;
    case 'image':
      return (params) => ImageCellRenderer(params);
    default:
      return (params) => TextCellRenderer(params);
  }
};

/**
 * Get recommended alignment by data type
 */
export const getAlignmentByDataType = (
  dataType: FieldDataType,
  customAlign?: 'left' | 'center' | 'right'
): 'left' | 'center' | 'right' => {
  if (customAlign) {
    return customAlign;
  }

  switch (dataType) {
    case 'integer':
    case 'currency':
    case 'float':
      return 'right';
    case 'boolean':
    case 'date':
    case 'datetime':
    case 'time':
    case 'image':
      return 'center';
    default:
      return 'left';
  }
};

/**
 * Create value formatter for AG Grid column
 */
export const createValueFormatter = (
  dataType: FieldDataType,
  options?: {
    dateFormat?: string;
    dateTimeFormat?: string;
    timeFormat?: string;
    enumValues?: Array<{ label: string; value: string }>;
  }
): ((params: any) => string) | undefined => {
  switch (dataType) {
    case 'date':
      return (params) => {
        if (!params.value) return '';
        try {
          const date = convertISOStringToDate(params.value);
          return format(date, options?.dateFormat || 'dd/MM/yyyy');
        } catch {
          return String(params.value);
        }
      };
    case 'datetime':
      return (params) => {
        if (!params.value) return '';
        try {
          const date = convertISOStringToDate(params.value);
          return format(date, options?.dateTimeFormat || 'dd/MM/yyyy HH:mm:ss');
        } catch {
          return String(params.value);
        }
      };
    case 'currency':
      return (params) => {
        if (params.value === null || params.value === undefined) return '';
        const numValue = Number.isNaN(Number(params.value)) ? 0 : Number(params.value);
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(numValue);
      };
    case 'enum':
      return (params) => {
        if (params.value === null || params.value === undefined) return '';
        const option = options?.enumValues?.find((opt) => opt.value === params.value);
        return option ? option.label : String(params.value);
      };
    case 'boolean':
      return (params) => {
        if (params.value === null || params.value === undefined) return '';
        return params.value ? 'Sim' : 'Não';
      };
    default:
      return undefined;
  }
};
