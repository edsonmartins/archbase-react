import { Flex, Select, Stack } from '@mantine/core';
import React, { useContext } from 'react';
import { AdvancedItemStateProps } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';

export const AdvancedBoolean: React.FunctionComponent<AdvancedItemStateProps> = ({
	path,
	item,
}: React.PropsWithChildren<AdvancedItemStateProps>) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	return (
		<Flex direction="column" wrap="nowrap">
			<Stack align="center" justify="center" m={1}>
				<Select
					label='Default:{" "}'
					variant="outline"
					value={(item.default as string) ?? ''}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						handleChange(`${path}.default`, value, 'ASSIGN_VALUE');
					}}
					data={[
						{ value: 'true', label: 'true' },
						{ value: 'false', label: 'false' },
					]}
				/>
			</Stack>
		</Flex>
	);
};
