import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseJsonEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento textarea',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
  },
  vars: {
    root: {
      '--input-fz': 'Tamanho da fonte (monospace)',
      '--input-radius': 'Raio da borda',
    },
    input: {
      '--input-bd': 'Cor da borda',
      '--input-bg': 'Cor de fundo',
      '--json-string-color': 'Cor para strings',
      '--json-number-color': 'Cor para números',
      '--json-boolean-color': 'Cor para booleanos',
      '--json-null-color': 'Cor para null',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'input',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-error',
      selector: 'input',
      condition: 'Quando há erro de validação',
    },
    {
      modifier: 'data-monospace',
      selector: 'input',
      condition: 'Fonte monoespaçada aplicada',
    },
  ],
};
