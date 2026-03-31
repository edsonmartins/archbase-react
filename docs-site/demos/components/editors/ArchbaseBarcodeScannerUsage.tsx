import React, { useState } from 'react';
import { Stack, Text, Code, Paper } from '@mantine/core';
import { ArchbaseBarcodeScanner } from '@archbase/components';

export function ArchbaseBarcodeScannerUsage() {
  const [scannedCode, setScannedCode] = useState<string>('');
  const [scannedFormat, setScannedFormat] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseBarcodeScanner
        asModal
        buttonLabel="Escanear Codigo"
        modalTitle="Escanear Codigo de Barras / QR Code"
        label="Scanner de Codigos"
        description="Clique no botao para abrir a camera e escanear um codigo"
        value={scannedCode}
        onScan={(code, format) => {
          setScannedCode(code);
          setScannedFormat(format);
        }}
        onError={(err) => console.error('Erro no scanner:', err)}
      />

      {scannedCode && (
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Text size="sm" fw={500} c="dimmed">Codigo escaneado:</Text>
            <Code block>{scannedCode}</Code>
            <Text size="xs" c="dimmed">Formato: {scannedFormat}</Text>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
