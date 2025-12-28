import { GridFilterModel, GridRowId, GridSortModel, GridFilterItem, GridColDef } from '@mui/x-data-grid';
import type {
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
  ArchbaseFieldDataType,
  ArchbaseFilterOperator,
} from '../../filters/ArchbaseCompositeFilters.types';

/**
 * Obtém o ID de uma linha de forma segura
 */
export const safeGetRowId = <T extends object>(
  row: T,
  getRowId?: (row: T) => any
): GridRowId | undefined => {
  if (!row) return undefined;

  try {
    if (getRowId) {
      return getRowId(row);
    }
    return (row as any).id;
  } catch (error) {
    console.error('Error in safeGetRowId:', error);
    return undefined;
  }
};

/**
 * Constrói uma expressão de busca global
 */
export const buildGlobalFilterExpression = (filterValue: string, columns: any[]): string | undefined => {
  if (!filterValue || !columns || columns.length === 0) {
    return undefined;
  }

  try {
    console.log('[buildGlobalFilterExpression] columns recebidas:', columns.map(c => ({
      field: c.field,
      enableGlobalFilter: c.enableGlobalFilter
    })));

    // Filtrar colunas que suportam busca global e excluir a coluna "actions"
    const filterableColumns = columns.filter((col) => {
      try {
        return col.field !== 'actions' && col.enableGlobalFilter !== false;
      } catch (e) {
        // Se der erro ao acessar enableGlobalFilter, considere a coluna como filtrável por padrão
        return col.field !== 'actions';
      }
    });

    console.log('[buildGlobalFilterExpression] colunas filtráveis:', filterableColumns.map(c => c.field));

    if (filterableColumns.length === 0) {
      return undefined;
    }

    // Construir expressões de filtro
    const filterExpressions = filterableColumns.map((col) => `${col.field}==^*${filterValue}*`);

    console.log('[buildGlobalFilterExpression] expressão final:', filterExpressions.join(','));

    return filterExpressions.join(',');
  } catch (error) {
    console.error('Erro ao construir expressão de filtro global:', error);

    // Em caso de erro, use uma abordagem simplificada que filtra apenas por campo
    const safeColumns = columns.filter((col) => col.field && col.field !== 'actions');
    if (safeColumns.length === 0) return undefined;

    return safeColumns.map((col) => `${col.field}==^*${filterValue}*`).join(',');
  }
};

/**
 * Constrói uma expressão de filtro
 */
export const buildFilterExpression = (
  filterModel: GridFilterModel,
  columns: any[]
): string | undefined => {
  // Se não tiver filtros, verificar se tem filtro global
  if (!filterModel.items || filterModel.items.length === 0) {
    if (filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0) {
      const globalFilterValue = filterModel.quickFilterValues[0];
      if (globalFilterValue) {
        return buildGlobalFilterExpression(globalFilterValue, columns);
      }
    }
    return undefined;
  }

  // Processar filtros de coluna
  const filterParts: string[] = [];

  filterModel.items.forEach((item) => {
    const { field, operator, value } = item;

    if (value === undefined || value === null || value === '') {
      return;
    }

    let filterExpr = '';
    switch (operator) {
      case 'contains':
        filterExpr = `${field}==*${value}*`;
        break;
      case 'equals':
        filterExpr = `${field}==${value}`;
        break;
      case 'startsWith':
        filterExpr = `${field}==${value}*`;
        break;
      case 'endsWith':
        filterExpr = `${field}==*${value}`;
        break;
      case 'isEmpty':
        filterExpr = `${field}==null`;
        break;
      case 'isNotEmpty':
        filterExpr = `${field}!=null`;
        break;
      case 'is':
        filterExpr = `${field}==${value}`;
        break;
      case 'not':
        filterExpr = `${field}!=${value}`;
        break;
      case '>':
        filterExpr = `${field}>${value}`;
        break;
      case '>=':
        filterExpr = `${field}>=${value}`;
        break;
      case '<':
        filterExpr = `${field}<${value}`;
        break;
      case '<=':
        filterExpr = `${field}<=${value}`;
        break;
      default:
        filterExpr = `${field}==${value}`;
    }

    if (filterExpr) {
      filterParts.push(filterExpr);
    }
  });

  // Adicionar filtro global se existir
  if (filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0) {
    const globalFilterValue = filterModel.quickFilterValues[0];
    if (globalFilterValue) {
      const globalFilter = buildGlobalFilterExpression(globalFilterValue, columns);
      if (globalFilter) {
        filterParts.push(`(${globalFilter})`);
      }
    }
  }

  if (filterParts.length === 0) {
    return undefined;
  }

  // Combinar todos os filtros com AND (;)
  return filterParts.join(';');
};

