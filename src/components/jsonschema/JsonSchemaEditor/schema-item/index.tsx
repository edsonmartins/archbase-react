import { getPathDepthLevel } from '@components/core';
import { ActionIcon, Checkbox, Flex, FlexProps, Input, Select, Tooltip } from '@mantine/core';
import { IconCirclePlus, IconSettings, IconTrash } from '@tabler/icons-react';
import i18next from 'i18next';
import React, { useContext, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { JSONSchema7, JSONSchema7TypeName } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';
import { DropPlus } from '../drop-plus';
import { SchemaArray } from '../schema-array';
import { SchemaObject } from '../schema-object';
import { DataType, getDefaultSchema, handleTypeChange, random, SchemaTypes } from '../utils';
import { deleteKey, renameKeys } from '../utils';

export interface SchemaItemProps extends FlexProps {
	jsonSchema: JSONSchema7;
	name: string;
	itemPath: string;
	parentPath: string;
	showadvanced: (item: string) => void;
	isReadOnly: boolean;
}

const itemTypes = SchemaTypes.map((item) => ({ value: item, label: item }));
export const SchemaItem: React.FunctionComponent<SchemaItemProps> = ({
	name,
	showadvanced,
	jsonSchema,
	itemPath,
	parentPath,
	isReadOnly,
}: React.PropsWithChildren<SchemaItemProps>) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	const [error, setError] = useState<string | undefined>();
	const required = jsonSchema.required as string[];
	const item: JSONSchema7 = jsonSchema.properties[name] as JSONSchema7;

	const length =
		getPathDepthLevel(parentPath) - (parentPath.match(/(properties)/g) ? parentPath.match(/(properties)/g).length : 0);
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const debounced = useDebouncedCallback(
		(newValue: string) => {
			if (jsonSchema.properties && jsonSchema.properties[newValue]) {
				setError(`${i18next.t('archbase:Duplicate Properties, the property already exists')}`);
			} else {
				const oldName = name;
				const proptoupdate = newValue;

				const newobj = renameKeys({ [oldName]: proptoupdate }, jsonSchema.properties);
				handleChange(`${parentPath}.properties`, JSON.parse(JSON.stringify(newobj)), 'ASSIGN_VALUE');
				setError('');
			}
		},
		// delay in ms
		1000,
	);
	if (!item) {
		return <></>;
	}
	return (
		<div>
			<Flex align="center" direction="row" wrap="nowrap" className="schema-item" style={tagPaddingLeftStyle}>
				<Input.Wrapper error={error}>
					<Input
						readOnly={isReadOnly}
						defaultValue={name}
						size="sm"
						m={2}
						placeholder={`${i18next.t('archbase:Enter property name')}`}
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
							debounced(evt.target.value);
						}}
					/>
				</Input.Wrapper>

				<Checkbox
					disabled={isReadOnly}
					checked={required ? required.length > 0 && required.includes(name) : false}
					m={2}
					color="blue"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						if (!evt.target.checked) {
							handleChange(`${parentPath}.required`, name, 'REMOVE_ITEM_FROM_ARRAY');
						} else {
							handleChange(`${parentPath}.required`, name, 'PUSH_ITEM_TO_ARRAY');
						}
					}}
				/>
				<Select
					readOnly={isReadOnly}
					value={item.type.toString()}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Choose data type')}`}
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						handleChange(`${itemPath}`, newSchema, 'ASSIGN_VALUE');
					}}
					data={itemTypes}
				/>
				<Input
					readOnly={isReadOnly}
					value={item.title || ''}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Add Title')}`}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${itemPath}.title`, evt.target.value, 'ASSIGN_VALUE');
					}}
				/>
				<Input
					readOnly={isReadOnly}
					value={item.description || ''}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Add Description')}`}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${itemPath}.description`, evt.target.value, 'ASSIGN_VALUE');
					}}
				/>

				{item.type !== 'object' && item.type !== 'array' && (
					<Tooltip
						aria-label={`${i18next.t('archbase:Advanced Settings')}`}
						label={`${i18next.t('archbase:Advanced Settings')}`}
						position="top"
					>
						<ActionIcon
							disabled={isReadOnly}
							size="sm"
							mt={2}
							mb={2}
							ml={1}
							aria-label={`${i18next.t('archbase:Advanced Settings')}`}
							onClick={() => {
								showadvanced(name);
							}}
						>
							<IconSettings />
						</ActionIcon>
					</Tooltip>
				)}

				<Tooltip
					aria-label={`${i18next.t('archbase:Remove Node')}`}
					label={`${i18next.t('archbase:Remove Node')}`}
					position="top"
				>
					<ActionIcon
						disabled={isReadOnly}
						size="sm"
						mt={2}
						mb={2}
						ml={1}
						color="red"
						aria-label={`${i18next.t('archbase:Remove Node')}`}
						onClick={() => {
							const updatedState = deleteKey(name, JSON.parse(JSON.stringify(jsonSchema.properties)));
							handleChange(`${parentPath}.properties`, updatedState, 'ASSIGN_VALUE');
						}}
					>
						<IconTrash />
					</ActionIcon>
				</Tooltip>

				{item.type === 'object' ? (
					<DropPlus
						parentPath={parentPath}
						itemPath={itemPath}
						item={item}
						parent={jsonSchema}
						isReadOnly={isReadOnly}
					/>
				) : (
					<Tooltip
						aria-label={`${i18next.t('archbase:Add Sibling Node')}`}
						label={`${i18next.t('archbase:Add Sibling Node')}`}
						position="top"
					>
						<ActionIcon
							disabled={isReadOnly}
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							variant="subtle"
							color="green"
							aria-label={`${i18next.t('archbase:Add Sibling Node')}`}
							onClick={() => {
								if (jsonSchema.properties) {
									const fieldName = `field_${random()}`;
									handleChange(
										`${parentPath}.properties.${fieldName}`,
										getDefaultSchema(DataType.string),
										'ASSIGN_VALUE',
									);
								}
							}}
						>
							<IconCirclePlus />
						</ActionIcon>
					</Tooltip>
				)}
			</Flex>
			{item.type === 'object' && <SchemaObject path={itemPath} jsonSchema={item} isReadOnly={isReadOnly} />}
			{item.type === 'array' && <SchemaArray path={itemPath} jsonSchema={item} isReadOnly={isReadOnly} />}
		</div>
	);
};
