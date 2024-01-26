import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import { Meta, StoryObj } from '@storybook/react';
import { formatISO } from 'date-fns';
import React, { useState } from 'react';
import { Pessoa, pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { useArchbaseDataSource } from '../../hooks';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseDatePickerRange } from '../ArchbaseDatePickerRange';

const ArchbaseDatePickerRangeExample = () => {
	const [selectedRange, setSelectedRange] = useState<DateValue[]>();
	const forceUpdate = useArchbaseForceUpdate();
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({
		initialData: data,
		name: 'dsPessoas',
	});
	if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
		dataSource.edit();
	}
	useArchbaseDataSourceListener<Pessoa, string>({
		dataSource,
		listener: (event: DataSourceEvent<Pessoa>): void => {
			switch (event.type) {
				case DataSourceEventNames.fieldChanged: {
					forceUpdate();
					break;
				}
				default:
			}
		},
	});

	return (
		<Grid>
			<Grid.Col span={12}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Date Picker Range Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 500 }}>
						<ArchbaseDatePickerRange onSelectDateRange={setSelectedRange} label="Informe o período" />
						<Text size="1rem">
							{selectedRange && formatISO(selectedRange[0]!) + ' -> ' + formatISO(selectedRange[1]!)}
						</Text>
					</Box>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbaseDatePickerRange> = {
	title: 'Editores/DatePicker Range',
	component: ArchbaseDatePickerRange,
};

export default meta;
type Story = StoryObj<typeof ArchbaseDatePickerRange>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseDatePickerRangeExample />,
};
