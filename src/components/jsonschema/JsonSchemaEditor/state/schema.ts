import { hookstate, State } from '@hookstate/core';
import Ajv from 'ajv';
import { JSONSchema7 } from '../../JsonSchemaEditor.types';
import { Schema2 } from '../../JsonSchemaEditor.types';

const ajv = new Ajv();

export const defaultSchema = (): JSONSchema7 => {
	return {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		title: 'title',
		description: '',
		properties: {},
		required: [],
	};
};

const isValidSchema = (schema: JSONSchema7): boolean => {
	const isValid = ajv.validateSchema(schema);
	return isValid;
};

export const useSchemaState = (initialState: Schema2): State<Schema2> => {
	if (initialState.jsonSchema === undefined) {
		initialState.jsonSchema = defaultSchema();
	}

	initialState.isValidSchema = isValidSchema(initialState.jsonSchema);
	return hookstate<Schema2>(initialState);
};
