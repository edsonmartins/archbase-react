import React, { useState } from 'react';
import { Stack, Card } from '@mantine/core';
import { ArchbaseCronExpressionEdit } from '@archbase/components';

export function ArchbaseCronExpressionEditStates() {
  const [dailyValue, setDailyValue] = useState<string>('0 0 * * *');
  const [weeklyValue, setWeeklyValue] = useState<string>('0 0 * * 0');
  const [hourlyValue, setHourlyValue] = useState<string>('0 * * * *');
  const [readOnlyValue, setReadOnlyValue] = useState<string>('0 0 * * *');
  const [errorValue, setErrorValue] = useState<string>('');

  return (
    <Stack gap="xl" p="md">
      <Card withBorder p="sm" radius="md">
        <ArchbaseCronExpressionEdit
          label="Diariamente (meia-noite)"
          value={dailyValue}
          onChange={setDailyValue}
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseCronExpressionEdit
          label="Semanalmente (domingo à meia-noite)"
          value={weeklyValue}
          onChange={setWeeklyValue}
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseCronExpressionEdit
          label="A cada hora"
          value={hourlyValue}
          onChange={setHourlyValue}
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseCronExpressionEdit
          label="Somente leitura"
          value={readOnlyValue}
          onChange={setReadOnlyValue}
          readOnly
        />
      </Card>

      <Card withBorder p="sm" radius="md">
        <ArchbaseCronExpressionEdit
          label="Com erro"
          value={errorValue}
          onChange={setErrorValue}
          error="Expressão cron inválida"
        />
      </Card>
    </Stack>
  );
}
