import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseImageEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container da imagem e controles',
    imageWrapper: 'Container da imagem',
    image: 'Elemento da imagem',
    placeholder: 'Placeholder quando sem imagem',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    controls: 'Container dos botões de controle',
    uploadButton: 'Botão de upload',
    clearButton: 'Botão de limpar',
    dropzone: 'Área de arrastar e soltar',
  },

  vars: {
    root: {
      '--image-width': 'Largura da imagem',
      '--image-height': 'Altura da imagem',
      '--image-radius': 'Raio da borda da imagem',
    },
    placeholder: {
      '--placeholder-bg': 'Cor de fundo do placeholder',
      '--placeholder-color': 'Cor do ícone/texto do placeholder',
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
      modifier: 'data-has-image',
      selector: 'root',
      condition: 'Quando há uma imagem carregada',
    },
    {
      modifier: 'data-dragging',
      selector: 'dropzone',
      condition: 'Quando arquivo está sendo arrastado sobre a área',
    },
  ],
};
