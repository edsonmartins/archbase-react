import { Badge, Box } from '@mantine/core';
import { t } from 'i18next';
import React from 'react';

export type ArchbaseItemRenderType = {
  value: any;
  label: string;
  color: string;
};

export interface ArchbaseItemRenderProps {
  currentValue: string | undefined;
  values: ArchbaseItemRenderType[];
}

export function ArchbaseItemRender({ currentValue, values }: ArchbaseItemRenderProps) {
  const index = values.findIndex((item) => item.value.toString() === currentValue);
  if (index !== -1) {
    return (
      <Box>
        <Badge color={values[index].color}>{t(values[index].label)}</Badge>
      </Box>
    );
  }

  return null;
}
