import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseLookupSelect } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Cliente {
  id: string;
  nome: string;
  tipoClienteId: string;
}

interface TipoCliente {
  id: string;
  descricao: string;
}

const tiposClienteData: TipoCliente[] = [
  { id: '1', descricao: 'Pessoa Física' },
  { id: '2', descricao: 'Pessoa Jurídica' },
  { id: '3', descricao: 'Governamental' },
];

const clienteData: Cliente = {
  id: '1',
  nome: 'João Silva',
  tipoClienteId: '1',
};

export function ArchbaseLookupSelectUsage() {
  const [value, setValue] = useState<TipoCliente | null>(null);
  const { dataSource: lookupDataSource } = useArchbaseDataSource<TipoCliente, string>({
    initialData: tiposClienteData,
    name: 'dsTipoClienteLookup',
  });

  return (
    <Stack gap="md" p="md">
      <ArchbaseLookupSelect<Cliente, string, TipoCliente>
        label="Tipo de Cliente"
        placeholder="Selecione o tipo..."
        value={value}
        onSelectValue={(tipo) => setValue(tipo)}
        lookupDataSource={lookupDataSource}
        lookupDataFieldText="descricao"
        lookupDataFieldId="id"
        getOptionValue={(tipo) => tipo.id}
        clearable
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Selecionado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(value, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
