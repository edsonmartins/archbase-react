import { t } from 'i18next';
import isBase64Validator from 'validator/lib/isBase64';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import { ValidationOptions } from '../ValidationOptions';

export const IS_BASE64 = 'isBase64';

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function isBase64Validate(value: unknown, options?: any): boolean {
	return typeof value === 'string' && isBase64Validator(value, options);
}

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function IsBase64(
	options?: any,
	validationOptions?: ValidationOptions,
): PropertyDecorator {
	return ValidateBy(
		{
			name: IS_BASE64,
			constraints: [options],
			validator: {
				validate: (value, args): boolean => isBase64Validate(value),
				defaultMessage: buildMessage(
					(eachPrefix) =>
						eachPrefix + `${t('archbase:$property must be base64 encoded')}`,
					validationOptions,
				),
			},
		},
		validationOptions,
	);
}
