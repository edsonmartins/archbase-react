import React from 'react';
import { Stack, Group, Card, Text } from '@mantine/core';
import { ArchbaseSparkline } from '@archbase/components';

export function ArchbaseSparklineUsage() {
  const salesData = [10, 20, 15, 40, 30, 50, 45, 60, 55, 70];
  const visitorsData = [100, 120, 90, 150, 140, 180, 160, 200, 190, 210];
  const conversionData = [2.5, 3.2, 2.8, 4.1, 3.9, 5.0, 4.5, 5.5, 5.2, 6.0];

  return (
    <Stack gap="md" p="md">
      <Group grow>
        <Card withBorder p="sm">
          <ArchbaseSparkline
            data={salesData}
            label="Vendas"
            showValue
            showTrend
            autoTrendColors
            height={40}
          />
        </Card>

        <Card withBorder p="sm">
          <ArchbaseSparkline
            data={visitorsData}
            label="Visitantes"
            color="violet"
            showValue
            showTrend
            height={40}
          />
        </Card>

        <Card withBorder p="sm">
          <ArchbaseSparkline
            data={conversionData}
            label="Conversão (%)"
            showValue
            showTrend
            autoTrendColors
            valueFormat={(v) => `${v.toFixed(1)}%`}
            height={40}
          />
        </Card>
      </Group>
    </Stack>
  );
}
