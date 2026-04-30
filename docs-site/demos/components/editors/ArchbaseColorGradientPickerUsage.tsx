import React, { useState } from 'react';
import { Stack, Card, Text, Group, Box } from '@mantine/core';
import { ArchbaseColorGradientPicker, ArchbaseFlatColorPicker } from '@archbase/components';

export function ArchbaseColorGradientPickerUsage() {
  const [color, setColor] = useState('#339af0');
  const [flatColor, setFlatColor] = useState('#fa5252');

  return (
    <Stack gap="md" p="md">
      <Card withBorder p="md">
        <Text fw={500} mb="md">Color Gradient Picker</Text>
        <Group align="flex-start">
          <ArchbaseColorGradientPicker
            value={color}
            onChange={setColor}
            swatches={[
              '#fa5252', '#e64980', '#be4bdb', '#7950f2',
              '#4c6ef5', '#228be6', '#15aabf', '#12b886',
              '#40c057', '#82c91e', '#fab005', '#fd7e14',
            ]}
            showEyeDropper
            showAlphaSlider
          />
          <Box>
            <Text size="sm" c="dimmed">Cor selecionada:</Text>
            <Text ff="monospace">{color}</Text>
            <Box
              mt="xs"
              w={100}
              h={50}
              style={{ backgroundColor: color, borderRadius: 4 }}
            />
          </Box>
        </Group>
      </Card>

      <Card withBorder p="md">
        <Text fw={500} mb="md">Flat Color Picker (paleta simples)</Text>
        <Group align="flex-start">
          <ArchbaseFlatColorPicker
            value={flatColor}
            onChange={setFlatColor}
            swatches={[
              '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5',
              '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e',
              '#fab005', '#fd7e14', '#868e96', '#495057', '#212529',
            ]}
            columns={5}
          />
          <Box>
            <Text size="sm" c="dimmed">Cor selecionada:</Text>
            <Text ff="monospace">{flatColor}</Text>
            <Box
              mt="xs"
              w={100}
              h={50}
              style={{ backgroundColor: flatColor, borderRadius: 4 }}
            />
          </Box>
        </Group>
      </Card>
    </Stack>
  );
}
