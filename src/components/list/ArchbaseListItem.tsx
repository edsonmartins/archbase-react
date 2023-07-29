import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import ArchbaseListContext, { ArchbaseListContextValue } from './ArchbaseList.context';
import { MantineNumberSize } from '@mantine/core';
export interface ArchbaseListItemProps<T,_ID> {
  /** Indicador se o item está ativo(selecionado) */
  active: boolean;
  /** Cor de fundo do item */
  activeBackgroundColor?: string;
  /** Cor do item se ele estiver ativo */
  activeColor?: string;
  /** Alinhamento do texto do item */
  align?: 'left' | 'right' | 'center';
  /** Cor de fundo do item não selecionado */
  backgroundColor?: string;
  /** Texto do item */
  caption: string;
  /** Cor da fonte do item */
  color: string;
  /** Filhos do item */
  children?: ReactNode;
  /** Indicador se o item está desabilitado */
  disabled: boolean;
  /** Icone a ser apresentado ao lado esquerdo do item */
  icon?: ReactNode | string;
  /** Id do item */
  id: any;
  /** Posição do item dentro da lista */
  index: number;
  /** Imagem a ser apresentada ao lado esquerdo do item */
  image?: ReactNode | string;
  /** Indicador se a imagem dever ser em forma de circulo */
  imageCircle?: boolean;
  /** Altura da Imagem */
  imageHeight?: string;
  /** Largura da Imagem */
  imageWidth?: string;
  /** Indicador se o conteúdo do item deve ser justificado */
  justify?: boolean;
  /** Indicador se o item deve ter uma borda */
  showBorder?: boolean;
  /** Cor da borda */
  borderColor?: string;
  /** Arredondamento dos cantos da borda */
  borderRadius?: MantineNumberSize;
  /** Dados do item a ser apresentado */
  recordData?: T;
  /** Indicador se o item está visivel na lista */
  visible?: boolean;
}

export function ArchbaseListItem<T,ID>({
  active,
  activeBackgroundColor,
  activeColor,
  align,
  backgroundColor,
  caption,
  color,
  disabled,
  icon,
  id,
  index,
  image,
  imageCircle,
  imageHeight,
  imageWidth,
  justify,
  children,
  recordData,
  showBorder = true,
  borderColor,
  borderRadius,
}: ArchbaseListItemProps<T,ID>) {
  const listContextValue = useContext<ArchbaseListContextValue<T,ID>>(ArchbaseListContext);
  const itemRef = useRef<any>(null);

  useEffect(()=>{
    if (itemRef.current && active) {
      itemRef.current.focus();
    }
  },[active])

  const onClick = (event) => {
    event.preventDefault();
    if (!disabled) {
      if (listContextValue.handleSelectItem) {
        listContextValue.handleSelectItem(index, recordData!);
      }
    }
  };

  const handleMouseOver = (event: React.MouseEvent) => {
    if (listContextValue.onItemEnter) {
      listContextValue.onItemEnter(event, recordData!);
    }
  };

  const handleMouseOut = (event: React.MouseEvent) => {
    if (listContextValue.onItemLeave) {
      listContextValue.onItemLeave(event, recordData!);
    }
  };

  let style = {};
  if (activeBackgroundColor && activeColor && active) {
    style = { backgroundColor: activeBackgroundColor, color: activeColor };
  } else if (backgroundColor && color && !active) {
    style = { backgroundColor: backgroundColor, color: color };
  }

  let classNameImage;
  if (imageCircle) {
    classNameImage = ' img-circle';
  }

  const ComponentItem = listContextValue.type==='ordered'?'ol':listContextValue.type==='unordered'?'ul':'div';
  return (
    <ComponentItem
      tabIndex={-1}
      ref={itemRef}
      style={style}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      id={'lstItem_' + listContextValue.ownerId + '_' + id}
      key={'lstItem_' + listContextValue.ownerId + '_' + id}
    >
      {icon} {image} {caption}
      {children}
    </ComponentItem>
  );
}

ArchbaseListItem.defaultProps = {
  align: 'left',
  justify: false,
  showBorder: false,
  disabled: false
}

ArchbaseListItem.displayName = 'ArchbaseListItem';
