import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseFileAttachment } from '@archbase/components';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  base64?: string;
}

export function ArchbaseFileAttachmentUsage() {
  const [files, setFiles] = useState<FileInfo[]>([]);

  return (
    <Stack gap="md" p="md">
      <ArchbaseFileAttachment
        label="Anexos"
        onFilesChange={(newFiles) => setFiles(newFiles)}
        accept="image/*,.pdf,.doc,.docx"
        maxSize={5 * 1024 * 1024} // 5MB
        multiple
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Arquivos selecionados:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(files.map(f => ({ name: f.name, size: f.size, type: f.type })), null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
