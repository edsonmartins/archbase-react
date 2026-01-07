import React from 'react';
import { Container, Title, Text, Stack, Paper, Group, ThemeIcon } from '@mantine/core';
import { IconHeart, IconActivity, IconBrain, IconApple } from '@tabler/icons-react';
import { InfographicRenderer } from '@archbase/graphics';

export function HealthAndEducationInfographic() {
  const healthMetricsSpec = `infographic card-simple
data
  items:
    - label: Frequência Cardíaca
      value: 72 bpm
      desc: Em repouso
    - label: Pressão Arterial
      value: 120/80
      desc: Normal
    - label: IMC
      value: 22,5
      desc: Peso saudável
    - label: Sono
      value: 7,5h
      desc: Média diária
`;

  const workoutPlanSpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Aquecimento
      desc: 10 min alongamento
    - label: Cardio
      desc: 30 min corrida
    - label: Musculação
      desc: 45 min treino A
    - label: Resfriamento
      desc: 10 min alongamento
`;

  const learningPathSpec = `infographic timeline-simple-vertical
data
  items:
    - label: Semana 1-2
      desc: Fundamentos e HTML
    - label: Semana 3-4
      desc: CSS e Flexbox
    - label: Semana 5-6
      desc: JavaScript Básico
    - label: Semana 7-8
      desc: DOM e Eventos
    - label: Semana 9-10
      desc: React Intro
    - label: Semana 11-12
      desc: Projeto Final
`;

  const skillsMatrixSpec = `infographic card-simple
data
  items:
    - label: HTML/CSS
      value: Avançado
      desc: 95% de domínio
    - label: JavaScript
      value: Intermediário
      desc: 70% de domínio
    - label: React
      value: Intermediário
      desc: 60% de domínio
    - label: Node.js
      value: Básico
      desc: 30% de domínio
`;

  return (
    <Stack gap="xl" p="md">
      <Title order={4}>Saúde e Educação</Title>
      <Text size="sm">Exemplos de infográficos para área da saúde e educação</Text>

      {/* Saúde */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="red" size="sm">
            <IconHeart size={16} />
          </ThemeIcon>
          <Text fw={500}>Indicadores de Saúde</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="200px" specification={healthMetricsSpec} />
        </Container>
      </Paper>

      {/* Plano de Treino */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="orange" size="sm">
            <IconActivity size={16} />
          </ThemeIcon>
          <Text fw={500}>Plano de Treino</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="200px" specification={workoutPlanSpec} />
        </Container>
      </Paper>

      {/* Trilha de Aprendizado */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="blue" size="sm">
            <IconBrain size={16} />
          </ThemeIcon>
          <Text fw={500}>Trilha de Aprendizado (12 semanas)</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="280px" specification={learningPathSpec} />
        </Container>
      </Paper>

      {/* Matriz de Skills */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="grape" size="sm">
            <IconApple size={16} />
          </ThemeIcon>
          <Text fw={500}>Matriz de Habilidades</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="200px" specification={skillsMatrixSpec} />
        </Container>
      </Paper>
    </Stack>
  );
}
