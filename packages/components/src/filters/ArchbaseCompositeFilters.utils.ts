import { builder, emit, EQ, NEQ, GT, LT, GE, LE, IN, OUT, BT } from '@archbase/core';
import type {
  ArchbaseActiveFilter,
  ArchbaseFilterOperator,
  FilterValue,
  ApiFilterFormat,
} from './ArchbaseCompositeFilters.types';

/**
 * Mapeamento de operadores do ArchbaseCompositeFilters para operadores RSQL
 */
const OPERATOR_MAP: Record<ArchbaseFilterOperator, string> = {
  // String
  'contains': '=like=',
  'starts_with': '=like=',
  'ends_with': '=like=',
  '=': EQ,
  '!=': NEQ,
  // Numérico
  '>': GT,
  '<': LT,
  '>=': GE,
  '<=': LE,
  // Nulo
  'is_null': '=null=',
  'is_not_null': '=notnull=',
  // Intervalo
  'between': BT,
  // Data
  'date_before': LT,
  'date_after': GT,
  'date_between': BT,
  // Múltiplos valores
  'in': IN,
  'not_in': OUT,
};

/**
 * Converte um filtro ativo para o formato RSQL
 *
 * @param filter - O filtro ativo a converter
 * @returns Uma string RSQL representando o filtro
 *
 * @example
 * ```ts
 * const filter: ArchbaseActiveFilter = {
 *   id: '1',
 *   key: 'nome',
 *   label: 'Nome',
 *   type: 'text',
 *   operator: 'contains',
 *   value: 'João',
 *   displayValue: 'João'
 * };
 * const rsql = convertFilterToRSQL(filter); // "nome=like=*João*"
 * ```
 */
export function convertFilterToRSQL(filter: ArchbaseActiveFilter): string {
  const { key, operator, value, type } = filter;
  const rsqlOperator = OPERATOR_MAP[operator];

  // Tratamento especial para operadores que não precisam de valor
  if (operator === 'is_null') {
    return `${key}=null=true`;
  }
  if (operator === 'is_not_null') {
    return `${key}=null=false`;
  }

  // Formata o valor baseado no tipo e operador
  const formattedValue = formatValueForRSQL(value, type, operator);

  // Para contains, starts_with, ends_with, usa o operador =like= com curingas
  if (operator === 'contains') {
    return `${key}=like=*${formattedValue}*`;
  }
  if (operator === 'starts_with') {
    return `${key}=like=${formattedValue}*`;
  }
  if (operator === 'ends_with') {
    return `${key}=like=*${formattedValue}`;
  }

  // Para between
  if (operator === 'between' || operator === 'date_between') {
    if (Array.isArray(value)) {
      const [start, end] = value;
      const startStr = formatSingleValue(start, type);
      const endStr = formatSingleValue(end, type);
      return emit(builder.bt(key, startStr, endStr));
    }
  }

  // Para in/not_in (múltiplos valores)
  if (operator === 'in' || operator === 'not_in') {
    if (Array.isArray(value)) {
      const values = value.map(v => String(v));
      return emit(
        operator === 'in'
          ? builder.in(key, values)
          : builder.out(key, values)
      );
    }
  }

  // Operadores de comparação padrão
  if (rsqlOperator === EQ) {
    return emit(builder.eq(key, formattedValue));
  }
  if (rsqlOperator === NEQ) {
    return emit(builder.neq(key, formattedValue));
  }
  if (rsqlOperator === GT) {
    return emit(builder.gt(key, formattedValue));
  }
  if (rsqlOperator === LT) {
    return emit(builder.lt(key, formattedValue));
  }
  if (rsqlOperator === GE) {
    return emit(builder.ge(key, formattedValue));
  }
  if (rsqlOperator === LE) {
    return emit(builder.le(key, formattedValue));
  }

  // Fallback para operadores customizados
  return `${key}${rsqlOperator}${formattedValue}`;
}

/**
 * Formata um valor para RSQL baseado no tipo de dado
 */
function formatValueForRSQL(
  value: FilterValue,
  type: string,
  operator: ArchbaseFilterOperator
): string {
  // Para between, trata como array
  if ((operator === 'between' || operator === 'date_between') && Array.isArray(value)) {
    const [start, end] = value;
    return `${formatSingleValue(start, type)},${formatSingleValue(end, type)}`;
  }

  // Para in/not_in, trata como array
  if ((operator === 'in' || operator === 'not_in') && Array.isArray(value)) {
    return value.map(v => formatSingleValue(v, type)).join(',');
  }

  return formatSingleValue(value, type);
}

/**
 * Formata um único valor para RSQL
 */
function formatSingleValue(value: FilterValue, type: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type) {
    case 'date':
    case 'datetime':
      if (value instanceof Date) {
        return value.toISOString();
      }
      return String(value);

    case 'boolean':
      return value ? 'true' : 'false';

    case 'integer':
    case 'float':
    case 'currency':
      return String(value);

    case 'time':
      return String(value);

    default:
      return String(value);
  }
}

