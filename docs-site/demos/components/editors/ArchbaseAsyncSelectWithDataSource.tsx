import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseAsyncSelect, OptionsResult } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Cliente {
  id: string;
  nome: string;
  cidadeId: string;
}

interface Cidade {
  id: string;
  nome: string;
  estado: string;
}

// Simula dados de cidades
const mockCidades: Cidade[] = [
  { id: '1', nome: 'Sao Paulo', estado: 'SP' },
  { id: '2', nome: 'Santos', estado: 'SP' },
  { id: '3', nome: 'Campinas', estado: 'SP' },
  { id: '4', nome: 'Rio de Janeiro', estado: 'RJ' },
  { id: '5', nome: 'Belo Horizonte', estado: 'MG' },
];

const searchCidades = async (page: number, query: string): Promise<OptionsResult<Cidade>> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const filtered = mockCidades.filter(c =>
    c.nome.toLowerCase().includes(query.toLowerCase())
  );

  return {
    options: filtered,
    page: 0,
    totalPages: 1,
  };
};

// Busca cidade por ID (para converter valor armazenado)
const getCidadeById = async (id: string): Promise<Cidade> => {
  const cidade = mockCidades.find(c => c.id === id);
  return cidade || { id: '', nome: '', estado: '' };
};

export function ArchbaseAsyncSelectWithDataSource() {
  const [initialized, setInitialized] = useState(false);

const clienteData: Cliente[] = [
    {
      id: '1',
      nome: 'Joao Silva',
      cidadeId: '1'
    }
  ];

  const { dataSource } = useArchbaseDataSource<Cliente, string>({
    initialData: clienteData,
    name: 'dsClienteAsyncSelect',
  });

  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();

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

      <ArchbaseAsyncSelect<Cliente, string, Cidade>
        dataSource={dataSource}
        dataField="cidadeId"
        label="Cidade"
        placeholder="Digite para buscar..."
        getOptions={searchCidades}
        getOptionLabel={(cidade) => `${cidade.nome} - ${cidade.estado}`}
        getOptionValue={(cidade) => cidade.id}
        converter={(cidade) => cidade?.id}
        getConvertedOption={getCidadeById}
        minCharsToSearch={2}
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
