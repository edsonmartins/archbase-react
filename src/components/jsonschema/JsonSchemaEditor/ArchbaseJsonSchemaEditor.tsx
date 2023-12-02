import { setNestedObjectValue, SetNestedObjectValueOperation } from '@components/core';
import { Flex } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { produce } from 'immer';
import React, { useEffect } from 'react';
import { Schema2 } from '../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorProvider } from './ArchbaseJsonSchemaEditor.context';
import { SchemaArray } from './schema-array';
import { SchemaObject } from './schema-object';
import { SchemaRoot } from './schema-root';
import { isValidSchemaValidator } from './utils';
import { Whoops } from './whoops';

export * from '../ArchbaseJsonSchemaEditor.types';

export interface ArchbaseJsonSchemaEditorProps {
	rootSchema?: Schema2 | undefined;
	defaultRootSchema?: Schema2 | undefined;
	onRootSchemaChange?: (schema: Schema2) => void;
}

const initialSchema: Schema2 = {
	jsonSchema: {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		title: 'title',
		description: '',
		properties: {},
		required: [],
	},
	isReadOnly: false,
	fieldId: 0,
	isValidSchema: true,
};

export const ArchbaseJsonSchemaEditor = ({
	rootSchema,
	defaultRootSchema,
	onRootSchemaChange,
}: ArchbaseJsonSchemaEditorProps) => {
	const [internalRootSchema, setInternalRootSchema] = useUncontrolled({
		value: rootSchema,
		defaultValue: defaultRootSchema,
		finalValue: initialSchema as Schema2,
		onChange: onRootSchemaChange,
	});

	const handleChange = (path: string, value: string, operation: SetNestedObjectValueOperation) => {
		const newState = produce((draft) => {
			setNestedObjectValue(draft, path, value, operation);
		}, internalRootSchema);
		if (rootSchema === undefined) {
			setInternalRootSchema(newState());
		}

		if (onRootSchemaChange) {
			onRootSchemaChange(newState());
		}
	};

	useEffect(() => {
		if (internalRootSchema !== undefined && rootSchema !== internalRootSchema && rootSchema != undefined) {
			setInternalRootSchema(rootSchema);
		}
	}, [rootSchema]);
	console.log(internalRootSchema.jsonSchema);
	return (
		<ArchbaseJsonSchemaEditorProvider value={{ handleChange }}>
			{isValidSchemaValidator(internalRootSchema.jsonSchema) && internalRootSchema.jsonSchema ? (
				<Flex m={2} direction="column">
					<SchemaRoot
						path="jsonSchema"
						jsonSchema={internalRootSchema.jsonSchema}
						isReadOnly={internalRootSchema.isReadOnly}
					/>

					{internalRootSchema.jsonSchema.type === 'object' && (
						<SchemaObject
							path="jsonSchema"
							jsonSchema={internalRootSchema.jsonSchema}
							isReadOnly={internalRootSchema.isReadOnly}
						/>
					)}

					{internalRootSchema.jsonSchema.type === 'array' && (
						<SchemaArray
							path="jsonSchema"
							jsonSchema={internalRootSchema.jsonSchema}
							isReadOnly={internalRootSchema.isReadOnly}
						/>
					)}
				</Flex>
			) : (
				<Flex align="center" justify="center">
					<Whoops />
				</Flex>
			)}
		</ArchbaseJsonSchemaEditorProvider>
	);
};
