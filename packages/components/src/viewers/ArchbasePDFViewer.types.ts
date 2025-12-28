import type { CSSProperties, ReactNode } from 'react';
import type { IArchbaseDataSourceBase } from '@archbase/data';

export type PDFSource =
  | string  // URL
  | Uint8Array
  | { url: string }
  | { data: string | Uint8Array };

export type PDFRenderMode = 'canvas' | 'svg' | 'none';
export type PDFTextLayerMode = 'legacy' | 'typedArray';

export interface PDFAnnotation {
  id: string;
  type: 'highlight' | 'comment' | 'bookmark';
  pageIndex: number;
  rect: { x: number; y: number; width: number; height: number };
  content?: string;
  color?: string;
  author?: string;
  createdAt: Date;
}

export interface PDFToolbarActions {
  zoomIn?: boolean;
  zoomOut?: boolean;
  nextPage?: boolean;
  previousPage?: boolean;
  firstPage?: boolean;
  lastPage?: boolean;
  rotate?: boolean;
  download?: boolean;
  print?: boolean;
  pageNavigation?: boolean;
}

export interface ArchbasePDFViewerProps<T, ID> {
  // DataSource Integration
  dataSource?: IArchbaseDataSourceBase<T>;
  dataField?: string;

  // PDF Source
  file?: PDFSource;
  onLoadSuccess?: (pdf: any) => void;
  onLoadError?: (error: Error) => void;

  // Display
  width?: string | number;
  height?: string | number;
  page?: number;
  scale?: number;
  rotation?: number;
  renderMode?: PDFRenderMode;
  textLayer?: boolean;

  // Toolbar
  toolbar?: boolean | PDFToolbarActions;
  toolbarPosition?: 'top' | 'bottom' | 'both';

  // Annotations
  annotations?: PDFAnnotation[];
  onAnnotationAdd?: (annotation: PDFAnnotation) => void;
  onAnnotationRemove?: (annotationId: string) => void;
  onAnnotationUpdate?: (annotationId: string, updates: Partial<PDFAnnotation>) => void;
  enableAnnotations?: boolean;
  showAnnotationsList?: boolean;

  // Styling
  style?: CSSProperties;
  className?: string;

  // Events
  onPageChange?: (currentPage: number, totalPages: number) => void;
  onZoomChange?: (scale: number) => void;

  // Accessibility
  title?: string;
  ariaLabel?: string;

  // States
  disabled?: boolean;
  loading?: ReactNode;
  error?: ReactNode;
  noData?: ReactNode;
}
