import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbasePasswordEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Usuario {
  id: string;
  email: string;
  senha: string;
}

export function ArchbasePasswordEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Usuario>({
    initialData: [{
      id: '1',
      email: 'usuario@email.com',
      senha: 'senha123'
    }],
    name: 'dsUsuarioPassword',
  });

  // Inicializa em modo de edição após o mount
  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        edit();
        setInitialized(true);
      } catch (e) {
        // Ignorar se não conseguir editar no primeiro render
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

      <ArchbasePasswordEdit
        dataSource={dataSource}
        dataField="senha"
        label="Senha do Usuário"
        placeholder="Digite a nova senha..."
        required
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(
            current ? { ...current, senha: '*'.repeat(current.senha?.length || 0) } : null,
            null,
            2
          )}
        </Code>
      </Card>
    </Stack>
  );
}
