import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseSwitch } from '@archbase/components';
import { IconCheck, IconX } from '@tabler/icons-react';

export function ArchbaseSwitchStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseSwitch
        label="Switch normal"
      />

      {/* Ligado */}
      <ArchbaseSwitch
        label="Switch ligado"
        isChecked
      />

      {/* Com labels */}
      <ArchbaseSwitch
        label="Com labels ON/OFF"
        onLabel="ON"
        offLabel="OFF"
      />

      {/* Com icone no thumb */}
      <ArchbaseSwitch
        label="Com icone no thumb"
        thumbIcon={<IconCheck size={12} />}
        isChecked
      />

      {/* Desabilitado */}
      <ArchbaseSwitch
        label="Switch desabilitado"
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseSwitch
        label="Somente leitura"
        readOnly
        isChecked
      />

      {/* Com erro */}
      <ArchbaseSwitch
        label="Com erro"
        error="Voce deve ativar esta opcao"
      />

      {/* Com descricao */}
      <ArchbaseSwitch
        label="Com descricao"
        description="Ative para habilitar o recurso"
      />

      {/* Com valores customizados */}
      <ArchbaseSwitch
        label="Valores customizados (1/0)"
        trueValue={1}
        falseValue={0}
      />
    </Stack>
  );
}
