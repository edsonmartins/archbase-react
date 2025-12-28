import type { StylesApi } from '@mantinex/demo';

export const ArchbaseCompositeFiltersStylesApi: StylesApi = {
  selectors: {
    root: 'Container do componente',
    container: 'Contêiner principal com borda',
    input: 'Input de texto para adicionar filtros',
    pill: 'Pill visual de cada filtro ativo',
    rsqlOutput: 'Área de exibição do RSQL gerado',
  },
  vars: {
    variant: 'Variante visual: default, compact, minimal',
  },
  staticSelectors: [],
};
