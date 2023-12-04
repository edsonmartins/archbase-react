import { SetNestedObjectValueOperation } from 'components/core';
import React from 'react';

export interface ArchbaseJsonSchemaEditorContextValue {
	handleChange?: (path: string, value: any, operation?: SetNestedObjectValueOperation) => void;
}
export const ArchbaseJsonSchemaEditorContext = React.createContext<ArchbaseJsonSchemaEditorContextValue>({});
export const ArchbaseJsonSchemaEditorProvider = ArchbaseJsonSchemaEditorContext.Provider;
