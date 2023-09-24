import { createStyles, MantineNumberSize, getSize } from '@mantine/styles';
import { CSSProperties } from 'react';

export interface ArchbaseListStylesParams {
  withPadding: boolean;
  listStyleType: string;
  spacing: MantineNumberSize;
  center: boolean;
  horizontal: boolean;
  style: CSSProperties;
}

export default createStyles((theme, { withPadding, listStyleType, horizontal, style }: ArchbaseListStylesParams, { size }) => ({
  root: {
    ...theme.fn.fontStyles(),
    listStyleType,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: getSize({ size, sizes: theme.fontSizes }),
    lineHeight: theme.lineHeight,
    margin: 0,
    paddingLeft: withPadding ? theme.spacing.xl : 0,
    listStylePosition: 'inside',
    flexDirection: horizontal ? 'row' : 'column',
    display: horizontal ? 'flex' : 'inherit',
    ...style,
  },
}));
