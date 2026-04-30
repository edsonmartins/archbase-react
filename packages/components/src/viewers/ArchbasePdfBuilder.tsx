import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from 'react';
import { Box, Input } from '@mantine/core';
import { Designer, Form, Viewer } from '@pdfme/ui';
import type { Template, Font } from '@pdfme/common';
import { text, image, barcodes } from '@pdfme/schemas';
import { generate } from '@pdfme/generator';
import { useArchbaseV1V2Compatibility } from '@archbase/data';

// ---------------------------------------------------------------------------
// Public ref interface
// ---------------------------------------------------------------------------

export interface ArchbasePdfBuilderRef {
  /** Generate a PDF from the current template + inputs and return its bytes. */
  generatePdf(): Promise<Uint8Array>;
  /** Return the current pdfme instance (Designer | Form | Viewer) if available. */
  getInstance(): Designer | Form | Viewer | null;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ArchbasePdfBuilderProps<T = unknown> {
  /** Which pdfme UI to render. */
  mode?: 'designer' | 'form' | 'viewer';

  /** The pdfme template object. */
  template: Template;

  /**
   * Optional Archbase DataSource – used in `form` mode to populate inputs
   * from the current record.
   */
  dataSource?: any;
  /** Field path inside the data source record. */
  dataField?: string;

  /**
   * Standalone inputs for `form` / `viewer` mode.
   * Each element maps schema field names to string values.
   */
  inputs?: Record<string, string>[];

  /** Fired whenever the designer changes the template. */
  onTemplateChange?: (template: Template) => void;

  /** Fired when `generatePdf` completes. */
  onGenerate?: (pdf: Uint8Array) => void;

  /**
   * Additional pdfme schema plugins.
   * Defaults to `[text, image, barcodes]`.
   */
  plugins?: Record<string, any>;

  /** Custom font configuration forwarded to pdfme. */
  font?: Font;

  /** Container height. */
  height?: string | number;
  /** Container width. */
  width?: string | number;

  /** Optional label rendered above the builder (uses Mantine Input.Wrapper). */
  label?: string;
  /** Optional description rendered below the label. */
  description?: string;

  /** Extra inline styles applied to the outer wrapper. */
  style?: CSSProperties;
  /** Extra CSS class name applied to the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Default plugins helper
// ---------------------------------------------------------------------------

const DEFAULT_PLUGINS: Record<string, any> = { Text: text, Image: image, ...barcodes };

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ArchbasePdfBuilderInner<T = unknown>(
  {
    mode = 'designer',
    template,
    dataSource,
    dataField,
    inputs: inputsProp,
    onTemplateChange,
    onGenerate,
    plugins,
    font,
    height = '100vh',
    width = '100%',
    label,
    description,
    style,
    className,
  }: ArchbasePdfBuilderProps<T>,
  ref: React.Ref<ArchbasePdfBuilderRef>,
) {
  // ---- Container ref ----
  const containerRef = useRef<HTMLDivElement>(null);

  // ---- pdfme instance ----
  const instanceRef = useRef<Designer | Form | Viewer | null>(null);

  // ---- Keep latest template in a ref so callbacks always see current value ----
  const templateRef = useRef<Template>(template);
  templateRef.current = template;

  // ---- DataSource integration (form mode) ----
  const { currentValue: dsValue, loadDataSourceFieldValue } =
    useArchbaseV1V2Compatibility<Record<string, string>[] | undefined>(
      'ArchbasePdfBuilder',
      dataSource,
      dataField,
      undefined,
    );

  useEffect(() => {
    if (dataSource && dataField) {
      loadDataSourceFieldValue();
    }
  }, [dataSource, dataField, loadDataSourceFieldValue]);

  // Resolve inputs: prop takes precedence, then data-source value, then empty.
  const resolvedInputs: Record<string, string>[] =
    inputsProp ?? dsValue ?? [{}];

  // ---- Merged plugins ----
  const mergedPlugins = plugins
    ? { ...DEFAULT_PLUGINS, ...plugins }
    : DEFAULT_PLUGINS;

  // ---- Initialise / re-create pdfme instance ----
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous instance
    if (instanceRef.current) {
      instanceRef.current.destroy();
      instanceRef.current = null;
    }

    const domContainer = containerRef.current;

    const commonOpts: any = {
      domContainer,
      template,
      plugins: mergedPlugins,
      ...(font ? { options: { font } } : {}),
    };

    try {
      if (mode === 'designer') {
        const designer = new Designer(commonOpts);

        designer.onChangeTemplate((updated: Template) => {
          templateRef.current = updated;
          onTemplateChange?.(updated);
        });

        instanceRef.current = designer;
      } else if (mode === 'form') {
        const form = new Form({
          ...commonOpts,
          inputs: resolvedInputs,
        });

        instanceRef.current = form;
      } else {
        // viewer
        const viewer = new Viewer({
          ...commonOpts,
          inputs: resolvedInputs,
        });

        instanceRef.current = viewer;
      }
    } catch (err) {
      console.error('[ArchbasePdfBuilder] Failed to initialise pdfme:', err);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
    // We intentionally re-create when mode or template identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, template, font]);

  // ---- Update inputs on form/viewer when they change ----
  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    if (mode === 'form' || mode === 'viewer') {
      try {
        (inst as Form | Viewer).setInputs(resolvedInputs);
      } catch {
        // instance may not be ready yet
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedInputs, mode]);

  // ---- Imperative handle ----
  useImperativeHandle(
    ref,
    () => ({
      async generatePdf(): Promise<Uint8Array> {
        const currentTemplate = templateRef.current;
        let currentInputs = resolvedInputs;

        // In form mode we can grab the latest user-edited inputs
        if (mode === 'form' && instanceRef.current) {
          try {
            currentInputs = (instanceRef.current as Form).getInputs();
          } catch {
            // fallback to prop inputs
          }
        }

        const pdf = await generate({
          template: currentTemplate,
          inputs: currentInputs,
          plugins: mergedPlugins,
          ...(font ? { options: { font } } : {}),
        });

        onGenerate?.(pdf);
        return pdf;
      },

      getInstance() {
        return instanceRef.current;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, font, resolvedInputs],
  );

  // ---- Render ----
  const content = (
    <Box
      ref={containerRef}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      className={className}
    />
  );

  if (label || description) {
    return (
      <Input.Wrapper label={label} description={description}>
        {content}
      </Input.Wrapper>
    );
  }

  return content;
}

// ---------------------------------------------------------------------------
// Forward-ref wrapper that preserves the generic parameter
// ---------------------------------------------------------------------------

export const ArchbasePdfBuilder = forwardRef(ArchbasePdfBuilderInner) as <
  T = unknown,
>(
  props: ArchbasePdfBuilderProps<T> & { ref?: React.Ref<ArchbasePdfBuilderRef> },
) => React.ReactElement | null;

(ArchbasePdfBuilder as any).displayName = 'ArchbasePdfBuilder';
