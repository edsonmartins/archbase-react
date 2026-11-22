/**
 * Textos pt-BR da beautiful-grid (prop `msg`).
 *
 * Mesmo papel que o AG_GRID_LOCALE_PTBR tinha na engine anterior.
 */
import type { BGridMessages } from 'beautiful-grid';

export const BGRID_LOCALE_PTBR: BGridMessages = {
  emptyList: 'Nenhum registro encontrado',
  toolbox: {
    sort: 'Ordenar',
    sortAscending: 'Ordenar crescente',
    sortDescending: 'Ordenar decrescente',
    clearSort: 'Limpar ordenação',
    filterApplied: 'Filtro aplicado',
    openColumnOptions: 'Abrir opções da coluna',
    filter: 'Filtrar',
    textFilter: 'Filtro de texto',
    valueFilter: 'Filtro por valores',
    numberFilter: 'Filtro numérico',
    contains: 'Contém',
    equals: 'Igual a',
    notEquals: 'Diferente de',
    numberEquals: 'Igual a',
    numberNotEquals: 'Diferente de',
    greaterThan: 'Maior que',
    greaterThanOrEqual: 'Maior ou igual a',
    lessThan: 'Menor que',
    lessThanOrEqual: 'Menor ou igual a',
    between: 'Entre',
    searchPlaceholder: 'Pesquisar...',
    textPlaceholder: 'Digite o texto',
    numberPlaceholder: 'Digite o número',
    minimumPlaceholder: 'Mínimo',
    maximumPlaceholder: 'Máximo',
    invalidRange: 'Intervalo inválido',
    clear: 'Redefinir',
    apply: 'Aplicar',
    emptyValue: '(Vazio)',
    selectAll: 'Selecionar todos',
    noValues: 'Sem valores',
    noResults: 'Nenhum resultado',
    extraMenu: 'Mais opções',
    columns: 'Colunas',
    hiddenColumns: 'Colunas ocultas',
    showAllColumns: 'Mostrar todas as colunas',
    hideThisColumn: 'Ocultar esta coluna',
    lastVisibleColumn: 'A última coluna visível não pode ser ocultada',
    hiddenColumnCount: (count: number) =>
      count === 1 ? '1 coluna oculta' : `${count} colunas ocultas`,
    moreValues: (count: number) => `mais ${count}`,
  },
};
