import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseChipGroupStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz do grupo',
    label: 'Label do grupo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    chipGroup: 'Grupo de chips',
    chip: 'Chip individual',
  },
  vars: {
    root: {
      '--chip-spacing': 'Espaçamento entre chips',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'chip',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-error',
      selector: 'root',
      condition: 'Quando há erro de validação',
    },
  ],
};
