import { t } from 'i18next';
import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const EQUALS = 'equals';

/**
 * Checks if value matches ("===") the comparison.
 */
export function equals(value: unknown, comparison: unknown): boolean {
  return value === comparison;
}

/**
 * Checks if value matches ("===") the comparison.
 */
export function Equals(comparison: any, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: EQUALS,
      constraints: [comparison],
      validator: {
        validate: (value, args): boolean => equals(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + `${t('archbase:$property must be a latitude string or number')}`,
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
