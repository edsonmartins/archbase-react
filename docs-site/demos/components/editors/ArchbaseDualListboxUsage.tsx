import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseDualListbox } from '@archbase/components';

export function ArchbaseDualListboxUsage() {
  const [value, setValue] = useState<any[]>([]);

  const options = [
    { value: 'react', label: 'React' },
    { value: 'angular', label: 'Angular' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nuxt', label: 'Nuxt' },
  ];

  return (
    <Stack gap="md" p="md">
      <ArchbaseDualListbox
        label="Tecnologias"
        options={options}
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
        availableLabel="Disponíveis"
        selectedLabel="Selecionados"
        showSearch
      />

      {value.length > 0 && (
        <Card withBorder p="sm" radius="md">
          <Text size="sm" fw={500} mb="xs">Valor atual:</Text>
          <Code block style={{ fontSize: 12 }}>
            {JSON.stringify({ value }, null, 2)}
          </Code>
        </Card>
      )}
    </Stack>
  );
}
