import React, { useState } from 'react';
import { Stack, Text, Code, Card, Modal, Table, Button, Group } from '@mantine/core';
import { ArchbaseLookupEdit } from '@archbase/components';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  cidade: string;
}

const clientes: Cliente[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', cidade: 'São Paulo' },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com', cidade: 'Rio de Janeiro' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com', cidade: 'Belo Horizonte' },
  { id: '4', nome: 'Ana Costa', email: 'ana@email.com', cidade: 'Curitiba' },
];

export function ArchbaseLookupEditUsage() {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalOpened(false);
  };

  return (
    <Stack gap="md" p="md">
      <ArchbaseLookupEdit
        label="Cliente"
        placeholder="Clique no icone para buscar..."
        value={selectedCliente?.nome || ''}
        readOnly
        onActionSearchExecute={() => setModalOpened(true)}
        tooltipIconSearch="Buscar cliente"
        clearable
        onClear={() => setSelectedCliente(null)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Cliente selecionado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(selectedCliente, null, 2)}
        </Code>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Selecionar Cliente"
        size="lg"
      >
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Cidade</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clientes.map((cliente) => (
              <Table.Tr key={cliente.id}>
                <Table.Td>{cliente.nome}</Table.Td>
                <Table.Td>{cliente.email}</Table.Td>
                <Table.Td>{cliente.cidade}</Table.Td>
                <Table.Td>
                  <Button size="xs" onClick={() => handleSelectCliente(cliente)}>
                    Selecionar
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Modal>
    </Stack>
  );
}
