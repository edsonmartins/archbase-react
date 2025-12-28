import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseAsyncMultiSelectStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input/display de valores',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    dropdown: 'Container do dropdown de opções',
    option: 'Item de opção individual',
    options: 'Container das opções',
    empty: 'Mensagem quando não há opções',
    searchInput: 'Input de busca no dropdown',
    values: 'Container dos valores selecionados',
    value: 'Badge de valor individual selecionado',
    valueRemove: 'Botão de remover valor individual',
    rightSection: 'Seção direita (ícone de seta)',
    leftSection: 'Seção esquerda (ícones)',
    loading: 'Indicador de carregamento',
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
    dropdown: {
      '--combobox-padding': 'Padding do dropdown',
      '--combobox-option-padding': 'Padding das opções',
    },
    value: {
      '--value-remove': 'Estilo do botão de remover',
      '--value-label': 'Estilo do label do valor',
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
      modifier: 'data-selected',
      selector: 'option',
      condition: 'Quando a opção está selecionada',
    },
    {
      modifier: 'data-hovered',
      selector: 'option',
      condition: 'Quando a opção está com hover',
    },
    {
      modifier: 'data-loading',
      selector: 'root',
      condition: 'Durante carregamento assíncrono',
    },
    {
      modifier: 'data-multi',
      selector: 'root',
      condition: 'Sempre ativo (modo multipla seleção)',
    },
  ],
};
