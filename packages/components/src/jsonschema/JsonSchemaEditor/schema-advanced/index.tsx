import { Flex } from '@mantine/core';
import * as React from 'react';
import { JSONSchema7 } from '../../ArchbaseJsonSchemaEditor.types';
import { AdvancedBoolean } from '../advanced-boolean';
import { AdvancedNumber } from '../advanced-number';
import { AdvancedString } from '../advanced-string';

export interface AdvancedSettingsProps {
	path: string;
	item: JSONSchema7;
}

export const AdvancedSettings = ({
	path,
	item,
}: AdvancedSettingsProps) => {
	const getAdvancedView = (path: string): React.JSX.Element | undefined => {
		switch (item.type) {
			case 'string':
				return <AdvancedString path={path} item={item} />;
			case 'number':
			case 'integer':
				return <AdvancedNumber path={path} item={item} />;
			case 'boolean':
				return <AdvancedBoolean path={path} item={item} />;
			default:
				return undefined;
		}
	};

	return <Flex>{getAdvancedView(path)}</Flex>;
};
