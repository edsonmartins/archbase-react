import { ActionIcon, Button, Checkbox, Flex, FlexProps, Input, Modal, Select, Tooltip } from '@mantine/core';
import { IconCirclePlus, IconSettings } from '@tabler/icons-react';
import React, { useContext, useRef, useState } from 'react';
import { JSONSchema7, JSONSchema7TypeName } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';
import { AdvancedSettings } from '../schema-advanced';
import { SchemaObject } from '../schema-object';
import { DataType, getDefaultSchema, handleTypeChange, random, SchemaTypes } from '../utils';

export interface SchemaArrayProps extends FlexProps {
	path: string;
	jsonSchema: JSONSchema7;
	isReadOnly: boolean;
}
export const SchemaArray: React.FunctionComponent<SchemaArrayProps> = ({
	path,
	jsonSchema,
	isReadOnly,
}: React.PropsWithChildren<SchemaArrayProps>) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	const [open, setOpen] = useState(false);

	const items = jsonSchema.items as JSONSchema7;
	const length = path.split('.').length;
	const tagPaddingLeftStyle = {
		paddingLeft: `${20 * (length + 1)}px`,
	};

	const onCloseAdvanced = (): void => {
		setOpen(false);
	};

	const showadvanced = (): void => {
		setOpen(true);
	};

	const focusRef = useRef(null);

	return (
		<>
			<Flex direction="row" wrap="nowrap" className="array-item" mt={2} mr={5} style={tagPaddingLeftStyle}>
				<Input key="Items" style={{ flexShrink: 1 }} disabled value="Items" size="sm" m={2} variant="outline" />
				<Checkbox disabled m={2} color="blue" />
				<Select
					variant="outline"
					disabled={isReadOnly}
					value={items.type as JSONSchema7TypeName}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						handleChange(`${path}.items`, newSchema, 'ASSIGN_VALUE');
					}}
					data={SchemaTypes.map((item, index) => ({ key: String(index), value: item }))}
				/>
				<Input
					value={items.title}
					disabled={isReadOnly}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Title"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.items.title`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
				<Input
					value={items.description}
					disabled={isReadOnly}
					size="sm"
					m={2}
					variant="outline"
					placeholder="Add Description"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.items.description`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
				<Tooltip aria-label="Advanced Settings" label="Advanced Settings" position="top">
					<ActionIcon
						disabled={isReadOnly}
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

				{items.type === 'object' && (
					<Tooltip aria-label="Add Child Node" label="Add Child Node" position="top">
						<ActionIcon
							disabled={isReadOnly}
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							variant="subtle"
							color="green"
							aria-label="Add Child Node"
							onClick={() => {
								const fieldName = `field_${random()}`;
								handleChange(
									`${path}.items.properties.${fieldName}`,
									getDefaultSchema(DataType.string),
									'ASSIGN_VALUE',
								);
							}}
						>
							<IconCirclePlus />
						</ActionIcon>
					</Tooltip>
				)}
			</Flex>
			{items.type === 'object' && <SchemaObject path={`${path}.items`} jsonSchema={items} isReadOnly={isReadOnly} />}
			{items.type === 'array' && <SchemaArray path={`${path}.items`} jsonSchema={items} isReadOnly={isReadOnly} />}
			<div ref={focusRef}>
				<Modal opened={open} size="lg" onClose={onCloseAdvanced} title="Advanced Schema Settings">
					<AdvancedSettings path={`${path}.items`} item={items} />

					<Button color="blue" variant="ghost" mr={3} onClick={onCloseAdvanced}>
						Close
					</Button>
				</Modal>
			</div>
		</>
	);
};
