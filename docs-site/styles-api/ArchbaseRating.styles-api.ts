import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseRatingStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    starGroup: 'Grupo de estrelas',
    star: 'Estrela individual',
    starSymbol: 'Símbolo da estrela',
  },
  vars: {
    root: {
      '--rating-size': 'Tamanho da estrela',
      '--rating-spacing': 'Espaçamento entre estrelas',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-error',
      selector: 'root',
      condition: 'Quando há erro de validação',
    },
  ],
};
