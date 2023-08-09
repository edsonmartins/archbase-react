import React, { ReactNode } from 'react';
import * as style from './style';
import { ArchbaseScreenClassResolver } from '../../context/ScreenClassResolver';

export interface ArchbaseHiddenProps {
  /**
   * Conteúdo do componente
   */
  children: ReactNode;
  /**
   * Esconder em dispositivos extra pequenos
   */
  xs?: boolean;
  /**
   * Esconder em dispositivos pequenos
   */
  sm?: boolean;
  /**
   * Esconder em dispositivos médios
   */
  md?: boolean;
  /**
   * Esconder em dispositivos grandes
   */
  lg?: boolean;
  /**
   * Esconder em dispositivos extra grandes
   */
  xl?: boolean;
  /**
   * Esconder em dispositivos muito grandes (xxlarge)
   */
  xxl?: boolean;
  /**
   * Esconder em dispositivos extremamente grandes (xxxlarge)
   */
  xxxl?: boolean;
}

export const ArchbaseHidden: React.FC<ArchbaseHiddenProps> = ({
  children,
  xs = false,
  sm = false,
  md = false,
  lg = false,
  xl = false,
  xxl = false,
  xxxl = false,
}: ArchbaseHiddenProps) => (
  <ArchbaseScreenClassResolver>
    {(screenClass: any) =>
      style.hidden({
        screenClass,
        xs,
        sm,
        md,
        lg,
        xl,
        xxl,
        xxxl,
      })
        ? null
        : children
    }
  </ArchbaseScreenClassResolver>
);
