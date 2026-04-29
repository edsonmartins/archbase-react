import React, { useState } from 'react';
import { Stack, Group, Text, Card } from '@mantine/core';
import { ArchbaseNumberStepper } from '@archbase/components';

export function ArchbaseNumberStepperUsage() {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(99.99);

  return (
    <Stack gap="md" p="md">
      <Card withBorder p="md">
        <Text size="sm" mb="xs">Quantidade:</Text>
        <ArchbaseNumberStepper
          value={quantity}
          onChangeValue={setQuantity}
          min={1}
          max={100}
          step={1}
          label="Quantidade"
        />
      </Card>

      <Card withBorder p="md">
        <Text size="sm" mb="xs">Preço (com decimais):</Text>
        <ArchbaseNumberStepper
          value={price}
          onChangeValue={setPrice}
          min={0}
          step={0.5}
          precision={2}
          prefix="R$ "
          label="Preço"
        />
      </Card>

      <Card withBorder p="md">
        <Text size="sm" mb="xs">Tamanhos diferentes:</Text>
        <Group>
          <ArchbaseNumberStepper
            value={5}
            min={0}
            max={10}
            size="xs"
            label="XS"
          />
          <ArchbaseNumberStepper
            value={5}
            min={0}
            max={10}
            size="sm"
            label="SM"
          />
          <ArchbaseNumberStepper
            value={5}
            min={0}
            max={10}
            size="md"
            label="MD"
          />
          <ArchbaseNumberStepper
            value={5}
            min={0}
            max={10}
            size="lg"
            label="LG"
          />
        </Group>
      </Card>
    </Stack>
  );
}
