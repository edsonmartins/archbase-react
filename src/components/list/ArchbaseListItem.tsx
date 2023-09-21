import React, { ReactNode, useContext, useEffect, useRef } from 'react'
import { Image, MantineNumberSize, Space } from '@mantine/core'
import ArchbaseListContext, { ArchbaseListContextValue } from './ArchbaseList.context'

export interface ArchbaseListItemProps<T, ID> {
  /** Indicador se o item está ativo(selecionado) */
  active: boolean
  /** Cor de fundo do item */
  activeBackgroundColor?: string
  /** Cor do item se ele estiver ativo */
  activeColor?: string
  /** Alinhamento do texto do item */
  align?: 'left' | 'right' | 'center'
  /** Cor de fundo do item não selecionado */
  backgroundColor?: string
  /** Texto do item */
  caption: string
  /** Cor da fonte do item */
  color: string
  /** Filhos do item */
  children?: ReactNode
  /** Indicador se o item está desabilitado */
  disabled: boolean
  /** Icone a ser apresentado ao lado esquerdo do item */
  icon?: ReactNode
  /** Id do item */
  id: any
  /** Posição do item dentro da lista */
  index: number
  /** Imagem a ser apresentada ao lado esquerdo do item */
  image?: ReactNode | string
  /** Arredondamento da Imagem */
  imageRadius?: MantineNumberSize
  /** Altura da imagem */
  imageHeight?: number | string
  /** Largura da Imagem */
  imageWidth?: number | string
  /** Indicador se o conteúdo do item deve ser justificado */
  justify?: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /** Indicador se o item deve ter uma borda */
  withBorder?: boolean
  /** Cor da borda */
  borderColor?: string
  /** Arredondamento dos cantos da borda */
  borderRadius?: MantineNumberSize
  /** Dados do item a ser apresentado */
  recordData?: T
  /** Indicador se o item está visivel na lista */
  visible?: boolean
  /** Espaçamento entre os valores do item */
  spacing?: MantineNumberSize
}

export function ArchbaseListItem<T, ID>({
  active,
  activeBackgroundColor,
  activeColor,
  //align,
  backgroundColor,
  caption,
  color,
  disabled,
  icon,
  id,
  index,
  image,
  imageRadius,
  imageHeight,
  imageWidth,
  justify = 'flex-start',
  children,
  recordData,
  spacing = 'md'
}: ArchbaseListItemProps<T, ID>) {
  const listContextValue = useContext<ArchbaseListContextValue<T, ID>>(ArchbaseListContext)
  const itemRef = useRef<any>(null)

  useEffect(() => {
    if (itemRef.current && active) {
      itemRef.current.focus()
    }
  }, [active])

  const onClick = (event) => {
    event.preventDefault()
    if (!disabled) {
      if (listContextValue.handleSelectItem) {
        listContextValue.handleSelectItem(index, recordData!)
      }
    }
  }

  const handleMouseOver = (event: React.MouseEvent) => {
    if (listContextValue.onItemEnter) {
      listContextValue.onItemEnter(event, recordData!)
    }
  }

  const handleMouseOut = (event: React.MouseEvent) => {
    if (listContextValue.onItemLeave) {
      listContextValue.onItemLeave(event, recordData!)
    }
  }

  let style = {
    display: 'flex',
    backgroundColor: '',
    color: '',
    justifyContent: justify,
    alignItems: 'center'
  }
  if (activeBackgroundColor && activeColor && active) {
    style = { ...style, backgroundColor: activeBackgroundColor, color: activeColor }
  } else if (backgroundColor && color && !active) {
    style = { ...style, backgroundColor: backgroundColor, color: color }
  }
  const imageComp = image ? (
    typeof image === 'string' ? (
      <Image
        src={recordData![image]}
        radius={imageRadius}
        width={imageWidth}
        height={imageHeight}
      />
    ) : (
      image
    )
  ) : (
    image
  )

  const ComponentItem =
    listContextValue.type === 'ordered'
      ? 'ol'
      : listContextValue.type === 'unordered'
      ? 'ul'
      : 'div'
  return (
    <ComponentItem
      tabIndex={-1}
      ref={itemRef}
      style={style}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      id={`stItem_${listContextValue.ownerId}_${id}`}
      key={`lstItem_${listContextValue.ownerId}_${id}`}
    >
      {icon}
      {icon ? <Space w={spacing} /> : null}
      {imageComp}
      {imageComp ? <Space w={spacing} /> : null}
      {caption}
      {children}
    </ComponentItem>
  )
}

ArchbaseListItem.defaultProps = {
  align: 'left',
  justify: false,
  showBorder: false,
  disabled: false
}

ArchbaseListItem.displayName = 'ArchbaseListItem'
