import React from 'react';
import { Paper, Stack, Text, Code, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function ArchbasePdfBuilderUsage() {
  return (
    <Stack gap="md" p="md">
      <Alert icon={<IconInfoCircle size={16} />} title="Componente Interativo" color="blue">
        O ArchbasePdfBuilder utiliza o @pdfme/ui para fornecer um designer visual de templates PDF.
        Por ser um componente complexo que requer configuracao de templates, exibimos abaixo um exemplo
        de como configurar o componente.
      </Alert>

      <Paper withBorder p="md" radius="md">
        <Text size="sm" fw={600} mb="xs">Exemplo de uso basico:</Text>
        <Code block style={{ fontSize: 12 }}>
{`import { useRef } from 'react';
import { ArchbasePdfBuilder } from '@archbase/components';
import type { ArchbasePdfBuilderRef } from '@archbase/components';
import type { Template } from '@pdfme/common';

const myTemplate: Template = {
  basePdf: 'data:application/pdf;base64,...',
  schemas: [[
    { name: 'nome', type: 'text', position: { x: 20, y: 20 }, width: 100, height: 10 },
    { name: 'valor', type: 'text', position: { x: 20, y: 40 }, width: 100, height: 10 },
  ]],
};

function Demo() {
  const ref = useRef<ArchbasePdfBuilderRef>(null);

  return (
    <ArchbasePdfBuilder
      ref={ref}
      mode="designer"
      template={myTemplate}
      height={600}
      onTemplateChange={(t) => console.log('Template atualizado:', t)}
    />
  );
}`}
        </Code>
      </Paper>

      <Paper withBorder p="md" radius="md">
        <Text size="sm" fw={600} mb="xs">Modos disponiveis:</Text>
        <Stack gap="xs">
          <Text size="sm"><strong>designer</strong> - Editor visual de templates PDF (arrastar campos, definir posicoes)</Text>
          <Text size="sm"><strong>form</strong> - Formulario para preenchimento dos campos do template</Text>
          <Text size="sm"><strong>viewer</strong> - Visualizacao somente leitura do PDF gerado</Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
