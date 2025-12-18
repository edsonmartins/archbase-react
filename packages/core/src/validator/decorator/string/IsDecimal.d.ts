import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_DECIMAL = "isDecimal";
/**
 * Checks if the string is a valid decimal.
 * If given value is not a string, then it returns false.
 */
export declare function isDecimal(value: unknown, options?: validator.IsDecimalOptions): boolean;
/**
 * Checks if the string is a valid decimal.
 * If given value is not a string, then it returns false.
 */
export declare function IsDecimal(options?: validator.IsDecimalOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsDecimal.d.ts.map
