import React, { useState } from 'react';
import { ArchbasePDFViewer } from '@archbase/components';
import type { PDFAnnotation } from '@archbase/components';

// Sample PDF URL (using a publicly available test PDF)
const SAMPLE_PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkeypldi-09-2010.pdf';

export function ArchbasePDFViewerUsage() {
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);

  const handleAnnotationAdd = (annotation: PDFAnnotation) => {
    setAnnotations((prev) => [...prev, annotation]);
  };

  const handleAnnotationRemove = (annotationId: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
  };

  return (
    <ArchbasePDFViewer
      file={SAMPLE_PDF_URL}
      height={700}
      enableAnnotations={true}
      showAnnotationsList={true}
      annotations={annotations}
      onAnnotationAdd={handleAnnotationAdd}
      onAnnotationRemove={handleAnnotationRemove}
      toolbar
      textLayer
    />
  );
}
