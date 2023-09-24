import { DataSourceValidationError, IDataSourceValidator } from '../datasource/ArchbaseDataSource';
import { ValidatorOptions, ValidationError, validateSync, validate, validateOrReject } from './index';

export class ArchbaseValidator implements IDataSourceValidator {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}
  validateEntity<T>(value: T): DataSourceValidationError[] {
    const errors: ValidationError[] = validateSync(value as object);
    const result: DataSourceValidationError[] = [];
    errors.forEach((error) => {
      if (error.constraints) {
        for (const [key, value] of Object.entries(error.constraints)) {
          result.push({
            errorMessage: value,
            debugMessage: `key: ${key} value: ${value}`,
            fieldName: error.property,
          });
        }
      }
    });

    return result;
  }

  /**
   * Valida determinado objeto.
   */
  public validate(object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    return validate(object, validatorOptions);
  }

  /**
   * Valida determinado objeto e rejeita em caso de erro.
   */
  public validateOrReject(object: object, validatorOptions?: ValidatorOptions): Promise<void> {
    return validateOrReject(object, validatorOptions);
  }
}
