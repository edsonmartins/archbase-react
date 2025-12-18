import { ValidationOptions } from '../ValidationOptions';
import validator from 'validator';
export declare const IS_IDENTITY_CARD = "isIdentityCard";
/**
 * Check if the string is a valid identity card code.
 * locale is one of ['ES', 'zh-TW', 'he-IL', 'ar-TN'] OR 'any'. If 'any' is used, function will check if any of the locals match.
 * Defaults to 'any'.
 * If given value is not a string, then it returns false.
 */
export declare function isIdentityCard(value: unknown, locale: validator.IdentityCardLocale): boolean;
/**
 * Check if the string is a valid identity card code.
 * locale is one of ['ES', 'zh-TW', 'he-IL', 'ar-TN'] OR 'any'. If 'any' is used, function will check if any of the locals match.
 * Defaults to 'any'.
 * If given value is not a string, then it returns false.
 */
export declare function IsIdentityCard(locale?: validator.IdentityCardLocale, validationOptions?: ValidationOptions): PropertyDecorator;
//# sourceMappingURL=IsIdentityCard.d.ts.map
