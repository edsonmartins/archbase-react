import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { Box, Card, Grid, Group, ScrollArea, Text, useMantineTheme } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { ArchbaseThemeEditor } from './ArchbaseThemeEditor';

import { IconAdjustments } from '@tabler/icons-react';
import { ArchbaseThemeOverride } from 'components/core';

import { DARK_MODE_EVENT_NAME, UPDATE_DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { addons } from '@storybook/preview-api';

const channel = addons.getChannel();

const ArchbaseThemeEditorExample = () => {
  const theme = useMantineTheme();

  const [isDark, setDark] = React.useState();

  const toggleDarkMode = () => {
    channel.emit(UPDATE_DARK_MODE_EVENT_NAME);
  };

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);

    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
  }, [setDark]);

  const forceUpdate = useArchbaseForceUpdate();
  const { dataSource } = useArchbaseDataSource<ArchbaseThemeOverride, string>({
    initialData: [theme],
    name: 'dsTheme',
  });
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit();
  }
  useArchbaseDataSourceListener<ArchbaseThemeOverride, string>({
    dataSource,
    listener: (event: DataSourceEvent<ArchbaseThemeOverride>): void => {
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
            <Group position="apart">
              <Text weight={500}>Theme Editor Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({ height: 100 })}>
            <ArchbaseThemeEditor
              drawerLabel="Editor de Tema"
              buttonLabel={<IconAdjustments size={'1.5rem'} />}
              toggleDarkMode={toggleDarkMode}
              dataSource={dataSource}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto MantineTheme</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}>
            <ArchbaseJsonView data={theme} />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsTheme</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/ThemeEditor',
  component: ArchbaseThemeEditorExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseThemeEditorExample> = {
  args: {
    render: () => {
      <ArchbaseThemeEditorExample />;
    },
  },
};
