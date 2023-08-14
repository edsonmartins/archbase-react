import React, { useState } from 'react';
import {
  Box,
  Card,
  ColorScheme,
  ColorSchemeProvider,
  Grid,
  Group,
  MantineProvider,
  MantineTheme,
  ScrollArea,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { ArchbaseThemeEditor } from './ArchbaseThemeEditor';
import { useArchbaseForceUpdate } from '../hooks';
import { Meta, StoryObj } from '@storybook/react';

import { IconAdjustments } from '@tabler/icons-react';

const ArchbaseThemeEditorExample = () => {
  const theme = useMantineTheme();

  const forceUpdate = useArchbaseForceUpdate();
  const { dataSource } = useArchbaseDataSource<MantineTheme, string>({ initialData: [theme], name: 'dsTheme' });
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit();
  }
  useArchbaseDataSourceListener<MantineTheme, string>({
    dataSource,
    listener: (event: DataSourceEvent<MantineTheme>): void => {
      switch (event.type) {
        case DataSourceEventNames.fieldChanged: {
          forceUpdate();
          break;
        }
        default:
      }
    },
  });

  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Grid>
          <Grid.Col span={12}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart">
                  <Text weight={500}>Theme Editor Component</Text>
                </Group>
              </Card.Section>
              <Box sx={(_theme) => ({ height: 100 })}>
                <ArchbaseThemeEditor drawerLabel="Editor de Tema" buttonLabel={<IconAdjustments size={'1.5rem'} />} />
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
      </MantineProvider>
    </ColorSchemeProvider>
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
