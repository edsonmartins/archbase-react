import { none, State, useHookstate } from '@hookstate/core';
import { ActionIcon, Checkbox, Flex, FlexProps, Input, Select, Tooltip } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconCirclePlus, IconSettings, IconTrash } from '@tabler/icons-react';
import * as React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDebouncedCallback } from 'use-debounce';
import { JSONSchema7, JSONSchema7Definition, JSONSchema7TypeName } from '../../JsonSchemaEditor.types';
import { DropPlus } from '../drop-plus';
import { SchemaArray } from '../schema-array';
import { SchemaObject } from '../schema-object';
import { DataType, getDefaultSchema, handleTypeChange, random, SchemaTypes } from '../utils';
import { deleteKey, renameKeys } from '../utils';

export interface SchemaItemProps extends FlexProps {
	required: string[];
	itemStateProp: State<JSONSchema7>;
	parentStateProp: State<JSONSchema7>;
	name: string;
	isReadOnly: State<boolean>;
	showadvanced: (item: string) => void;
}

export const SchemaItem: React.FunctionComponent<SchemaItemProps> = (
	props: React.PropsWithChildren<SchemaItemProps>,
) => {
	const { name, itemStateProp, showadvanced, required, parentStateProp, isReadOnly } = props;

	const parentState = useHookstate(parentStateProp);
	const parentStateOrNull: State<JSONSchema7> | undefined = parentState.ornull;
	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = parentStateOrNull.properties.ornull;

	const nameState = useHookstate(name);
	const isReadOnlyState = useHookstate(isReadOnly);

	const itemState = useHookstate(
		(
			parentStateProp.properties as State<{
				[key: string]: JSONSchema7;
			}>
		).nested(nameState.value),
	);
	const colorScheme = useColorScheme();

	const { length } = parentState.path.filter((name) => name !== 'properties');
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const isRequired = required ? required.length > 0 && required.includes(name) : false;
	const warnDuplicatedProperties = () =>
		toast('Propriedades Duplicadas, a propriedade já existe.', {
			position: 'top-right',
			type: 'warning',
			autoClose: 1000,
			theme: colorScheme,
		});

	// Debounce callback
	const debounced = useDebouncedCallback(
		// function
		(newValue: string) => {
			// Todo: make toast for duplicate properties
			if (propertiesOrNull && propertiesOrNull[newValue].value) {
				warnDuplicatedProperties();
			} else {
				const oldName = name;
				const proptoupdate = newValue;

				const newobj = renameKeys({ [oldName]: proptoupdate }, parentState.properties.value);
				parentStateOrNull.properties.set(JSON.parse(JSON.stringify(newobj)));
			}
		},
		// delay in ms
		1000,
	);

	if (!itemState.value) {
		return <></>;
	}

	return (
		<div>
			<Flex align="space-evenly" direction="row" wrap="nowrap" className="schema-item" style={tagPaddingLeftStyle}>
				<Input
					disabled={isReadOnlyState.value}
					defaultValue={nameState.value}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Enter property name"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						debounced(evt.target.value);
					}}
				/>
				<Checkbox
					disabled={isReadOnlyState.value}
					checked={isRequired}
					m={2}
					color="blue"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						if (!evt.target.checked && required.includes(name)) {
							(parentState.required as State<string[]>)[required.indexOf(name)].set(none);
						} else {
							parentState.required.merge([name]);
						}
					}}
				/>
				<Select
					disabled={false}
					variant="outline"
					value={itemState.type.value.toString()}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						itemState.set(newSchema as JSONSchema7);
					}}
					data={SchemaTypes.map((item, index) => ({ key: String(index), value: item }))}
				/>
				<Input
					disabled={isReadOnlyState.value}
					value={itemState.title.value || ''}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Title"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.title.set(evt.target.value);
					}}
				/>
				<Input
					disabled={isReadOnlyState.value}
					value={itemState.description.value || ''}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.description.set(evt.target.value);
					}}
				/>

				{itemState.type.value !== 'object' && itemState.type.value !== 'array' && (
					<Tooltip aria-label="Advanced Settings" label="Advanced Settings" position="top">
						<ActionIcon
							disabled={isReadOnlyState.value}
							size="sm"
							mt={2}
							mb={2}
							ml={1}
							variant="link"
							color="blue"
							aria-label="Advanced Settings"
							onClick={() => {
								showadvanced(name);
							}}
						>
							<IconSettings />
						</ActionIcon>
					</Tooltip>
				)}

				<Tooltip aria-label="Remove Node" label="Remove Node" position="top">
					<ActionIcon
						disabled={isReadOnlyState.value}
						size="sm"
						mt={2}
						mb={2}
						ml={1}
						variant="link"
						color="red"
						aria-label="Remove Node"
						onClick={() => {
							const updatedState = deleteKey(nameState.value, JSON.parse(JSON.stringify(parentState.properties.value)));
							parentState.properties.set(updatedState);
						}}
					>
						<IconTrash />
					</ActionIcon>
				</Tooltip>

				{itemState.type?.value === 'object' ? (
					<DropPlus isDisabled={isReadOnlyState.value} parentStateProp={parentState} itemStateProp={itemStateProp} />
				) : (
					<Tooltip aria-label="Add Sibling Node" label="Add Sibling Node" position="top">
						<ActionIcon
							disabled={isReadOnlyState.value}
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							variant="subtle"
							color="green"
							aria-label="Add Sibling Node"
							onClick={() => {
								if (propertiesOrNull) {
									const fieldName = `field_${random()}`;
									propertiesOrNull?.nested(fieldName).set(getDefaultSchema(DataType.string) as JSONSchema7);
								}
							}}
						>
							<IconCirclePlus />
						</ActionIcon>
					</Tooltip>
				)}
			</Flex>
			{itemState.type?.value === 'object' && <SchemaObject isReadOnly={isReadOnlyState} schemaState={itemState} />}
			{itemState.type?.value === 'array' && <SchemaArray isReadOnly={isReadOnlyState} schemaState={itemState} />}
			<ToastContainer />
		</div>
	);
};
