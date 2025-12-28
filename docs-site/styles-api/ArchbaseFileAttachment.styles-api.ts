import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseFileAttachmentStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    dropzone: 'Área de arrastar e soltar arquivos',
    dropzoneIcon: 'Ícone da área de drop',
    dropzoneText: 'Texto da área de drop',
    fileList: 'Lista de arquivos anexados',
    fileItem: 'Item individual de arquivo',
    fileName: 'Nome do arquivo',
    fileSize: 'Tamanho do arquivo',
    fileIcon: 'Ícone do tipo de arquivo',
    removeButton: 'Botão de remover arquivo',
  },

  vars: {
    root: {
      '--dropzone-min-height': 'Altura mínima da área de drop',
      '--dropzone-radius': 'Raio da borda da área de drop',
    },
    dropzone: {
      '--dropzone-bg': 'Cor de fundo da área de drop',
      '--dropzone-border-color': 'Cor da borda',
      '--dropzone-hover-bg': 'Cor de fundo no hover',
    },
    fileItem: {
      '--file-item-bg': 'Cor de fundo do item de arquivo',
      '--file-item-radius': 'Raio da borda do item',
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
      modifier: 'data-dragging',
      selector: 'dropzone',
      condition: 'Quando arquivo está sendo arrastado',
    },
    {
      modifier: 'data-accept',
      selector: 'dropzone',
      condition: 'Quando arquivo arrastado é aceito',
    },
    {
      modifier: 'data-reject',
      selector: 'dropzone',
      condition: 'Quando arquivo arrastado é rejeitado',
    },
  ],
};
