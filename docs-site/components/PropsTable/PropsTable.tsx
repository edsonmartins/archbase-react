import React from 'react';
import { Code, Highlight, Table, Text, Title } from '@mantine/core';

export interface DocgenProp {
  defaultValue?: {
    value: string;
  };
  description: string;
  name: string;
  required: boolean;
  type: {
    name: string;
  };
}

export interface Docgen {
  description?: string;
  displayName: string;
  props: Record<string, DocgenProp>;
}

interface PropsTableProps {
  component: string;
  query?: string;
  data: Record<string, Docgen>;
}

export function PropsTable({ component, query = '', data }: PropsTableProps) {
  if (!data[component]) {
    return (
      <Text c="dimmed" fz="sm">
        Nenhuma documentação de props encontrada para {component}
      </Text>
    );
  }

  const componentData = data[component];
  const rows = Object.keys(componentData.props || {})
    .filter((propKey) =>
      componentData.props[propKey].name.toLowerCase().includes(query.toLowerCase().trim())
    )
    .map((propKey) => {
      const prop = componentData.props[propKey];

      return (
        <Table.Tr key={propKey}>
          <Table.Td style={{ whiteSpace: 'nowrap' }}>
            <Highlight highlight={query} component="span" fz="sm" fw={500}>
              {prop.name}
            </Highlight>
            {prop.required && (
              <Text component="sup" c="red" fz="xs">
                {' '}*
              </Text>
            )}
          </Table.Td>

          <Table.Td>
            <Code fz="xs">{prop.type.name}</Code>
          </Table.Td>

          <Table.Td>
            {prop.defaultValue?.value && (
              <Code fz="xs" c="blue">{prop.defaultValue.value}</Code>
            )}
          </Table.Td>

          <Table.Td>
            <Text fz="sm" c="dimmed" dangerouslySetInnerHTML={{ __html: prop.description || '-' }} />
          </Table.Td>
        </Table.Tr>
      );
    });

  if (rows.length === 0) {
    return (
      <Text c="dimmed" fz="sm">
        Nenhuma prop encontrada
      </Text>
    );
  }

  return (
    <Table.ScrollContainer minWidth={800}>
      <Table layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={180}>Nome</Table.Th>
            <Table.Th w={250}>Tipo</Table.Th>
            <Table.Th w={120}>Padrão</Table.Th>
            <Table.Th>Descrição</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

interface PropsTablesListProps {
  components: string[];
  data: Record<string, Docgen>;
}

export function PropsTablesList({ components, data }: PropsTablesListProps) {
  return (
    <>
      {components.map((component) => (
        <div key={component} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Title order={3} mb="md">{component}</Title>
          <PropsTable component={component} data={data} />
        </div>
      ))}
    </>
  );
}
