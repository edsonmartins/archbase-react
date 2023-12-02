import { Checkbox, Flex, NumberInput, Stack, Text, Textarea } from '@mantine/core';
import React, { useContext } from 'react';
import { AdvancedItemStateProps } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';

export const AdvancedNumber: React.FunctionComponent<AdvancedItemStateProps> = ({
	path,
	item,
}: React.PropsWithChildren<AdvancedItemStateProps>) => {
	const { handleChange } = useContext(ArchbaseJsonSchemaEditorContext);

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
					label="Default: "
					size="sm"
					defaultValue={item.default !== undefined ? Number(item.default) : ''}
					value={item.default !== undefined ? Number(item.default) : ''}
					placeholder="Default value"
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
						label="Min Value: "
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
						label="Max Value: "
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
					<Text>Enum: </Text>
					<Checkbox
						checked={isEnumChecked}
						onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
							if (!evt.target.checked) {
								handleChange(`${path}.enum`, null, 'REMOVE');
							} else {
								handleChange(`${path}.enum`, [''], 'ASSIGN_VALUE');
							}
						}}
					/>
					<Textarea
						w="85%"
						value={enumValue}
						disabled={!isEnumChecked}
						placeholder="ENUM Values - One Entry Per Line"
						datatype="number"
						onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
							const re = /^[0-9\n]+$/;
							if (evt.target.value === '' || re.test(evt.target.value)) {
								const update = changeEnumOtherValue(evt.target.value);
								if (update === null) {
									handleChange(`${path}.enum`, null, 'REMOVE');
								} else {
									handleChange(`${path}.enum`, update as string[], 'ASSIGN_VALUE');
								}
							}
						}}
					/>
				</Flex>
			</Stack>
		</Flex>
	);
};
