import React from 'react';
import { ObjectInspector } from 'react-inspector';

export interface ArchbaseObjectInspectorProps {
  /** Objeto a ser exibido */
  data: any;
  theme?: string;
}

export function ArchbaseObjectInspector({ data, theme }: ArchbaseObjectInspectorProps) {
  return <ObjectInspector theme={theme} data={data} />;
}
