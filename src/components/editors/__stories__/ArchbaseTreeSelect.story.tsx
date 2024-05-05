import { Box, Card, Grid, Group, ScrollArea, Space, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import { treeData } from '../../../demo/data/treeData';
import React, { useState } from 'react';
import { ArchbaseObjectInspector } from '../../debug';
import { ArchbaseTreeSelect } from '../ArchbaseTreeSelect';

const ArchbaseTreeSelectExample = () => {
	const [value, setValue] = useState('')
	const [selectedNode, setSelectedNode] = useState({})
	return (
		<Grid>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Tree Select Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 300 }}>
							<ArchbaseTreeSelect
								id={'treeSelect'}
								label='Selecionado'
								selectable={false}
								dataSource={data}
								withBorder={true}
								width={'270px'}
								widthTreeView={'540px'}
								heightTreeView={'300px'}
								value={value}
								height={'calc(100% - 40px)'}
								allowNodeSelectType={['SELECTABLE']}
								onConfirm={(node) => {
									setValue(node.text)
									setSelectedNode(node)
								}}
							/>
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify='space-between'>
							<Text fw={500}>Nó selecionado</Text>
						</Group>
					</Card.Section>
					<ScrollArea h={300}>
						<Space h={20} />
						<ArchbaseObjectInspector data={selectedNode} expandLevel={10}/>
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const data = treeData;

const meta: Meta<typeof ArchbaseTreeSelect> = {
	title: 'Editores/TreeSelect',
	component: ArchbaseTreeSelect,
};

export default meta;
type Story = StoryObj<typeof ArchbaseTreeSelect>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseTreeSelectExample />,
};