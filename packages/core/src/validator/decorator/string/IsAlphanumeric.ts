import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isAlphanumericValidator from 'validator/lib/isAlphanumeric';
import validator from 'validator';
import { t } from 'i18next';

export const IS_ALPHANUMERIC = 'isAlphanumeric';

/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export function isAlphanumeric(value: unknown, locale?: validator.AlphanumericLocale): boolean {
  return typeof value === 'string' && isAlphanumericValidator(value, locale);
}

/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export function IsAlphanumeric(
  locale?: validator.AlphanumericLocale,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ALPHANUMERIC,
      constraints: [locale],
      validator: {
        validate: (value, args): boolean => isAlphanumeric(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + `${t('archbase:$property must contain only letters and numbers')}`,
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
