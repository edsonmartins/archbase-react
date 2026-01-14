'use client';

import React, { useState } from 'react';
import { Stack, Text, UnstyledButton, Group, useMantineColorScheme } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import cx from 'clsx';
import classes from './MdxDetails.module.css';

interface MdxDetailsProps {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function MdxDetails({ summary, children, defaultOpen = false }: MdxDetailsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack gap={0} className={classes.wrapper}>
      <UnstyledButton
        className={cx(classes.button, isDark && classes.dark)}
        onClick={() => setOpen(!open)}
        p="sm"
      >
        <Group justify="space-between" gap="xl">
          <Text size="sm" fw={500}>
            {summary}
          </Text>
          <IconChevronRight
            size={18}
            className={cx(classes.chevron, open && classes.open)}
            style={{ color: isDark ? '#c1c2c5' : '#495057' }}
          />
        </Group>
      </UnstyledButton>
      {open && (
        <div className={cx(classes.content, isDark && classes.darkContent)}>
          {children}
        </div>
      )}
    </Stack>
  );
}
