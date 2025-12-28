import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Pessoa {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  cep: string;
}

export function ArchbaseMaskEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Pessoa, string>({
    initialData: [{
      id: '1',
      nome: 'Maria Santos',
      cpf: '12345678901',
      telefone: '11999998888',
      cep: '01310100'
    }],
    name: 'dsPessoaMask',
  });
  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();


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

      <ArchbaseMaskEdit
        dataSource={dataSource}
        dataField="cpf"
        label="CPF"
        mask={MaskPattern.CPF}
        placeholder="Digite o CPF..."
      />

      <ArchbaseMaskEdit
        dataSource={dataSource}
        dataField="telefone"
        label="Telefone"
        mask={MaskPattern.PHONE}
        placeholder="Digite o telefone..."
      />

      <ArchbaseMaskEdit
        dataSource={dataSource}
        dataField="cep"
        label="CEP"
        mask={MaskPattern.CEP}
        placeholder="Digite o CEP..."
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
