import { JSONSchema7, JSONSchema7TypeName } from '../ArchbaseJsonSchemaEditor.types';
export declare const JSONPATH_JOIN_CHAR = ".";
export declare const isValidSchemaValidator: (schema: JSONSchema7) => boolean;
export declare enum PropertyType {
    SIBLING = 0,
    CHILD = 1
}
export declare const StringFormat: {
    name: string;
}[];
export declare const SchemaTypes: string[];
export declare enum DataType {
    string = "string",
    number = "number",
    array = "arrray",
    object = "object",
    boolean = "boolean",
    integer = "integer"
}
export declare const getDefaultSchema: (dataType: DataType, includeSchema?: boolean) => JSONSchema7;
export declare const random: () => string;
export declare const handleTypeChange: (newValue: JSONSchema7TypeName, rootChange: boolean) => JSONSchema7;
export declare const renameKeys: any;
export declare const deleteKey: (key: string, object: any) => any;
export declare const isValidEnum: (value: any) => boolean;
//# sourceMappingURL=utils.d.ts.map