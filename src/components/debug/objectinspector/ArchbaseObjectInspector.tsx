import { useColorScheme } from '@mantine/hooks';
import React from 'react';
import { ObjectInspector } from 'react-inspector';

export interface ArchbaseObjectInspectorProps {
	/** Objeto a ser exibido */
	data: any;
	expandLevel?: number;
}

export function ArchbaseObjectInspector({ data, expandLevel }: ArchbaseObjectInspectorProps) {
	const colorScheme = useColorScheme();

	return (
		<ObjectInspector
			theme={colorScheme === 'dark' ? 'chromeDark' : 'chromeLight'}
			data={data}
			expandLevel={expandLevel}
		/>
	);
}
