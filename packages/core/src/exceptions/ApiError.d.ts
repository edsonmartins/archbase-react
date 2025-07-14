export declare class ApiError {
    private _status;
    private _timestamp;
    private _message;
    private _debugMessage;
    private _subErrors;
    constructor(data: any);
    get status(): number;
    get timestamp(): Date;
    get debugMessage(): string;
    get message(): string;
    get subErrors(): ApiSubError[];
}
export declare abstract class ApiSubError {
    constructor();
}
export declare class ApiValidationError extends ApiSubError {
    private _object;
    private _field;
    private _rejectedValue;
    private _message;
    constructor(data: any);
    get object(): string;
    get field(): string;
    get rejectedValue(): any;
    get message(): string;
}
//# sourceMappingURL=ApiError.d.ts.map