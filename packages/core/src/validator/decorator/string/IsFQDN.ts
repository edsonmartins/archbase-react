import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isFqdnValidator from 'validator/lib/isFQDN';
import validator from 'validator';
import { t } from 'i18next';

export const IS_FQDN = 'isFqdn';

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export function isFQDN(value: unknown, options?: validator.IsFQDNOptions): boolean {
  return typeof value === 'string' && isFqdnValidator(value, options);
}

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export function IsFQDN(options?: validator.IsFQDNOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_FQDN,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isFQDN(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + `${t('archbase:$property must be a valid domain name')}`,
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
