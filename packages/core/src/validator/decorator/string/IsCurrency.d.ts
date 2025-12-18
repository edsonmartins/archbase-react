import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_CURRENCY = "isCurrency";
/**
 * Checks if the string is a valid currency amount.
 * If given value is not a string, then it returns false.
 */
export declare function isCurrency(value: unknown, options?: validator.IsCurrencyOptions): boolean;
/**
 * Checks if the string is a valid currency amount.
 * If given value is not a string, then it returns false.
 */
export declare function IsCurrency(options?: validator.IsCurrencyOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsCurrency.d.ts.map
