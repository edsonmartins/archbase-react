import React from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import './overlayscrollbars.css';

export const FullHeightOverlayScrollbars: React.FC<{
  children: React.ReactNode | React.ReactElement;
  height: string | number;
}> = props => {
  return (
    <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: 'scroll' } }}>
      <div style={{ height: props.height }}>{props.children}</div>
    </OverlayScrollbarsComponent>
  );
};
