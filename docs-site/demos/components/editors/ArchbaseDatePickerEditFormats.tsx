import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseDatePickerEdit } from '@archbase/components';

export function ArchbaseDatePickerEditFormats() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Formatos de Data Disponiveis:</Text>

      <ArchbaseDatePickerEdit
        label="DD/MM/YYYY (padrao)"
        dateFormat="DD/MM/YYYY"
        clearable
      />

      <ArchbaseDatePickerEdit
        label="DD-MM-YYYY"
        dateFormat="DD-MM-YYYY"
        clearable
      />

      <ArchbaseDatePickerEdit
        label="YYYY/MM/DD"
        dateFormat="YYYY/MM/DD"
        clearable
      />

      <ArchbaseDatePickerEdit
        label="YYYY-MM-DD"
        dateFormat="YYYY-MM-DD"
        clearable
      />
    </Stack>
  );
}
