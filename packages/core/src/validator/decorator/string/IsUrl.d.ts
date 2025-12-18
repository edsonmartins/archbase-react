import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_URL = "isUrl";
/**
 * Checks if the string is a url.
 * If given value is not a string, then it returns false.
 */
export declare function isURL(value: string, options?: validator.IsURLOptions): boolean;
/**
 * Checks if the string is a url.
 * If given value is not a string, then it returns false.
 */
export declare function IsUrl(options?: validator.IsURLOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsUrl.d.ts.map
