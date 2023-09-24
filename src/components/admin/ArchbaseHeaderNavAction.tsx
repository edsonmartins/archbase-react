import React, { ReactNode } from 'react';
import { Group } from '@mantine/core';

export interface ArchbaseHeaderNavActionProps {
  children: ReactNode[];
}

export const ArchbaseHeaderNavAction = (props: ArchbaseHeaderNavActionProps) => {
  return <Group spacing="sm">{props.children}</Group>;
};
