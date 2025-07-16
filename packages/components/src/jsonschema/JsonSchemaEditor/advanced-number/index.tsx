import { Checkbox, Flex, Input, NumberInput, Stack, Text, Textarea } from '@mantine/core';
import { useArchbaseTranslation } from '@archbase/core';
import React, { useContext, useState } from 'react';
import { AdvancedItemStateProps } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';
import { isValidEnum } from '../utils';

export const AdvancedNumber = ({
	path,
	item,
}: AdvancedItemStateProps) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);
	const { t } = useArchbaseTranslation();
	const [error, setError] = useState<string | undefined>();

	const changeEnumOtherValue = (value: string): string[] | null => {
		const array = value.split('\n');
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			return null;
		}

		return array;
	};

	const isEnumChecked = item.enum !== undefined;
	const enumData = item.enum ? (item.enum as string[]) : [];
	const enumValue = enumData?.join('\n');

	return (
		<Flex direction="column" w="100%" wrap="nowrap">
			<Stack align="stretch" justify="center" m={1}>
				<NumberInput
					label={`${t('archbase:Default value')}`}
					size="sm"
					defaultValue={item.default !== undefined ? Number(item.default) : ''}
					value={item.default !== undefined ? Number(item.default) : ''}
					placeholder={`${t('archbase:Default value')}`}
					onChange={(value: number | string) => {
						if (value !== '') {
							handleChange(`${path}.default`, Number(value), 'ASSIGN_VALUE');
						} else {
							handleChange(`${path}.default`, null, 'REMOVE');
						}
					}}
				/>
			</Stack>

			<Stack align="stretch" justify="center" m={1}>
				<Flex justify="space-between">
					<NumberInput
						label={`${t('archbase:Min Value')}`}
						size="sm"
						defaultValue={item.minimum !== undefined ? Number(item.minimum) : ''}
						value={item.minimum !== undefined ? Number(item.minimum) : ''}
						onChange={(value: number | string) => {
							if (value !== '') {
								handleChange(`${path}.minimum`, Number(value), 'ASSIGN_VALUE');
							} else {
								handleChange(`${path}.minimum`, null, 'REMOVE');
							}
						}}
					/>
					<NumberInput
						label={`${t('archbase:Max Value')}`}
						size="sm"
						defaultValue={item.maximum !== undefined ? Number(item.maximum) : ''}
						value={item.maximum !== undefined ? Number(item.maximum) : ''}
						onChange={(value: number | string) => {
							if (value !== '') {
								handleChange(`${path}.maximum`, Number(value), 'ASSIGN_VALUE');
							} else {
								handleChange(`${path}.maximum`, null, 'REMOVE');
							}
						}}
					/>
				</Flex>
			</Stack>
			<Stack align="stretch" justify="center" mt={8}>
				<Flex align="center" justify="space-between">
					<Text>{`${t('archbase:Enum')}`}</Text>
					<Checkbox
						mx={16}
						checked={isEnumChecked}
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
							if (!evt.target.checked) {
								handleChange(`${path}.enum`, null, 'REMOVE');
							} else {
								handleChange(`${path}.enum`, [''], 'ASSIGN_VALUE');
							}
						}}
					/>
					<Input.Wrapper w="100%" error={error}>
						<Textarea
							value={enumValue}
							disabled={!isEnumChecked}
							placeholder={`${t('archbase:ENUM Values - One Entry Per Line')}`}
							datatype="number"
							onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
								const re = /^[0-9\n]+$/;
								if (evt.target.value === '' || re.test(evt.target.value)) {
									const update = changeEnumOtherValue(evt.target.value);
									if (isValidEnum(update)) {
										if (update === null) {
											handleChange(`${path}.enum`, null, 'REMOVE');
										} else {
											handleChange(`${path}.enum`, update as string[], 'ASSIGN_VALUE');
										}
									} else {
										setError(`${t('archbase:Enum must not have duplicate values')}`);
									}
								}
							}}
						/>
					</Input.Wrapper>
				</Flex>
			</Stack>
		</Flex>
	);
};
