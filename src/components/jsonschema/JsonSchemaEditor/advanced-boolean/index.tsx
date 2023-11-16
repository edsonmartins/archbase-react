import * as React from "react";
import {Flex, Stack, Select} from '@mantine/core'

import { AdvancedItemStateProps } from "../../JsonSchemaEditor.types";
import { useHookstate } from "@hookstate/core";

export const AdvancedBoolean: React.FunctionComponent<AdvancedItemStateProps> = (
	props: React.PropsWithChildren<AdvancedItemStateProps>
) => {
	const { itemStateProp } = props;

	const item = useHookstate(itemStateProp);

	return (
		<Flex direction="column" wrap="nowrap">
			<Stack
				align="center"
				justify="center"
				m={1}
			>
				<Select
					label='Default:{" "}'
					variant="outline"
					value={(item.default.value as string) ?? ""}
					size="sm"
					m={2}
					placeholder="Choose data type"
					onChange={(value: string) => {
						item.default.set(value);
					}}
					data={[{value: "true", label: "true"}, {value: "false", label: "false"}]}
				/>
			</Stack>
		</Flex>
	);
};
