// Removed circular dependency - interfaces moved to local definitions

// Local interfaces to avoid circular dependency
export interface DataSourceValidationError {
  errorMessage: string;
  debugMessage: string;
  fieldName: string;
}

export interface IDataSourceValidator {
  validateEntity<T>(value: T): DataSourceValidationError[];
}
import { ValidatorOptions, ValidationError, validateSync, validate, validateOrReject } from './index'

export class ArchbaseValidator implements IDataSourceValidator {
  constructor() {}
  validateEntity<T>(value: T): DataSourceValidationError[] {
    const errors : ValidationError[] = validateSync(value as object);
    const result : DataSourceValidationError[] = [];
    errors.forEach(error => {    
      if (error.constraints){  
        for (const [key, value] of Object.entries(error.constraints)) {
          result.push({
            errorMessage: value,
            debugMessage: `key: ${key} value: ${value}`,
            fieldName: error.property
          })
        }
      }
    })
    return result
  }

  /**
   * Valida determinado objeto.
   */
  public validate(object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    return validate(object, validatorOptions)
  }

  /**
   * Valida determinado objeto e rejeita em caso de erro.
   */
  public validateOrReject(object: object, validatorOptions?: ValidatorOptions): Promise<void> {
    return validateOrReject(object, validatorOptions)
  }
}
