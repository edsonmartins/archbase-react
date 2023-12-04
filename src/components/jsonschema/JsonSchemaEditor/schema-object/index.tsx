import { Button, Flex, Modal } from '@mantine/core';
import i18next from 'i18next';
import React, { useRef, useState } from 'react';
import { JSONSchema7 } from '../ArchbaseJsonSchemaEditor';
import { AdvancedSettings } from '../schema-advanced';
import { SchemaItem } from '../schema-item';

export interface SchemaObjectProps {
	path: string;
	jsonSchema: JSONSchema7;
	isReadOnly: boolean;
}

export const SchemaObject: React.FunctionComponent<SchemaObjectProps> = ({
	path,
	jsonSchema,
	isReadOnly,
}: React.PropsWithChildren<SchemaObjectProps>) => {
	const [open, setOpen] = useState(false);
	const [item, setItem] = useState('');

	const onCloseAdvanced = (): void => {
		setOpen(false);
	};

	const showadvanced = (item: string): void => {
		setOpen(true);
		setItem(item);
	};
	const focusRef = useRef(null);
	if (!jsonSchema.properties) {
		return <></>;
	} else {
		return (
			<div className="object-style">
				{Object.keys(jsonSchema.properties).map((name) => {
					return (
						<SchemaItem
							key={String(name)}
							parentPath={path}
							itemPath={`${path}.properties.${name}`}
							name={name as string}
							showadvanced={showadvanced}
							jsonSchema={jsonSchema}
							isReadOnly={isReadOnly}
						/>
					);
				})}
				<div ref={focusRef}>
					<Modal
						opened={open}
						size="lg"
						onClose={onCloseAdvanced}
						title={`${i18next.t('archbase:Advanced Schema Settings')}`}
					>
						<AdvancedSettings path={`${path}.properties.${item}`} item={jsonSchema.properties[item] as JSONSchema7} />
						<Flex justify="flex-end">
							<Button mr={3} onClick={onCloseAdvanced}>
								{`${i18next.t('archbase:Close')}`}
							</Button>
						</Flex>
					</Modal>
				</div>
			</div>
		);
	}
};
