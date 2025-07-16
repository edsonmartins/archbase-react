import { getPathDepthLevel } from '@archbase/core';
import { ActionIcon, Button, Checkbox, Flex, FlexProps, Input, Modal, Select, Tooltip } from '@mantine/core';
import { IconCirclePlus, IconSettings } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
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
const itemTypes = SchemaTypes.map((item) => ({ value: item, label: item }));
export const SchemaArray = ({
	path,
	jsonSchema,
	isReadOnly,
}: SchemaArrayProps) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	const { t } = useArchbaseTranslation();
	const [open, setOpen] = useState(false);

	const items = jsonSchema.items as JSONSchema7;
	const length = getPathDepthLevel(path) - (path.match(/(properties)/g) ? path.match(/(properties)/g).length : 0);

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
			<Flex
				direction="row"
				align="center"
				wrap="nowrap"
				className="array-item"
				mt={2}
				mr={5}
				style={tagPaddingLeftStyle}
			>
				<Input
					key="Items"
					style={{ flexShrink: 1 }}
					disabled
					value={`${t('archbase:Items')}`}
					size="sm"
					m={2}
					variant="outline"
				/>
				<Checkbox disabled m={2} color="blue" />
				<Select
					readOnly={isReadOnly}
					value={items.type as JSONSchema7TypeName}
					size="sm"
					m={2}
					placeholder={`${t('archbase:Choose data type')}`}
					onChange={(value: string) => {
						const newSchema = handleTypeChange(value as JSONSchema7TypeName, false);
						handleChange(`${path}.items`, newSchema, 'ASSIGN_VALUE');
					}}
					data={itemTypes}
				/>
				<Input
					value={items.title}
					readOnly={isReadOnly}
					size="sm"
					m={2}
					placeholder={`${t('archbase:Add Title')}`}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.items.title`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
				<Input
					value={items.description}
					readOnly={isReadOnly}
					size="sm"
					m={2}
					placeholder={`${t('archbase:Add Description')}`}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.items.description`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
				<Tooltip
					aria-label={`${t('archbase:Advanced Settings')}`}
					label={`${t('archbase:Advanced Settings')}`}
					position="top"
				>
					<ActionIcon
						disabled={isReadOnly}
						size="sm"
						mt={2}
						mb={2}
						ml={1}
						color="blue"
						aria-label={`${t('archbase:Advanced Settings')}`}
						onClick={() => {
							showadvanced();
						}}
					>
						<IconSettings />
					</ActionIcon>
				</Tooltip>

				{items.type === 'object' && (
					<Tooltip
						aria-label={`${t('archbase:Add Child Node')}`}
						label={`${t('archbase:Add Child Node')}`}
						position="top"
					>
						<ActionIcon
							disabled={isReadOnly}
							size="sm"
							mt={2}
							mb={2}
							mr={2}
							color="green"
							aria-label={`${t('archbase:Add Child Node')}`}
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
				<Modal
					opened={open}
					size="lg"
					onClose={onCloseAdvanced}
					title={`${t('archbase:Advanced Schema Settings')}`}
				>
					<AdvancedSettings path={`${path}.items`} item={items} />
					<Flex justify="flex-end">
						<Button mr={3} onClick={onCloseAdvanced}>
							{`${t('archbase:Close')}`}
						</Button>
					</Flex>
				</Modal>
			</div>
		</>
	);
};
