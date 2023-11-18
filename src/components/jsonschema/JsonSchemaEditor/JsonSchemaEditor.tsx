import { useHookstate } from '@hookstate/core';
import { Flex } from '@mantine/core';
import * as React from 'react';
import { SchemaEditorProps } from '../JsonSchemaEditor.types';
import { SchemaArray } from './schema-array';
import { SchemaObject } from './schema-object';
import { SchemaRoot } from './schema-root';
import { defaultSchema, useSchemaState } from './state';
import { Whoops } from './whoops';

export * from '../JsonSchemaEditor.types';

export const JsonSchemaEditor = (props: SchemaEditorProps) => {
	const { onSchemaChange, readOnly, data } = props;

	const schemaState = useSchemaState({
		jsonSchema: data ?? defaultSchema(),
		isReadOnly: readOnly ?? false,
		fieldId: 0,
	});

	const jsonSchemaState = useHookstate(schemaState.jsonSchema);

	return (
		<>
			{schemaState.isValidSchema ? (
				<Flex m={2} direction="column">
					<SchemaRoot
						onSchemaChange={onSchemaChange}
						schemaState={schemaState.jsonSchema}
						isReadOnly={schemaState.isReadOnly}
					/>

					{jsonSchemaState.type.value === 'object' && (
						<SchemaObject schemaState={jsonSchemaState} isReadOnly={schemaState.isReadOnly ?? false} />
					)}

					{jsonSchemaState.type.value === 'array' && (
						<SchemaArray schemaState={jsonSchemaState} isReadOnly={schemaState.isReadOnly ?? false} />
					)}
				</Flex>
			) : (
				<Flex align="center" justify="center">
					<Whoops />
				</Flex>
			)}
		</>
	);
};
