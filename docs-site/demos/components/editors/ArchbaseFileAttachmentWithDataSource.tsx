import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseFileAttachment, ArchbaseEdit, Attachment } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Documento {
  id: string;
  titulo: string;
  anexos: string; // JSON string com lista de arquivos
}

const initialData: Documento[] = [{
  id: '1',
  titulo: 'Contrato de Servico',
  anexos: '[]'
}];

export function ArchbaseFileAttachmentWithDataSource() {
  const [initialized, setInitialized] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const { dataSource } = useArchbaseDataSource<Documento, string>({
    initialData,
    name: 'dsDocumentoAnexo',
  });

  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();

  // Sincroniza anexos com o dataSource
  useEffect(() => {
    if (currentRecord?.anexos) {
      try {
        const parsed = JSON.parse(currentRecord.anexos);
        setAttachments(parsed);
      } catch {
        setAttachments([]);
      }
    }
  }, [currentRecord?.anexos]);

  const handleAdd = (newAttachment: Attachment) => {
    const updated = [...attachments, newAttachment];
    setAttachments(updated);
    dataSource.setFieldValue('anexos', JSON.stringify(updated));
  };

  const handleRemove = (removedAttachment: Attachment) => {
    const updated = attachments.filter(a => a.name !== removedAttachment.name);
    setAttachments(updated);
    dataSource.setFieldValue('anexos', JSON.stringify(updated));
  };

  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        edit();
        setInitialized(true);
      } catch (e) {
        // Ignorar
      }
    }
  }, [initialized, dataSource, isBrowsing]);

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={edit} disabled={isEditing} color="blue">
          Editar
        </Button>
        <Button size="xs" onClick={save} disabled={isBrowsing} color="green">
          Salvar
        </Button>
        <Button size="xs" onClick={cancel} disabled={isBrowsing} color="red">
          Cancelar
        </Button>
      </Group>

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="titulo"
        label="Titulo do Documento"
      />

      <Text size="sm" fw={500}>Anexos:</Text>
      <ArchbaseFileAttachment
        attachments={attachments}
        accept={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
        acceptDescription="PDFs e documentos Office"
        onAttachmentAdd={handleAdd}
        onAttachmentRemove={handleRemove}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(currentRecord, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
