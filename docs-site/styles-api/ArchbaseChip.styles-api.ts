import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseChipStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (chip)',
    label: 'Label do chip',
    icon: 'Ícone do chip',
    check: 'Indicador de seleção',
  },
  vars: {
    root: {
      '--chip-height': 'Altura do chip',
      '--chip-fz': 'Tamanho da fonte',
      '--chip-radius': 'Raio da borda',
    },
  },
  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'root',
      condition: 'Quando o chip está selecionado',
    },
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: 'Quando disabled=true',
    },
  ],
};
