import { useHookstate } from '@hookstate/core';
import { Flex, Select, Stack } from '@mantine/core';
import * as React from 'react';
import { AdvancedItemStateProps } from '../../JsonSchemaEditor.types';

export const AdvancedBoolean: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>,
) => {
	const { itemStateProp } = props;

	const item = useHookstate(itemStateProp);

	return (
		<Flex direction="column" wrap="nowrap">
			<Stack align="center" justify="center" m={1}>
				<Select
					label='Default:{" "}'
					variant="outline"
					value={(item.default.value as string) ?? ''}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						item.default.set(value);
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
