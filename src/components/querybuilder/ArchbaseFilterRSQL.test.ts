import { describe, expect, test } from '@jest/globals';
import { buildFrom } from './ArchbaseFilterRSQL';
import { baseFilterDemo } from '../../demo/data/filterDemo';
import builder from 'components/core/rsql/builder';
import { Rule } from '@components/querybuilder';

const simpleRules: Rule[] = [
  {
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
        id: '2',
        field: 'data',
        dataType: 'date',
        operator: 'between',
        value: '01/07/2023',
        value2: '31/07/2023',
      },
    ],
  },
];

const nestedRules: Rule[] = [
  {
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
        id: '2',
        field: 'data',
        dataType: 'date',
        operator: 'between',
        value: '01/07/2023',
        value2: '31/07/2023',
      },
      {
        id: '3',
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
            id: '2',
            field: 'data',
            dataType: 'date',
            operator: 'between',
            value: '01/07/2023',
            value2: '31/07/2023',
          },
        ],
      },
    ],
  },
];

const moreNestedRules: Rule[] = [
  {
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
        id: '2',
        field: 'data',
        dataType: 'date',
        operator: 'between',
        value: '01/07/2023',
        value2: '31/07/2023',
      },
      {
        id: '3',
        condition: 'and',
        rules: [
          {
            id: '1',
            condition: 'or',
            rules: [
              {
                id: '1',
                field: 'idade',
                dataType: 'number',
                operator: '>',
                value: 18,
              },
              {
                id: '2',
                field: 'data',
                dataType: 'date',
                operator: 'between',
                value: '01/07/2023',
                value2: '31/07/2023',
              },
            ],
          },
          {
            id: '2',
            condition: 'and',
            rules: [
              {
                id: '1',
                condition: 'or',
                rules: [
                  {
                    id: '1',
                    field: 'idade',
                    dataType: 'number',
                    operator: '>',
                    value: 18,
                  },
                  {
                    id: '2',
                    field: 'data',
                    dataType: 'date',
                    operator: 'between',
                    value: '01/07/2023',
                    value2: '31/07/2023',
                  },
                ],
              },
              {
                id: '2',
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
                    id: '2',
                    field: 'data',
                    dataType: 'date',
                    operator: 'between',
                    value: '01/07/2023',
                    value2: '31/07/2023',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

describe('ArchbaseFilterRSQL', () => {
  test('Simple rules should return corresponding expressionNode', () => {
    baseFilterDemo.filter.rules = simpleRules;
    expect(buildFrom(baseFilterDemo)).toStrictEqual({
      expressionNode: builder.and(builder.gt('idade', 18), builder.bt('data', '01/07/2023', '31/07/2023')),
      sortStrings: [],
    });
  });

  test('Nested rules should return corresponding expressionNode', () => {
    baseFilterDemo.filter.rules = nestedRules;
    expect(buildFrom(baseFilterDemo)).toStrictEqual({
      expressionNode: builder.and(
        builder.gt('idade', 18),
        builder.bt('data', '01/07/2023', '31/07/2023'),
        builder.and(builder.gt('idade', 18), builder.bt('data', '01/07/2023', '31/07/2023')),
      ),
      sortStrings: [],
    });
  });

  test('More nested rules should return corresponding expressionNode', () => {
    baseFilterDemo.filter.rules = moreNestedRules;
    expect(buildFrom(baseFilterDemo)).toStrictEqual({
      expressionNode: builder.and(
        builder.gt('idade', 18),
        builder.bt('data', '01/07/2023', '31/07/2023'),
        builder.and(
          builder.or(builder.gt('idade', 18), builder.bt('data', '01/07/2023', '31/07/2023')),
          builder.and(
            builder.or(builder.gt('idade', 18), builder.bt('data', '01/07/2023', '31/07/2023')),
            builder.and(builder.gt('idade', 18), builder.bt('data', '01/07/2023', '31/07/2023')),
          ),
        ),
      ),
      sortStrings: [],
    });
  });
});
