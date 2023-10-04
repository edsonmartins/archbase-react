import React from 'react';
import { ObjectInspector } from 'react-inspector';
import { useArchbaseTheme } from '../../hooks';

export interface ArchbaseObjectInspectorProps {
  /** Objeto a ser exibido */
  data: any;
}

export function ArchbaseObjectInspector({ data }: ArchbaseObjectInspectorProps) {
  const theme = useArchbaseTheme()
  
  return <ObjectInspector theme={theme.colorScheme==='dark'?'chromeDark':'chromeLight'} data={data} />;
}
