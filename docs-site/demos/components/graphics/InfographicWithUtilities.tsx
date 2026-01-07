import React from 'react';
import { Container, Title, Text, Stack, Tabs } from '@mantine/core';
import { InfographicRenderer } from '@archbase/graphics';
import {
  createProcessInfographic,
  createTimelineInfographic,
  createMetricCard,
  INFGRAPHIC_TEMPLATES,
} from '@archbase/graphics';

export function InfographicWithUtilities() {
  const processSpec = createProcessInfographic([
    { label: 'Discovery', desc: 'Levantamento de requisitos' },
    { label: 'Design', desc: 'Criação de protótipos' },
    { label: 'Development', desc: 'Implementação' },
    { label: 'Testing', desc: 'QA e validação' },
    { label: 'Launch', desc: 'Deploy em produção' },
  ]);

  const timelineSpec = createTimelineInfographic([
    { label: '2024 Q1', desc: 'Início do projeto', date: 'Jan-Mar' },
    { label: '2024 Q2', desc: 'MVP lançado', date: 'Abr-Jun' },
    { label: '2024 Q3', desc: 'Expansão de features', date: 'Jul-Set' },
    { label: '2024 Q4', desc: 'Versão estável', date: 'Out-Dez' },
  ]);

  const metricSpec = createMetricCard('Receita Total', 'R$ 1.250.000', 'Crescimento de 25%');

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Utilitários de Infográfico</Title>
      <Text size="sm">Funções auxiliares para criar infográficos comuns</Text>

      <Tabs defaultValue="process">
        <Tabs.List>
          <Tabs.Tab value="process">Processo</Tabs.Tab>
          <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
          <Tabs.Tab value="metric">Métrica</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="process">
          <Container
            style={{
              background: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '16px',
            }}
          >
            <InfographicRenderer
              width="100%"
              height="300px"
              specification={processSpec}
            />
          </Container>
        </Tabs.Panel>

        <Tabs.Panel value="timeline">
          <Container
            style={{
              background: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '16px',
            }}
          >
            <InfographicRenderer
              width="100%"
              height="300px"
              specification={timelineSpec}
            />
          </Container>
        </Tabs.Panel>

        <Tabs.Panel value="metric">
          <Container
            style={{
              background: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '16px',
            }}
          >
            <InfographicRenderer
              width="100%"
              height="200px"
              specification={metricSpec}
            />
          </Container>
        </Tabs.Panel>
      </Tabs>

      <Text size="xs" c="dimmed">
        Templates disponíveis: {Object.values(INFGRAPHIC_TEMPLATES).join(', ')}
      </Text>
    </Stack>
  );
}
