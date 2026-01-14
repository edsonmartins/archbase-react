'use client';

import React from 'react';
import { Paper, Text, Group, Stack, useMantineColorScheme } from '@mantine/core';
import cx from 'clsx';
import classes from './MdxCard.module.css';

interface MdxCardProps {
  icon?: string;
  title: string;
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray';
}

export function MdxCard({ icon, title, children, color = 'blue' }: MdxCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colorMap = {
    blue: { light: '#e7f5ff', dark: '#1a3a5c', border: '#228be6', text: '#228be6' },
    green: { light: '#ebfbee', dark: '#1a3c29', border: '#40c057', text: '#40c057' },
    orange: { light: '#fff4e5', dark: '#3d2a0f', border: '#fd7e14', text: '#fd7e14' },
    red: { light: '#fff5f5', dark: '#3d1a1a', border: '#fa5252', text: '#fa5252' },
    purple: { light: '#f3f0ff', dark: '#2d2447', border: '#7950f2', text: '#7950f2' },
    gray: { light: '#f8f9fa', dark: '#2a2a2a', border: '#868e96', text: '#868e96' },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <Paper
      className={cx(classes.card, isDark && classes.dark)}
      style={{
        backgroundColor: isDark ? colors.dark : colors.light,
        borderColor: colors.border,
      }}
      p="md"
      radius="md"
      withBorder
    >
      <Group gap="sm" mb="sm">
        {icon && <span className={classes.icon}>{icon}</span>}
        <Text
          size="sm"
          fw={700}
          style={{ color: colors.text }}
          className={classes.title}
        >
          {title}
        </Text>
      </Group>
      <div className={classes.content}>
        {children}
      </div>
    </Paper>
  );
}
