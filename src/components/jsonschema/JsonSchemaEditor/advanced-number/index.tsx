import { Checkbox, Flex, NumberInput, Stack, Textarea } from '@mantine/core';
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
		<Flex direction="column" wrap="nowrap">
			<Stack align="center" justify="center" m={1}>
				<NumberInput
					label="Default: "
					size="sm"
					defaultValue={Number(item.default)}
					value={Number(item.default)}
					placeholder="Default value"
					onChange={(value: number | string) => {
						handleChange(`${path}.default`, Number(value), 'ASSIGN_VALUE');
					}}
				/>
			</Stack>

			<Stack align="center" justify="center" m={1}>
				<NumberInput
					label="Min Value: "
					size="sm"
					defaultValue={Number(item.minimum)}
					value={Number(item.minimum)}
					onChange={(value: number | string) => {
						handleChange(`${path}.minimum`, Number(value), 'ASSIGN_VALUE');
					}}
				/>
				<NumberInput
					label="Max Value: "
					size="sm"
					defaultValue={Number(item.maximum)}
					value={Number(item.maximum)}
					onChange={(value: number | string) => {
						handleChange(`${path}.maximum`, Number(value), 'ASSIGN_VALUE');
					}}
				/>
			</Stack>
			<Stack align="center" justify="center" m={1}>
				<Checkbox
					label="Enum: "
					checked={isEnumChecked}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
						if (!evt.target.checked) {
							handleChange(`${path}.enum`, null, 'REMOVE');
						} else {
							handleChange(`${path}.enum`, Array<string>(), 'ASSIGN_VALUE');
						}
					}}
				/>
				<Textarea
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
			</Stack>
		</Flex>
	);
};
