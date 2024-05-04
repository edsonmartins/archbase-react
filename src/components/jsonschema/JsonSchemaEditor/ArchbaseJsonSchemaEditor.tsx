import { setNestedObjectValue, SetNestedObjectValueOperation } from '@components/core';
import { Flex } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { produce } from 'immer';
import React from 'react';
import { JSONSchema7, Schema2 } from '../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorProvider } from './ArchbaseJsonSchemaEditor.context';
import { SchemaArray } from './schema-array';
import { SchemaObject } from './schema-object';
import { SchemaRoot } from './schema-root';
import { isValidSchemaValidator } from './utils';
import { useTranslation } from 'react-i18next';

export * from '../ArchbaseJsonSchemaEditor.types';

export interface ArchbaseJsonSchemaEditorProps {
	rootSchema?: JSONSchema7 | undefined;
	defaultRootSchema?: JSONSchema7 | undefined;
	onRootSchemaChange?: (schema: JSONSchema7, isValid: boolean) => void;
	readOnly?: boolean;
}

const initialSchema: JSONSchema7 = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	title: 'title',
	description: '',
	properties: {},
	required: [],
};

export const ArchbaseJsonSchemaEditor = ({
	rootSchema,
	defaultRootSchema,
	onRootSchemaChange,
	readOnly = false,
}: ArchbaseJsonSchemaEditorProps) => {
	const [internalRootSchema, setInternalRootSchema] = useUncontrolled({
		value: {
			jsonSchema: rootSchema ?? initialSchema,
			isReadOnly: readOnly,
			fieldId: 0,
		},
		defaultValue: {
			jsonSchema: defaultRootSchema ?? initialSchema,
			isReadOnly: readOnly,
			fieldId: 0,
		},
		finalValue: initialSchema as Schema2,
		onChange: (value) => onRootSchemaChange(value.jsonSchema, isValidSchemaValidator(value.jsonSchema)),
	});
	const { ready } = useTranslation();

	const handleChange = (path: string, value: string, operation: SetNestedObjectValueOperation) => {
		const newState = produce((draft) => {
			setNestedObjectValue(draft, path, value, operation);
		}, internalRootSchema);
		if (rootSchema === undefined) {
			setInternalRootSchema(newState());
		}

		if (onRootSchemaChange) {
			onRootSchemaChange(newState().jsonSchema, isValidSchemaValidator(internalRootSchema.jsonSchema));
		}
	};
	if (ready) {
	return (
		<ArchbaseJsonSchemaEditorProvider value={{ handleChange }}>
			<Flex m={2} direction="column">
				<SchemaRoot
					path="jsonSchema"
					jsonSchema={internalRootSchema.jsonSchema}
					isReadOnly={internalRootSchema.isReadOnly}
				/>

				{internalRootSchema?.jsonSchema?.type === 'object' && (
					<SchemaObject
						path="jsonSchema"
						jsonSchema={internalRootSchema.jsonSchema}
						isReadOnly={internalRootSchema.isReadOnly}
					/>
				)}

				{internalRootSchema?.jsonSchema?.type === 'array' && (
					<SchemaArray
						path="jsonSchema"
						jsonSchema={internalRootSchema.jsonSchema}
						isReadOnly={internalRootSchema.isReadOnly}
					/>
				)}
			</Flex>
		</ArchbaseJsonSchemaEditorProvider>
	);}
	return false;
};
