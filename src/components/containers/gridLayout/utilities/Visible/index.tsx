import React, { ReactNode } from 'react';
import * as style from './style';
import { ArchbaseScreenClassResolver } from '../../context/ScreenClassResolver';

interface ArchbaseVisibleProps {
  /**
   * Conteúdo do componente
   */
  children: ReactNode;
  /**
   * Mostrar em dispositivos extra pequenos
   */
  xs?: boolean;
  /**
   * Mostrar em dispositivos pequenos
   */
  sm?: boolean;
  /**
   * Mostrar em dispositivos médios
   */
  md?: boolean;
  /**
   * Mostrar em dispositivos grandes
   */
  lg?: boolean;
  /**
   * Mostrar em dispositivos extra grandes
   */
  xl?: boolean;
  /**
   * Mostrar em dispositivos muito grandes (xxlarge)
   */
  xxl?: boolean;
  /**
   * Mostrar em dispositivos extremamente grandes (xxxlarge)
   */
  xxxl?: boolean;
}

export const ArchbaseVisible: React.FC<ArchbaseVisibleProps> = ({
  children,
  xs = false,
  sm = false,
  md = false,
  lg = false,
  xl = false,
  xxl = false,
  xxxl = false,
}: ArchbaseVisibleProps) => (
  <ArchbaseScreenClassResolver>
    {(screenClass) =>
      !style.visible({
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
