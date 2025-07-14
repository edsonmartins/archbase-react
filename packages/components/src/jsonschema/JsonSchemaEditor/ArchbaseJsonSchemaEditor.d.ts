import { JSONSchema7 } from '../ArchbaseJsonSchemaEditor.types';
export * from '../ArchbaseJsonSchemaEditor.types';
export interface ArchbaseJsonSchemaEditorProps {
    rootSchema?: JSONSchema7 | undefined;
    defaultRootSchema?: JSONSchema7 | undefined;
    onRootSchemaChange?: (schema: JSONSchema7, isValid: boolean) => void;
    readOnly?: boolean;
}
export declare const ArchbaseJsonSchemaEditor: ({ rootSchema, defaultRootSchema, onRootSchemaChange, readOnly, }: ArchbaseJsonSchemaEditorProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseJsonSchemaEditor.d.ts.map