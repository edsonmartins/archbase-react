import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseTreeSelectStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input/display de valor',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    dropdown: 'Container do dropdown da árvore',
    option: 'Item de nó individual',
    options: 'Container dos nós da árvore',
    empty: 'Mensagem quando não há opções',
    rightSection: 'Seção direita (ícone de seta)',
    leftSection: 'Seção esquerda (ícones)',
    nodeLabel: 'Label do nó da árvore',
    nodeIcon: 'Ícone de expansão/colapso',
    nodeChildren: 'Container de filhos do nó',
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
      '--tree-level-indent': 'Indentação por nível da árvore',
    },
    option: {
      '--node-hover-bg': 'Cor de fundo em hover',
      '--node-selected-bg': 'Cor de fundo quando selecionado',
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
      condition: 'Quando o nó está selecionado',
    },
    {
      modifier: 'data-hovered',
      selector: 'option',
      condition: 'Quando o nó está com hover',
    },
    {
      modifier: 'data-expanded',
      selector: 'option',
      condition: 'Quando o nó está expandido',
    },
    {
      modifier: 'data-has-children',
      selector: 'option',
      condition: 'Quando o nó tem filhos',
    },
    {
      modifier: 'data-leaf',
      selector: 'option',
      condition: 'Quando o nó é folha (sem filhos)',
    },
  ],
};
