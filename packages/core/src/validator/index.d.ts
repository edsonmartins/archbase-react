import { ValidationError } from './validation/ValidationError';
import { ValidatorOptions } from './validation/ValidatorOptions';
import { ValidationSchema } from './validation-schema/ValidationSchema';
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
export { ArchbaseValidator } from './ArchbaseValidator';
export type { DataSourceValidationError, IDataSourceValidator } from './ArchbaseValidator';
/**
 * Valida determinado objeto.
 */
export declare function validate(object: object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;
/**
 * Valida determinado objeto por um determinado esquema de validação.
 */
export declare function validate(schemaName: string, object: object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;
/**
 * Valida determinado objeto e rejeita em caso de erro.
 */
export declare function validateOrReject(object: object, validatorOptions?: ValidatorOptions): Promise<void>;
/**
 * Valida determinado objeto por um determinado esquema de validação e rejeita em caso de erro.
 */
export declare function validateOrReject(schemaName: string, object: object, validatorOptions?: ValidatorOptions): Promise<void>;
/**
 * Executa a validação de sincronização do objeto fornecido.
 * Observe que este método ignora completamente as validações assíncronas.
 * Se você deseja realizar a validação corretamente, você precisa chamar o método activate.
 */
export declare function validateSync(object: object, validatorOptions?: ValidatorOptions): ValidationError[];
/**
 * Valida determinado objeto por um determinado esquema de validação.
 * Observe que este método ignora completamente as validações assíncronas.
 * Se você deseja realizar a validação corretamente, você precisa chamar o método activate.
 */
export declare function validateSync(schemaName: string, object: object, validatorOptions?: ValidatorOptions): ValidationError[];
/**
 * Registra um novo esquema de validação.
 */
export declare function registerSchema(schema: ValidationSchema): void;
//# sourceMappingURL=index.d.ts.map
