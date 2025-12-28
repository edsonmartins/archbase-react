import { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Group, Paper, Text, LoadingOverlay, Stack, ScrollArea } from '@mantine/core';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useArchbaseDataSourceListener } from '@archbase/data';
import { useArchbaseTranslation } from '@archbase/core';
import { ArchbasePDFViewerToolbar } from './ArchbasePDFViewer.toolbar';
import {
  ArchbasePDFAnnotations,
  ArchbasePDFAnnotationsList,
} from './ArchbasePDFViewer.annotations';
import type {
  ArchbasePDFViewerProps,
  PDFSource,
} from './ArchbasePDFViewer.types';

// Setup worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

export function ArchbasePDFViewer<T, ID>({
  dataSource,
  dataField,
  file: fileProp,
  width = '100%',
  height = 700,
  page: initialPage = 1,
  scale: initialScale = 1.0,
  rotation: initialRotation = 0,
  toolbar = true,
  textLayer = true,
  renderMode = 'canvas',
  toolbarPosition = 'top',
  onPageChange,
  onZoomChange,
  onLoadSuccess,
  onLoadError,
  annotations = [],
  onAnnotationAdd,
  onAnnotationRemove,
  onAnnotationUpdate,
  enableAnnotations = false,
  showAnnotationsList = false,
  disabled,
  loading,
  error,
  style,
  className,
}: ArchbasePDFViewerProps<T, ID>) {
  const { t } = useArchbaseTranslation();

  // State for page dimensions (needed for annotations)
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const pageRef = useRef<HTMLDivElement>(null);

  // DataSource V1/V2 compatibility
  const {
    currentValue: pdfFile,
    loadDataSourceFieldValue,
    isReadOnly,
  } = useArchbaseV1V2Compatibility<PDFSource>(
    'ArchbasePDFViewer',
    dataSource,
    dataField,
    fileProp
  );

  // Load initial value
  useEffect(() => {
    if (dataSource && dataField) {
      loadDataSourceFieldValue();
    }
  }, [dataSource, dataField, loadDataSourceFieldValue]);

  // DataSource event listener
  const dataSourceEvent = useCallback((event: any) => {
    // Eventos que requerem recarregamento do PDF
    if (
      event.type === 'dataChanged' ||
      event.type === 'recordChanged' ||
      event.type === 'afterScroll' ||
      event.type === 'afterCancel' ||
      event.type === 'afterEdit'
    ) {
      loadDataSourceFieldValue();
    }
  }, [loadDataSourceFieldValue]);

  useArchbaseDataSourceListener({
    dataSource,
    listener: dataSourceEvent,
  });

  // Internal state
  const [pdf, setPdf] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(initialRotation);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  // Ref para container
  const containerRef = useRef<HTMLDivElement>(null);

  // Update page dimensions when page renders
  const handlePageRender = useCallback(() => {
    if (pageRef.current) {
      const rect = pageRef.current.getBoundingClientRect();
      setPageDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  // PDF handlers
  const handleLoadSuccess = useCallback((pdfDocument: any) => {
    setPdf(pdfDocument);
    setTotalPages(pdfDocument.numPages);
    setIsLoading(false);
    setLoadError(null);

    if (onLoadSuccess) {
      onLoadSuccess(pdfDocument);
    }
  }, [onLoadSuccess]);

  const handleLoadError = useCallback((error: Error) => {
    setIsLoading(false);
    setLoadError(error);

    if (onLoadError) {
      onLoadError(error);
    }
  }, [onLoadError]);

  // Navigation handlers
  const zoomIn = useCallback(() => {
    const newScale = Math.min(scale + 0.25, 3.0);
    setScale(newScale);
    onZoomChange?.(newScale);
  }, [scale, onZoomChange]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(scale - 0.25, 0.25);
    setScale(newScale);
    onZoomChange?.(newScale);
  }, [scale, onZoomChange]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, totalPages);
    }
  }, [currentPage, onPageChange]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
    onPageChange?.(1, totalPages);
  }, [onPageChange, totalPages]);

  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
    onPageChange?.(totalPages, totalPages);
  }, [onPageChange, totalPages]);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(() => {
    const actualFile = pdfFile || fileProp;
    if (typeof actualFile === 'string') {
      const link = document.createElement('a');
      link.href = actualFile;
      link.download = actualFile.split('/').pop() || 'document.pdf';
      link.click();
    }
  }, [pdfFile, fileProp]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const actualFile = pdfFile || fileProp;
  const isDisabled = disabled || isReadOnly;

  return (
    <Stack gap="xs" style={style} className={className}>
      {/* Top Toolbar */}
      {toolbar && toolbarPosition !== 'bottom' && (
        <Paper withBorder p="xs">
          <ArchbasePDFViewerToolbar
            currentPage={currentPage}
            totalPages={totalPages}
            scale={scale}
            rotation={rotation}
            toolbarActions={toolbar === true ? undefined : toolbar}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            onFirstPage={firstPage}
            onLastPage={lastPage}
            onRotate={rotate}
            onDownload={handleDownload}
            onPrint={handlePrint}
            disabled={isDisabled}
          />
        </Paper>
      )}

      {/* PDF Viewer with Annotations List */}
      <Group gap="xs" align="flex-start">
        {/* Annotations List Sidebar */}
        {showAnnotationsList && enableAnnotations && (
          <Paper withBorder p="xs" style={{ width: 250 }}>
            <ScrollArea.Autosize mah={height} type="always">
              <ArchbasePDFAnnotationsList
                annotations={annotations}
                onAnnotationRemove={onAnnotationRemove}
                disabled={isDisabled}
              />
            </ScrollArea.Autosize>
          </Paper>
        )}

        {/* PDF Viewer */}
        <Paper
          withBorder
          p="md"
          style={{ width: showAnnotationsList ? 'calc(100% - 270px)' : '100%', height, overflow: 'auto' }}
          ref={containerRef}
        >
          <LoadingOverlay visible={isLoading} />
          {!actualFile ? (
            <Box p="xl">
              <Text ta="center" c="dimmed">
                {String(t('No PDF document loaded'))}
              </Text>
            </Box>
          ) : loadError ? (
            <Box p="xl">
              <Text ta="center" c="red">
                {error || String(t('Error loading PDF'))}
              </Text>
            </Box>
          ) : (
            <Group justify="center" style={{ position: 'relative' }}>
              <Document
                file={actualFile as any}
                onLoadSuccess={handleLoadSuccess}
                onLoadError={handleLoadError}
                loading={loading || String(t('Loading PDF...'))}
                error={error || String(t('Error loading PDF'))}
              >
                <Box ref={pageRef} style={{ position: 'relative' }}>
                  <Page
                    pageNumber={currentPage}
                    scale={scale}
                    renderTextLayer={textLayer}
                    onRenderSuccess={handlePageRender}
                  />
                  {/* Annotations Layer */}
                  {enableAnnotations && pageDimensions.width > 0 && (
                    <ArchbasePDFAnnotations
                      annotations={annotations}
                      onAnnotationAdd={onAnnotationAdd}
                      onAnnotationRemove={onAnnotationRemove}
                      onAnnotationUpdate={onAnnotationUpdate}
                      disabled={isDisabled}
                      pageIndex={currentPage - 1}
                      pageWidth={pageDimensions.width}
                      pageHeight={pageDimensions.height}
                    />
                  )}
                </Box>
              </Document>
            </Group>
          )}
        </Paper>
      </Group>

      {/* Bottom Toolbar */}
      {toolbar && toolbarPosition !== 'top' && (
        <Paper withBorder p="xs">
          <ArchbasePDFViewerToolbar
            currentPage={currentPage}
            totalPages={totalPages}
            scale={scale}
            rotation={rotation}
            toolbarActions={toolbar === true ? undefined : toolbar}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onNextPage={nextPage}
            onPreviousPage={previousPage}
            onFirstPage={firstPage}
            onLastPage={lastPage}
            onRotate={rotate}
            onDownload={handleDownload}
            onPrint={handlePrint}
            disabled={isDisabled}
          />
        </Paper>
      )}
    </Stack>
  );
}
