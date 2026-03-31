import React from 'react';
import { ArchbaseDocViewer } from '@archbase/components';

const SAMPLE_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/800px-Camponotus_flavomarginatus_ant.jpg';

export function ArchbaseDocViewerUsage() {
  return (
    <ArchbaseDocViewer
      uri={SAMPLE_IMAGE_URL}
      height={500}
      showToolbar
      label="Visualizador de Documentos"
      description="Exemplo com imagem (suporta PDF, imagens e documentos Office)"
      onDocumentLoad={() => console.log('Documento carregado')}
      onDocumentError={(err) => console.error('Erro:', err)}
    />
  );
}
