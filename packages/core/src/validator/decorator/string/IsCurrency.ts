import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isCurrencyValidator from 'validator/lib/isCurrency';
import validator from 'validator';
import { t } from 'i18next';

export const IS_CURRENCY = 'isCurrency';

/**
 * Checks if the string is a valid currency amount.
 * If given value is not a string, then it returns false.
 */
export function isCurrency(value: unknown, options?: validator.IsCurrencyOptions): boolean {
  return typeof value === 'string' && isCurrencyValidator(value, options);
}

/**
 * Checks if the string is a valid currency amount.
 * If given value is not a string, then it returns false.
 */
export function IsCurrency(
  options?: validator.IsCurrencyOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_CURRENCY,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isCurrency(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + `${t('archbase:$property must be a currency')}`, validationOptions),
      },
    },
    validationOptions
  );
}
