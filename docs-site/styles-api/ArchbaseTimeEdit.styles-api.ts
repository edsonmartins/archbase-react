import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseTimeEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    rightSection: 'Seção direita (ícone de relógio)',
  },
  vars: {
    root: {
      '--input-height': 'Altura do input',
      '--input-fz': 'Tamanho da fonte',
    },
    input: {
      '--input-bd': 'Cor da borda',
      '--input-bg': 'Cor de fundo',
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
  ],
};
