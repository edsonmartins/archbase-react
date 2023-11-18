import { State, useHookstate } from '@hookstate/core';
import { Button, Modal } from '@mantine/core';
import React, { useRef } from 'react';
import { JSONSchema7, JSONSchema7Definition } from '../../JsonSchemaEditor.types';
import { AdvancedSettings } from '../schema-advanced';
import { SchemaItem } from '../schema-item';

export interface SchemaObjectProps {
	schemaState: State<JSONSchema7>;
	isReadOnly: State<boolean>;
}

export const SchemaObject: React.FunctionComponent<SchemaObjectProps> = (
	props: React.PropsWithChildren<SchemaObjectProps>,
) => {
	const { schemaState, isReadOnly } = props;
	const schema = useHookstate(schemaState);
	const properties = useHookstate(schema.properties);

	const propertiesOrNull:
		| State<{
				[key: string]: JSONSchema7Definition;
		  }>
		| undefined = properties.ornull;

	const isReadOnlyState = useHookstate(isReadOnly);

	const onCloseAdvanced = (): void => {
		localState.isAdvancedOpen.set(false);
	};

	const showadvanced = (item: string): void => {
		localState.isAdvancedOpen.set(true);
		localState.item.set(item);
	};

	const focusRef = useRef(null);

	const localState = useHookstate({
		isAdvancedOpen: false,
		item: '',
	});

	if (!propertiesOrNull) {
		return <></>;
	} else {
		return (
			<div className="object-style">
				{propertiesOrNull?.keys?.map((name) => {
					return (
						<SchemaItem
							key={String(name)}
							itemStateProp={propertiesOrNull.nested(name as string) as State<JSONSchema7>}
							parentStateProp={schema}
							name={name as string}
							showadvanced={showadvanced}
							required={schema.required.value as string[]}
							isReadOnly={isReadOnlyState}
						/>
					);
				})}
				<div ref={focusRef}>
					<Modal
						opened={localState.isAdvancedOpen.get()}
						size="lg"
						onClose={onCloseAdvanced}
						title="Advanced Schema Settings"
					>
						<AdvancedSettings
							itemStateProp={propertiesOrNull.nested(localState.item.value as string) as State<JSONSchema7>}
						/>

						<Button color="blue" variant="ghost" mr={3} onClick={onCloseAdvanced}>
							Close
						</Button>
					</Modal>
				</div>
			</div>
		);
	}
};
