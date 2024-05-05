import { Box, Card, Grid, Group, ScrollArea, Space, Text, Textarea } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { ArchbaseTimeRangeSelector, RangeOption } from '../ArchbaseTimeRangeSelector';
import { ArchbaseObjectInspector } from '../../../components/debug';
import { subDays } from 'date-fns'

const ArchbaseTimeRangeSelectorExample = () => {
	const ULTIMOS_7_DIAS = 'últimos 7 dias';
	const ULTIMOS_30_DIAS = 'últimos 30 dias';
	const ULTIMO_DIA = 'último dia';

	const [value, setValue] = useState(ULTIMOS_7_DIAS)
	const [range, setRange] = useState({ start: subDays(new Date(), 7), end: new Date() })

	const ranges = useMemo(() => [
		{  
			label: ULTIMO_DIA,
			value: ULTIMO_DIA,
			rangeFunction: (current: Date) => ({ start: subDays(current, 1), end: current })
		},
		{  
			label: ULTIMOS_7_DIAS,
			value: ULTIMOS_7_DIAS,
			rangeFunction: (current: Date) => ({ start: subDays(current, 7), end: current })
		},
		{  
			label: ULTIMOS_30_DIAS,
			value: ULTIMOS_30_DIAS,
			rangeFunction: (current: Date) => ({ start: subDays(current, 30), end: current })
		}
	],[])
	return (
		<Grid>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Time Range Selector Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 500 }}>
						<ScrollArea h={500} p={20}>
							<ArchbaseTimeRangeSelector
								defaultRangeValue={ULTIMOS_7_DIAS}
								ranges={ranges} 
								onRangeChange={(selectedValue, range) => {
									setValue(selectedValue)
									setRange(range)
									}} 
							/>
						</ScrollArea>
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify='space-between'>
							<Text fw={500}>Resultado</Text>
						</Group>
					</Card.Section>
					<ScrollArea h={300}>
						<Space h={20} />
						<Text>{value}</Text>
						<ArchbaseObjectInspector data={range} />
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseTimeRangeSelector> = {
	title: 'Editores/TimeRangeSeletor',
	component: ArchbaseTimeRangeSelector,
};

export default meta;
type Story = StoryObj<typeof ArchbaseTimeRangeSelector>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseTimeRangeSelectorExample />,
};