import { SetNestedObjectValueOperation } from '@archbase/core';
import React from 'react';
export interface ArchbaseJsonSchemaEditorContextValue {
    handleChange?: (path: string, value: any, operation?: SetNestedObjectValueOperation) => void;
}
export declare const ArchbaseJsonSchemaEditorContext: React.Context<ArchbaseJsonSchemaEditorContextValue>;
export declare const ArchbaseJsonSchemaEditorProvider: React.Provider<ArchbaseJsonSchemaEditorContextValue>;
//# sourceMappingURL=ArchbaseJsonSchemaEditor.context.d.ts.map