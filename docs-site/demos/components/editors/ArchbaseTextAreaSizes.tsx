import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseTextArea } from '@archbase/components';

export function ArchbaseTextAreaSizes() {
  return (
    <Stack gap="md" p="md">
      <ArchbaseTextArea
        size="xs"
        label="Extra Small"
        placeholder="Textarea XS..."
        minRows={2}
      />
      <ArchbaseTextArea
        size="sm"
        label="Small"
        placeholder="Textarea SM..."
        minRows={2}
      />
      <ArchbaseTextArea
        size="md"
        label="Medium (padrão)"
        placeholder="Textarea MD..."
        minRows={2}
      />
      <ArchbaseTextArea
        size="lg"
        label="Large"
        placeholder="Textarea LG..."
        minRows={2}
      />
      <ArchbaseTextArea
        size="xl"
        label="Extra Large"
        placeholder="Textarea XL..."
        minRows={2}
      />
    </Stack>
  );
}
