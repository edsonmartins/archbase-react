import { FlexProps } from '@mantine/core';
import { JSONSchema7 } from '../../ArchbaseJsonSchemaEditor.types';
export interface DropPlusProps extends FlexProps {
    itemPath: string;
    parentPath: string;
    parent: JSONSchema7;
    item: JSONSchema7;
    isReadOnly: boolean;
}
export declare const DropPlus: ({ itemPath, parentPath, parent, item, isReadOnly, }: DropPlusProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map