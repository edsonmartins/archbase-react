import { State, useHookstate } from '@hookstate/core';
import { ActionIcon, Checkbox, Flex, FlexProps, Input, Select, Tooltip } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import * as React from 'react';
import { JSONSchema7, JSONSchema7TypeName } from '../../JsonSchemaEditor.types';
import { DataType, getDefaultSchema, handleTypeChange, random } from '../utils';

export interface SchemaArrayProps extends FlexProps {
	schemaState: State<JSONSchema7>;
	onSchemaChange: (results: string) => void;
	isReadOnly: State<boolean>;
}
export const SchemaRoot: React.FunctionComponent<SchemaArrayProps> = (
	props: React.PropsWithChildren<SchemaArrayProps>,
) => {
	const state = useHookstate(props.schemaState);
	const isReadOnlyState = useHookstate(props.isReadOnly);

	return (
		<>
			{props.onSchemaChange(JSON.stringify(state.value))}
			<Flex data-testid="jsonschema-editor" direction="row" wrap="nowrap" mt={2} mr={5}>
				<Input disabled placeholder="root" m={2} variant="outline" />
				<Tooltip aria-label="All Required" label="All Required" position="top">
					<Checkbox disabled={isReadOnlyState.value} m={2} width={20} color="blue" />
				</Tooltip>

				<Select
					variant="outline"
					disabled={isReadOnlyState.value}
					value={state.type.value.toString() ?? ''}
					size="sm"
					m={2}
					placeholder="Choose root data type"
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						state.set(newSchema as JSONSchema7);
					}}
					data={[
						{ key: 'object', value: 'object' },
						{ key: 'array', value: 'array' },
					]}
				/>
				<Input
					value={state.value?.title ?? ''}
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
					value={state.value?.description ?? ''}
					disabled={isReadOnlyState.value}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						state.description.set(evt.target.value);
					}}
				/>

				{state.value?.type === 'object' && (
					<>
						<Tooltip aria-label="Add Child Node" label="Add Child Node" position="top">
							<ActionIcon
								disabled={isReadOnlyState.value}
								size="sm"
								mt={2}
								mb={2}
								mr={2}
								variant="link"
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
					</>
				)}
			</Flex>
		</>
	);
};
