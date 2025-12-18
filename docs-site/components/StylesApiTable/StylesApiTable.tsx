import React from 'react';
import { Code, Table, Text, Title } from '@mantine/core';

export interface StylesApiSelector {
  [key: string]: string;
}

export interface StylesApiVar {
  [selector: string]: {
    [variable: string]: string;
  };
}

export interface StylesApiModifier {
  modifier: string;
  selector: string;
  value?: string;
  condition: string;
}

export interface StylesApiData {
  selectors: StylesApiSelector;
  vars?: StylesApiVar;
  modifiers?: StylesApiModifier[];
}

interface SelectorsTableProps {
  data: StylesApiSelector;
}

export function SelectorsTable({ data }: SelectorsTableProps) {
  const rows = Object.entries(data).map(([selector, description]) => (
    <Table.Tr key={selector}>
      <Table.Td>
        <Code fz="sm">{selector}</Code>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" c="dimmed">{description}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={500}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={200}>Seletor</Table.Th>
            <Table.Th>Descrição</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

interface VariablesTableProps {
  data: StylesApiVar;
}

export function VariablesTable({ data }: VariablesTableProps) {
  const rows: React.ReactNode[] = [];

  Object.entries(data).forEach(([selector, vars]) => {
    Object.entries(vars).forEach(([variable, description]) => {
      rows.push(
        <Table.Tr key={`${selector}-${variable}`}>
          <Table.Td>
            <Code fz="sm">{selector}</Code>
          </Table.Td>
          <Table.Td>
            <Code fz="sm" c="blue">{variable}</Code>
          </Table.Td>
          <Table.Td>
            <Text fz="sm" c="dimmed">{description}</Text>
          </Table.Td>
        </Table.Tr>
      );
    });
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={150}>Seletor</Table.Th>
            <Table.Th w={280}>Variável CSS</Table.Th>
            <Table.Th>Descrição</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

interface ModifiersTableProps {
  data: StylesApiModifier[];
}

export function ModifiersTable({ data }: ModifiersTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const rows = data.map((mod, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Code fz="sm">{mod.modifier}</Code>
      </Table.Td>
      <Table.Td>
        <Code fz="sm">{mod.selector}</Code>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" c="dimmed">{mod.condition}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={200}>Modificador</Table.Th>
            <Table.Th w={150}>Seletor</Table.Th>
            <Table.Th>Condição</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

interface StylesApiTableProps {
  component: string;
  data: Record<string, StylesApiData>;
}

export function StylesApiTable({ component, data }: StylesApiTableProps) {
  const componentData = data[component];

  if (!componentData) {
    return (
      <Text c="dimmed" fz="sm">
        Nenhuma documentação de Styles API encontrada para {component}
      </Text>
    );
  }

  return (
    <div>
      <Title order={4} mb="sm">Seletores</Title>
      <Text fz="sm" c="dimmed" mb="md">
        Use estes seletores com a prop <Code>classNames</Code> para estilizar elementos internos.
      </Text>
      <SelectorsTable data={componentData.selectors} />

      {componentData.vars && Object.keys(componentData.vars).length > 0 && (
        <>
          <Title order={4} mt="xl" mb="sm">Variáveis CSS</Title>
          <Text fz="sm" c="dimmed" mb="md">
            Use estas variáveis com a prop <Code>vars</Code> ou em CSS para customizar estilos.
          </Text>
          <VariablesTable data={componentData.vars} />
        </>
      )}

      {componentData.modifiers && componentData.modifiers.length > 0 && (
        <>
          <Title order={4} mt="xl" mb="sm">Modificadores de dados</Title>
          <Text fz="sm" c="dimmed" mb="md">
            Atributos data-* aplicados aos elementos baseados no estado do componente.
          </Text>
          <ModifiersTable data={componentData.modifiers} />
        </>
      )}
    </div>
  );
}

interface StylesApiTablesListProps {
  components: string[];
  data: Record<string, StylesApiData>;
}

export function StylesApiTablesList({ components, data }: StylesApiTablesListProps) {
  return (
    <>
      {components.map((component) => (
        <div key={component} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Title order={3} mb="md">{component}</Title>
          <StylesApiTable component={component} data={data} />
        </div>
      ))}
    </>
  );
}
