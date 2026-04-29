import React, { useState } from 'react';
import { Stack, Group, Slider, Text, Card } from '@mantine/core';
import { ArchbaseArcGauge } from '@archbase/components';

export function ArchbaseArcGaugeUsage() {
  const [value, setValue] = useState(65);

  return (
    <Stack gap="md" p="md">
      <Group justify="center" gap="xl">
        <ArchbaseArcGauge
          value={value}
          size={200}
          label="Performance"
          showValue
          segments={[
            { value: 33, color: 'red' },
            { value: 66, color: 'yellow' },
            { value: 100, color: 'green' },
          ]}
        />

        <ArchbaseArcGauge
          value={value}
          size={180}
          label="Velocidade"
          showValue
          valueSuffix=" km/h"
          color="blue"
          showTicks
          tickCount={5}
        />

        <ArchbaseArcGauge
          value={value}
          min={0}
          max={100}
          size={160}
          label="CPU"
          showValue
          color="violet"
        />
      </Group>

      <Card withBorder p="md">
        <Text size="sm" mb="xs">Ajustar valor: {value}%</Text>
        <Slider
          value={value}
          onChange={setValue}
          min={0}
          max={100}
        />
      </Card>
    </Stack>
  );
}
