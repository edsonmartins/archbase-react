import { useCallback, useEffect, useMemo } from 'react';
import { Box, Input, ScrollArea } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import {
  useArchbaseV1V2Compatibility,
  useArchbaseDataSourceListener,
} from '@archbase/data';
import type { IArchbaseDataSourceBase } from '@archbase/data';

function formatXmlString(xml: string): string {
  let formatted = '';
  let indent = '';
  const tab = '  ';
  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
    formatted += indent + '<' + node + '>\n';
    if (node.match(/^<?\w[^>]*[^/]$/) && !node.startsWith('?')) indent += tab;
  });
  return formatted.substring(1, formatted.length - 2);
}

export interface ArchbaseXmlViewerProps<T> {
  /** DataSource to read the XML string value from */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Field name within the DataSource */
  dataField?: string;
  /** Standalone XML string value */
  value?: string;
  /** Alias for value - standalone XML string */
  xml?: string;
  /** Label for Input.Wrapper */
  label?: string;
  /** Description for Input.Wrapper */
  description?: string;
  /** Error message for Input.Wrapper */
  error?: string;
  /** Whether to show line numbers @default true */
  showLineNumbers?: boolean;
  /** Whether to show the copy button @default true */
  showCopyButton?: boolean;
  /** Whether to auto-format/indent the XML @default true */
  formatXml?: boolean;
  /** Max height - enables scroll area when set */
  maxHeight?: string | number;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Width of the viewer */
  width?: string | number;
}

function ArchbaseXmlViewer<T>({
  dataSource,
  dataField,
  value: valueProp,
  xml,
  label,
  description,
  error,
  showCopyButton = true,
  formatXml = true,
  maxHeight,
  style,
  className,
  width,
}: ArchbaseXmlViewerProps<T>) {
  const resolvedValueProp = valueProp ?? xml;

  const {
    currentValue,
    loadDataSourceFieldValue,
  } = useArchbaseV1V2Compatibility<string>(
    'ArchbaseXmlViewer',
    dataSource,
    dataField,
    resolvedValueProp,
  );

  useEffect(() => {
    if (dataSource && dataField) {
      loadDataSourceFieldValue();
    }
  }, [dataSource, dataField, loadDataSourceFieldValue]);

  const dataSourceEvent = useCallback((_event: any) => {
    loadDataSourceFieldValue();
  }, [loadDataSourceFieldValue]);

  useArchbaseDataSourceListener({
    dataSource,
    listener: dataSourceEvent,
  });

  const xmlString = currentValue ?? '';

  const displayXml = useMemo(() => {
    if (!xmlString) return '';
    if (formatXml) {
      try {
        return formatXmlString(xmlString);
      } catch {
        return xmlString;
      }
    }
    return xmlString;
  }, [xmlString, formatXml]);

  const codeHighlightElement = (
    <CodeHighlight
      code={displayXml}
      language="xml"
      withCopyButton={showCopyButton}
    />
  );

  const content = (
    <Box style={{ ...style, width }} className={className}>
      {maxHeight ? (
        <ScrollArea style={{ maxHeight }} type="auto">
          {codeHighlightElement}
        </ScrollArea>
      ) : (
        codeHighlightElement
      )}
    </Box>
  );

  if (label || description || error) {
    return (
      <Input.Wrapper label={label} description={description} error={error}>
        {content}
      </Input.Wrapper>
    );
  }

  return content;
}

ArchbaseXmlViewer.displayName = 'ArchbaseXmlViewer';

export { ArchbaseXmlViewer };
