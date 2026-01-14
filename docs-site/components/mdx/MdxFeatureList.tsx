'use client';

import React from 'react';
import { SimpleGrid, Text, Paper, useMantineColorScheme } from '@mantine/core';
import cx from 'clsx';
import classes from './MdxFeatureList.module.css';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface MdxFeatureListProps {
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export function MdxFeatureList({ features, columns = 3 }: MdxFeatureListProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: columns }}
      spacing="md"
      className={classes.grid}
    >
      {features.map((feature, index) => (
        <Paper
          key={index}
          className={cx(classes.feature, isDark && classes.dark)}
          p="md"
          radius="md"
          withBorder
        >
          <div className={classes.icon}>{feature.icon}</div>
          <Text size="sm" fw={700} mt="xs" mb="xs">
            {feature.title}
          </Text>
          <Text size="sm" c="dimmed">
            {feature.description}
          </Text>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
