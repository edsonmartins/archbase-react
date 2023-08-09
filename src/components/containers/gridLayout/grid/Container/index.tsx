import React, { createElement, forwardRef, ReactNode } from 'react';
import getStyle from './style';
import { getConfiguration } from '../../config';
import { ArchbaseScreenClassResolver} from '../../context/ScreenClassResolver';

export interface ArchbaseGridContainerProps {
  children: ReactNode;
  /**
   * Verdadeiro torna o container com largura total, falso com largura fixa
   */
  fluid?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em xs, não presente significa fluído em todos os lugares
   */
  xs?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em sm, não presente significa fluído em todos os lugares
   */
  sm?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em md, não presente significa fluído em todos os lugares
   */
  md?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em lg, não presente significa fluído em todos os lugares
   */
  lg?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em xl, não presente significa fluído em todos os lugares
   */
  xl?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em xxl, não presente significa fluído em todos os lugares
   */
  xxl?: boolean;
  /**
   * Isso é em combinação com fluid ativado
   * Verdadeiro torna o container fluído apenas em xxxl, não presente significa fluído em todos os lugares
   */
  xxxl?: boolean;
  /**
   * Estilo opcional
   */
  style?: { [key: string]: number | string };
  /**
   * Use seu próprio componente
   */
  component?: React.ElementType;
}

export const ArchbaseGridContainer = forwardRef<HTMLElement, ArchbaseGridContainerProps>(
  (
    {
      children,
      fluid= false,
      xs= false,
      sm= false,
      md= false,
      lg= false,
      xl= false,
      xxl= false,
      xxxl= false,
      style,
      component: CustomComponent = 'div',
      ...otherProps
    }: ArchbaseGridContainerProps,
    ref
  ) => (
    <ArchbaseScreenClassResolver>
      {(screenClass: any) =>
        createElement(
          CustomComponent,
          {
            ref,
            style: getStyle({
              fluid, 
              xs,
              sm,
              md,
              lg,
              xl,
              xxl,
              xxxl,
              screenClass,
              containerWidths: getConfiguration().containerWidths,
              gutterWidth: getConfiguration().gutterWidth,
              moreStyle: style,
            }),
            ...otherProps,
          },
          children
        )
      }
    </ArchbaseScreenClassResolver>
  )
);
