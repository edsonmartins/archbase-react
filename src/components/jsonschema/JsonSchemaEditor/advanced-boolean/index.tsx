import { Flex, Select, Stack } from '@mantine/core';
import i18next from 'i18next';
import React, { useContext } from 'react';
import { AdvancedItemStateProps } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';

export const AdvancedBoolean = ({
	path,
	item,
}: AdvancedItemStateProps) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	return (
		<Flex direction="column" w="100%" wrap="nowrap">
			<Stack align="stretch" justify="center" m={1}>
				<Select
					label={`${i18next.t('archbase:Default value')}`}
					value={(item.default as string) ?? ''}
					size="sm"
					m={2}
					placeholder={`${i18next.t('archbase:Choose data type')}`}
					onChange={(value: string) => {
						handleChange(`${path}.default`, value, 'ASSIGN_VALUE');
					}}
					data={[
						{ value: 'true', label: `${i18next.t('archbase:true')}` },
						{ value: 'false', label: `${i18next.t('archbase:false')}` },
					]}
				/>
			</Stack>
		</Flex>
	);
};
