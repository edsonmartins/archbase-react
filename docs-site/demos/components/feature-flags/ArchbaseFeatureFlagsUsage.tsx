import React, { useState } from 'react';
import {
  ArchbaseFeatureFlagsProvider,
  useArchbaseFeatureFlag,
  useArchbaseVariant,
} from '@archbase/feature-flags';
import { Button, Card, Text, Badge, Stack } from '@mantine/core';

// Demo component that uses feature flags
function FeatureFlagsDemo() {
  const { enabled: newDashboardEnabled, loading } = useArchbaseFeatureFlag('new-dashboard');
  const { variant } = useArchbaseVariant('button-color');

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={500}>Feature Flag: new-dashboard</Text>
          <Badge color={newDashboardEnabled ? 'green' : 'gray'}>
            {newDashboardEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
          {newDashboardEnabled ? (
            <Text size="sm">New dashboard is active! 🎉</Text>
          ) : (
            <Text size="sm">Old dashboard is shown.</Text>
          )}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={500}>A/B Test: button-color</Text>
          <Badge color="blue">Variant: {variant?.name || 'none'}</Badge>
          <Button
            color={variant?.payload?.value === 'red' ? 'red' : 'blue'}
          >
            Click Me
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

export function ArchbaseFeatureFlagsUsage() {
  return (
    <ArchbaseFeatureFlagsProvider
      config={{
        url: process.env.NEXT_PUBLIC_UNLEASH_URL || 'https://app.unleash-hosted.com',
        clientKey: process.env.NEXT_PUBLIC_UNLEASH_KEY || 'your-api-key',
        appName: 'archbase-react',
        environment: 'development',
      }}
    >
      <FeatureFlagsDemo />
    </ArchbaseFeatureFlagsProvider>
  );
}
