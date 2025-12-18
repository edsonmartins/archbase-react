import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseImageEdit } from '@archbase/components';

export function ArchbaseImageEditUsage() {
  const [imageBase64, setImageBase64] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseImageEdit
        label="Foto do Produto"
        width={200}
        height={200}
        onChangeImage={(base64) => setImageBase64(base64 || '')}
        allowClear
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Imagem (base64):
        </Text>
        <Code block style={{ fontSize: 12, maxHeight: 100, overflow: 'auto' }}>
          {imageBase64 ? `${imageBase64.substring(0, 100)}...` : 'Nenhuma imagem'}
        </Code>
      </Card>
    </Stack>
  );
}
