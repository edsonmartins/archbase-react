import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseSelect } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Pessoa {
  id: string;
  nome: string;
  estadoNascimento: string;
}

interface Estado {
  sigla: string;
  nome: string;
}

const estados: Estado[] = [
  { sigla: 'SP', nome: 'Sao Paulo' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'BA', nome: 'Bahia' },
];

export function ArchbaseSelectWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Pessoa, string>({
    initialData: [{
      id: '1',
      nome: 'Maria Santos',
      estadoNascimento: 'SP'
    }],
    name: 'dsPessoaSelect',
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

      <ArchbaseSelect<Pessoa, string, Estado>
        dataSource={dataSource}
        dataField="estadoNascimento"
        label="Estado de Nascimento"
        placeholder="Selecione um estado..."
        initialOptions={estados}
        getOptionLabel={(estado) => estado.nome}
        getOptionValue={(estado) => estado.sigla}
        converter={(estado) => estado?.sigla}
        searchable
        clearable
        required
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
