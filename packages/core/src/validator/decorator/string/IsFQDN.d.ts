import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_FQDN = "isFqdn";
/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export declare function isFQDN(value: unknown, options?: validator.IsFQDNOptions): boolean;
/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export declare function IsFQDN(options?: validator.IsFQDNOptions, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsFQDN.d.ts.map
