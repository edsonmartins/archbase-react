import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseTextAreaStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento textarea',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    rightSection: 'Seção direita (contador, ícones)',
    leftSection: 'Seção esquerda (ícones)',
  },

  vars: {
    root: {
      '--input-height': 'Altura do input',
      '--input-fz': 'Tamanho da fonte',
      '--input-radius': 'Raio da borda',
      '--input-padding-x': 'Padding horizontal',
    },
    input: {
      '--input-bd': 'Cor da borda',
      '--input-bg': 'Cor de fundo',
      '--input-color': 'Cor do texto',
      '--input-placeholder-color': 'Cor do placeholder',
      '--line-height': 'Altura da linha',
    },
  },

  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'input',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-readonly',
      selector: 'input',
      condition: 'Quando readOnly=true ou DataSource em modo browse',
    },
    {
      modifier: 'data-error',
      selector: 'input',
      condition: 'Quando há erro de validação',
    },
    {
      modifier: 'data-with-left-section',
      selector: 'input',
      condition: 'Quando leftSection está presente',
    },
    {
      modifier: 'data-with-right-section',
      selector: 'input',
      condition: 'Quando rightSection está presente',
    },
    {
      modifier: 'data-monospace',
      selector: 'input',
      condition: 'Quando monospace=true (fonte monoespaçada)',
    },
  ],
};
