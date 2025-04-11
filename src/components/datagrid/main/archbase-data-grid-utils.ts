import { GridFilterModel, GridRowId, GridSortModel } from '@mui/x-data-grid';

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
    // Filtrar colunas que suportam busca global e excluir a coluna "actions"
    const filterableColumns = columns.filter((col) => {
      try {
        return col.field !== 'actions' && col.enableGlobalFilter !== false;
      } catch (e) {
        // Se der erro ao acessar enableGlobalFilter, considere a coluna como filtrável por padrão
        return col.field !== 'actions';
      }
    });

    if (filterableColumns.length === 0) {
      return undefined;
    }

    // Construir expressões de filtro
    const filterExpressions = filterableColumns.map((col) => `${col.field}==^*${filterValue}*`);

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
  if (dataSource && dataSource.getOptions().originSort) {
    return dataSource.getOptions().originSort;
  }
  
  if (dataSource && dataSource.getOptions() && dataSource.getOptions().sort) {
    return dataSource.getOptions().sort.map((sort: string) => {
      const [field, order] = sort.split(':');
      return {
        field,
        sort: order === 'desc' ? 'desc' : 'asc',
      };
    });
  }
  
  return [];
};
