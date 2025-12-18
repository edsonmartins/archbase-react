import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_POSTAL_CODE = "isPostalCode";
/**
 * Check if the string is a postal code, in the specified locale.
 * If given value is not a string, then it returns false.
 */
export declare function isPostalCode(value: unknown, locale: 'any' | validator.PostalCodeLocale): boolean;
/**
 * Check if the string is a postal code, in the specified locale.
 * If given value is not a string, then it returns false.
 */
export declare function IsPostalCode(locale?: 'any' | validator.PostalCodeLocale, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsPostalCode.d.ts.map
