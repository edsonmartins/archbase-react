import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseCheckboxStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    input: 'Elemento input checkbox (oculto)',
    icon: 'Ícone de check dentro do checkbox',
    inner: 'Container do checkbox visual',
    body: 'Container do checkbox + label',
    label: 'Label do checkbox',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
  },

  vars: {
    root: {
      '--checkbox-size': 'Tamanho do checkbox',
      '--checkbox-radius': 'Raio da borda',
      '--checkbox-color': 'Cor quando marcado',
    },
    inner: {
      '--checkbox-icon-size': 'Tamanho do ícone de check',
    },
  },

  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'input',
      condition: 'Quando o checkbox está marcado',
    },
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
      modifier: 'data-indeterminate',
      selector: 'input',
      condition: 'Quando está em estado indeterminado',
    },
  ],
};
