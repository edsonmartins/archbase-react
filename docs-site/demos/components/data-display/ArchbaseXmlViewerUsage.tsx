import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseXmlViewer } from '@archbase/components';

const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<configuracao>
  <aplicacao nome="Archbase" versao="3.0.0">
    <modulos>
      <modulo nome="components" ativo="true" />
      <modulo nome="security" ativo="true" />
      <modulo nome="layout" ativo="true" />
    </modulos>
    <banco-de-dados>
      <conexao tipo="postgresql">
        <host>localhost</host>
        <porta>5432</porta>
        <nome>archbase_db</nome>
      </conexao>
    </banco-de-dados>
  </aplicacao>
</configuracao>`;

export function ArchbaseXmlViewerUsage() {
  return (
    <Stack gap="md" p="md">
      <ArchbaseXmlViewer
        xml={sampleXml}
        formatXml
        showLineNumbers
        showCopyButton
      />
    </Stack>
  );
}
