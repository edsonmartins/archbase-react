import { Avatar, Card, Grid, Group, Text } from '@mantine/core';
import { ThemeIcon } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import { IconUser } from '@tabler/icons-react';
import { IconAt, IconPhoneCall } from '@tabler/icons-react';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import {
	useArchbaseDataSource,
	useArchbaseDataSourceListener,
	useArchbaseForceUpdate,
	useArchbaseListContext,
} from '../../hooks';
import { ArchbaseList, ArchbaseListCustomItemProps } from '../ArchbaseList';
import ArchbaseListContext, { ArchbaseListContextValue } from '../ArchbaseList.context';
import { Pessoa } from 'demo/data/Pessoa';
import { pessoasData } from '../../../demo';

const data = pessoasData;

interface ArchbaseListBasicExampleProps {
	showIcon: boolean;
	showPhoto: boolean;
	justifyContent: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
	spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ArchbaseListBasicExample = ({ showIcon, showPhoto, justifyContent, spacing }: ArchbaseListBasicExampleProps) => {
	const forceUpdate = useArchbaseForceUpdate();
	const [icon, setIcon] = useState<ReactNode | undefined>();
	const [photo, setPhoto] = useState<ReactNode | string | undefined>();
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({
		initialData: data,
		name: 'dsPessoas',
	});

	useArchbaseDataSourceListener<Pessoa, string>({
		dataSource,
		listener: (event: DataSourceEvent<Pessoa>): void => {
			switch (event.type) {
				case DataSourceEventNames.afterScroll: {
					forceUpdate();
					break;
				}
				default:
			}
		},
	});

	useEffect(() => {
		if (showIcon) {
			setIcon(
				<ThemeIcon color="blue" size={20} radius="xl">
					<IconUser size="1rem" />
				</ThemeIcon>,
			);
		} else {
			setIcon(undefined);
		}
		if (showPhoto) {
			setPhoto('foto');
		} else {
			setPhoto(undefined);
		}
	}, [showIcon, showPhoto]);

	return (
		<Grid>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Lista de Pessoas</Text>
						</Group>
					</Card.Section>
					<ArchbaseList<Pessoa, string>
						dataSource={dataSource}
						dataFieldId="id"
						dataFieldText="nome"
						icon={icon}
						image={photo}
						imageRadius={50}
						imageWidth={24}
						imageHeight={24}
						justify={justifyContent}
						spacing={spacing}
					/>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsPessoas</Text>
						</Group>
					</Card.Section>
					<ArchbaseObjectInspector data={dataSource} />
				</Card>
			</Grid.Col>
		</Grid>
	);
};

type CustomItemProps = ArchbaseListCustomItemProps<Pessoa, string>;

const classes = {
	icon: {
		color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-3))',
	},

	name: {
		fontFamily: `Greycliff CF, var(--mantine-font-family)`,
	},
};

const CustomItem = (props: CustomItemProps) => {
	const listContextValue = useArchbaseListContext<Pessoa, string>();
	const itemRef = useRef<any>(null);

	useEffect(() => {
		if (itemRef.current && props.active) {
			itemRef.current.focus();
		}
	}, [props.active]);

	const handleClick = (event) => {
		event.preventDefault();
		if (!props.disabled) {
			if (listContextValue.handleSelectItem) {
				listContextValue.handleSelectItem(props.index, props.recordData);
			}
		}
	};

	const backgroundColor = props.active ? listContextValue.activeBackgroundColor : '';
	const color = props.active ? listContextValue.activeColor : '';

	return (
		<div onClick={handleClick} style={{ padding: '8px', backgroundColor, color }} ref={itemRef} tabIndex={-1}>
			<Group wrap="nowrap">
				<Avatar src={props.recordData.foto} size={94} radius="md" />
				<div>
					<Text fz="lg" fw={500} style={classes.name}>
						{props.recordData.nome}
					</Text>

					<Group wrap="nowrap" gap={10} mt={3}>
						<IconAt stroke={1.5} size="1rem" style={classes.icon} />
						<Text fz="xs" c="dimmed" style={classes.name}>
							{props.recordData.email}
						</Text>
					</Group>

					<Group wrap="nowrap" gap={10} mt={5}>
						<IconPhoneCall stroke={1.5} size="1rem" style={classes.icon} />
						<Text fz="xs" c="dimmed" style={classes.name}>
							{props.recordData.celular}
						</Text>
					</Group>
				</div>
			</Group>
		</div>
	);
};

const ArchbaseListCustomItemExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({
		initialData: data,
		name: 'dsPessoas',
	});

	useArchbaseDataSourceListener<Pessoa, string>({
		dataSource,
		listener: (event: DataSourceEvent<Pessoa>): void => {
			switch (event.type) {
				case DataSourceEventNames.afterScroll: {
					forceUpdate();
					break;
				}
				default:
			}
		},
	});

	return (
		<Grid>
			<Grid.Col offset={1} span={7}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Lista de Pessoas customizada</Text>
						</Group>
					</Card.Section>
					<ArchbaseList<Pessoa, string>
						height={700}
						dataSource={dataSource}
						component={{
							type: CustomItem,
							props: { opcao1: 'teste', opcao2: 'teste' },
						}}
					/>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsPessoas</Text>
						</Group>
					</Card.Section>
					<ArchbaseObjectInspector data={dataSource} />
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseList> = {
	title: 'Listas e tabelas/List',
	component: ArchbaseList,
};

export default meta;
type Story = StoryObj<typeof ArchbaseList>;

export const Primary: StoryObj<typeof ArchbaseListBasicExample> = {
	name: 'Exemplo lista simples',
	render: (args) => {
		return <ArchbaseListBasicExample {...args} />;
	},
	args: {
		showIcon: false,
		showPhoto: false,
		justifyContent: 'flex-start',
		spacing: 'md',
	},
	argTypes: {
		justifyContent: {
			options: ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly'],
			control: { type: 'radio' },
		},
		spacing: {
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
			control: { type: 'select' },
		},
	},
};

export const Example2: StoryObj<typeof ArchbaseList> = {
	name: 'Exemplo com render item customizado',
	render: (args) => {
		return <ArchbaseListCustomItemExample />;
	},
};