/**
 * Converte uma lista de filtros ativos para uma query RSQL completa
 *
 * @param filters - Array de filtros ativos
 * @returns Uma string RSQL com todos os filtros combinados com AND ( ; )
 *
 * @example
 * ```ts
 * const filters: ArchbaseActiveFilter[] = [
 *   { id: '1', key: 'nome', label: 'Nome', type: 'text', operator: 'contains', value: 'João', displayValue: 'João' },
 *   { id: '2', key: 'idade', label: 'Idade', type: 'integer', operator: '>', value: 18, displayValue: '18' }
 * ];
 * const rsql = convertToRSQL(filters); // "nome=like=*João*;idade>18"
 * ```
 */
export function convertToRSQL(filters: ArchbaseActiveFilter[]): string | undefined {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  // Converte cada filtro para RSQL
  const rsqlParts = filters.map(convertFilterToRSQL);

  // Combina com AND implícito ( ; em RSQL )
  return rsqlParts.join(';');
}

/**
 * Converte um filtro para o formato de API
 */
export function convertToApiFormat(filter: ArchbaseActiveFilter): ApiFilterFormat {
  return {
    field: filter.key,
    operator: filter.operator,
    value: filter.value,
  };
}

/**
 * Converte uma lista de filtros para o formato de API
 */
export function convertToApiFormatList(filters: ArchbaseActiveFilter[]): ApiFilterFormat[] {
  return filters.map(convertToApiFormat);
}

/**
 * Obtém o valor de exibição formatado para um filtro
 */
export function getDisplayValue(
  value: FilterValue,
  type: string,
  operator: ArchbaseFilterOperator,
  options?: Array<{ value: string; label: string }>
): string {
  // Para null checks
  if (operator === 'is_null') {
    return 'is null';
  }
  if (operator === 'is_not_null') {
    return 'is not null';
  }

  // Para selects, usa o label
  if (options && Array.isArray(value)) {
    return value
      .map(v => options.find(opt => opt.value === v)?.label || v)
      .join(', ');
  }
  if (options && typeof value === 'string') {
    return options.find(opt => opt.value === value)?.label || value;
  }

  // Para date range
  if (Array.isArray(value) && value.length === 2) {
    const [start, end] = value;
    const startStr = start instanceof Date ? start.toLocaleDateString() : String(start || '');
    const endStr = end instanceof Date ? end.toLocaleDateString() : String(end || '');
    return `${startStr} - ${endStr}`;
  }

  // Para arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Para boolean
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  // Para datas
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return String(value);
}

/**
 * Obtém os operadores disponíveis para um tipo de dado
 */
export function getOperatorsForType(
  type: string
): ArchbaseFilterOperator[] {
  const textOperators: ArchbaseFilterOperator[] = ['contains', 'starts_with', 'ends_with', '=', '!=', 'is_null', 'is_not_null'];
  const numberOperators: ArchbaseFilterOperator[] = ['=', '!=', '>', '<', '>=', '<=', 'is_null', 'is_not_null', 'between'];
  const dateOperators: ArchbaseFilterOperator[] = ['=', '!=', 'date_before', 'date_after', 'date_between', 'is_null', 'is_not_null'];
  const selectOperators: ArchbaseFilterOperator[] = ['=', '!=', 'in', 'not_in', 'is_null', 'is_not_null'];
  const booleanOperators: ArchbaseFilterOperator[] = ['=', '!='];

  switch (type) {
    case 'text':
    case 'uuid':
      return textOperators;
    case 'integer':
    case 'float':
    case 'currency':
      return numberOperators;
    case 'date':
    case 'datetime':
    case 'time':
      return dateOperators;
    case 'enum':
    case 'image':
      return selectOperators;
    case 'boolean':
      return booleanOperators;
    default:
      return textOperators;
  }
}

/**
 * Obtém o operador padrão para um tipo de dado
 */
export function getDefaultOperatorForType(type: string): ArchbaseFilterOperator {
  switch (type) {
    case 'text':
    case 'uuid':
      return 'contains';
    case 'integer':
    case 'float':
    case 'currency':
      return '=';
    case 'date':
    case 'datetime':
    case 'time':
      return '=';
    case 'enum':
    case 'image':
      return '=';
    case 'boolean':
      return '=';
    default:
      return 'contains';
  }
}

/**
 * Valida se um valor é válido para um operador e tipo
 */
export function validateFilterValue(
  value: FilterValue,
  type: string,
  operator: ArchbaseFilterOperator
): boolean {
  // is_null e is_not_null não precisam de valor
  if (operator === 'is_null' || operator === 'is_not_null') {
    return true;
  }

  // between requer array com 2 elementos
  if (operator === 'between' || operator === 'date_between') {
    return Array.isArray(value) && value.length === 2;
  }

  // in/not_in requer array com pelo menos 1 elemento
  if (operator === 'in' || operator === 'not_in') {
    return Array.isArray(value) && value.length > 0;
  }

  // Valor vazio
  if (value === null || value === undefined || value === '') {
    return false;
  }

  return true;
}

/**
 * Gera um ID único para um filtro
 */
export function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
