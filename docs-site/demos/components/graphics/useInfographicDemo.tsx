import React, { useEffect, useRef } from 'react';
import { Container, Title, Text, Stack, Button, Code } from '@mantine/core';
import { useInfographic } from '@archbase/graphics';

export function useInfographicDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { infographic, isLoading, error, render, destroy } = useInfographic({
    width: '100%',
    height: '300px',
    editable: false,
  });

  useEffect(() => {
    if (infographic && containerRef.current) {
      import('@antv/infographic').then(({ Infographic }) => {
        const instance = new Infographic({
          container: containerRef.current,
          width: '100%',
          height: '300px',
        });

        const spec = `infographic card-simple
data
  items:
    - label: Total de Vendas
      value: R$ 125.430,00
    - label: Novos Clientes
      value: 1.234
    - label: Taxa de Conversão
      value: 12,5%
`;

        instance.render(spec);
      });
    }

    return () => {
      destroy();
    };
  }, [infographic, destroy]);

  const handleRenderNew = () => {
    if (infographic) {
      const newSpec = `infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Aprovado
      desc: Cliente aprovou
    - label: Produção
      desc: Em andamento
    - label: Entrega
      desc: Pendente
`;
      render(newSpec);
    }
  };

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Hook useInfographic</Title>
      <Text size="sm">Gerenciamento programático de infográficos</Text>

      {isLoading && (
        <Text size="sm" c="dimmed">
          Carregando...
        </Text>
      )}

      {error && (
        <Text size="sm" c="red">
          Erro: {error.message}
        </Text>
      )}

      <Container
        style={{
          background: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
      </Container>

      <Button onClick={handleRenderNew} disabled={!infographic}>
        Renderizar Novo Infográfico
      </Button>

      <Code block>{`const { infographic, render, isLoading } = useInfographic({
  width: '100%',
  height: '300px',
});

useEffect(() => {
  if (infographic) {
    render(\`infographic list-row-simple-horizontal-arrow\`);
  }
}, [infographic]);`}</Code>
    </Stack>
  );
}
