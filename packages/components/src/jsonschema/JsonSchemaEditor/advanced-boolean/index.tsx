import { Flex, Select, Stack } from '@mantine/core';
import { useArchbaseTranslation } from '@archbase/core';
import React, { useContext } from 'react';
import { AdvancedItemStateProps } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';

export const AdvancedBoolean = ({
	path,
	item,
}: AdvancedItemStateProps) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	const { t } = useArchbaseTranslation();
	return (
		<Flex direction="column" w="100%" wrap="nowrap">
			<Stack align="stretch" justify="center" m={1}>
				<Select
					label={`${t('archbase:Default value')}`}
					value={(item.default as string) ?? ''}
					size="sm"
					m={2}
					placeholder={`${t('archbase:Choose data type')}`}
					onChange={(value: string) => {
						handleChange(`${path}.default`, value, 'ASSIGN_VALUE');
					}}
					data={[
						{ value: 'true', label: `${t('archbase:true')}` },
						{ value: 'false', label: `${t('archbase:false')}` },
					]}
				/>
			</Stack>
		</Flex>
	);
};
