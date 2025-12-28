import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseLookupNumberStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input numérico',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    rightSection: 'Seção direita (indicador de lookup)',
    leftSection: 'Seção esquerda (prefixo)',
    lookupIndicator: 'Indicador de lookup em andamento',
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
      modifier: 'data-with-prefix',
      selector: 'input',
      condition: 'Quando há prefixo configurado',
    },
    {
      modifier: 'data-with-suffix',
      selector: 'input',
      condition: 'Quando há sufixo configurado',
    },
    {
      modifier: 'data-loading',
      selector: 'root',
      condition: 'Durante carregamento do lookup',
    },
    {
      modifier: 'data-lookup-success',
      selector: 'input',
      condition: 'Quando lookup foi bem-sucedido',
    },
    {
      modifier: 'data-lookup-error',
      selector: 'input',
      condition: 'Quando lookup falhou',
    },
  ],
};
