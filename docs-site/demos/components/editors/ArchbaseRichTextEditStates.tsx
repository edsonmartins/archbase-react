import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseRichTextEdit } from '@archbase/components';

const initialContent = `
<h2>Título do Artigo</h2>
<p>Este é um parágrafo com <strong>negrito</strong>, <em>itálico</em> e <u>sublinhado</u>.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
<p>Texto com cores: <span style="color: red;">vermelho</span>, <span style="color: blue;">azul</span>, <span style="color: green;">verde</span>.</p>
`;

export function ArchbaseRichTextEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseRichTextEdit
        label="Editor Normal"
        value={initialContent}
        height="200px"
      />

      {/* Somente leitura */}
      <ArchbaseRichTextEdit
        label="Somente Leitura"
        value={initialContent}
        readOnly
        height="150px"
      />

      {/* Desabilitado */}
      <ArchbaseRichTextEdit
        label="Desabilitado"
        value={initialContent}
        disabled
        height="150px"
      />

      {/* Sem toolbar */}
      <ArchbaseRichTextEdit
        label="Sem Toolbar"
        value="<p>Editor sem barra de ferramentas</p>"
        hideToolbar
        height="150px"
      />

      {/* Com erro */}
      <ArchbaseRichTextEdit
        label="Com Erro"
        value="<p>Conteúdo com erro</p>"
        error="O conteúdo excede o limite permitido"
        height="150px"
      />

      {/* Obrigatório */}
      <ArchbaseRichTextEdit
        label="Obrigatório"
        required
        height="150px"
      />
    </Stack>
  );
}
