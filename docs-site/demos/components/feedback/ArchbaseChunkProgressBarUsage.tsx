import React, { useState } from 'react';
import { Stack, Slider, Text, Card, Group } from '@mantine/core';
import { ArchbaseChunkProgressBar } from '@archbase/components';

export function ArchbaseChunkProgressBarUsage() {
  const [value, setValue] = useState(65);

  return (
    <Stack gap="md" p="md">
      <ArchbaseChunkProgressBar
        value={value}
        chunkCount={10}
        label="Progresso do Download"
        showPercentage
        completedColor="blue"
      />

      <ArchbaseChunkProgressBar
        value={value}
        chunkCount={5}
        label="Etapas Concluídas"
        showPercentage
        completedColor="green"
        animated
      />

      <ArchbaseChunkProgressBar
        value={value}
        chunkCount={8}
        label="Upload"
        showPercentage
        completedColor="violet"
        striped
      />

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
