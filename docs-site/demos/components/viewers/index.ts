import type { MantineDemo } from '@mantinex/demo';
import { ArchbasePDFViewerUsage } from './ArchbasePDFViewerUsage';
import { ArchbasePDFViewerWithDataSource } from './ArchbasePDFViewerWithDataSource';

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
