import { Flex, Footer, MantineNumberSize } from '@mantine/core';
import React, { ReactNode } from 'react';

export interface ArchbaseAdminLayoutFooterProps {
  children?: ReactNode | ReactNode[];
  height?: MantineNumberSize;
}

export const ArchbaseAdminLayoutFooter = ({ children, height = 60 }: ArchbaseAdminLayoutFooterProps) => {
  return (
    <Footer height={height} p="md">
      <Flex align="center" direction="row" wrap="wrap">
        {children}
      </Flex>
    </Footer>
  );
};
