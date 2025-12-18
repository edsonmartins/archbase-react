import { ValidationOptions } from '../ValidationOptions';
export declare const IS_UUID = "isUuid";
/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 * If given value is not a string, then it returns false.
 */
export declare function isUUID(value: unknown, version?: any): boolean;
/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 * If given value is not a string, then it returns false.
 */
export declare function IsUUID(version?: any, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsUUID.d.ts.map
