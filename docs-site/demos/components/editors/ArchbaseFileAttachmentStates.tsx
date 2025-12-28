import React, { useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseFileAttachment, Attachment } from '@archbase/components';

export function ArchbaseFileAttachmentStates() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleAdd = (newAttachment: Attachment) => {
    setAttachments(prev => [...prev, newAttachment]);
  };

  const handleRemove = (removedAttachment: Attachment) => {
    setAttachments(prev => prev.filter(a => a.name !== removedAttachment.name));
  };

  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Componente de anexos:</Text>

      <ArchbaseFileAttachment
        attachments={attachments}
        accept={['image/*', 'application/pdf', '.doc', '.docx']}
        acceptDescription="Imagens, PDFs e documentos Word"
        onAttachmentAdd={handleAdd}
        onAttachmentRemove={handleRemove}
        height={200}
      />

      <Text size="sm" c="dimmed">
        Arquivos anexados: {attachments.length}
      </Text>
    </Stack>
  );
}
