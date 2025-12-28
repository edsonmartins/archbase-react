import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseRadioGroupStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz',
    label: 'Label do grupo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    radioGroup: 'Grupo de radio buttons',
    radio: 'Radio button individual',
    radioWrapper: 'Wrapper do radio button',
    radioLabel: 'Label do radio button',
  },
  vars: {
    root: {
      '--radio-size': 'Tamanho do radio button',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'radio',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-error',
      selector: 'root',
      condition: 'Quando há erro de validação',
    },
  ],
};
