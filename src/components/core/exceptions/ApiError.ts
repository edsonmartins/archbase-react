export class ApiError {
  private _status: number;
  private _timestamp: Date;
  private _message: string;
  private _debugMessage: string;
  private _subErrors: ApiSubError[];

  constructor(data: any) {
    this._status = data.status;
    this._timestamp = data.timestamp;
    this._message = data.message;
    this._subErrors = data.subErrors;
  }

  public get status(): number {
    return this._status;
  }

  public get timestamp(): Date {
    return this._timestamp;
  }

  public get debugMessage(): string {
    return this._debugMessage;
  }

  public get message(): string {
    return this._message;
  }

  public get subErrors(): ApiSubError[] {
    return this._subErrors;
  }
}

export abstract class ApiSubError {
  constructor() {}
}

export class ApiValidationError extends ApiSubError {
  private _object: string;
  private _field: string;
  private _rejectedValue: any;
  private _message: string;

  constructor(data: any) {
    super();
    this._object = data.object;
    this._field = data.field;
    this._rejectedValue = data.rejectedValue;
    this._message = data.message;
  }

  public get object(): string {
    return this._object;
  }

  public get field(): string {
    return this._field;
  }

  public get rejectedValue(): any {
    return this._rejectedValue;
  }

  public get message(): string {
    return this._message;
  }
}
