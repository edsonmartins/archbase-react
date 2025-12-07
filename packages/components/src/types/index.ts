// Common component types and interfaces
import { CSSProperties, FocusEventHandler, RefObject } from 'react';
import { MantineSize } from '@mantine/core';
import { ArchbaseDataSource, IArchbaseDataSourceBase } from '@archbase/data';

/**
 * Base props for all Archbase components that support DataSource integration
 */
export interface ArchbaseComponentProps<T = any, ID = any> {
  /** DataSource for data binding (V1 ou V2) */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Field name for data binding */
  dataField?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is read-only */
  readOnly?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Custom CSS styles */
  style?: CSSProperties;
  /** Component size */
  size?: MantineSize;
  /** Component width */
  width?: string | number;
  /** Callback when value changes */
  onChangeValue?: (value: any, event: any) => void;
  /** Callback when component gains focus */
  onFocusEnter?: FocusEventHandler<any>;
  /** Callback when component loses focus */
  onFocusExit?: FocusEventHandler<any>;
  /** Reference to the underlying DOM element */
  innerRef?: RefObject<any>;
}

/**
 * Props for editor components (form inputs)
 */
export interface ArchbaseEditorProps<T = any, ID = any> extends ArchbaseComponentProps<T, ID> {
  /** Current value */
  value?: any;
  /** Default value */
  defaultValue?: any;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Description text */
  description?: string;
  /** Error message */
  error?: string;
  /** Whether to show validation state */
  withAsterisk?: boolean;
}

/**
 * Props for display components
 */
export interface ArchbaseDisplayProps<T = any, ID = any> extends ArchbaseComponentProps<T, ID> {
  /** Content to display */
  children?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Event types for component interactions
 */
export interface ArchbaseComponentEvent<T = any> {
  type: string;
  data?: T;
  target?: any;
  originalEvent?: Event;
}

/**
 * Validation result for components
 */
export interface ArchbaseValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Theme configuration for components
 */
export interface ArchbaseThemeConfig {
  primaryColor?: string;
  fontFamily?: string;
  borderRadius?: number;
  shadows?: Record<string, string>;
  spacing?: Record<string, number>;
}

/**
 * Component configuration context
 */
export interface ArchbaseComponentConfig {
  theme?: ArchbaseThemeConfig;
  locale?: string;
  dateFormat?: string;
  timeFormat?: string;
  numberFormat?: Intl.NumberFormatOptions;
  validation?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    showErrorMessages?: boolean;
  };
}

export type ArchbaseComponentSize = MantineSize;
export type ArchbaseComponentVariant = 'filled' | 'outline' | 'light' | 'white' | 'default' | 'subtle';