import React, { useState, useEffect, ReactNode, useMemo, FocusEventHandler, useRef } from 'react';
import { uniqueId } from 'lodash';
import { ArchbaseListItem } from './ArchbaseListItem';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { ArchbaseError } from '../core';
import { useArchbaseDidMount, useArchbaseWillUnmount } from '../hooks';
import { Box, MantineNumberSize, Paper, useMantineTheme } from '@mantine/core';
import useStyles from './ArchbaseList.styles';
import { ArchbaseListProvider } from './ArchbaseList.context';
import { ArchbaseObjectHelper } from '../core/helper';
import { useUncontrolled } from '@mantine/hooks';
import { useArchbaseForceRerender } from '../hooks/useArchbaseForceRenderer';

export interface ArchbaseListCustomItemProps<T, _ID> {
  /** Chave */
  key: string;
  /** Id do item */
  id: any;
  /** Indicador se o Item está ativo */
  active: boolean;
  /** Indice dentro da lista */
  index: number;
  /** Registro contendo dados de uma linha na lista */
  recordData: T;
  /** Indicador se item da lista está desabilitado */
  disabled: boolean;
}

export interface ComponentDefinition {
  type: React.ElementType;
  props?: any;
}

export interface ArchbaseListProps<T, ID> {
  /** Cor de fundo do item ativo */
  activeBackgroundColor?: string;
  /** Cor do item ativo */
  activeColor?: string;
  /** Alinhamento dos itens na lista */
  align?: 'left' | 'right' | 'center';
  /** Cor de fundo da lista */
  backgroundColor?: string;
  /** Cor do texto da lista */
  color?: string;
  /** Altura da lista */
  height?: number | string;
  /** Largura da lista */
  width?: number | string;
  /** desabilita todos os itens da lista */
  disabled?: boolean;
  /** Indicador se os itens da lista devem ser justificados */
  justify?: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** Evento que ocorre quando um item da lista é selecionado */
  onSelectListItem?: (index: number, data: any) => void;
  /** Mostra uma borda ao redor da lista */
  withBorder?: boolean;
  /** Cor da borda */
  borderColor?: string;
  /** Arredondamento dos cantos da borda */
  borderRadius?: MantineNumberSize;
  /** Propriedade do objeto de dados que representa o texto a ser apresentado na lista */
  dataFieldText?: string;
  /** Propriedade do objeto de dados que representa o ID do item na lista para controle */
  dataFieldId?: string;
  /** Indice do item ativo na lista */
  activeIndex?: number;
  /** Indice default do item ativo na lista */
  defaultActiveIndex?: number;
  /** Evento gerado quando o mouse está sobre um item */
  onItemEnter?: (event: React.MouseEvent, data: any) => void;
  /** Evento gerado quando o mouse sai de um item */
  onItemLeave?: (event: React.MouseEvent, data: any) => void;
  /** Permite costumizar o style da lista */
  style?: React.CSSProperties;
  /** Id da lista */
  id?: string;
  /** Fonte de dados a ser usado pela lista */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Filtro a ser aplicado na lista */
  filter?: string;
  /** Function a ser aplicada na lista para filtrar os itens */
  onFilter?: (record: any) => boolean;
  /** Definições do componente customizado a ser renderizado para um Item da lista */
  component?: ComponentDefinition;
  /** Somente componentes <ArchbaseListItem /> */
  children?: React.ReactNode[];
  /** Tipo de lista: ol,ul,div */
  type?: 'ordered' | 'unordered' | 'none';
  /** Incluir preenchimento à esquerda para compensar a lista do conteúdo principal */
  withPadding?: boolean;
  /** Tamanho da fonte do tema ou número para definir o valor */
  size?: MantineNumberSize;
  /** Ícone que deve substituir o ponto do item da lista */
  icon?: React.ReactNode;
  /** Imagem ou source de uma imagem para mostrar no item da lista */
  image?: React.ReactNode | string;
  /** Arredondamento da Imagem */
  imageRadius?: MantineNumberSize;
  /** Altura da imagem */
  imageHeight?: number | string;
  /** Largura da Imagem */
  imageWidth?: number | string;
  /** Espaçamento entre os valores do item */
  spacing?: MantineNumberSize;
  /** Centralizar itens com ícone */
  center?: boolean;
  /** Lista horizontal */
  horizontal?: boolean;
  /** force update list */
  update?: number;
  /** Estilo de lista */
  listStyleType?: React.CSSProperties['listStyleType'];
  onFocusEnter?: FocusEventHandler<HTMLDivElement> | undefined;
  onFocusExit?: FocusEventHandler<HTMLDivElement> | undefined;
}

