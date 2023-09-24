import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';
import { t } from 'i18next';

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateNested(validationOptions?: ValidationOptions): PropertyDecorator {
  const opts: ValidationOptions = { ...validationOptions };
  const eachPrefix = opts.each ? `${t('archbase:each value in ')}` : '';
  opts.message = opts.message || eachPrefix + `${t('archbase:nested property $property must be either object or array')}`;
  // @ts-ignore

  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.NESTED_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      validationOptions: opts,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
