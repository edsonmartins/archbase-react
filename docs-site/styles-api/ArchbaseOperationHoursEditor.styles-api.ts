import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseOperationHoursEditorStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    label: 'Label do componente',
    multiSelect: 'Seletor de múltiplos dias',
    timeInputGroup: 'Grupo de inputs de horário',
    timeInput: 'Input de horário individual',
    addButton: 'Botão de adicionar horário',
    hoursList: 'Lista de horários configurados',
    hoursItem: 'Item individual de horário',
    hoursItemGroup: 'Grupo do item (dias + horário + delete)',
    daysLabel: 'Label dos dias no item',
    timeRangeLabel: 'Label do intervalo de tempo',
    deleteButton: 'Botão de remover horário',
  },

  vars: {
    root: {
      '--editor-spacing': 'Espaçamento entre elementos',
    },
    multiSelect: {
      '--input-bd': 'Cor da borda do multi-select',
      '--input-bg': 'Cor de fundo do multi-select',
    },
    timeInput: {
      '--input-bd': 'Cor da borda do time input',
      '--input-bg': 'Cor de fundo do time input',
    },
    hoursItem: {
      '--item-bg': 'Cor de fundo do item',
      '--item-bd': 'Cor da borda do item',
    },
  },

  modifiers: [
    {
      modifier: 'data-disabled',
      selector: 'addButton',
      condition: 'Quando dias ou horário não estão selecionados',
    },
    {
      modifier: 'data-readonly',
      selector: 'root',
      condition: 'Quando readOnly=true',
    },
    {
      modifier: 'data-error',
      selector: 'root',
      condition: 'Quando há erro de validação',
    },
  ],
};
