import { ValidationOptions } from '../ValidationOptions';
import { registerDecorator } from '../../register-decorator';
import { ValidationArguments } from '../../validation/ValidationArguments';
import { ValidatorConstraintInterface } from '../../validation/ValidatorConstraintInterface';
import { t } from 'i18next';

export interface ValidateByOptions {
  name: string;
  constraints?: any[];
  validator: ValidatorConstraintInterface | Function;
  async?: boolean;
}

export function buildMessage(
  impl: (eachPrefix: string, args?: ValidationArguments) => string,
  validationOptions?: ValidationOptions
): (validationArguments?: ValidationArguments) => string {
  return (validationArguments?: ValidationArguments): string => {
    const eachPrefix = validationOptions && validationOptions.each ? `${t('archbase:each value in ')}` : '';
    return impl(eachPrefix, validationArguments);
  };
}

export function ValidateBy(options: ValidateByOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  // @ts-ignore
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: options.name,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: options.constraints,
      validator: options.validator,
    });
  };
}
