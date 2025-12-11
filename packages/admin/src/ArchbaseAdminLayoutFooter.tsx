/**
 * ArchbaseAdminLayoutFooter — rodapé do layout admin.
 * @status stable
 */
import { Flex } from '@mantine/core';
import React, { ReactNode } from 'react';

export interface ArchbaseAdminLayoutFooterProps {
	children?: ReactNode | ReactNode[];
}

export const ArchbaseAdminLayoutFooter = ({ children }: ArchbaseAdminLayoutFooterProps) => {
	return (
		<Flex align="center" direction="row" wrap="wrap" h={'100%'}>
			{children}
		</Flex>
	);
};
