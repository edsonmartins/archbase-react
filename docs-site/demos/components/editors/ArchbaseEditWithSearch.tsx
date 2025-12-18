import React, { useState } from 'react';
import { Stack, Text, Code, Card, Modal, Table, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { ArchbaseEdit } from '@archbase/components';

interface Cliente {
  id: string;
  nome: string;
  documento: string;
}

const clientes: Cliente[] = [
  { id: '1', nome: 'Empresa ABC Ltda', documento: '12.345.678/0001-90' },
  { id: '2', nome: 'Comércio XYZ', documento: '98.765.432/0001-10' },
  { id: '3', nome: 'Indústria 123', documento: '11.222.333/0001-44' },
];

export function ArchbaseEditWithSearch() {
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const handleSearch = () => {
    setModalOpened(true);
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalOpened(false);
  };

  return (
    <Stack gap="md" p="md">
      <ArchbaseEdit
        label="Cliente"
        placeholder="Clique no ícone para buscar..."
        value={selectedCliente?.nome || ''}
        readOnly
        icon={<IconSearch size={16} />}
        onActionSearchExecute={handleSearch}
        tooltipIconSearch="Buscar cliente"
        variant="filled"
      />

      {selectedCliente && (
        <Card withBorder p="sm" radius="md">
          <Text size="sm" fw={500} mb="xs">Cliente selecionado:</Text>
          <Code block style={{ fontSize: 12 }}>
            {JSON.stringify(selectedCliente, null, 2)}
          </Code>
        </Card>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Buscar Cliente"
        size="lg"
      >
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nome</Table.Th>
              <Table.Th>Documento</Table.Th>
              <Table.Th w={100}>Ação</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clientes.map((cliente) => (
              <Table.Tr key={cliente.id}>
                <Table.Td>{cliente.nome}</Table.Td>
                <Table.Td>{cliente.documento}</Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => handleSelectCliente(cliente)}
                  >
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
