import type { MantineDemo } from '@mantinex/demo';
import { ArchbasePDFViewerUsage } from './ArchbasePDFViewerUsage';
import { ArchbasePDFViewerWithDataSource } from './ArchbasePDFViewerWithDataSource';
import { ArchbaseDocViewerUsage } from './ArchbaseDocViewerUsage';
import { ArchbasePdfBuilderUsage } from './ArchbasePdfBuilderUsage';

// Usage Demo
const usageCode = `
import { ArchbasePDFViewer } from '@archbase/components';
import type { PDFAnnotation } from '@archbase/components';

function Demo() {
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);

  return (
    <ArchbasePDFViewer
      file="path/to/document.pdf"
      height={700}
      enableAnnotations={true}
      showAnnotationsList={true}
      annotations={annotations}
      onAnnotationAdd={(annotation) => setAnnotations([...annotations, annotation])}
      onAnnotationRemove={(id) => setAnnotations(annotations.filter(a => a.id !== id))}
      toolbar
      textLayer
    />
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: ArchbasePDFViewerUsage,
  code: usageCode,
};

// With DataSource Demo
const withDataSourceCode = `
import { ArchbasePDFViewer } from '@archbase/components';
import { ArchbaseDataSource } from '@archbase/data';

interface Document {
  id: string;
  name: string;
  url: string;
}

function Demo() {
  const [dataSource] = useState(() => {
    const ds = new ArchbaseDataSource<Document, string>({
      initialData: [
        { id: '1', name: 'Doc', url: 'path/to/doc.pdf' }
      ],
      idField: 'id',
    });
    ds.open();
    return ds;
  });

  return (
    <ArchbasePDFViewer
      dataSource={dataSource}
      dataField="url"
      height={700}
      toolbar
    />
  );
}
`;

export const withDataSource: MantineDemo = {
  type: 'code',
  component: ArchbasePDFViewerWithDataSource,
  code: withDataSourceCode,
};

// ---------------------------------------------------------------------------
// ArchbaseDocViewer
// ---------------------------------------------------------------------------

const docViewerUsageCode = `
import { ArchbaseDocViewer } from '@archbase/components';

function Demo() {
  return (
    <ArchbaseDocViewer
      uri="https://example.com/image.jpg"
      height={500}
      showToolbar
      label="Visualizador de Documentos"
      onDocumentLoad={() => console.log('Documento carregado')}
    />
  );
}
`;

export const docViewerUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseDocViewerUsage,
  code: docViewerUsageCode,
};

// ---------------------------------------------------------------------------
// ArchbasePdfBuilder
// ---------------------------------------------------------------------------

const pdfBuilderUsageCode = `
import { useRef } from 'react';
import { ArchbasePdfBuilder } from '@archbase/components';
import type { ArchbasePdfBuilderRef } from '@archbase/components';
import type { Template } from '@pdfme/common';

const myTemplate: Template = {
  basePdf: 'data:application/pdf;base64,...',
  schemas: [[
    { name: 'nome', type: 'text', position: { x: 20, y: 20 }, width: 100, height: 10 },
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
}
`;

export const pdfBuilderUsage: MantineDemo = {
  type: 'code',
  component: ArchbasePdfBuilderUsage,
  code: pdfBuilderUsageCode,
};
