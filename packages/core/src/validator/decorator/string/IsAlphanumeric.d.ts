import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_ALPHANUMERIC = "isAlphanumeric";
/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export declare function isAlphanumeric(value: unknown, locale?: validator.AlphanumericLocale): boolean;
/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export declare function IsAlphanumeric(locale?: validator.AlphanumericLocale, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsAlphanumeric.d.ts.map
