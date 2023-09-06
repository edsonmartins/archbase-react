import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

/**
 * Resolve promise before validation
 */
export function ValidatePromise(validationOptions?: ValidationOptions): PropertyDecorator {
  // @ts-ignore
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.PROMISE_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      validationOptions: validationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
