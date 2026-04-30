import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Center,
  Group,
  Input,
  Loader,
  Stack,
  Text,
  ActionIcon,
  Tooltip,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core';
import {
  IconFile,
  IconFileTypePdf,
  IconPhoto,
  IconFileText,
  IconDownload,
  IconExternalLink,
  IconAlertCircle,
} from '@tabler/icons-react';
import {
  useArchbaseV1V2Compatibility,
  useArchbaseDataSourceListener,
} from '@archbase/data';
import type { IArchbaseDataSourceBase } from '@archbase/data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DocumentType = 'pdf' | 'image' | 'text' | 'office' | 'unknown';

export interface ArchbaseDocViewerProps<T> {
  /** DataSource to read the URL or base64 value from */
  dataSource?: IArchbaseDataSourceBase<T>;
  /** Field name within the DataSource */
  dataField?: string;
  /** Standalone URL string */
  uri?: string;
  /** Standalone base64 string (include the data URI prefix or provide mimeType) */
  base64?: string;
  /** Explicit MIME type – auto-detected from the URL extension when omitted */
  mimeType?: string;
  /** Height of the viewer @default '600px' */
  height?: string | number;
  /** Width of the viewer @default '100%' */
  width?: string | number;
  /** Show the toolbar with download / open-in-new-tab buttons @default true */
  showToolbar?: boolean;
  /** Label for Input.Wrapper */
  label?: string;
  /** Description for Input.Wrapper */
  description?: string;
  /** Error message for Input.Wrapper */
  error?: string;
  /** Callback fired when the document finishes loading */
  onDocumentLoad?: () => void;
  /** Callback fired when the document fails to load */
  onDocumentError?: (error: Error) => void;
  /** Custom style applied to the outer container */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EXTENSION_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  bmp: 'image/bmp',
  txt: 'text/plain',
  json: 'application/json',
  xml: 'application/xml',
  csv: 'text/csv',
  html: 'text/html',
  htm: 'text/html',
  md: 'text/markdown',
  log: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url, 'https://dummy.base').pathname;
    const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
    return ext;
  } catch {
    return '';
  }
}

function detectMimeType(url: string | undefined, explicitMime?: string): string {
  if (explicitMime) return explicitMime;
  if (!url) return 'application/octet-stream';
  const ext = getExtensionFromUrl(url);
  return EXTENSION_MIME[ext] ?? 'application/octet-stream';
}

function classifyDocument(mime: string): DocumentType {
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  if (
    mime.startsWith('text/') ||
    mime === 'application/json' ||
    mime === 'application/xml'
  )
    return 'text';
  if (
    mime.includes('officedocument') ||
    mime.includes('msword') ||
    mime.includes('ms-excel') ||
    mime.includes('ms-powerpoint')
  )
    return 'office';
  return 'unknown';
}

function isBase64DataUri(value: string): boolean {
  return value.startsWith('data:');
}

function buildGoogleViewerUrl(url: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
}

