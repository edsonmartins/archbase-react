import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_NUMBER_STRING = "isNumberString";
/**
 * Checks if the string is numeric.
 * If given value is not a string, then it returns false.
 */
export declare function isNumberString(value: unknown, options?: validator.IsNumericOptions): boolean;
/**
 * Checks if the string is numeric.
 * If given value is not a string, then it returns false.
 */
export declare function IsNumberString(options?: validator.IsNumericOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsNumberString.d.ts.map
