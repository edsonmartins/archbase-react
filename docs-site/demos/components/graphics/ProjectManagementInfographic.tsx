import React from 'react';
import { Container, Title, Text, Stack, Tabs } from '@mantine/core';
import { InfographicRenderer, createProcessInfographic, createTimelineInfographic } from '@archbase/graphics';

export function ProjectManagementInfographic() {
  const sdlcSpec = createProcessInfographic([
    { label: 'Planejamento', desc: 'Definição de escopo e requisitos' },
    { label: 'Análise', desc: 'Levantamento técnico e viabilidade' },
    { label: 'Design', desc: 'Arquitetura e UI/UX' },
    { label: 'Desenvolvimento', desc: 'Implementação das features' },
    { label: 'Testes', desc: 'QA e validação' },
    { label: 'Deploy', desc: 'Implementação em produção' },
    { label: 'Manutenção', desc: 'Suporte e evolução' },
  ]);

  const agileSpec = createTimelineInfographic([
    { label: 'Sprint 1', desc: 'Backlog e Planning', date: 'Semana 1' },
    { label: 'Sprint 2', desc: 'Desenvolvimento Core', date: 'Semana 2' },
    { label: 'Sprint 3', desc: 'Integração', date: 'Semana 3' },
    { label: 'Sprint 4', desc: 'Testes e Bugfix', date: 'Semana 4' },
    { label: 'Sprint 5', desc: 'Release Candidate', date: 'Semana 5' },
    { label: 'Sprint 6', desc: 'Deploy Final', date: 'Semana 6' },
  ]);

  const roadmapSpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Q1
      desc: Fundação e MVP
    - label: Q2
      desc: Features Core
    - label: Q3
      desc: Escala e Otimização
    - label: Q4
      desc: Expansão e Novos Mercados
`;

  const userJourneySpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Descoberta
      desc: Encontra o produto
    - label: Interesse
      desc: Avalia propostas
    - label: Consideração
      desc: Compara opções
    - label: Conversão
      desc: Realiza compra
    - label: Retenção
      desc: Torna-se cliente fiel
    - label: Advocacia
      desc: Indica para outros
`;

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Gerenciamento de Projetos</Title>
      <Text size="sm">Infográficos para planejamento, roadmaps e metodologias ágeis</Text>

      <Tabs defaultValue="sdlc">
        <Tabs.List>
          <Tabs.Tab value="sdlc">Ciclo de Vida</Tabs.Tab>
          <Tabs.Tab value="agile">Ágil/Sprints</Tabs.Tab>
          <Tabs.Tab value="roadmap">Roadmap</Tabs.Tab>
          <Tabs.Tab value="journey">Jornada do Usuário</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sdlc">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              SDLC - Software Development Life Cycle
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="300px" specification={sdlcSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="agile">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Planejamento de Sprints (6 semanas)
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="300px" specification={agileSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="roadmap">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Roadmap Anual do Produto
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="200px" specification={roadmapSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="journey">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Jornada do Cliente (Customer Journey)
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="300px" specification={userJourneySpec} />
            </Container>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
