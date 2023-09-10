import { ValidationError } from './validation/ValidationError';
import { ValidatorOptions } from './validation/ValidatorOptions';
import { ValidationSchema } from './validation-schema/ValidationSchema';
import { getMetadataStorage } from './metadata/MetadataStorage';
import { Validator } from './validation/Validator';
import { getFromContainer } from './container';

export * from './container';
export * from './decorator/decorators';
export * from './decorator/ValidationOptions';
export * from './validation/ValidatorConstraintInterface';
export * from './validation/ValidationError';
export * from './validation/ValidatorOptions';
export * from './validation/ValidationArguments';
export * from './validation/ValidationTypes';
export * from './validation/Validator';
export * from './validation-schema/ValidationSchema';
export * from './register-decorator';
export * from './metadata/MetadataStorage';

// -------------------------------------------------------------------------
// Métodos de atalho para usuários de API
// -------------------------------------------------------------------------

/**
 * Valida determinado objeto.
 */
export function validate(object: object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;

/**
 * Valida determinado objeto por um determinado esquema de validação.
 */
export function validate(
  schemaName: string,
  object: object,
  validatorOptions?: ValidatorOptions
): Promise<ValidationError[]>;

/**
 * Valida determinado objeto pelos decoradores do objeto ou determinado esquema de validação.
 */
export function validate(
  schemaNameOrObject: object | string,
  objectOrValidationOptions?: object | ValidatorOptions,
  maybeValidatorOptions?: ValidatorOptions
): Promise<ValidationError[]> {
  if (typeof schemaNameOrObject === 'string') {
    return getFromContainer(Validator).validate(
      schemaNameOrObject,
      objectOrValidationOptions as object,
      maybeValidatorOptions
    );
  } else {
    return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions as ValidatorOptions);
  }
}

/**
 * Valida determinado objeto e rejeita em caso de erro.
 */
export function validateOrReject(object: object, validatorOptions?: ValidatorOptions): Promise<void>;

/**
 * Valida determinado objeto por um determinado esquema de validação e rejeita em caso de erro.
 */
export function validateOrReject(
  schemaName: string,
  object: object,
  validatorOptions?: ValidatorOptions
): Promise<void>;

/**
 * Valida determinado objeto pelos decoradores do objeto ou determinado esquema de validação e rejeita em caso de erro.
 */
export function validateOrReject(
  schemaNameOrObject: object | string,
  objectOrValidationOptions?: object | ValidatorOptions,
  maybeValidatorOptions?: ValidatorOptions
): Promise<void> {
  if (typeof schemaNameOrObject === 'string') {
    return getFromContainer(Validator).validateOrReject(
      schemaNameOrObject,
      objectOrValidationOptions as object,
      maybeValidatorOptions
    );
  } else {
    return getFromContainer(Validator).validateOrReject(
      schemaNameOrObject,
      objectOrValidationOptions as ValidatorOptions
    );
  }
}

/**
 * Executa a validação de sincronização do objeto fornecido.
 * Observe que este método ignora completamente as validações assíncronas.
 * Se você deseja realizar a validação corretamente, você precisa chamar o método activate.
 */
export function validateSync(object: object, validatorOptions?: ValidatorOptions): ValidationError[];

/**
 * Valida determinado objeto por um determinado esquema de validação.
 * Observe que este método ignora completamente as validações assíncronas.
 * Se você deseja realizar a validação corretamente, você precisa chamar o método activate.
 */
export function validateSync(
  schemaName: string,
  object: object,
  validatorOptions?: ValidatorOptions
): ValidationError[];

/**
 * Valida determinado objeto pelos decoradores do objeto ou determinado esquema de validação.
 * Observe que este método ignora completamente as validações assíncronas.
 * Se você deseja realizar a validação corretamente, você precisa chamar o método activate.
 */
export function validateSync(
  schemaNameOrObject: object | string,
  objectOrValidationOptions?: object | ValidatorOptions,
  maybeValidatorOptions?: ValidatorOptions
): ValidationError[] {
  if (typeof schemaNameOrObject === 'string') {
    return getFromContainer(Validator).validateSync(
      schemaNameOrObject,
      objectOrValidationOptions as object,
      maybeValidatorOptions
    );
  } else {
    return getFromContainer(Validator).validateSync(schemaNameOrObject, objectOrValidationOptions as ValidatorOptions);
  }
}

/**
 * Registra um novo esquema de validação.
 */
export function registerSchema(schema: ValidationSchema): void {
  getMetadataStorage().addValidationSchema(schema);
}
