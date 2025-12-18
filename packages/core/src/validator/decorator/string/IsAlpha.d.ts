import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_ALPHA = "isAlpha";
/**
 * Checks if the string contains only letters (a-zA-Z).
 * If given value is not a string, then it returns false.
 */
export declare function isAlpha(value: unknown, locale?: validator.AlphaLocale): boolean;
/**
 * Checks if the string contains only letters (a-zA-Z).
 * If given value is not a string, then it returns false.
 */
export declare function IsAlpha(locale?: validator.AlphaLocale, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsAlpha.d.ts.map
