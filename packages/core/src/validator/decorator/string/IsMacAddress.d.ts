import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_MAC_ADDRESS = "isMacAddress";
/**
 * Check if the string is a MAC address.
 * If given value is not a string, then it returns false.
 */
export declare function isMACAddress(value: unknown, options?: validator.IsMACAddressOptions): boolean;
/**
 * Check if the string is a MAC address.
 * If given value is not a string, then it returns false.
 */
export declare function IsMACAddress(optionsArg?: validator.IsMACAddressOptions, validationOptionsArg?: ValidationOptions): PropertyDecorator;
export declare function IsMACAddress(validationOptionsArg?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsMacAddress.d.ts.map
