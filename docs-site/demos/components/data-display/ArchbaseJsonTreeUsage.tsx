import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseJsonTree } from '@archbase/components';

const sampleData = {
  nome: 'Archbase React',
  versao: '3.0.0',
  licenca: 'MIT',
  dependencias: {
    react: '^18.0.0',
    mantine: '^7.0.0',
    typescript: '^5.0.0',
  },
  recursos: ['DataSource', 'Validação', 'Templates', 'i18n'],
  configuracao: {
    tema: {
      corPrimaria: '#228be6',
      modoEscuro: false,
    },
    api: {
      baseUrl: 'https://api.exemplo.com',
      timeout: 5000,
    },
  },
};

export function ArchbaseJsonTreeUsage() {
  return (
    <Stack gap="md" p="md">
      <ArchbaseJsonTree
        data={sampleData}
        defaultExpanded={true}
        maxDepth={3}
        clickToExpandNode
      />
    </Stack>
  );
}
