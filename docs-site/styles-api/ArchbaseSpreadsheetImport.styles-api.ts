import type { StylesApi } from '@mantinex/demo';

export const ArchbaseSpreadsheetImportStylesApi: StylesApi = {
  selectors: {
    root: 'Container do Modal de importação',
    content: 'Conteúdo interno do modal',
    header: 'Cabeçalho com título',
    title: 'Título do modal',
    description: 'Descrição do modal',
    uploadArea: 'Área de drag & drop para upload',
    uploadButton: 'Botão de seleção de arquivo',
    reviewTable: 'Tabela de revisão de dados',
    confirmButton: 'Botão de confirmação',
    cancelButton: 'Botão de cancelamento',
    closeButton: 'Botão de fechamento',
    successMessage: 'Mensagem de sucesso',
    errorMessage: 'Mensagem de erro',
    progress: 'Barra de progresso',
  },
  vars: {
    modalSize: 'Tamanho do modal (md, xl, full)',
  },
  staticSelectors: [],
};
