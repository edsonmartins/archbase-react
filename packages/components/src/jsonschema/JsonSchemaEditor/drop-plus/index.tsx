import { ActionIcon, Button, FlexProps, Popover, Stack } from '@mantine/core';
import { IconCirclePlus } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import React, { useContext } from 'react';
import { JSONSchema7 } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';
import { DataType, getDefaultSchema } from '../utils';
import { random } from '../utils';

export interface DropPlusProps extends FlexProps {
	itemPath: string;
	parentPath: string;
	parent: JSONSchema7;
	item: JSONSchema7;
	isReadOnly: boolean;
}
export const DropPlus = ({
	itemPath,
	parentPath,
	parent,
	item,
	isReadOnly,
}:DropPlusProps) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	const { t } = useArchbaseTranslation();
	if (isReadOnly) {
		return <div />;
	}

	if (!parent) {
		return <></>;
	}

	return (
		<Popover position="bottom" withArrow shadow="md" withinPortal={true}>
			<Popover.Target>
				<ActionIcon
					size="sm"
					mt={2}
					mb={2}
					mr={2}
					variant="subtle"
					color="green"
					aria-label={`${t('archbase:Add Child Node')}`}
				>
					<IconCirclePlus />
				</ActionIcon>
			</Popover.Target>

			<Popover.Dropdown w="120px" color="white">
				<Stack>
					<Button
						color="blue"
						variant="outline"
						size="xs"
						onClick={() => {
							const fieldName = `field_${random()}`;
							handleChange(`${parentPath}.properties.${fieldName}`, getDefaultSchema(DataType.string), 'ASSIGN_VALUE');
						}}
					>
						{`${t('archbase:Sibling Node')}`}
					</Button>
					<Button
						size="xs"
						color="orange"
						variant="outline"
						onClick={() => {
							if (item.properties) {
								const fieldName = `field_${random()}`;
								handleChange(`${itemPath}.properties.${fieldName}`, getDefaultSchema(DataType.string), 'ASSIGN_VALUE');
							}
						}}
					>
						{`${t('archbase:Child Node')}`}
					</Button>
				</Stack>
			</Popover.Dropdown>
		</Popover>
	);
};
