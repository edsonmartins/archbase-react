export interface DataSourceValidationError {
    errorMessage: string;
    debugMessage: string;
    fieldName: string;
}
export interface IDataSourceValidator {
    validateEntity<T>(value: T): DataSourceValidationError[];
}
import { ValidatorOptions, ValidationError } from './index';
export declare class ArchbaseValidator implements IDataSourceValidator {
    constructor();
    validateEntity<T>(value: T): DataSourceValidationError[];
    /**
     * Valida determinado objeto.
     */
    validate(object: any, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;
    /**
     * Valida determinado objeto e rejeita em caso de erro.
     */
    validateOrReject(object: object, validatorOptions?: ValidatorOptions): Promise<void>;
}
//# sourceMappingURL=ArchbaseValidator.d.ts.map