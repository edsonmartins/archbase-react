/**
 * Dicionario nivel 1: strings da propria biblioteca.
 *
 * Nivel 2 (rotulos de membros) vem do data model e e resolvido pela porta
 * `labeler`; nivel 3 (valores de dados) pertence ao schema do produto. RFC de
 * metadados, secao 6.2.
 */
export interface AnalyticsStrings {
  emptyExploration: string;
  loading: string;
  noResults: string;
  truncatedWarning: string;
  timeoutError: string;
  concurrencyError: string;
  forbiddenMemberError: string;
  upstreamError: string;
  networkError: string;
  /** Aviso quantitativo de degradacao. `{count}` e substituido pelo numero. */
  degradedOneMember: string;
  degradedManyMembers: string;
  degradedAllMembers: string;
  addComparison: string;
  comparisonPeriod: string;
  variation: string;
  searchMembers: string;
  save: string;
  cancel: string;
  /** Titulo do painel recolhivel de metricas, dimensoes e filtros. */
  queryPanel: string;
}

export const DEFAULT_STRINGS: AnalyticsStrings = {
  emptyExploration: 'Selecione uma metrica ou dimensao para comecar.',
  loading: 'Carregando...',
  noResults: 'Nenhum resultado para os filtros aplicados.',
  truncatedWarning: 'Resultado parcial: aplique um filtro para ver todos os dados.',
  timeoutError: 'A consulta demorou demais. Reduza o periodo ou aplique um filtro.',
  concurrencyError: 'Muitas consultas em andamento. Aguarde um instante e tente de novo.',
  forbiddenMemberError: 'Esta consulta usa dados fora do seu acesso.',
  upstreamError: 'Nao foi possivel consultar os dados agora. Tente novamente.',
  networkError: 'Sem conexao com o servidor. Verifique sua rede.',
  degradedOneMember: '1 item foi removido por estar fora do seu acesso.',
  degradedManyMembers: '{count} itens foram removidos por estarem fora do seu acesso.',
  degradedAllMembers: 'Esta consulta usa apenas dados fora do seu acesso.',
  addComparison: 'Comparar com outro periodo',
  comparisonPeriod: 'Periodo de comparacao',
  variation: 'Variacao',
  searchMembers: 'Buscar',
  save: 'Salvar',
  cancel: 'Cancelar',
  queryPanel: 'Metricas, dimensoes e filtros',
};

export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}
