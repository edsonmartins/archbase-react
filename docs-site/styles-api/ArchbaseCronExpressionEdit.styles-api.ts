import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseCronExpressionEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    input: 'Input de texto readonly',
    label: 'Label do campo',
    error: 'Mensagem de erro',
    rightSection: 'Seção direita (botão de abrir modal)',
    actionIcon: 'Botão de ação (ícone de relógio)',
    modal: 'Modal do editor de expressão',
    modalHeader: 'Cabeçalho do modal',
    modalBody: 'Corpo do modal',
    modalFooter: 'Rodapé do modal (botões)',
    saveButton: 'Botão de salvar',
    cancelButton: 'Botão de cancelar',
  },

  vars: {
    root: {
      '--input-height': 'Altura do input',
      '--input-fz': 'Tamanho da fonte',
      '--input-radius': 'Raio da borda',
    },
    input: {
      '--input-bd': 'Cor da borda',
      '--input-bg': 'Cor de fundo',
      '--input-color': 'Cor do texto',
    },
  },

  modifiers: [
    {
      modifier: 'data-readonly',
      selector: 'root',
      condition: 'Quando readOnly=true',
    },
    {
      modifier: 'data-error',
      selector: 'input',
      condition: 'Quando há erro de validação',
    },
    {
      modifier: 'data-modal-opened',
      selector: 'modal',
      condition: 'Quando modal está aberto',
    },
  ],
};
