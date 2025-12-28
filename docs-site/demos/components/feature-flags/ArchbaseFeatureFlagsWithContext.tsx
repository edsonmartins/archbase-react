import React, { useState } from 'react';
import {
  ArchbaseFeatureFlagsProvider,
  useArchbaseFeatureFlag,
  useArchbaseVariant,
} from '@archbase/feature-flags';
import { Button, Card, Text, Badge, Stack, TextInput } from '@mantine/core';

// Demo with dynamic context
function FeatureFlagsWithContext() {
  const { enabled: premiumEnabled, loading: premiumLoading } = useArchbaseFeatureFlag('premium-features');
  const { enabled: darkMode, loading: darkModeLoading } = useArchbaseFeatureFlag('dark-mode');
  const { variant: pricingVariant, loading: pricingLoading } = useArchbaseVariant('pricing-strategy');
  const [userId, setUserId] = useState('user-123');

  const loading = premiumLoading || darkModeLoading || pricingLoading;

  if (loading) {
    return <Text>Loading flags...</Text>;
  }

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={500}>User Context</Text>
          <TextInput
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.currentTarget.value)}
            placeholder="Enter user ID"
          />
          <Text size="xs" c="dimmed">
            Change the user ID to test different feature flag configurations
          </Text>
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={500}>Premium Features</Text>
          <Badge color={premiumEnabled ? 'green' : 'gray'}>
            {premiumEnabled ? 'Premium User' : 'Free User'}
          </Badge>
          {premiumEnabled && (
            <Text size="sm">This user has access to premium features! ⭐</Text>
          )}
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Text fw={500}>A/B Testing: Pricing Strategy</Text>
          <Badge color="blue">Variant: {pricingVariant?.name || 'default'}</Badge>
          {pricingVariant?.name === 'discount' && (
            <Text size="sm" c="green">20% Discount Applied! 🎉</Text>
          )}
          {pricingVariant?.name === 'premium' && (
            <Text size="sm">Premium Pricing Shown 💎</Text>
          )}
          {pricingVariant?.name === 'standard' && (
            <Text size="sm">Standard Pricing Shown</Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

export function ArchbaseFeatureFlagsWithContext() {
  const [currentUserId, setCurrentUserId] = useState('user-123');

  return (
    <ArchbaseFeatureFlagsProvider
      config={{
        url: process.env.NEXT_PUBLIC_UNLEASH_URL || 'https://app.unleash-hosted.com',
        clientKey: process.env.NEXT_PUBLIC_UNLEASH_KEY || 'your-api-key',
        appName: 'archbase-react',
        environment: 'development',
        context: {
          userId: currentUserId,
          properties: {
            plan: 'premium',
            region: 'us-east-1',
          },
        },
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Context User ID"
          value={currentUserId}
          onChange={(e) => setCurrentUserId(e.currentTarget.value)}
        />
        <FeatureFlagsWithContext />
      </Stack>
    </ArchbaseFeatureFlagsProvider>
  );
}