/**
 * Converte valores hexadecimais para RGB
 */
export const getRgbValues = (hexColor: string): string => {
  try {
    // Remove o # se existir
    const hex = hexColor.replace('#', '');

    // Converte para RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Verifica se valores são válidos
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return '0, 0, 0'; // Fallback para preto se valor inválido
    }

    return `${r}, ${g}, ${b}`;
  } catch (e) {
    console.error('Error converting hex to RGB:', e);
    return '0, 0, 0'; // Fallback para preto em caso de erro
  }
};

/**
 * Obtém o modelo de ordenação inicial a partir do DataSource
 */
export const getInitialSortModel = (dataSource: any): GridSortModel => {
  const options = dataSource && typeof dataSource.getOptions === 'function' ? dataSource.getOptions() : {};

  if (options && options.originSort) {
    return options.originSort;
  }

  if (options && options.sort) {
    return options.sort.map((sort: string) => {
      const [field, order] = sort.split(':');
      return {
        field,
        sort: order === 'desc' ? 'desc' : 'asc',
      };
    });
  }

  return [];
};

/**
 * Converte RSQL para GridFilterModel do MUI X DataGrid
 * Permite compatibilidade entre ArchbaseCompositeFilters e o sistema nativo do MUI
 */
export const convertRSQLToFilterModel = (
  rsql: string | undefined,
  columns: GridColDef[]
): GridFilterModel => {
  if (!rsql) {
    return { items: [] };
  }

  const items: GridFilterItem[] = [];

  try {
    // RSQL usa ; como AND e , como OR
    // Vamos processar filtros separados por ; (AND)
    const filters = rsql.split(';');

    for (const filter of filters) {
      const trimmed = filter.trim();
      if (!trimmed) continue;

      // Parse do operador RSQL
      let field: string = '';
      let operator: string = '';
      let value: string = '';

      // Operadores em ordem de complexidade (mais complexos primeiro)
      const operators = [
        { rsql: '=like=', mui: 'contains', pattern: /=(like)=/ },
        { rsql: '>=', mui: '>=', pattern: />=/ },
        { rsql: '<=', mui: '<=', pattern: /<=/ },
        { rsql: '>', mui: '>', pattern: />/ },
        { rsql: '<', mui: '<', pattern: /</ },
        { rsql: '!=', mui: 'not', pattern: /!=/ },
        { rsql: '==', mui: 'equals', pattern: /==/ },
      ];

      let matchedOp: typeof operators[0] | null = null;
      let matchIndex = -1;

      // Encontrar qual operador está presente na expressão
      for (const op of operators) {
        const match = trimmed.match(op.pattern);
        if (match) {
          matchedOp = op;
          matchIndex = match.index!;
          break;
        }
      }

      if (matchedOp && matchIndex >= 0) {
        field = trimmed.substring(0, matchIndex).trim();
        const opValue = trimmed.substring(matchIndex + matchedOp.rsql.length).trim();

        // Tratar wildcards do RSQL (*)
        if (matchedOp.rsql === '=like=') {
          if (opValue.startsWith('*') && opValue.endsWith('*')) {
            operator = 'contains';
            value = opValue.slice(1, -1);
          } else if (opValue.startsWith('*')) {
            operator = 'endsWith';
            value = opValue.slice(1);
          } else if (opValue.endsWith('*')) {
            operator = 'startsWith';
            value = opValue.slice(0, -1);
          } else {
            operator = 'contains';
            value = opValue;
          }
        } else {
          operator = matchedOp.mui;
          value = opValue;
        }

        // Tratar null checks
        if (value === 'null=true') {
          operator = 'isEmpty';
          value = '';
        } else if (value === 'null=false') {
          operator = 'isNotEmpty';
          value = '';
        }

        items.push({
          id: Math.random().toString(36),
          field,
          operator,
          value,
        });
      }
    }
  } catch (error) {
    console.error('Erro ao converter RSQL para FilterModel:', error);
  }

  return { items };
};

/**
 * Converte ArchbaseActiveFilter[] para GridFilterModel
 */
