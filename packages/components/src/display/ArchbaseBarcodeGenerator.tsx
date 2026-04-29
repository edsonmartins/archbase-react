import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, BoxProps, Text, Stack, Paper, Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconDownload, IconCopy, IconCheck } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export type BarcodeFormat =
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'UPC'
  | 'UPCE'
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar';

export interface ArchbaseBarcodeGeneratorProps extends Omit<BoxProps, 'children'> {
  /** Valor a ser codificado */
  value: string;
  /** Formato do código de barras */
  format?: BarcodeFormat;
  /** Largura de cada barra */
  width?: number;
  /** Altura das barras */
  height?: number;
  /** Mostrar valor abaixo do código */
  displayValue?: boolean;
  /** Cor de fundo */
  background?: string;
  /** Cor das linhas */
  lineColor?: string;
  /** Margem ao redor */
  margin?: number;
  /** Fonte do texto */
  font?: string;
  /** Tamanho da fonte */
  fontSize?: number;
  /** Alinhamento do texto */
  textAlign?: 'left' | 'center' | 'right';
  /** Posição do texto */
  textPosition?: 'bottom' | 'top';
  /** Margem do texto */
  textMargin?: number;
  /** Mostrar botões de ação (download, copiar) */
  showActions?: boolean;
  /** Nome do arquivo para download */
  downloadFilename?: string;
  /** Callback quando código é gerado */
  onGenerated?: () => void;
  /** Callback de erro */
  onError?: (error: Error) => void;
  /** Label opcional */
  label?: string;
}

// =============================================================================
// JsBarcode Dynamic Import Check
// =============================================================================

let JsBarcode: any = null;

async function loadJsBarcode(): Promise<boolean> {
  if (JsBarcode) return true;

  try {
    const module = await import('jsbarcode');
    JsBarcode = module.default || module;
    return true;
  } catch (error) {
    console.warn(
      'JsBarcode não está instalado. Instale com: npm install jsbarcode'
    );
    return false;
  }
}

// =============================================================================
// ArchbaseBarcodeGenerator Component
// =============================================================================

export function ArchbaseBarcodeGenerator({
  value,
  format = 'CODE128',
  width = 2,
  height = 100,
  displayValue = true,
  background = '#ffffff',
  lineColor = '#000000',
  margin = 10,
  font = 'monospace',
  fontSize = 20,
  textAlign = 'center',
  textPosition = 'bottom',
  textMargin = 2,
  showActions = false,
  downloadFilename = 'barcode',
  onGenerated,
  onError,
  label,
  ...boxProps
}: ArchbaseBarcodeGeneratorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load JsBarcode
  useEffect(() => {
    loadJsBarcode().then((loaded) => {
      setIsLoaded(loaded);
      if (!loaded) {
        setError('JsBarcode não está disponível');
      }
    });
  }, []);

  // Generate barcode
  useEffect(() => {
    if (!isLoaded || !svgRef.current || !value) return;

    try {
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue,
        background,
        lineColor,
        margin,
        font,
        fontSize,
        textAlign,
        textPosition,
        textMargin,
      });
      setError(null);
      onGenerated?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar código de barras';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [
    isLoaded,
    value,
    format,
    width,
    height,
    displayValue,
    background,
    lineColor,
    margin,
    font,
    fontSize,
    textAlign,
    textPosition,
    textMargin,
    onGenerated,
    onError,
  ]);

  // Download as PNG
  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = `${downloadFilename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [downloadFilename]);

  // Copy SVG to clipboard
  const handleCopy = useCallback(async () => {
    if (!svgRef.current) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      await navigator.clipboard.writeText(svgData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  }, []);

  if (!isLoaded) {
    return (
      <Paper withBorder p="md" ta="center">
        <Text size="sm" c="dimmed">
          Carregando gerador de código de barras...
        </Text>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper withBorder p="md" ta="center" bg="red.0">
        <Text size="sm" c="red">
          {error}
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="xs">
      {label && (
        <Text fw={500} size="sm">
          {label}
        </Text>
      )}

      <Box {...boxProps}>
        <Paper withBorder p="sm" bg={background}>
          <Stack gap="xs" align="center">
            <svg ref={svgRef} />

            {showActions && (
              <Group gap="xs">
                <Tooltip label="Download PNG">
                  <ActionIcon variant="light" onClick={handleDownload}>
                    <IconDownload size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={copied ? 'Copiado!' : 'Copiar SVG'}>
                  <ActionIcon
                    variant="light"
                    color={copied ? 'green' : 'gray'}
                    onClick={handleCopy}
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

// =============================================================================
// Convenience Components
// =============================================================================

/** Gerador de código EAN-13 */
export function ArchbaseEAN13Generator(
  props: Omit<ArchbaseBarcodeGeneratorProps, 'format'>
) {
  return <ArchbaseBarcodeGenerator format="EAN13" {...props} />;
}

/** Gerador de código EAN-8 */
export function ArchbaseEAN8Generator(
  props: Omit<ArchbaseBarcodeGeneratorProps, 'format'>
) {
  return <ArchbaseBarcodeGenerator format="EAN8" {...props} />;
}

/** Gerador de código UPC */
export function ArchbaseUPCGenerator(
  props: Omit<ArchbaseBarcodeGeneratorProps, 'format'>
) {
  return <ArchbaseBarcodeGenerator format="UPC" {...props} />;
}

/** Gerador de código CODE128 */
export function ArchbaseCODE128Generator(
  props: Omit<ArchbaseBarcodeGeneratorProps, 'format'>
) {
  return <ArchbaseBarcodeGenerator format="CODE128" {...props} />;
}

export default ArchbaseBarcodeGenerator;
