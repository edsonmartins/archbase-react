import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseKeyValueEditorStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    itemsList: 'Lista de pares chave-valor',
    item: 'Item individual (par chave-valor)',
    keyInput: 'Input da chave',
    valueInput: 'Input do valor',
    addButton: 'Botão de adicionar item',
    removeButton: 'Botão de remover item',
    emptyState: 'Estado vazio (sem itens)',
  },

  vars: {
    root: {
      '--item-gap': 'Espaçamento entre itens',
      '--input-gap': 'Espaçamento entre inputs de chave e valor',
    },
    item: {
      '--item-bg': 'Cor de fundo do item',
      '--item-radius': 'Raio da borda do item',
      '--item-padding': 'Padding do item',
    },
  },

  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'root',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-readonly',
      selector: 'root',
      condition: 'Quando readOnly=true ou DataSource em modo browse',
    },
    {
      modifier: 'data-error',
      selector: 'root',
      condition: 'Quando há erro de validação',
    },
    {
      modifier: 'data-empty',
      selector: 'root',
      condition: 'Quando não há itens',
    },
  ],
};
