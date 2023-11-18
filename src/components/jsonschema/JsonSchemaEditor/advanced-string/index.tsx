import { none, useHookstate } from '@hookstate/core';
import { Checkbox, Flex, Input, NumberInput, Select, Stack, Text, Textarea } from '@mantine/core';
import * as React from 'react';
import { AdvancedItemStateProps, JSONSchema7 } from '../../JsonSchemaEditor.types';
import { StringFormat } from '../utils';

export const AdvancedString: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>,
) => {
	const { itemStateProp } = props;

	const changeEnumOtherValue = (value: string): string[] | null => {
		const array = value.split('\n');
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			return null;
		}

		return array;
	};

	const itemState = useHookstate(itemStateProp);

	const isEnumChecked = (itemState.value as JSONSchema7).enum !== undefined;
	const enumData = (itemState.value as JSONSchema7).enum ? (itemState.enum.value as string[]) : [];
	const enumValue = enumData?.join('\n');

	return (
		<Flex direction="column" wrap="nowrap">
			<Stack align="center" justify="center" m={1}>
				<Text>Default:</Text>
				<Input
					id="default"
					placeholder="Default value"
					value={(itemState.default.value as string) ?? ''}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.default.set(evt.target.value);
					}}
				/>
			</Stack>

			<Stack align="center" justify="center" m={1}>
				<NumberInput
					label="Min Length: "
					size="sm"
					defaultValue={Number(itemState.minLength.value)}
					value={Number(itemState.minLength.value)}
					onChange={(value: number | string) => {
						itemState.minLength.set(Number(value));
					}}
				/>
				<NumberInput
					label="Max Length: "
					size="sm"
					defaultValue={Number(itemState.maxLength.value)}
					value={Number(itemState.maxLength.value)}
					onChange={(value: number | string) => {
						itemState.maxLength.set(Number(value));
					}}
				/>
			</Stack>
			<Stack align="center" justify="center" m={1}>
				<Text>Pattern: </Text>
				<Input
					id="pattern"
					placeholder="MUST be a valid regular expression."
					value={itemState.pattern.value ?? ''}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						itemState.pattern.set(evt.target.value);
					}}
				/>
			</Stack>

			<Stack align="center" justify="center" m={1}>
				<Checkbox
					label="Enum: "
					checked={isEnumChecked}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						if (!evt.target.checked) {
							itemState.enum.set(none);
						} else {
							itemState.enum.set(Array<string>());
						}
					}}
				/>
				<Textarea
					value={enumValue || ''}
					disabled={!isEnumChecked}
					placeholder="ENUM Values - One Entry Per Line"
					onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
						const update = changeEnumOtherValue(evt.target.value);
						if (update === null) {
							itemState.enum.set(none);
						} else {
							itemState.enum.set(update as string[]);
						}
					}}
				/>
			</Stack>
			<Stack align="center" justify="center" m={1}>
				<Select
					label="Format:{' '}"
					variant="outline"
					value={itemState.format.value ?? ''}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						if (value === '') {
							itemState.format.set(none);
						} else {
							itemState.format.set(value);
						}
					}}
					data={StringFormat.map((item, index) => ({ key: String(index), value: item.name }))}
				/>
			</Stack>
		</Flex>
	);
};
