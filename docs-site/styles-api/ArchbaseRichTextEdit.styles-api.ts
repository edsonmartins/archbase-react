import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseRichTextEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    editor: 'Container do SunEditor',
    toolbar: 'Barra de ferramentas',
    editorArea: 'Área de edição',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
  },
  vars: {
    root: {
      '--editor-height': 'Altura do editor',
      '--editor-width': 'Largura do editor',
    },
    editor: {
      '--editor-bd': 'Cor da borda',
      '--editor-bg': 'Cor de fundo',
    },
  },
  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'editor',
      condition: 'Quando disabled=true',
    },
    {
      modifier: 'data-readonly',
      selector: 'editor',
      condition: 'Quando readOnly=true',
    },
    {
      modifier: 'data-error',
      selector: 'root',
      condition: 'Quando há erro de validação',
    },
  ],
};