export function ArchbaseList<T, ID>(props: ArchbaseListProps<T, ID>) {
  const theme = useMantineTheme();
  const {
    activeBackgroundColor = theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 5],
    activeColor = 'white',
    backgroundColor,
    align,
    color,
    height = '20rem',
    justify = 'flex-start',
    onSelectListItem,
    width,
    withBorder = true,
    borderRadius,
    dataFieldText = 'text',
    dataFieldId = 'id',
    activeIndex,
    defaultActiveIndex,
    onItemEnter,
    onItemLeave,
    style,
    id,
    dataSource,
    filter,
    horizontal = false,
    onFilter,
    children,
    withPadding = false,
    listStyleType = '',
    center = false,
    spacing = 'md',
    type = 'none',
    icon,
    image,
    imageRadius,
    imageWidth,
    imageHeight,
    disabled,
    update = 0,
    onFocusEnter = () => {},
    onFocusExit = () => {},
  } = props;
  const [_activeIndex, setActiveIndex] = useState(activeIndex ? activeIndex : -1);

  const activeIndexRef = useRef<boolean>(false);
  const [rebuildedChildrens, setRebuildedChildrens] = useState<ReactNode[]>([]);
  const { classes } = useStyles({
    withPadding,
    listStyleType,
    center,
    spacing,
    horizontal,
    style: { width: width, height: height, overflowY: 'auto', ...style },
  });
  const [currentFilter, setCurrentFilter] = useState(filter);
  const [idList] = useState(id);

  useArchbaseDidMount(() => {
    if (activeIndex) {
      dataSource.gotoRecord(activeIndex);
    }
  });

  useArchbaseDidMount(() => {
    if (dataSource) {
      dataSource.addListener(dataSourceEvent);
    }
  });

  useArchbaseWillUnmount(() => {
    if (dataSource) {
      dataSource.removeListener(dataSourceEvent);
    }
  });

  useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);

  const dataSourceActiveIndexRef = useRef<boolean>(false);

  const dataSourceEvent = (event: DataSourceEvent<T>) => {
    if (dataSource) {
      if (event.type === DataSourceEventNames.afterScroll) {
        console.log('afterscroll', _activeIndex, dataSource.getCurrentIndex());
        console.log(onSelectListItem);
        console.log(!dataSource.isEmpty());
        if (!dataSource.isEmpty()) {
          if (_activeIndex !== dataSource.getCurrentIndex()) {
            dataSourceActiveIndexRef.current = true;
          }
        } else {
          setActiveIndex(-1);
        }
      }

      if (
        event.type === DataSourceEventNames.fieldChanged ||
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged
      ) {
        if (dataSource.isEmpty()) {
          setActiveIndex(-1);
        }
        if (!dataSource.isEmpty()) {
          if (_activeIndex !== dataSource.getCurrentIndex()) {
            dataSourceActiveIndexRef.current = true;
          }
        } else {
          setActiveIndex(-1);
        }
      }
    }
  };

  const rebuildedChildrenRef = useRef<boolean>(true);

  useEffect(() => {
    if (dataSourceActiveIndexRef.current) {
      dataSourceActiveIndexRef.current = false;
      if (dataSource && !dataSource.isEmpty()) {
        setActiveIndex(dataSource.getCurrentIndex());
        const record = dataSource.getCurrentRecord();
        if (onSelectListItem && record) {
          onSelectListItem(dataSource.getCurrentIndex(), record);
        }
        rebuildedChildrenRef.current = true;
      }
    }
  }, [dataSource.currentRecordIndex, dataSource, setActiveIndex, onSelectListItem]);

  useEffect(() => {
    if (activeIndexRef.current) {
      activeIndexRef.current = false;
      if (dataSource && !dataSource.isEmpty()) {
        const record = dataSource.gotoRecord(_activeIndex);
        if (onSelectListItem && record) {
          onSelectListItem(_activeIndex, record);
        }
        rebuildedChildrenRef.current = true;
      }
    }
  }, [_activeIndex, dataSource, onSelectListItem]);

  const handleSelectItem = (index: number, data: T) => {
    console.log('passou', index);
    activeIndexRef.current = true;
    setActiveIndex(index);
  };

  const handleKeyDown = (event) => {
    const keyActions = {
      38: () => handleArrowUp(),
      37: () => handleArrowLeft(),
      40: () => handleArrowDown(),
      39: () => handleArrowRight(),
      33: () => handlePageUp(),
      34: () => handlePageDown(),
      36: () => handleHome(),
      35: () => handleEnd(),
    };
    if (_activeIndex >= 0 && rebuildedChildrens.length > 0) {
      const action = keyActions[event.keyCode];
      if (action) {
        event.preventDefault();
        action();
      }
    }
  };

  const handleArrowUp = () => {
    let index = _activeIndex;
    if (index - 1 >= 0) {
      //setActiveIndex(index - 1)
      handleSelectItem(index - 1, getRecordDataFromChildren(index - 1));
    }
  };

  const handleArrowLeft = () => {
    handleArrowUp();
  };

  const handleArrowDown = () => {
    let index = _activeIndex;
    if (index + 1 < rebuildedChildrens.length) {
      // setActiveIndex(index + 1)
      handleSelectItem(index + 1, getRecordDataFromChildren(index + 1));
    }
  };

  const handleArrowRight = () => {
    handleArrowDown();
  };

  const handlePageUp = () => {
    let index = Math.max(_activeIndex - 5, 0);
    // setActiveIndex(index)
    handleSelectItem(index, getRecordDataFromChildren(index));
  };

  const handlePageDown = () => {
    let index = Math.min(_activeIndex + 5, rebuildedChildrens.length - 1);
    // setActiveIndex(index)
    handleSelectItem(index, getRecordDataFromChildren(index));
  };

  const handleHome = () => {
    // setActiveIndex(0)
    handleSelectItem(0, getRecordDataFromChildren(0));
  };

  const handleEnd = () => {
    const index = rebuildedChildrens.length - 1;
    // setActiveIndex(index)
    handleSelectItem(index, getRecordDataFromChildren(index));
  };

  const buildChildrensFromDataSource = (dataSource: ArchbaseDataSource<T, ID>) => {
    let sourceData = dataSource.browseRecords();
    if (sourceData.constructor !== Array) {
      throw new ArchbaseError('O dataSource deve ser obrigatoriamente um array de dados.');
    }

    return sourceData.map((record: any, index: number) => {
      if (!record) {
        return null;
      }

      let itemIsValid = true;
      if (currentFilter && dataFieldText) {
        if (ArchbaseObjectHelper.getNestedProperty(record, dataFieldText)) {
          if (!ArchbaseObjectHelper.getNestedProperty(record, dataFieldText).includes(currentFilter)) {
            itemIsValid = false;
          }
        }
      }
      if (onFilter) {
        itemIsValid = onFilter(record);
      }

      if (itemIsValid) {
        let active = record.active === undefined ? false : record.active;
        if (_activeIndex >= 0) {
          active = false;
          if (_activeIndex === index) {
            active = true;
          }
        }
        var { component, id, dataSource, ...rest } = props;
        if (component) {
          let DynamicComponent = component.type;
          let compProps = {};
          if (component.props) {
            compProps = component.props;
          }

          let newId = ArchbaseObjectHelper.getNestedProperty(record, dataFieldId);
          if (!newId) {
            newId = `${idList}_${index}`;
          }

          let newKey = `${idList}_${index}`;

          return (
            <DynamicComponent
              key={newKey}
              id={newId}
              active={active}
              index={index}
              dataSource={dataSource}
              recordData={record}
              disabled={record.disabled || disabled}
              {...compProps}
              {...rest}
              {...component.props}
            />
          );
        } else {
          let newId = ArchbaseObjectHelper.getNestedProperty(record, dataFieldId);
          if (!newId) {
            newId = `${idList}_${index}`;
          }
          let newKey = `${idList}_${index}`;

          return (
            <ArchbaseListItem
              key={newKey}
              disabled={record.disabled || disabled}
              id={newId}
              index={index}
              active={active}
              align={record.align}
              justify={record.justify === undefined ? justify : record.justify}
              activeBackgroundColor={
                record.activeBackColor === undefined ? activeBackgroundColor : record.activeBackColor
              }
              activeColor={record.activeColor === undefined ? activeColor : record.activeColor}
              backgroundColor={record.backgroundColor === undefined ? backgroundColor : record.backgroundColor}
              color={record.color === undefined ? color : record.color}
              imageRadius={imageRadius}
              imageHeight={imageHeight}
              imageWidth={imageWidth}
              icon={record.icon ? record.icon : icon}
              image={image}
              spacing={spacing}
              caption={ArchbaseObjectHelper.getNestedProperty(record, dataFieldText)}
              withBorder={record.withBorder === undefined ? withBorder : record.withBorder}
              visible={true}
              recordData={record}
            />
          );
        }
      }

      return null;
    });
  };

  const getRecordDataFromChildren = (index) => {
    let result;
    rebuildedChildrens.forEach((item: any) => {
      if (item.props.index === index) {
        result = item.props.recordData;
      }
    });

    return result;
  };

  const rebuildChildrens = (): ReactNode[] => {
    return React.Children.toArray(children).map((child: any, index: number) => {
      if (child.props.visible)
        if (child.type && child.type.componentName !== 'ArchbaseListItem') {
          throw new ArchbaseError(
            'Apenas componentes do tipo ArchbaseListItem podem ser usados como filhos de ArchbaseList.',
          );
        }
      if (!child.id) {
        throw new ArchbaseError('Todos os itens da lista devem conter um ID.');
      }
      let active: boolean = child.active;
      if (_activeIndex >= 0) {
        active = false;
        if (_activeIndex === index) {
          active = true;
        }
      }

      return (
        <ArchbaseListItem
          key={child.id}
          disabled={child.disabled || disabled}
          id={child.id}
          index={index}
          active={active}
          align={align}
          justify={child.justify === undefined ? justify : child.justify}
          activeBackgroundColor={child.activeBackColor === undefined ? activeBackgroundColor : child.activeBackColor}
          activeColor={child.activeColor === undefined ? activeColor : child.activeColor}
          backgroundColor={child.backgroundColor === undefined ? backgroundColor : child.backgroundColor}
          color={child.color === undefined ? color : child.color}
          imageRadius={child.imageRadius ? child.imageRadius : imageRadius}
          imageHeight={child.imageHeight ? child.imageHeight : imageHeight}
          imageWidth={child.imageWidth ? child.imageWidth : imageWidth}
          icon={child.icon ? child.icon : icon}
          image={child.image ? child.image : image}
          spacing={child.spacing ? child.spacing : spacing}
          caption={child.caption}
          withBorder={child.withBorder === undefined ? withBorder : child.withBorder}
          visible={child.visible}
        >
          {child.children}
        </ArchbaseListItem>
      );
    });
  };

  useEffect(() => {
    if (rebuildedChildrenRef.current) {
      if (dataSource) {
        const newChildrens = buildChildrensFromDataSource(dataSource);
        setRebuildedChildrens(newChildrens);
      } else if (children) {
        const newChildrens = rebuildChildrens();
        setRebuildedChildrens(newChildrens);
      } else {
        setRebuildedChildrens([]);
      }
      rebuildedChildrenRef.current = false;
    }
  }, [_activeIndex, dataSource, children, update]);
  console.log(dataSource);

  return (
    <Paper
      id={idList}
      tabIndex={-1}
      withBorder={withBorder}
      radius={borderRadius}
      onKeyDown={handleKeyDown}
      onFocus={onFocusEnter}
      onBlur={onFocusExit}
    >
      <Box<any>
        component={type === 'unordered' ? 'ul' : type === 'ordered' ? 'ol' : 'div'}
        className={classes.root}
        tabIndex={-1}
      >
        <ArchbaseListProvider
          value={{
            dataSource,
            ownerId: id,
            handleSelectItem,
            activeBackgroundColor,
            activeColor,
            type,
            onItemEnter,
            onItemLeave,
            align,
          }}
        >
          {rebuildedChildrens}
        </ArchbaseListProvider>
      </Box>
    </Paper>
  );
}

ArchbaseList.displayName = 'ArchbaseList';
