import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Card, Flex, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState } from 'react';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseJsonSchemaEditor } from './JsonSchemaEditor';
import { JSONSchema7 } from './ArchbaseJsonSchemaEditor.types';

interface ArchbaseJsonSchemaEditorExampleProps {
  data?: JSONSchema7;
  readonly?: boolean;
}

const ArchbaseJsonSchemaEditorExample = ({ data, readonly }: ArchbaseJsonSchemaEditorExampleProps) => {
  const [schema, setSchema] = useState<JSONSchema7 | undefined>(data ? data : undefined);
  const [isValidSchema, setIsValidSchema] = useState<boolean>(true);

  return (
    <Flex direction="column">
      <Card shadow="sm" padding="lg" radius="md" withBorder m={20}>
        <Card.Section withBorder inheritPadding py="xs" mb="1rem">
          <Group justify="space-between">
            <Text fw={500}>JSON Schema Editor Component</Text>
          </Group>
        </Card.Section>
        <ScrollArea h={300}>
          <Badge color={isValidSchema ? 'green' : 'red'}>{isValidSchema ? 'Schema Válido' : 'Schema Inválido'}</Badge>
          <ArchbaseJsonSchemaEditor
            rootSchema={schema}
            onRootSchemaChange={(r, isValid) => {
              setSchema(r);
              setIsValidSchema(isValid);
              console.log(r, isValid);
            }}
            defaultRootSchema={data}
            readOnly={readonly}
          />
        </ScrollArea>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder m={20} mt={0}>
        <Card.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            <Text fw={500}>Schema do JSON</Text>
          </Group>
        </Card.Section>
        <ScrollArea h={300}>
          <ArchbaseObjectInspector data={schema} />
        </ScrollArea>
      </Card>
    </Flex>
  );
};

const initialSchemaWithData: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: '#/io/knack/avro/item',
  type: 'object',
  title: 'Item',
  description: 'The schema for item info.',
  required: ['id', 'name'],
  properties: {
    id: {
      $id: '#/string',
      type: 'string',
      title: 'string',
      description: 'The unique identifier of the item.',
    },
    name: {
      $id: '#/string',
      type: 'string',
      title: 'string',
      description: 'The display name of the item.',
    },
    info: {
      $id: '#/io/knack/avro/info',
      type: 'object',
      title: 'info',
      description: 'The info for the item.',
      required: ['timestamp', 'active'],
      properties: {
        timestamp: {
          $id: '#/long',
          type: 'number',
          title: 'long',
          description: 'The info timestamp.',
        },
        active: {
          $id: '#/boolean',
          type: 'boolean',
          title: 'boolean',
          description: 'The info active flag',
        },
        notes: {
          $id: '#/string',
          type: 'string',
          title: 'string',
          description: 'The display name of the item.',
        },
      },
    },
    tags: {
      $id: '#/array',
      type: 'array',
      title: 'array',
      description: 'Tags for grouping and filtering items.',
      items: {
        $id: '#/string',
        type: 'string',
        title: 'string',
        description: '',
      },
    },
    boxes: {
      $id: '#/array',
      type: 'array',
      title: 'array',
      description: 'Boxes this item supports',
      items: {
        $id: '#/io/knack/avro/box/record',
        type: 'object',
        title: 'boxRecord',
        description: '',
        required: ['height', 'width'],
        properties: {
          height: {
            $id: '#/int',
            type: 'integer',
            title: 'int',
            description: 'The box height.',
          },
          width: {
            $id: '#/int',
            type: 'integer',
            title: 'int',
            description: 'The box width.',
          },
          color: {
            $id: '#/string',
            type: 'string',
            title: 'string',
            description: 'The box color.',
          },
        },
      },
    },
  },
};

const meta: Meta<typeof ArchbaseJsonSchemaEditor> = {
  title: 'Editores/JsonSchemaEditor',
  component: ArchbaseJsonSchemaEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseJsonSchemaEditor é um editor visual de JSON Schema.

## Características
- Criação visual de JSON Schema
- Suporte a tipos: string, number, boolean, object, array
- Validação em tempo real
- Propriedades required
- Descrições e títulos
- Modo somente leitura
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseJsonSchemaEditor>;

export const NovoJsonSchema: Story = {
  name: 'Novo JsonSchema',
  render: () => <ArchbaseJsonSchemaEditorExample />,
};

export const ComDados: Story = {
  name: 'JsonSchema com dados',
  render: () => <ArchbaseJsonSchemaEditorExample data={initialSchemaWithData} />,
};

export const SomenteLeitura: Story = {
  name: 'Somente Leitura',
  render: () => <ArchbaseJsonSchemaEditorExample data={initialSchemaWithData} readonly={true} />,
};
