import React from 'react';
import { Container, Title, Text, Stack, Paper, Group, ThemeIcon } from '@mantine/core';
import { IconTrendingUp, IconUsers, IconShoppingCart, IconCoin } from '@tabler/icons-react';
import { InfographicRenderer, createMetricCard } from '@archbase/graphics';

export function BusinessMetricsInfographic() {
  const revenueSpec = `infographic card-simple
data
  items:
    - label: Receita Mensal
      value: R$ 1.250.000
      desc: Crescimento de 23%
    - label: Recorrência
      value: R$ 850.000
      desc: MRR positivo
    - label: Churn
      value: 2,1%
      desc: Abaixo da meta
`;

  const salesSpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Lead
      desc: 1.500 novos
    - label: Qualificado
      desc: 450 prospects
    - label: Proposta
      desc: 180 enviadas
    - label: Fechado
      desc: 72 vendas
`;

  const kpiSpec = `infographic card-simple
data
  items:
    - label: CAC
      value: R$ 450
      desc: Custo de aquisição
    - label: LTV
      value: R$ 4.500
      desc: Lifetime value
    - label: LTV:CAC
      value: 10:1
      desc: Ratio saudável
`;

  return (
    <Stack gap="xl" p="md">
      <Title order={4}>Métricas de Negócios</Title>
      <Text size="sm">Exemplos de dashboards de KPIs e métricas empresariais</Text>

      {/* Receita */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="green" size="sm">
            <IconCoin size={16} />
          </ThemeIcon>
          <Text fw={500}>Receita e Recorrência</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="200px" specification={revenueSpec} />
        </Container>
      </Paper>

      {/* Funil de Vendas */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="blue" size="sm">
            <IconShoppingCart size={16} />
          </ThemeIcon>
          <Text fw={500}>Funil de Vendas</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="200px" specification={salesSpec} />
        </Container>
      </Paper>

      {/* KPIs */}
      <Paper shadow="xs" p="md" withBorder>
        <Group mb="sm">
          <ThemeIcon color="orange" size="sm">
            <IconTrendingUp size={16} />
          </ThemeIcon>
          <Text fw={500}>Indicadores (CAC, LTV)</Text>
        </Group>
        <Container
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <InfographicRenderer width="100%" height="200px" specification={kpiSpec} />
        </Container>
      </Paper>
    </Stack>
  );
}
