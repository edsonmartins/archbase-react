import { useCallback, useEffect, useMemo } from 'react';
import { JsonView, allExpanded, darkStyles, defaultStyles, collapseAllNested } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { Box, Input, ScrollArea, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import {
  useArchbaseV1V2Compatibility,
  useArchbaseDataSourceListener,
} from '@archbase/data';
import type { IArchbaseDataSourceBase } from '@archbase/data';

export interface ArchbaseJsonTreeProps<T> {
  /** DataSource to read the JSON object/string from */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Field name within the DataSource */
  dataField?: string;
  /** Standalone JSON data (object or JSON string) */
  data?: object | string;
  /** Label for Input.Wrapper */
  label?: string;
  /** Description for Input.Wrapper */
  description?: string;
  /** Error message for Input.Wrapper */
  error?: string;
  /** Whether nodes are expanded by default (default: true) */
  defaultExpanded?: boolean;
  /** Maximum depth to expand nodes */
  maxDepth?: number;
  /** Whether clicking a node expands/collapses it (default: true) */
  clickToExpandNode?: boolean;
  /** Custom style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
  /** Width of the container */
  width?: string | number;
  /** Max height of the container (enables scroll) */
  maxHeight?: string | number;
}

function ArchbaseJsonTree<T>({
  dataSource,
  dataField,
  data: dataProp,
  label,
  description,
  error,
  defaultExpanded = true,
  maxDepth,
  clickToExpandNode = true,
  style,
  className,
  width,
  maxHeight,
}: ArchbaseJsonTreeProps<T>) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  const {
    currentValue,
    loadDataSourceFieldValue,
  } = useArchbaseV1V2Compatibility<any>(
    'ArchbaseJsonTree',
    dataSource,
    dataField,
    dataProp,
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

  const parsedData = useMemo(() => {
    if (currentValue === undefined || currentValue === null) {
      return undefined;
    }
    if (typeof currentValue === 'string') {
      try {
        return JSON.parse(currentValue);
      } catch {
        return { __parseError: `Invalid JSON: ${currentValue}` };
      }
    }
    if (typeof currentValue === 'object') {
      return currentValue;
    }
    return currentValue;
  }, [currentValue]);

  const shouldExpandNode = useMemo(() => {
    if (maxDepth !== undefined) {
      return (level: number) => level < maxDepth;
    }
    return defaultExpanded ? allExpanded : collapseAllNested;
  }, [defaultExpanded, maxDepth]);

  const jsonStyles = isDark ? darkStyles : defaultStyles;

  if (parsedData === undefined) {
    return null;
  }

  const jsonView = (
    <JsonView
      data={parsedData}
      shouldExpandNode={shouldExpandNode}
      style={jsonStyles}
      clickToExpandNode={clickToExpandNode}
    />
  );

  const innerContent = maxHeight ? (
    <ScrollArea style={{ maxHeight }} type="auto">
      {jsonView}
    </ScrollArea>
  ) : (
    jsonView
  );

  const content = (
    <Box style={{ width, ...style }} className={className}>
      {innerContent}
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

ArchbaseJsonTree.displayName = 'ArchbaseJsonTree';

export { ArchbaseJsonTree };
