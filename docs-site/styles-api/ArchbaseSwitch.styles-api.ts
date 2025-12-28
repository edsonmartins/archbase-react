import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseSwitchStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    input: 'Elemento input checkbox (oculto)',
    track: 'Track (trilha) do switch',
    thumb: 'Thumb (bolinha) do switch',
    body: 'Container do switch + label',
    label: 'Label do switch',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    trackLabel: 'Label dentro do track (on/off)',
  },

  vars: {
    root: {
      '--switch-height': 'Altura do switch',
      '--switch-width': 'Largura do switch',
      '--switch-radius': 'Raio da borda',
      '--switch-color': 'Cor quando ligado',
    },
    thumb: {
      '--switch-thumb-size': 'Tamanho do thumb',
    },
  },

  modifiers: [
    {
      modifier: 'data-checked',
      selector: 'input',
      condition: 'Quando o switch está ligado',
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
      modifier: 'data-label-position',
      selector: 'root',
      condition: 'Posição do label (left/right)',
    },
  ],
};
