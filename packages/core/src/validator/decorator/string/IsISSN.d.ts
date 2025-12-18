import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_ISSN = "isISSN";
/**
 * Checks if the string is a ISSN.
 * If given value is not a string, then it returns false.
 */
export declare function isISSN(value: unknown, options?: validator.IsISSNOptions): boolean;
/**
 * Checks if the string is a ISSN.
 * If given value is not a string, then it returns false.
 */
export declare function IsISSN(options?: validator.IsISSNOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsISSN.d.ts.map
