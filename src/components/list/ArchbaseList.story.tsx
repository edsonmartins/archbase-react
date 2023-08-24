import React, { useState, useEffect, ReactNode, useContext, useRef } from 'react';
import { Avatar, Card, Grid, Group, Text, createStyles } from '@mantine/core';
import { Pessoa, pessoasData } from '@demo/index';
import { useArchbaseDataSource, useArchbaseForceUpdate, useArchbaseDataSourceListener } from '@components/hooks';
import { DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseList, ArchbaseListCustomItemProps } from './ArchbaseList';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { ThemeIcon } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { IconPhoneCall, IconAt } from '@tabler/icons-react';
import ArchbaseListContext, { ArchbaseListContextValue } from './ArchbaseList.context';
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
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });

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
      <Grid.Col span="content">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Lista de Pessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseList<Pessoa, string>
            dataSource={dataSource!}
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
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

interface CustomItemProps extends ArchbaseListCustomItemProps<Pessoa, string> {}

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[7],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

const CustomItem = (props: CustomItemProps) => {
  const { classes } = useStyles();
  const listContextValue = useContext<ArchbaseListContextValue<Pessoa, string>>(ArchbaseListContext);
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
        listContextValue.handleSelectItem(props.index, props.recordData!);
      }
    }
  };

  const backgroundColor = props.active ? listContextValue.activeBackgroundColor : '';
  const color = props.active ? listContextValue.activeColor : '';

  return (
    <div onClick={handleClick} style={{ padding: '8px', backgroundColor, color }} ref={itemRef} tabIndex={-1}>
      <Group noWrap>
        <Avatar src={props.recordData.foto} size={94} radius="md" />
        <div>
          <Text fz="lg" fw={500} className={classes.name}>
            {props.recordData.nome}
          </Text>

          <Group noWrap spacing={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed" className={classes.name}>
              {props.recordData.email}
            </Text>
          </Group>

          <Group noWrap spacing={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed" className={classes.name}>
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
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });

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
      <Grid.Col span="content">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Lista de Pessoas customizada</Text>
            </Group>
          </Card.Section>
          <ArchbaseList<Pessoa, string>
            height={700}
            dataSource={dataSource!}
            component={{ type: CustomItem, props: { opcao1: 'teste', opcao2: 'teste' } }}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'List/List',
  component: ArchbaseListBasicExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseListBasicExample> = {
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

export const Example2: StoryObj<typeof ArchbaseListCustomItemExample> = {
  render: (_args) => {
    return <ArchbaseListCustomItemExample />;
  },
};
