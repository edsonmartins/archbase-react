import React, { useState } from 'react';
import { Stack, Group, Slider, Text, Card } from '@mantine/core';
import { ArchbaseLinearGauge } from '@archbase/components';

export function ArchbaseLinearGaugeUsage() {
  const [value, setValue] = useState(45);

  return (
    <Stack gap="md" p="md">
      <Group justify="center" gap="xl">
        <ArchbaseLinearGauge
          value={value}
          size={250}
          thickness={16}
          label="Progresso"
          showValue
          zones={[
            { from: 0, to: 30, color: 'red' },
            { from: 30, to: 70, color: 'yellow' },
            { from: 70, to: 100, color: 'green' },
          ]}
        />

        <ArchbaseLinearGauge
          value={value}
          size={200}
          orientation="vertical"
          thickness={20}
          label="Nível"
          showValue
          showTicks
          tickCount={5}
          showTickLabels
        />
      </Group>

      <Card withBorder p="md">
        <Text size="sm" mb="xs">Ajustar valor: {value}</Text>
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
