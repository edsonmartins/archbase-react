import { State, useHookstate } from '@hookstate/core';
import { ActionIcon, Button, Checkbox, Flex, FlexProps, Input, Modal, Select, Tooltip } from '@mantine/core';
import { IconCirclePlus, IconSettings } from '@tabler/icons-react';
import React, { useRef } from 'react';
import { JSONSchema7, JSONSchema7TypeName } from '../../JsonSchemaEditor.types';
import { AdvancedSettings } from '../schema-advanced';
import { SchemaObject } from '../schema-object';
import { DataType, getDefaultSchema, handleTypeChange, random, SchemaTypes } from '../utils';

export interface SchemaArrayProps extends FlexProps {
	schemaState: State<JSONSchema7>;
	isReadOnly: State<boolean>;
}
export const SchemaArray: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>,
) => {
	const { schemaState, isReadOnly } = props;

	const state = useHookstate(schemaState.items as JSONSchema7);
	const isReadOnlyState = useHookstate(isReadOnly);

	const { length } = state.path.filter((name) => name !== 'properties');
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const onCloseAdvanced = (): void => {
		localState.isAdvancedOpen.set(false);
	};

	const showadvanced = (): void => {
		localState.isAdvancedOpen.set(true);
	};

	const focusRef = useRef(null);

	const localState = useHookstate({
		isAdvancedOpen: false,
	});

	return (
		<>
			<Flex direction="row" wrap="nowrap" className="array-item" mt={2} mr={5} style={tagPaddingLeftStyle}>
				<Input key="Items" style={{ flexShrink: 1 }} disabled value="Items" size="sm" m={2} variant="outline" />
				<Checkbox disabled m={2} color="blue" />
				<Select
					variant="outline"
					disabled={isReadOnlyState.value}
					value={state.type.value as JSONSchema7TypeName}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						state.set(newSchema as JSONSchema7);
					}}
					data={SchemaTypes.map((item, index) => ({ key: String(index), value: item }))}
				/>
				<Input
					value={state.title.value}
					disabled={isReadOnlyState.value}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Title"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						state.title.set(evt.target.value);
					}}
				/>
				<Input
					value={state.description.value}
					disabled={isReadOnlyState.value}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						state.description.set(evt.target.value);
					}}
				/>
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
							showadvanced();
						}}
					>
						<IconSettings />
					</ActionIcon>
				</Tooltip>

				{state.type.value === 'object' && (
					<Tooltip aria-label="Add Child Node" label="Add Child Node" position="top">
						<ActionIcon
							disabled={isReadOnlyState.value}
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							variant="subtle"
							color="green"
							aria-label="Add Child Node"
							onClick={() => {
								const fieldName = `field_${random()}`;
								(
									state.properties as State<{
										[key: string]: JSONSchema7;
									}>
								)[fieldName].set(getDefaultSchema(DataType.string));
							}}
						>
							<IconCirclePlus />
						</ActionIcon>
					</Tooltip>
				)}
			</Flex>
			{state.type?.value === 'object' && <SchemaObject isReadOnly={isReadOnlyState.get()} schemaState={state} />}
			{state.type?.value === 'array' && <SchemaArray isReadOnly={isReadOnlyState.get()} schemaState={state} />}
			<div ref={focusRef}>
				<Modal
					opened={localState.isAdvancedOpen.get()}
					size="lg"
					onClose={onCloseAdvanced}
					title="Advanced Schema Settings"
				>
					<AdvancedSettings itemStateProp={state} />

					<Button color="blue" variant="ghost" mr={3} onClick={onCloseAdvanced}>
						Close
					</Button>
				</Modal>
			</div>
		</>
	);
};
