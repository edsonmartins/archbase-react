import React from 'react';
import { Container, Title, Text, Stack, Tabs } from '@mantine/core';
import { InfographicRenderer } from '@archbase/graphics';

export function TechStackInfographic() {
  const frontendSpec = `infographic card-simple
data
  items:
    - label: React
      value: Framework UI
      desc: Componentes reutilizáveis
    - label: TypeScript
      value: Tipagem Estática
      desc: Código type-safe
    - label: Tailwind
      value: Estilização
      desc: Utility-first CSS
    - label: Vite
      value: Build Tool
      desc: Dev experience
`;

  const backendSpec = `infographic card-simple
data
  items:
    - label: Node.js
      value: Runtime
      desc: JavaScript server-side
    - label: Express
      value: Framework
      desc: API REST
    - label: PostgreSQL
      value: Banco de Dados
      desc: Dados relacionais
    - label: Redis
      value: Cache
      desc: Performance
`;

  const devopsSpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Code
      desc: Push de código
    - label: Build
      desc: Compilação
    - label: Test
      desc: Testes automatizados
    - label: Deploy
      desc: Produção
    - label: Monitor
      desc: Observabilidade
`;

  const architectureSpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Client
      desc: React App
    - label: API Gateway
      desc: Nginx/Routes
    - label: Services
      desc: Microservices
    - label: Queue
      desc: RabbitMQ/Redis
    - label: Database
      desc: PostgreSQL/Mongo
`;

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Stack Tecnológico</Title>
      <Text size="sm">Visualização de arquiteturas e tecnologias</Text>

      <Tabs defaultValue="frontend">
        <Tabs.List>
          <Tabs.Tab value="frontend">Frontend</Tabs.Tab>
          <Tabs.Tab value="backend">Backend</Tabs.Tab>
          <Tabs.Tab value="devops">DevOps CI/CD</Tabs.Tab>
          <Tabs.Tab value="architecture">Arquitetura</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="frontend">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Stack Frontend Moderno
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="250px" specification={frontendSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="backend">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Stack Backend Scalável
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="250px" specification={backendSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="devops">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Pipeline CI/CD
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="250px" specification={devopsSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="architecture">
          <Stack gap="sm" mt="md">
            <Text size="sm" c="dimmed">
              Arquitetura de Microserviços
            </Text>
            <Container
              style={{
                background: '#f8f9fa',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <InfographicRenderer width="100%" height="250px" specification={architectureSpec} />
            </Container>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
