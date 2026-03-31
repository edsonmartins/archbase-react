import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseDiffViewer } from '@archbase/components';

const oldCode = `function saudacao(nome) {
  console.log("Olá, " + nome);
  return nome;
}`;

const newCode = `function saudacao(nome: string): string {
  const mensagem = \`Olá, \${nome}!\`;
  console.log(mensagem);
  return mensagem;
}`;

export function ArchbaseDiffViewerUsage() {
  return (
    <Stack gap="md" p="md">
      <ArchbaseDiffViewer
        oldValue={oldCode}
        newValue={newCode}
        splitView={true}
        leftTitle="Versão Anterior"
        rightTitle="Versão Atual"
      />
    </Stack>
  );
}
