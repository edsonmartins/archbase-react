import { Checkbox, Flex, NumberInput, Select, Stack, Text, Textarea, TextInput } from '@mantine/core';
import React, { useContext } from 'react';
import { AdvancedItemStateProps } from '../../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditorContext } from '../ArchbaseJsonSchemaEditor.context';
import { StringFormat } from '../utils';

export const AdvancedString: React.FunctionComponent<AdvancedItemStateProps> = ({
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
				<TextInput
					id="default"
					label="Default: "
					placeholder="Default value"
					value={(item.default as string) ?? ''}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.default`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
			</Stack>

			<Stack align="stretch" justify="center" m={1}>
				<Flex justify="space-between">
					<NumberInput
						label="Min Length: "
						size="sm"
						defaultValue={item.minLength !== undefined ? Number(item.minLength) : ''}
						value={item.minLength !== undefined ? Number(item.minLength) : ''}
						onChange={(value: number | string) => {
							if (value !== '') {
								handleChange(`${path}.minLength`, Number(value), 'ASSIGN_VALUE');
							} else {
								handleChange(`${path}.minLength`, null, 'REMOVE');
							}
						}}
					/>
					<NumberInput
						label="Max Length: "
						size="sm"
						defaultValue={item.maxLength !== undefined ? Number(item.maxLength) : ''}
						value={item.maxLength !== undefined ? Number(item.maxLength) : ''}
						onChange={(value: number | string) => {
							if (value !== '') {
								handleChange(`${path}.maxLength`, Number(value), 'ASSIGN_VALUE');
							} else {
								handleChange(`${path}.maxLength`, null, 'REMOVE');
							}
						}}
					/>
				</Flex>
			</Stack>
			<Stack align="stretch" justify="center" m={1}>
				<TextInput
					id="pattern"
					label="Pattern:"
					placeholder="MUST be a valid regular expression."
					value={item.pattern ?? ''}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.pattern`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
			</Stack>

			<Stack align="stretch" justify="center" mt={8}>
				<Flex align="center" justify="space-between">
					<Text>Enum: </Text>
					<Checkbox
						checked={isEnumChecked}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							if (!event.target.checked) {
								handleChange(`${path}.enum`, null, 'REMOVE');
							} else {
								handleChange(`${path}.enum`, [''], 'ASSIGN_VALUE');
							}
						}}
					/>
					<Textarea
						w="85%"
						value={enumValue || ''}
						disabled={!isEnumChecked}
						placeholder="ENUM Values - One Entry Per Line"
						onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
							const update = changeEnumOtherValue(event.target.value);
							if (update === null) {
								handleChange(`${path}.enum`, null, 'REMOVE');
							} else {
								handleChange(`${path}.enum`, update as string[], 'ASSIGN_VALUE');
							}
						}}
					/>
				</Flex>
			</Stack>
			<Stack align="stretch" justify="center" m={1}>
				<Select
					label="Format: "
					value={item.format ?? ''}
					size="sm"
					m={2}
					withinPortal
					placeholder="Choose data type"
					onChange={(value: string) => {
						if (value === '') {
							handleChange(`${path}.format`, null, 'REMOVE');
						} else {
							handleChange(`${path}.format`, value, 'ASSIGN_VALUE');
						}
					}}
					data={StringFormat.map((item) => ({ label: item.name, value: item.name }))}
				/>
			</Stack>
		</Flex>
	);
};
