import { ActionIcon, Checkbox, Flex, FlexProps, Input, Select, TextInput, Tooltip } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import i18next from 'i18next';
import React, { useContext } from 'react';
import { JSONSchema7, JSONSchema7TypeName } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';
import { DataType, getDefaultSchema, handleTypeChange, random } from '../utils';


export interface SchemaArrayProps extends FlexProps {
	path: string;
	jsonSchema: JSONSchema7;
	isReadOnly: boolean;
}
export const SchemaRoot = ({
	path,
	jsonSchema,
	isReadOnly,
}: SchemaArrayProps) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	return (
		<>
			<Flex data-testid="jsonschema-editor" direction="row" align="center" wrap="nowrap" mt={2} mr={5}>
				<Input disabled placeholder={`${i18next.t('archbase:root')}`} m={2} />
				<Tooltip
					aria-label={`${i18next.t('archbase:All Required')}`}
					label={`${i18next.t('archbase:All Required')}`}
					position="top"
				>
					<Checkbox
						disabled={isReadOnly}
						m={2}
						width={20}
						color="blue"
					/>
				</Tooltip>

				<Select
					readOnly={isReadOnly}
					value={jsonSchema.type.toString()}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Choose root data type')}`}
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						handleChange(`${path}`, newSchema, 'ASSIGN_VALUE');
					}}
					data={[
						{ value: 'object', label: 'object' },
						{ value: 'array', label: 'array' },
					]}
				/>
				<TextInput
					value={jsonSchema.title ?? ''}
					readOnly={isReadOnly}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Add Title')}`}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.title`, event.currentTarget.value, 'ASSIGN_VALUE');
					}}
				/>
				<TextInput
					value={jsonSchema.description ?? ''}
					readOnly={isReadOnly}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Add Description')}`}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.description`, event.currentTarget.value, 'ASSIGN_VALUE');
					}}
				/>

				{jsonSchema.type === 'object' && (
					<>
						<Tooltip
							aria-label={`${i18next.t('archbase:Add Child Node')}`}
							label={`${i18next.t('archbase:Add Child Node')}`}
							position="top"
						>
							<ActionIcon
								disabled={isReadOnly}
								size="sm"
								mt={2}
								mb={2}
								mr={2}
								color="green"
								aria-label={`${i18next.t('archbase:Add Child Node')}`}
								onClick={() => {
									const fieldName = `field_${random()}`;
									handleChange(`${path}.properties.${fieldName}`, getDefaultSchema(DataType.string), 'ASSIGN_VALUE');
								}}
							>
								<IconCirclePlus />
							</ActionIcon>
						</Tooltip>
					</>
				)}
			</Flex>
		</>
	);
};