function buildOfficeOnlineUrl(url: string): string {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ArchbaseDocViewer<T>({
  dataSource,
  dataField,
  uri,
  base64,
  mimeType: mimeTypeProp,
  height = '600px',
  width = '100%',
  showToolbar = true,
  label,
  description,
  error: errorProp,
  onDocumentLoad,
  onDocumentError,
  style,
  className,
}: ArchbaseDocViewerProps<T>) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  // Resolve value from dataSource OR standalone props
  const standaloneProp = uri ?? base64;

  const { currentValue, loadDataSourceFieldValue } =
    useArchbaseV1V2Compatibility<string>(
      'ArchbaseDocViewer',
      dataSource,
      dataField,
      standaloneProp,
    );

  useEffect(() => {
    if (dataSource && dataField) {
      loadDataSourceFieldValue();
    }
  }, [dataSource, dataField, loadDataSourceFieldValue]);

  const dataSourceEvent = useCallback(
    (_event: any) => {
      loadDataSourceFieldValue();
    },
    [loadDataSourceFieldValue],
  );

  useArchbaseDataSourceListener({ dataSource, listener: dataSourceEvent });

  // Resolved document URL / data URI
  const documentUrl = currentValue ?? '';

  const mime = useMemo(
    () => detectMimeType(documentUrl, mimeTypeProp),
    [documentUrl, mimeTypeProp],
  );
  const docType = useMemo(() => classifyDocument(mime), [mime]);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset loading state when URL changes
  useEffect(() => {
    if (!documentUrl) {
      setIsLoading(false);
      setLoadError(null);
      setTextContent(null);
      return;
    }
    setIsLoading(true);
    setLoadError(null);
    setTextContent(null);
  }, [documentUrl]);

  // Fetch text content for text-type documents
  useEffect(() => {
    if (!documentUrl || docType !== 'text') return;
    if (isBase64DataUri(documentUrl)) {
      try {
        const base64Part = documentUrl.split(',')[1] ?? '';
        const decoded = atob(base64Part);
        setTextContent(decoded);
        setIsLoading(false);
        onDocumentLoad?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setLoadError('Failed to decode base64 content.');
        setIsLoading(false);
        onDocumentError?.(error);
      }
      return;
    }
    let cancelled = false;
    fetch(documentUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!cancelled) {
          setTextContent(text);
          setIsLoading(false);
          onDocumentLoad?.();
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const error = err instanceof Error ? err : new Error(String(err));
          setLoadError(error.message);
          setIsLoading(false);
          onDocumentError?.(error);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [documentUrl, docType, onDocumentLoad, onDocumentError]);

  // Handlers
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    onDocumentLoad?.();
  }, [onDocumentLoad]);

  const handleIframeError = useCallback(() => {
    const error = new Error('Failed to load document in iframe.');
    setLoadError(error.message);
    setIsLoading(false);
    onDocumentError?.(error);
  }, [onDocumentError]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    onDocumentLoad?.();
  }, [onDocumentLoad]);

  const handleImageError = useCallback(() => {
    const error = new Error('Failed to load image.');
    setLoadError(error.message);
    setIsLoading(false);
    onDocumentError?.(error);
  }, [onDocumentError]);

  // Download helper
  const handleDownload = useCallback(() => {
    if (!documentUrl) return;
    const a = document.createElement('a');
    a.href = documentUrl;
    a.download = '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [documentUrl]);

  const handleOpenNewTab = useCallback(() => {
    if (!documentUrl) return;
    window.open(documentUrl, '_blank', 'noopener,noreferrer');
  }, [documentUrl]);

  // Background colors
  const bgColor = isDark ? theme.colors.dark[6] : theme.colors.gray[0];
  const borderColor = isDark ? theme.colors.dark[4] : theme.colors.gray[3];

  // ---- Render helpers ----

  const renderToolbar = () => {
    if (!showToolbar || !documentUrl) return null;
    return (
      <Group
        justify="flex-end"
        gap="xs"
        px="sm"
        py={6}
        style={{
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: isDark ? theme.colors.dark[7] : theme.colors.gray[1],
        }}
      >
        <Tooltip label="Download">
          <ActionIcon variant="subtle" onClick={handleDownload} aria-label="Download">
            <IconDownload size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Open in new tab">
          <ActionIcon variant="subtle" onClick={handleOpenNewTab} aria-label="Open in new tab">
            <IconExternalLink size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    );
  };

  const renderLoading = () => (
    <Center style={{ width: '100%', height: '100%', minHeight: 200 }}>
      <Stack align="center" gap="xs">
        <Loader size="md" />
        <Text size="sm" c="dimmed">
          Loading document...
        </Text>
      </Stack>
    </Center>
  );

  const renderError = () => (
    <Center style={{ width: '100%', height: '100%', minHeight: 200 }}>
      <Stack align="center" gap="xs">
        <IconAlertCircle size={40} color={theme.colors.red[6]} />
        <Text size="sm" c="red">
          {loadError ?? 'An error occurred while loading the document.'}
        </Text>
      </Stack>
    </Center>
  );

  const renderEmpty = () => (
    <Center style={{ width: '100%', height: '100%', minHeight: 200 }}>
      <Stack align="center" gap="xs">
        <IconFile size={40} color={isDark ? theme.colors.dark[2] : theme.colors.gray[5]} />
        <Text size="sm" c="dimmed">
          No document to display.
        </Text>
      </Stack>
    </Center>
  );

  const renderDocumentIcon = () => {
    switch (docType) {
      case 'pdf':
        return <IconFileTypePdf size={20} />;
      case 'image':
        return <IconPhoto size={20} />;
      case 'text':
        return <IconFileText size={20} />;
      default:
        return <IconFile size={20} />;
    }
  };

  const renderPdf = () => (
    <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && renderLoading()}
      <object
        data={documentUrl}
        type="application/pdf"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: isLoading ? 'none' : 'block',
        }}
        onLoad={handleIframeLoad}
      >
        {/* Fallback: iframe for browsers that don't support object/pdf */}
        <iframe
          ref={iframeRef}
          src={documentUrl}
          title="PDF Document"
          style={{ width: '100%', height: '100%', border: 'none' }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </object>
    </Box>
  );

  const renderImage = () => (
    <Box style={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
      {isLoading && renderLoading()}
      <Center style={{ width: '100%', height: '100%' }}>
        <img
          src={documentUrl}
          alt="Document"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: isLoading ? 'none' : 'block',
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </Center>
    </Box>
  );

  const renderText = () => {
    if (isLoading) return renderLoading();
    return (
      <Box
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          padding: theme.spacing.sm,
        }}
      >
        <pre
          style={{
            margin: 0,
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: isDark ? theme.colors.gray[3] : theme.colors.dark[8],
          }}
        >
          {textContent ?? ''}
        </pre>
      </Box>
    );
  };

  const renderOffice = () => {
    // Office viewer only works with public HTTP(S) URLs
    if (isBase64DataUri(documentUrl)) {
      return (
        <Center style={{ width: '100%', height: '100%', minHeight: 200 }}>
          <Stack align="center" gap="xs">
            {renderDocumentIcon()}
            <Text size="sm" c="dimmed">
              Office document preview is not available for base64 content.
            </Text>
            <Text
              size="sm"
              c="blue"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleDownload}
            >
              Download file
            </Text>
          </Stack>
        </Center>
      );
    }
    // Try Office Online first, fallback to Google Docs Viewer on error
    return (
      <Box style={{ width: '100%', height: '100%', position: 'relative' }}>
        {isLoading && renderLoading()}
        <iframe
          ref={iframeRef}
          src={buildOfficeOnlineUrl(documentUrl)}
          title="Office Document"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: isLoading ? 'none' : 'block',
          }}
          onLoad={handleIframeLoad}
          onError={() => {
            // Fallback to Google Docs Viewer
            if (iframeRef.current) {
              iframeRef.current.src = buildGoogleViewerUrl(documentUrl);
            }
          }}
        />
      </Box>
    );
  };

  const renderUnknown = () => (
    <Center style={{ width: '100%', height: '100%', minHeight: 200 }}>
      <Stack align="center" gap="xs">
        <IconFile size={48} color={isDark ? theme.colors.dark[2] : theme.colors.gray[5]} />
        <Text size="sm" c="dimmed">
          Preview is not available for this file type.
        </Text>
        {documentUrl && (
          <Text
            size="sm"
            c="blue"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleDownload}
          >
            Download file
          </Text>
        )}
      </Stack>
    </Center>
  );

  const renderContent = () => {
    if (!documentUrl) return renderEmpty();
    if (loadError) return renderError();
    switch (docType) {
      case 'pdf':
        return renderPdf();
      case 'image':
        return renderImage();
      case 'text':
        return renderText();
      case 'office':
        return renderOffice();
      default:
        return renderUnknown();
    }
  };

  const viewer = (
    <Box
      style={{
        width,
        height,
        border: `1px solid ${borderColor}`,
        borderRadius: theme.radius.sm,
        overflow: 'hidden',
        backgroundColor: bgColor,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
      className={className}
    >
      {renderToolbar()}
      <Box style={{ flex: 1, overflow: 'hidden' }}>{renderContent()}</Box>
    </Box>
  );

  if (label || description || errorProp) {
    return (
      <Input.Wrapper label={label} description={description} error={errorProp}>
        {viewer}
      </Input.Wrapper>
    );
  }

  return viewer;
}

ArchbaseDocViewer.displayName = 'ArchbaseDocViewer';

export { ArchbaseDocViewer };
export type { DocumentType };
