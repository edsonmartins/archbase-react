import { Group } from '@mantine/core';
import React, { ReactNode } from 'react';

export interface ArchbaseHeaderNavActionProps {
	children: ReactNode[];
}

export const ArchbaseHeaderNavAction = (props: ArchbaseHeaderNavActionProps) => {
	return <Group gap="sm">{props.children}</Group>;
};
