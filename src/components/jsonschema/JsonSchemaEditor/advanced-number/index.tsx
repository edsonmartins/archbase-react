import * as React from "react";
import {Flex, Stack, NumberInput, Checkbox, Textarea} from '@mantine/core'

import {
	AdvancedItemStateProps,
	JSONSchema7,
} from "../../JsonSchemaEditor.types";
import { none, useHookstate } from "@hookstate/core";

export const AdvancedNumber: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>
) => {
	const { itemStateProp } = props;

	const changeEnumOtherValue = (value: string): string[] | null => {
		const array = value.split("\n");
		if (array.length === 0 || (array.length === 1 && !array[0])) {
			return null;
		}

		return array;
	};

	const itemState = useHookstate(itemStateProp);

	const isEnumChecked = (itemState.value as JSONSchema7).enum !== undefined;
	const enumData = (itemState.value as JSONSchema7).enum
		? (itemState.enum.value as string[])
		: [];
	const enumValue = enumData?.join("\n");

	return (
		<Flex direction="column" wrap="nowrap">
			<Stack
				align="center"
				justify="center"
				m={1}
			>
				<NumberInput
					label="Default: "
					size="sm"
					defaultValue={Number(itemState.default.value)}
					value={Number(itemState.default.value)}
					placeholder="Default value"
					onChange={(value: number | string) => {
						itemState.default.set(Number(value));
					}}
				/>
			</Stack>

			<Stack
				align="center"
				justify="center"
				m={1}
			>
				<NumberInput
					label="Min Value: "
					size="sm"
					defaultValue={Number(itemState.minimum.value)}
					value={Number(itemState.minimum.value)}
					onChange={(value: number | string) => {
						itemState.minimum.set(Number(value));
					}}
				/>
				<NumberInput
					label="Max Value: "
					size="sm"
					defaultValue={Number(itemState.maximum.value)}
					value={Number(itemState.maximum.value)}
					onChange={(value: number | string) => {
						itemState.maximum.set(Number(value));
					}}
				/>
			</Stack>
			<Stack
				align="center"
				justify="center"
				m={1}
			>
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
					value={enumValue}
					disabled={!isEnumChecked}
					placeholder="ENUM Values - One Entry Per Line"
					datatype="number"
					onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => {
						const re = /^[0-9\n]+$/;
						if (evt.target.value === "" || re.test(evt.target.value)) {
							const update = changeEnumOtherValue(evt.target.value);
							if (update === null) {
								itemState.enum.set(none);
							} else {
								itemState.enum.set(update as string[]);
							}
						}
					}}
				/>
			</Stack>
		</Flex>
	);
};
