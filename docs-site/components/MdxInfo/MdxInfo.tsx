import React from 'react';
import { Box } from '@mantine/core';
import classes from './MdxInfo.module.css';

interface MdxInfoProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'danger' | 'success';
}

export function MdxInfo({ children, type = 'info' }: MdxInfoProps) {
  return (
    <Box className={classes.info} data-type={type}>
      {children}
    </Box>
  );
}
