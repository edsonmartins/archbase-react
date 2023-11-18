import { State, useHookstate } from '@hookstate/core';
import { ActionIcon, Button, FlexProps, Popover, Stack } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import * as React from 'react';
import { JSONSchema7, JSONSchema7Definition } from '../../JsonSchemaEditor.types';
import { DataType, getDefaultSchema } from '../utils';
import { random } from '../utils';

export interface DropPlusProps extends FlexProps {
	itemStateProp: State<JSONSchema7>;
	parentStateProp: State<JSONSchema7>;
	isDisabled: boolean;
}
export const DropPlus: React.FunctionComponent<DropPlusProps> = (props: React.PropsWithChildren<DropPlusProps>) => {
	const itemState = useHookstate(props.itemStateProp);
	const parentState = useHookstate(props.parentStateProp);
	const parentStateOrNull: State<JSONSchema7> | undefined = parentState.ornull;
	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = parentStateOrNull.properties.ornull;

	const itemPropertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = itemState.properties.ornull;

	if (props.isDisabled) {
		return <div />;
	}

	if (!parentStateOrNull) {
		return <></>;
	}

	return (
		<Popover position="bottom" withArrow shadow="md" withinPortal={true}>
			<Popover.Target>
				<ActionIcon size="sm" mt={2} mb={2} mr={2} variant="subtle" color="green" aria-label="Add Child Node">
					<IconCirclePlus />
				</ActionIcon>
			</Popover.Target>

			<Popover.Dropdown w="100px" color="white">
				<Stack>
					<Button
						color="blue"
						variant="outline"
						size="xs"
						onClick={() => {
							const fieldName = `field_${random()}`;
							propertiesOrNull?.nested(fieldName).set(getDefaultSchema(DataType.string) as JSONSchema7);
						}}
					>
						Sibling Node
					</Button>
					<Button
						size="xs"
						color="orange"
						variant="outline"
						onClick={() => {
							if (itemState.properties) {
								const fieldName = `field_${random()}`;
								itemPropertiesOrNull?.nested(fieldName).set(getDefaultSchema(DataType.string) as JSONSchema7);
							}
						}}
					>
						Child Node
					</Button>
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
};
