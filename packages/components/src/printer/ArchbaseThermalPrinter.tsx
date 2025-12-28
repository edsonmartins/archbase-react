import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Box,
  Paper,
  Button,
  Group,
  Stack,
  Text,
  Alert,
  LoadingOverlay,
  Center,
  ActionIcon,
} from '@mantine/core';
import {
  IconPrinter,
  IconDownload,
  IconEye,
  IconCheck,
  IconAlertCircle,
  IconX,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import type {
  ArchbaseThermalPrinterProps,
  ReceiptData,
  PrinterStatus,
  PaperWidth,
  CutMode,
} from './ArchbaseThermalPrinter.types';
import { generateReceiptEscpos, formatCurrency as formatCurrencyUtil, formatDate as formatDateUtil, getCharsWidth } from './utils/escpos';

// Local wrappers to avoid export conflicts
const formatCurrency = (v: number) => formatCurrencyUtil(v);
const formatDate = (d?: Date) => formatDateUtil(d);

/**
 * Componente Receipt - Renderiza visualmente um receipt
 */
function Receipt({
  data,
  paperWidth = 80,
  align = 'left',
  style,
  className,
}: {
  data: ReceiptData;
  paperWidth?: PaperWidth;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
  className?: string;
}) {
  const chars = getCharsWidth(paperWidth);
  const mmWidth = paperWidth;

  return (
    <Box
      className={className}
      style={{
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '16px',
        width: `${mmWidth * 0.4}mm`, // Scale down for display
        minWidth: 280,
        maxWidth: 320,
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        ...style,
      }}
    >
      {/* Header */}
      {data.header && (
        <>
          {data.header.title && (
            <Text ta="center" fw={700} size="lg" mb="xs">
              {data.header.title}
            </Text>
          )}
          {data.header.address &&
            data.header.address.map((line, i) => (
              <Text key={i} ta="center" size="xs" mb={0}>
                {line}
              </Text>
            ))}
          {data.header.document && (
            <Text ta="center" size="xs" mb="xs">
              {data.header.document}
            </Text>
          )}
          <Text ta="left" size="xs">
            DATA: {formatDate(data.header.date)}
          </Text>
          {data.header.number && (
            <Text ta="left" size="xs">
              CUPOM: {data.header.number}
            </Text>
          )}
          {data.header.operator && (
            <Text ta="left" size="xs">
              OPERADOR: {data.header.operator}
            </Text>
          )}
          <Box style={{ borderBottom: '2px solid #000', margin: '8px 0' }} />
        </>
      )}

      {/* Items */}
      {data.items && data.items.length > 0 && (
        <>
          <Group justify="space-between" mb="xs" fw={700}>
            <Text span flex={1}>ITEM</Text>
            <Text span w={20} ta="center">QTD</Text>
            <Text span w={20} ta="right">VALOR</Text>
          </Group>
          {data.items.map((item, i) => {
            const total = item.quantity * item.price - (item.discount || 0);
            return (
              <Group key={i} justify="space-between" mb="xs" style={{ flexWrap: 'wrap' }}>
                <Text span flex={1} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </Text>
                <Text span w={20} ta="center">
                  {item.quantity}
                </Text>
                <Text span w={20} ta="right">
                  {formatCurrency(total)}
                </Text>
                {item.discount && item.discount > 0 && (
                  <Text span size="xs" c="red" w="100%">
                    {'  '}Desc: {formatCurrency(item.discount)}
                  </Text>
                )}
              </Group>
            );
          })}
          <Box style={{ borderBottom: '2px solid #000', margin: '8px 0' }} />
        </>
      )}

      {/* Summary */}
      {data.summary && (
        <>
          {data.summary.subtotal !== undefined && (
            <Group justify="space-between" mb="xs">
              <Text>Subtotal</Text>
              <Text>{formatCurrency(data.summary.subtotal)}</Text>
            </Group>
          )}
          {data.summary.discount && data.summary.discount > 0 && (
            <Group justify="space-between" mb="xs">
              <Text c="red">Desconto</Text>
              <Text c="red">-{formatCurrency(data.summary.discount)}</Text>
            </Group>
          )}
          {data.summary.serviceFee && data.summary.serviceFee > 0 && (
            <Group justify="space-between" mb="xs">
              <Text>Serviço</Text>
              <Text>{formatCurrency(data.summary.serviceFee)}</Text>
            </Group>
          )}
          <Group justify="space-between" mb="xs" fw={700}>
            <Text fz="lg">TOTAL</Text>
            <Text fz="lg">{formatCurrency(data.summary.total)}</Text>
          </Group>
          <Box style={{ borderBottom: '2px solid #000', margin: '8px 0' }} />
        </>
      )}

      {/* Payments */}
      {data.payments && data.payments.length > 0 && (
        <>
          <Text fw={700} mb="xs">
            Pagamento
          </Text>
          {data.payments.map((payment, i) => (
            <Group key={i} justify="space-between" mb="xs">
              <Text>{payment.method.toUpperCase()}</Text>
              <Text>{formatCurrency(payment.amount)}</Text>
            </Group>
          ))}
          <Box style={{ borderBottom: '2px solid #000', margin: '8px 0' }} />
        </>
      )}

      {/* Footer */}
      {data.footer && (
        <>
          {data.footer.messages &&
            data.footer.messages.map((msg, i) => (
              <Text key={i} ta="center" size="xs" mb="xs">
                {msg}
              </Text>
            ))}
          {data.footer.qrCode && (
            <Center my="md">
              <Box
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#fff',
                  backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.footer.qrCode)}')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            </Center>
          )}
        </>
      )}

      <Text ta="center" size="xs" mt="md" c="gray">
        {'\u00A0'}
      </Text>
    </Box>
  );
}

