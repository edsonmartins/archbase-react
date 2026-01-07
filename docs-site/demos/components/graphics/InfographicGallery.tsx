import React, { useState } from 'react';
import { Container, Title, Text, Stack, Tabs, Card, SimpleGrid } from '@mantine/core';
import { InfographicRenderer } from '@archbase/graphics';

export function InfographicGallery() {
  const [selectedTemplate, setSelectedTemplate] = useState('list-horizontal');

  const templates = [
    {
      id: 'list-horizontal',
      name: 'Lista Horizontal',
      description: 'Processo sequencial com setas',
      spec: `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Discovery
      desc: Pesquisa e descoberta
    - label: Design
      desc: Criação de protótipos
    - label: Build
      desc: Desenvolvimento
    - label: Test
      desc: QA e testes
    - label: Deploy
      desc: Lançamento
`,
    },
    {
      id: 'list-vertical',
      name: 'Lista Vertical',
      description: 'Fluxo de cima para baixo',
      spec: `infographic list-row-simple-vertical-arrow
data
  items:
    - label: Requisitos
      desc: Levantamento inicial
    - label: Análise
      desc: Viabilidade técnica
    - label: Prototipação
      desc: Mockups e wireframes
    - label: Desenvolvimento
      desc: Implementação
`,
    },
    {
      id: 'timeline',
      name: 'Timeline',
      description: 'Linha do tempo vertical',
      spec: `infographic timeline-simple-vertical
data
  items:
    - label: Q1 2024
      desc: Planejamento estratégico
    - label: Q2 2024
      desc: Desenvolvimento MVP
    - label: Q3 2024
      desc: Beta testing
    - label: Q4 2024
      desc: Lançamento oficial
`,
    },
    {
      id: 'card',
      name: 'Card Simples',
      description: 'Cartão de destaque',
      spec: `infographic card-simple
data
  items:
    - label: Receita Total
      value: R$ 2.5M
      desc: Crescimento de 35%
    - label: Novos Clientes
      value: 1.450
      desc: +20% vs ano anterior
    - label: Satisfação
      value: 98%
      desc: NPS 85
`,
    },
    {
      id: 'mindmap',
      name: 'Mindmap',
      description: 'Mapa mental simples',
      spec: `infographic mindmap-simple
data
  items:
    - label: Projeto
      desc: Centro do projeto
    - label: Frontend
      desc: React, TypeScript
    - label: Backend
      desc: Node.js, API
    - label: Database
      desc: PostgreSQL, Redis
`,
    },
    {
      id: 'flowchart',
      name: 'Fluxograma',
      description: 'Diagrama de fluxo',
      spec: `infographic flowchart-simple
data
  items:
    - label: Início
      desc: Ponto de entrada
    - label: Processamento
      desc: Análise de dados
    - label: Decisão
      desc: Validação
    - label: Fim
      desc: Conclusão
`,
    },
  ];

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Galeria de Templates</Title>
      <Text size="sm">Explore diferentes tipos de infográficos disponíveis</Text>

      <Tabs value={selectedTemplate} onChange={(value) => setSelectedTemplate(value as string)}>
        <Tabs.List>
          {templates.map((t) => (
            <Tabs.Tab key={t.id} value={t.id}>
              {t.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {templates.map((template) => (
          <Tabs.Panel key={template.id} value={template.id}>
            <Stack gap="sm" mt="md">
              <Text size="sm" c="dimmed">
                {template.description}
              </Text>
              <Container
                style={{
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <InfographicRenderer
                  width="100%"
                  height="350px"
                  specification={template.spec}
                />
              </Container>
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
}
