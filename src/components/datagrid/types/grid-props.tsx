/**
 * Interface para props do modal de exportação
 */
export interface ExportModalProps {
  opened: boolean;
  onClose: () => void;
  onExport: (config: any) => void;
  columns: any[];
  defaultConfig?: Partial<any>;
}

/**
 * Interface para props do modal de impressão
 */
export interface PrintModalProps {
  opened: boolean;
  onClose: () => void;
  onPrint: (config: any) => void;
  columns: any[];
  defaultConfig?: Partial<any>;
}

/**
 * Interface para props de paginação
 */
export interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  showNavigationButtons?: boolean;
  showRecordInfo?: boolean;
  labels: {
    totalRecords?: string;
    pageSize?: string;
    currentPage?: string;
    of?: string;
  };
}

/**
 * Interface para props de pesquisa global
 */
export interface GlobalSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}


