import type { StylesApiData } from '../components/StylesApiTable';

export const ArchbaseDatePickerEditStylesApi: StylesApiData = {
  selectors: {
    root: 'Elemento raiz (wrapper)',
    wrapper: 'Container interno',
    input: 'Elemento input',
    label: 'Label do campo',
    description: 'Descrição do campo',
    error: 'Mensagem de erro',
    required: 'Indicador de campo obrigatório (*)',
    rightSection: 'Seção direita (ícone de calendário)',
    calendarHeader: 'Cabeçalho do calendário',
    calendarHeaderControl: 'Botões de navegação do calendário',
    calendarHeaderLevel: 'Seletor mês/ano',
    monthCell: 'Célula do mês',
    day: 'Célula do dia',
    weekday: 'Cabeçalho do dia da semana',
  },

  vars: {
    root: {
      '--input-height': 'Altura do input',
      '--input-fz': 'Tamanho da fonte',
      '--input-radius': 'Raio da borda',
    },
    day: {
      '--day-size': 'Tamanho das células dos dias',
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
      modifier: 'data-selected',
      selector: 'day',
      condition: 'Quando o dia está selecionado',
    },
    {
      modifier: 'data-today',
      selector: 'day',
      condition: 'Quando é o dia atual',
    },
    {
      modifier: 'data-outside',
      selector: 'day',
      condition: 'Quando o dia está fora do mês atual',
    },
  ],
};
