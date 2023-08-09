import React, { createElement, forwardRef, ReactNode, ElementType } from 'react';
import getStyle from './style';
import { getConfiguration } from '../../config';
import { ArchbaseGutterWidthContext } from '../Row';
import { ArchbaseScreenClassResolver } from '../../context/ScreenClassResolver';
import { useMantineTheme } from '@mantine/core';

export interface ArchbaseColProps {
  /**
   * Conteúdo da coluna
   */
  children?: ReactNode;
  /**
   * Largura da coluna para a classe de tela `xs`, pode ser um número entre 0 e 12, ou "content"
   */
  xs?: number | 'content';
  /**
   * Largura da coluna para a classe de tela `sm`, pode ser um número entre 0 e 12, ou "content"
   */
  sm?: number | 'content';
  /**
   * Largura da coluna para a classe de tela `md`, pode ser um número entre 0 e 12, ou "content"
   */
  md?: number | 'content';
  /**
   * Largura da coluna para a classe de tela `lg`, pode ser um número entre 0 e 12, ou "content"
   */
  lg?: number | 'content';
  /**
   * Largura da coluna para a classe de tela `xl`, pode ser um número entre 0 e 12, ou "content"
   */
  xl?: number | 'content';
  /**
   * Largura da coluna para a classe de tela `xxl`, pode ser um número entre 0 e 12, ou "content"
   */
  xxl?: number | 'content';
  /**
   * Largura da coluna para a classe de tela `xxxl`, pode ser um número entre 0 e 12, ou "content"
   */
  xxxl?: number | 'content';
  /**
   * Deslocamento dessa coluna para todas as classes de tela
   */
  offset?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xxxl?: number;
  };
  /**
   * Quantidade que essa coluna é empurrada para a direita para todas as classes de tela
   */
  push?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xxxl?: number;
  };
  /**
   * Quantidade que essa coluna é puxada para a esquerda para todas as classes de tela
   */
  pull?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xxxl?: number;
  };
  /**
   * Ordem em que essa coluna é puxada para a esquerda para todas as classes de tela
   */
  order?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
    xxxl?: number;
  };
  /**
   * Defina para aplicar um estilo de depuração
   */
  debug?: boolean;
  /**
   * Estilo opcional
   */
  style?: { [key: string]: number | string };
  /**
   * Use seu próprio componente
   */
  component?: ElementType;
  /**
   * Largura fixa da coluna para todas as classes de tela
   */
  width?: number | string;
}

export const ArchbaseCol = forwardRef<HTMLElement, ArchbaseColProps>(
  (
    {
      children,
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
      xxxl,
      offset = {},
      push = {},
      pull = {},
      order = {},
      debug,
      style: moreStyle = {},
      component: CustomComponent = 'div',
      width,
      ...otherProps
    }: ArchbaseColProps,
    ref,
  ) => {
    const theme = useMantineTheme();
    return (
      <ArchbaseScreenClassResolver>
        {(screenClass: any) => (
          <ArchbaseGutterWidthContext.Consumer>
            {(gutterWidth) => {
              const theStyle = getStyle({
                forceWidth: width,
                width: {
                  'xs': xs!,
                  'sm': sm!,
                  'md': md!,
                  'lg': lg!,
                  'xl': xl!,
                  'xxl': xxl!,
                  'xxxl': xxxl!,
                },
                offset,
                pull,
                push,
                order,
                debug,
                screenClass,
                gutterWidth,
                gridColumns: getConfiguration().gridColumns,
                moreStyle,
                theme,
              });
              return createElement(CustomComponent, { ref, style: theStyle, ...otherProps, children });
            }}
          </ArchbaseGutterWidthContext.Consumer>
        )}
      </ArchbaseScreenClassResolver>
    );
  },
);

ArchbaseCol.displayName = 'ArchbaseCol';
