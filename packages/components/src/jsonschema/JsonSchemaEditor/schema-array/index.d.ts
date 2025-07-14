import { FlexProps } from '@mantine/core';
import { JSONSchema7 } from '../../ArchbaseJsonSchemaEditor.types';
export interface SchemaArrayProps extends FlexProps {
    path: string;
    jsonSchema: JSONSchema7;
    isReadOnly: boolean;
}
export declare const SchemaArray: ({ path, jsonSchema, isReadOnly, }: SchemaArrayProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map