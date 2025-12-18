import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Text, Code, Card, Modal, Table, Button, Group, TextInput } from '@mantine/core';
import { ArchbaseLookupEdit, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface Pedido {
  id: string;
  descricao: string;
  clienteId: string;
  clienteNome: string;
}

const clientes: Cliente[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com' },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com' },
];

export function ArchbaseLookupEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Pedido>({
    initialData: [{
      id: '1',
      descricao: 'Pedido de Notebooks',
      clienteId: '1',
      clienteNome: 'João Silva'
    }],
    name: 'dsPedido',
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

  const handleSelectCliente = useCallback((cliente: Cliente) => {
    if (dataSource) {
      dataSource.setFieldValue('clienteId', cliente.id);
      dataSource.setFieldValue('clienteNome', cliente.nome);
    }
    setModalOpened(false);
  }, [dataSource]);

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        dataField="descricao"
        label="Descricao do Pedido"
      />

      <ArchbaseLookupEdit
        dataSource={dataSource}
        dataField="clienteNome"
        label="Cliente"
        placeholder="Clique no icone para buscar cliente..."
        readOnly
        onActionSearchExecute={() => setModalOpened(true)}
        tooltipIconSearch="Buscar cliente"
        clearable
        onClear={() => {
          if (dataSource) {
            dataSource.setFieldValue('clienteId', '');
            dataSource.setFieldValue('clienteNome', '');
          }
        }}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(current, null, 2)}
        </Code>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Selecionar Cliente"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            placeholder="Pesquisar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredClientes.map((cliente) => (
                <Table.Tr key={cliente.id}>
                  <Table.Td>{cliente.nome}</Table.Td>
                  <Table.Td>{cliente.email}</Table.Td>
                  <Table.Td>
                    <Button size="xs" onClick={() => handleSelectCliente(cliente)}>
                      Selecionar
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Modal>
    </Stack>
  );
}
