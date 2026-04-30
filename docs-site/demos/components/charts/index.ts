import type { MantineDemo } from '@mantinex/demo';

// =============================================
// ArchbaseSparkline
// =============================================
import { ArchbaseSparklineUsage } from './ArchbaseSparklineUsage';

const sparklineUsageCode = `
import { ArchbaseSparkline } from '@archbase/components';
import { Card, Group, Stack } from '@mantine/core';

function Demo() {
  const salesData = [10, 20, 15, 40, 30, 50, 45, 60, 55, 70];

  return (
    <Card withBorder p="sm">
      <ArchbaseSparkline
        data={salesData}
        label="Vendas"
        showValue
        showTrend
        trendColors
        height={40}
      />
    </Card>
  );
}
`;

export const sparklineUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseSparklineUsage,
  code: sparklineUsageCode,
};

// =============================================
// ArchbaseArcGauge
// =============================================
import { ArchbaseArcGaugeUsage } from './ArchbaseArcGaugeUsage';

const arcGaugeUsageCode = `
import { ArchbaseArcGauge } from '@archbase/components';

function Demo() {
  return (
    <ArchbaseArcGauge
      value={65}
      size={200}
      label="Performance"
      showValue
      segments={[
        { value: 33, color: 'red' },
        { value: 66, color: 'yellow' },
        { value: 100, color: 'green' },
      ]}
    />
  );
}
`;

export const arcGaugeUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseArcGaugeUsage,
  code: arcGaugeUsageCode,
};

// =============================================
// ArchbaseLinearGauge
// =============================================
import { ArchbaseLinearGaugeUsage } from './ArchbaseLinearGaugeUsage';

const linearGaugeUsageCode = `
import { ArchbaseLinearGauge } from '@archbase/components';

function Demo() {
  return (
    <ArchbaseLinearGauge
      value={45}
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
  );
}
`;

export const linearGaugeUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseLinearGaugeUsage,
  code: linearGaugeUsageCode,
};