export const convertActiveFiltersToFilterModel = (
  activeFilters: ArchbaseActiveFilter[]
): GridFilterModel => {
  if (!activeFilters || activeFilters.length === 0) {
    return { items: [] };
  }

  const items: GridFilterItem[] = [];

  for (const filter of activeFilters) {
    let muiOperator: string = 'equals';

    // Mapeamento de operadores ArchbaseCompositeFilters -> MUI DataGrid
    const operatorMap: Record<ArchbaseFilterOperator, string> = {
      'contains': 'contains',
      'starts_with': 'startsWith',
      'ends_with': 'endsWith',
      '=': 'equals',
      '!=': 'not',
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<=',
      'is_null': 'isEmpty',
      'is_not_null': 'isNotEmpty',
      'between': 'equals', // MUI não tem between nativo
      'date_before': '<',
      'date_after': '>',
      'date_between': 'equals',
      'in': 'isAnyOf',
      'not_in': 'isNoneOf',
    };

    muiOperator = operatorMap[filter.operator] || 'equals';

    items.push({
      id: filter.id,
      field: filter.key,
      operator: muiOperator,
      value: filter.value,
    });
  }

  return { items };
};

/**
 * Converte FieldDataType para o tipo de coluna do MUI
 */
const mapDataTypeToFieldType = (dataType: ArchbaseFieldDataType): 'string' | 'number' | 'boolean' | 'date' | 'dateTime' | 'singleSelect' => {
  const typeMap: Record<ArchbaseFieldDataType, 'string' | 'number' | 'boolean' | 'date' | 'dateTime' | 'singleSelect'> = {
    'text': 'string',
    'integer': 'number',
    'float': 'number',
    'currency': 'number',
    'boolean': 'boolean',
    'date': 'date',
    'datetime': 'dateTime',
    'time': 'dateTime',
    'enum': 'singleSelect',
    'image': 'string',
    'uuid': 'string',
  };
  return typeMap[dataType] || 'string';
};

/**
 * Converte colunas do Grid para ArchbaseFilterDefinition[]
 * Permite gerar automaticamente as definições de filtro a partir das colunas
 */
export const convertColumnsToFilterDefinitions = (
  columns: GridColDef[],
  options?: {
    includeColumns?: string[]; // Colunas específicas para incluir
    excludeColumns?: string[]; // Colunas para excluir
    onlyFilterable?: boolean; // Apenas colunas com filterable=true
  }
): ArchbaseFilterDefinition[] => {
  const {
    includeColumns,
    excludeColumns = ['actions', 'id'],
    onlyFilterable = true,
  } = options || {};

  const definitions: ArchbaseFilterDefinition[] = [];

  for (const col of columns) {
    // Pular coluna actions
    if (col.field === 'actions') continue;

    // Verificar se deve incluir esta coluna
    if (includeColumns && includeColumns.length > 0 && !includeColumns.includes(col.field)) {
      continue;
    }

    // Verificar se deve excluir esta coluna
    if (excludeColumns && excludeColumns.includes(col.field)) {
      continue;
    }

    // Verificar se é filtrável
    if (onlyFilterable && col.filterable === false) {
      continue;
    }

    // Determinar o tipo de dado
    let dataType: ArchbaseFieldDataType = 'text';
    if (col.type) {
      const muiTypeToArchbase: Record<string, ArchbaseFieldDataType> = {
        'string': 'text',
        'number': 'float',
        'boolean': 'boolean',
        'date': 'date',
        'dateTime': 'datetime',
        'singleSelect': 'enum',
      };
      dataType = muiTypeToArchbase[col.type] || 'text';
    }

    const definition: ArchbaseFilterDefinition = {
      key: col.field,
      label: col.headerName || col.field,
      type: dataType,
    };

    // Se for singleSelect, adicionar opções
    if (col.type === 'singleSelect' && (col as any).valueOptions) {
      const valueOptions = (col as any).valueOptions;
      if (Array.isArray(valueOptions)) {
        definition.options = valueOptions.map((opt: any) => ({
          value: typeof opt === 'string' ? opt : opt.value,
          label: typeof opt === 'string' ? opt : opt.label,
        }));
      }
    }

    definitions.push(definition);
  }

  return definitions;
};

/**
 * Converte ArchbaseFilterDefinition para GridColDef[]
 * Útil para criar colunas automaticamente a partir de definições de filtro
 */
export const convertFilterDefinitionsToColumns = (
  definitions: ArchbaseFilterDefinition[]
): GridColDef[] => {
  const columns: GridColDef[] = [];

  for (const def of definitions) {
    const col: GridColDef = {
      field: def.key,
      headerName: def.label,
      type: mapDataTypeToFieldType(def.type),
      filterable: true,
      sortable: true,
    };

    // Se tiver opções, adicionar valueOptions (usando type assertion)
    if (def.options && def.options.length > 0) {
      (col as any).valueOptions = def.options.map(opt => opt.value);
      (col as any).valueFormatter = (value: any) => {
        const option = def.options!.find(o => o.value === value);
        return option ? option.label : value;
      };
    }

    columns.push(col);
  }

  return columns;
};
