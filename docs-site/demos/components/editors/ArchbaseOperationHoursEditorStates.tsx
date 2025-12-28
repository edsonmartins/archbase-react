import React, { useState } from 'react';
import { Stack, Card } from '@mantine/core';
import { ArchbaseOperatingHoursEditor } from '@archbase/components';

export function ArchbaseOperationHoursEditorStates() {
  const [normalValue, setNormalValue] = useState<string>('');
  const [preFilledValue, setPreFilledValue] = useState<string>(
    'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY|09:00-18:00;SATURDAY,SUNDAY|10:00-14:00'
  );
  const [readOnlyValue, setReadOnlyValue] = useState<string>(
    'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY|08:00-17:00'
  );
  const [errorValue, setErrorValue] = useState<string>('');

  return (
    <Stack gap="xl" p="md">
      <Card withBorder p="sm" radius="md">
        <ArchbaseOperatingHoursEditor
          label="Normal"
          initialValue={normalValue}
          onChange={setNormalValue}
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseOperatingHoursEditor
          label="Com valores preenchidos"
          initialValue={preFilledValue}
          onChange={setPreFilledValue}
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseOperatingHoursEditor
          label="Somente leitura"
          initialValue={readOnlyValue}
          onChange={setReadOnlyValue}
          readOnly
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseOperatingHoursEditor
          label="Com erro"
          initialValue={errorValue}
          onChange={setErrorValue}
          error="Defina pelo menos um horário de funcionamento"
        />
      </Card>
    </Stack>
  );
}
