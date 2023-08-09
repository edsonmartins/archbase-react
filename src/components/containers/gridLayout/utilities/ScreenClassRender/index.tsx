import React, { ReactNode } from 'react';
import { ArchbaseScreenClassResolver } from '../../context/ScreenClassResolver';

export interface ArchbaseScreenClassRenderProps {
  /**
   * A função cujo valor de retorno será renderizado.
   * Será chamado com um argumento: a classe da tela.
   */
  render: (screenClass: string) => ReactNode;
}

export const ArchbaseScreenClassRender: React.FC<ArchbaseScreenClassRenderProps> = ({
  render,
}: ArchbaseScreenClassRenderProps) => (
  <ArchbaseScreenClassResolver>
    {(screenClass: string) => render(screenClass)}
  </ArchbaseScreenClassResolver>
);

