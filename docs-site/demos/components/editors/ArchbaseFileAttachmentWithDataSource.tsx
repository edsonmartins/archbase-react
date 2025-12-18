import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseFileAttachment, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Documento {
  id: string;
  titulo: string;
  anexos: string; // JSON string com lista de arquivos
}

export function ArchbaseFileAttachmentWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Documento>({
    initialData: [{
      id: '1',
      titulo: 'Contrato de Servico',
      anexos: '[]'
    }],
    name: 'dsDocumentoAnexo',
  });

  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        edit();
        setInitialized(true);
      } catch (e) {
        // Ignorar
      }
    }
  }, [initialized, dataSource, isBrowsing, edit]);

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={edit} disabled={isEditing} color="blue">
          Editar
        </Button>
        <Button size="xs" onClick={() => save()} disabled={isBrowsing} color="green">
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

      <ArchbaseFileAttachment
        dataSource={dataSource}
        dataField="anexos"
        label="Anexos"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        maxSize={10 * 1024 * 1024} // 10MB
        multiple
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(current, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
