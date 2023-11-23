import { Checkbox, Flex, Input, NumberInput, Select, Stack, Text, Textarea } from '@mantine/core';
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
		<Flex direction="column" wrap="nowrap">
			<Stack align="center" justify="center" m={1}>
				<Text>Default:</Text>
				<Input
					id="default"
					placeholder="Default value"
					value={(item.default as string) ?? ''}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.default`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
			</Stack>

			<Stack align="center" justify="center" m={1}>
				<NumberInput
					label="Min Length: "
					size="sm"
					defaultValue={Number(item.minLength)}
					value={Number(item.minLength)}
					onChange={(value: number | string) => {
						handleChange(`${path}.minLength`, Number(value), 'ASSIGN_VALUE');
					}}
				/>
				<NumberInput
					label="Max Length: "
					size="sm"
					defaultValue={Number(item.maxLength)}
					value={Number(item.maxLength)}
					onChange={(value: number | string) => {
						handleChange(`${path}.maxLength`, Number(value), 'ASSIGN_VALUE');
					}}
				/>
			</Stack>
			<Stack align="center" justify="center" m={1}>
				<Text>Pattern: </Text>
				<Input
					id="pattern"
					placeholder="MUST be a valid regular expression."
					value={item.pattern ?? ''}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						handleChange(`${path}.pattern`, event.target.value, 'ASSIGN_VALUE');
					}}
				/>
			</Stack>

			<Stack align="center" justify="center" m={1}>
				<Checkbox
					label="Enum: "
					checked={isEnumChecked}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						if (!event.target.checked) {
							handleChange(`${path}.enum`, null, 'REMOVE');
						} else {
							handleChange(`${path}.enum`, Array<string>(), 'ASSIGN_VALUE');
						}
					}}
				/>
				<Textarea
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
			</Stack>
			<Stack align="center" justify="center" m={1}>
				<Select
					label="Format:{' '}"
					variant="outline"
					value={item.format ?? ''}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						if (value === '') {
							handleChange(`${path}.format`, null, 'REMOVE');
						} else {
							handleChange(`${path}.format`, value, 'ASSIGN_VALUE');
						}
					}}
					data={StringFormat.map((item, index) => ({ key: String(index), value: item.name }))}
				/>
			</Stack>
		</Flex>
	);
};
