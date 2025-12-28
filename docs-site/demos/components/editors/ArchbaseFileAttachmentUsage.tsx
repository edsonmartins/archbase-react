import React, { useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseFileAttachment, Attachment } from '@archbase/components';

export function ArchbaseFileAttachmentUsage() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleAdd = (newAttachment: Attachment) => {
    setAttachments(prev => [...prev, newAttachment]);
  };

  const handleRemove = (removedAttachment: Attachment) => {
    setAttachments(prev => prev.filter(a => a.name !== removedAttachment.name));
  };

  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Arraste arquivos ou clique para selecionar:</Text>

      <ArchbaseFileAttachment
        attachments={attachments}
        accept={['image/*', 'application/pdf']}
        acceptDescription="Imagens e PDFs"
        onAttachmentAdd={handleAdd}
        onAttachmentRemove={handleRemove}
      />
    </Stack>
  );
}
