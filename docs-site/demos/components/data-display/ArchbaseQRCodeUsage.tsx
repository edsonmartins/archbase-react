import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseQRCode } from '@archbase/components';

export function ArchbaseQRCodeUsage() {
  return (
    <Stack gap="md" p="md" align="center">
      <Text fw={500}>QR Code padrão</Text>
      <ArchbaseQRCode
        value="https://archbase.com.br"
        size={200}
        level="M"
        bgColor="#ffffff"
        fgColor="#000000"
      />
      <Text fw={500}>QR Code com cores customizadas</Text>
      <ArchbaseQRCode
        value="https://github.com/edsonmartins/archbase-react"
        size={150}
        level="H"
        bgColor="#f0f0f0"
        fgColor="#228be6"
      />
    </Stack>
  );
}
