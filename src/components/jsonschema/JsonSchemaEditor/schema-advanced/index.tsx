import { State, useHookstate } from '@hookstate/core';
import { Flex } from '@mantine/core';
import * as React from 'react';
import { JSONSchema7 } from '../../JsonSchemaEditor.types';
import { AdvancedBoolean } from '../advanced-boolean';
import { AdvancedNumber } from '../advanced-number';
import { AdvancedString } from '../advanced-string';

export interface AdvancedSettingsProps {
	itemStateProp: State<JSONSchema7>;
}

export const AdvancedSettings: React.FunctionComponent<AdvancedSettingsProps> = (
	props: React.PropsWithChildren<AdvancedSettingsProps>,
) => {
	const itemState = useHookstate(props.itemStateProp);

	const getAdvancedView = (item: State<JSONSchema7>): JSX.Element | undefined => {
		switch (itemState.type.value) {
			case 'string':
				return <AdvancedString itemStateProp={item} />;
			case 'number':
			case 'integer':
				return <AdvancedNumber itemStateProp={item} />;
			case 'boolean':
				return <AdvancedBoolean itemStateProp={item} />;
			default:
				return undefined;
		}
	};

	return <Flex>{getAdvancedView(itemState)}</Flex>;
};
