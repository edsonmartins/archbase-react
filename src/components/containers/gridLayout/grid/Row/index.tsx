import React, { forwardRef, ReactNode } from 'react';
import { getConfiguration } from '../../config';
import getStyle from './style';

export const ArchbaseGutterWidthContext = React.createContext(0);

interface ArchbaseRowProps {
  children: ReactNode;
  /**
   * Alinhamento vertical das colunas
   */
  align?: 'normal' | 'start' | 'center' | 'end' | 'stretch';
  /**
   * Alinhamento horizontal das colunas
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'initial' | 'inherit';
  /**
   * Atributo de estilo flex-direction
   */
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
  /**
   * Atributo de estilo flex-wrap
   */
  wrap?: 'nowrap' | 'wrap' | 'reverse';
  /**
   * Sem margens para esta linha
   */
  nogutter?: boolean;
  /**
   * Largura personalizada da margem para esta linha
   */
  gutterWidth?: number;
  /**
   * Estilo opcional
   */
  style?: { [key: string]: number | string };
  /**
   * Define para aplicar algum estilo de depuração
   */
  debug?: boolean;
  /**
   * Use seu próprio componente
   */
  component?: React.ElementType;
}

export const ArchbaseRow = forwardRef<HTMLElement, ArchbaseRowProps>(
  (
    {
      align= 'normal',
      justify= 'start',
      direction= 'row',
      wrap= 'wrap',
      nogutter= false,
      gutterWidth= 0,
      style= {},
      debug= false,
      component: CustomComponent = 'div',
      children,
      ...otherProps
    }: ArchbaseRowProps,
    ref
  ) => {
    let theGutterWidth = getConfiguration().gutterWidth;
    if (nogutter) theGutterWidth = 0;
    if (typeof gutterWidth === 'number') theGutterWidth = gutterWidth;
    const theStyle = getStyle({
      gutterWidth: theGutterWidth,
      align,
      justify,
      debug,
      moreStyle: style,
      direction,
      wrap,
    });
    return React.createElement(
      CustomComponent,
      { ref, style: theStyle, ...otherProps },
      <ArchbaseGutterWidthContext.Provider value={theGutterWidth}>
        {children}
      </ArchbaseGutterWidthContext.Provider>
    );
  }
);

ArchbaseRow.displayName = 'Row';


