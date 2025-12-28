import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseLookupEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input (somente leitura)',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    rightSection: 'Seção direita (botões)',
    searchButton: 'Botão de buscar',
    clearButton: 'Botão de limpar',
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
    },
    searchButton: {
      '--button-color': 'Cor do ícone de busca',
      '--button-hover-color': 'Cor do ícone no hover',
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
      condition: 'Quando DataSource em modo browse',
    },
    {
      modifier: 'data-error',
      selector: 'input',
      condition: 'Quando há erro de validação',
    },
    {
      modifier: 'data-has-value',
      selector: 'root',
      condition: 'Quando há um valor selecionado',
    },
    {
      modifier: 'data-clearable',
      selector: 'root',
      condition: 'Quando clearable=true e há valor',
    },
  ],
};
