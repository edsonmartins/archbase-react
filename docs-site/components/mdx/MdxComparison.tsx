'use client';

import React from 'react';
import { Stack, Text, Paper, useMantineColorScheme, Badge } from '@mantine/core';
import cx from 'clsx';
import classes from './MdxComparison.module.css';

interface ComparisonItem {
  label: string;
  left: string | React.ReactNode;
  right: string | React.ReactNode;
  highlight?: 'left' | 'right' | 'both' | 'none';
}

interface MdxComparisonProps {
  left: string;
  right: string;
  children: React.ReactNode;
}

interface ComparisonRowProps {
  item: ComparisonItem;
  leftLabel: string;
  rightLabel: string;
  isDark: boolean;
}

function ComparisonRow({ item, leftLabel, rightLabel, isDark }: ComparisonRowProps) {
  const getHighlightClass = () => {
    if (item.highlight === 'left') return classes.highlightLeft;
    if (item.highlight === 'right') return classes.highlightRight;
    if (item.highlight === 'both') return classes.highlightBoth;
    return '';
  };

  const getBadge = () => {
    if (item.highlight === 'left') return <Badge size="xs" color="green">Melhor</Badge>;
    if (item.highlight === 'right') return <Badge size="xs" color="green">Melhor</Badge>;
    if (item.highlight === 'both') return <Badge size="xs" color="blue">Igual</Badge>;
    return null;
  };

  return (
    <tr className={cx(classes.row, isDark && classes.darkRow)}>
      <td className={classes.labelCell}>
        <Text size="sm" fw={500}>{item.label}</Text>
      </td>
      <td className={cx(classes.valueCell, getHighlightClass())}>
        {typeof item.left === 'string' ? (
          <Text size="sm">{item.left}</Text>
        ) : (
          item.left
        )}
      </td>
      <td className={cx(classes.valueCell, getHighlightClass())}>
        {typeof item.right === 'string' ? (
          <Text size="sm">{item.right}</Text>
        ) : (
          item.right
        )}
      </td>
      <td className={classes.badgeCell}>
        {getBadge()}
      </td>
    </tr>
  );
}

export function MdxComparison({ left, right, children }: MdxComparisonProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Extrair itens do children (esperado ser um array de ComparisonItem)
  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<ComparisonItem> =>
      React.isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props !== null &&
      'label' in child.props
  ) as React.ReactElement<ComparisonItem>[];

  return (
    <Paper
      className={cx(classes.comparison, isDark && classes.dark)}
      p="md"
      radius="md"
      withBorder
    >
      <table className={classes.table}>
        <thead>
          <tr className={cx(classes.header, isDark && classes.darkHeader)}>
            <th className={classes.headerCell}>Recurso</th>
            <th className={classes.headerCell}>{left}</th>
            <th className={classes.headerCell}>{right}</th>
            <th className={classes.headerCell}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ComparisonRow
              key={index}
              item={item.props}
              leftLabel={left}
              rightLabel={right}
              isDark={isDark}
            />
          ))}
        </tbody>
      </table>
    </Paper>
  );
}

MdxComparison.Row = (props: ComparisonItem) => null as any;
