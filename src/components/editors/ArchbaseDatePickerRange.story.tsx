import React, { useState } from 'react';
import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { Pessoa, pessoasData } from '@demo/index';
import { useArchbaseDataSource } from '../hooks';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { Meta, StoryObj } from '@storybook/react';
import { useArchbaseForceUpdate } from '../hooks';
import { ArchbaseDatePickerRange } from './ArchbaseDatePickerRange';
import { DateValue } from '@mantine/dates';
import { formatISO } from 'date-fns';

const ArchbaseDatePickerRangeExample = () => {
  const [selectedRange, setSelectedRange] = useState<DateValue[]>();
  const forceUpdate = useArchbaseForceUpdate();
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });
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
            <Group position="apart">
              <Text weight={500}>Date Picker Range Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({ height: 500 })}>
            <ArchbaseDatePickerRange onSelectDateRange={setSelectedRange} label="Informe o período" />
            <Text size={'1rem'}>
              {selectedRange && formatISO(selectedRange![0]!) + ' -> ' + formatISO(selectedRange![1]!)}
            </Text>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/DatePicker Range',
  component: ArchbaseDatePickerRangeExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseDatePickerRangeExample> = {
  args: {
    render: () => {
      <ArchbaseDatePickerRangeExample />;
    },
  },
};
