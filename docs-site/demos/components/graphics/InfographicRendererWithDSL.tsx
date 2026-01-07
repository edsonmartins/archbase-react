import React, { useState } from 'react';
import { Container, Title, Text, Stack, Select, Button } from '@mantine/core';
import { InfographicRenderer } from '@archbase/graphics';

const templates = [
  { value: 'list-row-simple-horizontal-arrow', label: 'Lista Horizontal (Setas)' },
  { value: 'list-row-simple-horizontal-line', label: 'Lista Horizontal (Linhas)' },
  { value: 'list-row-simple-vertical-arrow', label: 'Lista Vertical (Setas)' },
  { value: 'timeline-simple-vertical', label: 'Timeline Vertical' },
  { value: 'card-simple', label: 'Cartão Simples' },
];

export function InfographicRendererWithDSL() {
  const [selectedTemplate, setSelectedTemplate] = useState('list-row-simple-horizontal-arrow');

  const getSpecification = (template: string) => {
    const baseSpec = (items: string) => `infographic ${template}
data
  items:
${items}`;

    if (template.includes('list-row')) {
      return baseSpec(`
    - label: Q1
      desc: Planejamento
    - label: Q2
      desc: Execução
    - label: Q3
      desc: Revisão
    - label: Q4
      desc: Entrega`);
    }

    if (template.includes('timeline')) {
      return baseSpec(`
    - label: Jan
      desc: Início do projeto
    - label: Fev
      desc: Desenvolvimento
    - label: Mar
      desc: Testes
    - label: Abr
      desc: Lançamento`);
    }

    return baseSpec(`
    - label: Título
      desc: Descrição do card`);
  };

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Templates DSL</Title>
      <Text size="sm">Selecione diferentes templates para visualizar</Text>

      <Select
        label="Template"
        value={selectedTemplate}
        onChange={(value) => setSelectedTemplate(value || 'list-row-simple-horizontal-arrow')}
        data={templates}
        mb="md"
      />

      <Container
        style={{
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <InfographicRenderer
          width="100%"
          height="300px"
          specification={getSpecification(selectedTemplate)}
        />
      </Container>
    </Stack>
  );
}
