import type { CSSProperties, ReactNode } from 'react';
import type { IArchbaseDataSourceBase } from '@archbase/data';

export type SpreadsheetFileType = 'csv' | 'xlsx' | 'xls' | 'all';

export interface SpreadsheetField {
  key: string;
  label: string;
  required?: boolean;
  fieldType?: 'text' | 'number' | 'date' | 'email' | 'boolean' | 'select';
  options?: string[];
  validations?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
  };
}

export interface SpreadsheetRow {
  [key: string]: any;
}

export interface ArchbaseSpreadsheetImportProps<T = any> {
  dataSource?: IArchbaseDataSourceBase<T>;
  onDataLoaded?: (data: T[]) => void;
  onRowAdded?: (row: T) => void;
  fields?: SpreadsheetField[];
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  allowedFileTypes?: SpreadsheetFileType[];
  maxFileSize?: number; // in bytes
  maxRows?: number;
  customHeaderComponent?: ReactNode;
  customButtonComponent?: ReactNode;
  translations?: {
    uploadStep?: string;
    selectFile?: string;
    dragDrop?: string;
    supportedFormats?: string;
    reviewStep?: string;
    reviewDescription?: string;
    confirmStep?: string;
    confirmDescription?: string;
    successStep?: string;
    successDescription?: string;
    uploadButton?: string;
    nextButton?: string;
    backButton?: string;
    confirmButton?: string;
    doneButton?: string;
    closeButton?: string;
    invalidRow?: string;
    requiredField?: string;
    rowsAdded?: string;
    rowsSkipped?: string;
  };
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
  initialData?: SpreadsheetRow[];
  mapRows?: (rows: SpreadsheetRow[]) => T[];
  validationCallback?: (row: SpreadsheetRow, index: number) => { valid: boolean; errors?: string[] };
}
