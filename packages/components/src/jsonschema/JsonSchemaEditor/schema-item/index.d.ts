import { FlexProps } from '@mantine/core';
import { JSONSchema7 } from '../../ArchbaseJsonSchemaEditor.types';
export interface SchemaItemProps extends FlexProps {
    jsonSchema: JSONSchema7;
    name: string;
    itemPath: string;
    parentPath: string;
    showadvanced: (item: string) => void;
    isReadOnly: boolean;
}
export declare const SchemaItem: ({ name, showadvanced, jsonSchema, itemPath, parentPath, isReadOnly, }: SchemaItemProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map