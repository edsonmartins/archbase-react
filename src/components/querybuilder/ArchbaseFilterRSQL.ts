import { ExpressionNode } from 'components/core';
import { ArchbaseQueryFilter, Rule } from './ArchbaseFilterCommons';
import builder from '@components/core/rsql/builder';
import { formatISO } from 'date-fns';

function buildFrom(filter: ArchbaseQueryFilter) {
  const sortStrings: string[] = [];
  if (filter.filter.rules) {
    const expressionNode = processRules(filter.filter.condition, filter.filter.rules);
    if (filter.sort && filter.sort.sortFields) {
      filter.sort.sortFields.forEach((field) => {
        if (field.selected) {
          sortStrings.push(field.name + ' ' + field.asc_desc);
        }
      });
    }

    return {
      expressionNode: expressionNode,
      sortStrings: sortStrings,
    };
  }

  return null;
}

function processRules(condition, rules: Rule[]) {
  let CONDITION: (...expressions: ExpressionNode[]) => ExpressionNode = builder.and;
  if (condition === 'or') {
    CONDITION = builder.or;
  }

  return CONDITION(
    // eslint-disable-next-line array-callback-return
    ...rules.map((rule) => {
      if (rule.field && !rule.disabled) {
        let newValue = rule.value;
        let newValue2 = rule.value2;
        if (
          newValue &&
          newValue !== '' &&
          (typeof newValue === 'number' || newValue instanceof Date) &&
          (rule.dataType === 'date' || rule.dataType === 'date_time')
        ) {
          newValue = convertToIsoDate(rule, newValue);
        }

        if (
          newValue2 &&
          newValue2 !== '' &&
          (typeof newValue2 === 'number' || newValue2 instanceof Date) &&
          (rule.dataType === 'date' || rule.dataType === 'date_time')
        ) {
          newValue2 = convertToIsoDate(rule, newValue2);
        }
        if (rule.operator === 'null') {
          return builder.eq(rule.field, `null`);
        } else if (rule.operator === 'notNull') {
          return builder.neq(rule.field, `null`);
        } else if (rule.operator === 'contains' && newValue && newValue !== '') {
          return builder.eq(rule.field, `^*${newValue}*`);
        } else if (rule.operator === 'startsWith' && newValue && newValue !== '') {
          return builder.eq(rule.field, `^${newValue}*`);
        } else if (
          rule.operator === 'endsWith' &&
          newValue &&
          newValue !== '' &&
          (typeof newValue === 'string' || typeof newValue === 'number')
        ) {
          return builder.eq(rule.field, `^*${newValue}`);
        } else if (rule.operator === '=' && newValue && newValue !== '' && (typeof newValue === 'string' || typeof newValue === 'number')) {
          return builder.eq(rule.field, newValue);
        } else if (
          rule.operator === '!=' &&
          newValue &&
          newValue !== '' &&
          (typeof newValue === 'string' || typeof newValue === 'number')
        ) {
          return builder.neq(rule.field, newValue);
        } else if (rule.operator === '<' && newValue && newValue !== '' && (typeof newValue === 'string' || typeof newValue === 'number')) {
          return builder.lt(rule.field, newValue);
        } else if (rule.operator === '>' && newValue && newValue !== '' && (typeof newValue === 'string' || typeof newValue === 'number')) {
          return builder.gt(rule.field, newValue);
        } else if (
          rule.operator === '<=' &&
          newValue &&
          newValue !== '' &&
          (typeof newValue === 'string' || typeof newValue === 'number')
        ) {
          return builder.le(rule.field, newValue);
        } else if (
          rule.operator === '>=' &&
          newValue &&
          newValue !== '' &&
          (typeof newValue === 'string' || typeof newValue === 'number')
        ) {
          return builder.ge(rule.field, newValue);
        } else if (
          rule.operator === 'between' &&
          newValue &&
          newValue !== '' &&
          newValue2 &&
          newValue2 !== '' &&
          (typeof newValue === 'string' || typeof newValue === 'number') &&
          (typeof newValue2 === 'string' || typeof newValue2 === 'number')
        ) {
          return builder.bt(rule.field, newValue, newValue2);
        } else if (
          rule.operator === 'notBetween' &&
          newValue &&
          newValue !== '' &&
          newValue2 &&
          newValue2 !== '' &&
          (typeof newValue === 'string' || typeof newValue === 'number') &&
          (typeof newValue2 === 'string' || typeof newValue2 === 'number')
        ) {
          return builder.nb(rule.field, newValue, newValue2);
        } else if (rule.operator === 'inList' && newValue && newValue !== '' && Array.isArray(newValue)) {
          return builder.in(rule.field, newValue);
        } else if (rule.operator === 'notInList' && newValue && newValue !== '' && Array.isArray(newValue)) {
          return builder.out(rule.field, newValue);
        }
      }
      if (rule.rules && !rule.disabled) {
        return processRules(rule.condition, rule.rules);
      }
    }),
  );
}

function convertToIsoDate(rule, value: Date | number) {
  if (rule.dataType === 'date') {
    return formatISO(value, { representation: 'date' });
  } else if (rule.dataType === 'date_time') {
    return formatISO(value, { representation: 'complete' });
  }
}

export { buildFrom };
