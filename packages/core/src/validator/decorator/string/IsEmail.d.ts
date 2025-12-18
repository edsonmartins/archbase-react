import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_EMAIL = "isEmail";
/**
 * Checks if the string is an email.
 * If given value is not a string, then it returns false.
 */
export declare function isEmailValidate(value: unknown, options?: validator.IsEmailOptions): boolean;
/**
 * Checks if the string is an email.
 * If given value is not a string, then it returns false.
 */
export declare function IsEmail(options?: validator.IsEmailOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsEmail.d.ts.map
