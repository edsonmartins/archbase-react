import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseAsyncSelectStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    dropdown: 'Dropdown de opções',
    option: 'Opção individual',
    optionsList: 'Lista de opções',
    noOptions: 'Mensagem de nenhuma opção',
    loading: 'Indicador de carregamento',
  },
  vars: {
    root: {
      '--input-height': 'Altura do input',
      '--input-fz': 'Tamanho da fonte',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'input',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-loading',
      selector: 'root',
      condition: 'Quando está carregando opções',
    },
  ],
};