/**
 * Componente ArchbaseThermalPrinter - Impressão térmica ESC/POS
 *
 * @example
 * ```tsx
 * <ArchbaseThermalPrinter
 *   data={{
 *     header: { title: 'Minha Loja', address: ['Rua X, 123'] },
 *     items: [{ name: 'Produto 1', quantity: 2, price: 10.00 }],
 *     summary: { total: 20.00 }
 *   }}
 *   onPrintComplete={() => console.log('Impresso!')}
 * />
 * ```
 */
export function ArchbaseThermalPrinter({
  data,
  options = {},
  printerId,
  autoPrint = false,
  template,
  style,
  className,
  disabled = false,
  loading,
  error,
  onPrintStart,
  onPrintComplete,
  onError,
  onStatusChange,
  showPreview = true,
  previewActions = true,
  ariaLabel,
  title,
}: ArchbaseThermalPrinterProps) {
  const { t } = useArchbaseTranslation();

  // State
  const [status, setStatus] = useState<PrinterStatus>('idle');
  const [showPreviewOnly, setShowPreviewOnly] = useState(false);

  // Parse options
  const paperWidth = options.paperWidth || 80;
  const cutMode = options.cut || 'full';
  const copies = options.copies || 1;

  // Generate ESC/POS commands
  const escposData = useMemo(() => {
    try {
      return generateReceiptEscpos(data, paperWidth, cutMode);
    } catch (e) {
      console.error('Failed to generate ESC/POS data:', e);
      return null;
    }
  }, [data, paperWidth, cutMode]);

  // Print function
  const handlePrint = useCallback(async () => {
    if (!escposData || disabled) return;

    setStatus('printing');
    onPrintStart?.();
    onStatusChange?.('printing');

    try {
      // Para impressão em browser, precisamos usar Web USB ou Web Bluetooth
      // Por enquanto, simula a impressão e oferece download

      // Simula tempo de impressão
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus('success');
      onPrintComplete?.();
      onStatusChange?.('success');

      // Reset após sucesso
      setTimeout(() => {
        setStatus('idle');
        onStatusChange?.('idle');
      }, 2000);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Print failed');
      setStatus('error');
      onError?.(err);
      onStatusChange?.('error');

      setTimeout(() => {
        setStatus('idle');
        onStatusChange?.('idle');
      }, 3000);
    }
  }, [escposData, disabled, onPrintStart, onPrintComplete, onError, onStatusChange]);

  // Download ESC/POS data
  const handleDownload = useCallback(() => {
    if (!escposData) return;

    const blob = new Blob([escposData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${Date.now()}.bin`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [escposData]);

  // Auto print on mount
  useEffect(() => {
    if (autoPrint && !disabled && escposData) {
      handlePrint();
    }
  }, [autoPrint, disabled, escposData]); // Don't include handlePrint to avoid loops

  // Get printer icon based on status
  const getPrinterIcon = () => {
    switch (status) {
      case 'printing':
        return <LoadingOverlay />;
      case 'success':
        return <IconCheck size={16} color="green" />;
      case 'error':
        return <IconAlertCircle size={16} color="red" />;
      default:
        return <IconPrinter size={16} />;
    }
  };

  // Get button label based on status
  const getButtonLabel = () => {
    switch (status) {
      case 'printing':
        return t('Printing...') as ReactNode;
      case 'success':
        return t('Printed!') as ReactNode;
      case 'error':
        return t('Error') as ReactNode;
      default:
        return t('Print') as ReactNode;
    }
  };

  return (
    <Paper
      shadow="sm"
      p="md"
      withBorder
      style={{ ...style }}
      className={className}
      aria-label={ariaLabel || title || 'Thermal printer'}
    >
      {/* Header */}
      <Group justify="space-between" mb="md">
        <Text fw={500}>{title || t('Thermal Printer') as ReactNode}</Text>
        {previewActions && (
          <Group gap="xs">
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={() => setShowPreviewOnly(!showPreviewOnly)}
              title={String(showPreviewOnly ? t('Hide preview') : t('Show preview'))}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      {/* Preview */}
      {(showPreview || showPreviewOnly) && (
        <Box mb="md">
          <Receipt data={data} paperWidth={paperWidth} />
        </Box>
      )}

      {/* Error state */}
      {status === 'error' && typeof error !== 'boolean' && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
          {typeof error === 'string' ? error : t('Failed to print receipt') as ReactNode}
        </Alert>
      )}

      {/* Actions */}
      {!disabled && (
        <Group>
          <Button
            leftSection={getPrinterIcon()}
            onClick={handlePrint}
            disabled={status === 'printing' || !escposData}
            loading={status === 'printing'}
          >
            {getButtonLabel()}
          </Button>

          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={handleDownload}
            disabled={!escposData}
          >
            {t('Download') as ReactNode}
          </Button>
        </Group>
      )}

      {/* Info */}
      {escposData && (
        <Text size="xs" c="dimmed" mt="md">
          {t('Receipt size') as ReactNode}: {escposData.length} bytes • {paperWidth}mm
        </Text>
      )}
    </Paper>
  );
}

ArchbaseThermalPrinter.displayName = 'ArchbaseThermalPrinter';

/**
 * Componente para teste rápido de impressão
 */
export function QuickPrintButton({
  data,
  onPrint,
}: {
  data: ReceiptData;
  onPrint?: () => void;
}) {
  const { t } = useArchbaseTranslation();

  const handleClick = () => {
    const escposData = generateReceiptEscpos(data);
    console.log('ESC/POS Data:', escposData);
    onPrint?.();
  };

  return (
    <Button
      leftSection={<IconPrinter size={16} />}
      onClick={handleClick}
      variant="light"
    >
      {t('Test Print') as ReactNode}
    </Button>
  );
}
