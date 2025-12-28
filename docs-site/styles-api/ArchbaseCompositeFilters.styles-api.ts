import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseCompositeFiltersStylesApi: StylesApiData = {
  selectors: {
    root: 'Container do componente',
    container: 'Contêiner principal com borda',
    input: 'Input de texto para adicionar filtros',
    pill: 'Pill visual de cada filtro ativo',
    rsqlOutput: 'Área de exibição do RSQL gerado',
  },
  vars: {
    variant: {
      default: 'Variante padrão',
      compact: 'Variante compacta',
      minimal: 'Variante mínima',
    },
  },
};
