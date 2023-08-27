import { Rule } from 'components/querybuilder';

export const rulesDemo: Rule = {
  id: '1',
  condition: 'and',
  rules: [
    {
      id: '1',
      field: 'idade',
      dataType: 'number',
      operator: '>',
      value: 18,
    },
    {
      id: '1',
      field: 'data',
      dataType: 'date',
      operator: 'between',
      value: '01/07/2023',
      value2: '31/07/2023',
    },
  ],
};
