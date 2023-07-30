import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import { uniqueId } from 'lodash';
import { ArchbaseListItem } from './ArchbaseListItem';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { ArchbaseError } from '@components/core';
import { useArchbaseDidMount, useArchbaseWillUnmount } from '@components/hooks';
import { Box, MantineNumberSize, Paper, useMantineTheme } from '@mantine/core';
import useStyles from './ArchbaseList.styles';
import { ArchbaseListProvider } from './ArchbaseList.context';

export interface ArchbaseListCustomItemProps<T,_ID> {
  /** Chave */
  key: string;
  /** Id do item */
  id : any;
  /** Indicador se o Item está ativo */
  active : boolean;
  /** Indice dentro da lista */
  index : number;
  /** Registro contendo dados de uma linha na lista */
  recordData: T,
  /** Indicador se item da lista está desabilitado */
  disabled: boolean;
}

export interface ComponentDefinition {
  type: React.ElementType;
  props?: any
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
  /** Indicador se os itens da lista devem ser justificados */
  justify?: 'flex-start'|'center'|'space-between'|'space-around'|'space-evenly';
  /** Evento que ocorre quando um item da lista é selecionado */
  onSelectListItem?: (index: number, data: any) => void;
  /** Mostra uma borda ao redor da lista */
  showBorder?: boolean;
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
  /** Estilo de lista */
  listStyleType?: React.CSSProperties['listStyleType'];
}
export function ArchbaseList<T, ID>(props: ArchbaseListProps<T, ID>) {
  const theme = useMantineTheme();
  const {
    activeBackgroundColor = theme.colors.archbase[theme.colorScheme === 'dark' ? 5 : 5],
    activeColor = 'white',
    backgroundColor,
    align,
    color,
    height = '20rem',
    justify='flex-start',
    onSelectListItem,
    width,
    showBorder = true,
    borderColor,
    borderRadius,
    dataFieldText = 'text',
    dataFieldId = 'id',
    activeIndex = 0,
    onItemEnter,
    onItemLeave,
    style,
    id = uniqueId('list'),
    dataSource,
    filter,
    horizontal = true,
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
    imageHeight
  } = props;
  const [activeIndexValue, setActiveIndexValue] = useState(
    activeIndex
      ? activeIndex
      : children && children.length > 0
      ? 0
      : dataSource && dataSource.getTotalRecords() > 0
      ? 0
      : -1,
  );
  const [currentFilter, setCurrentFilter] = useState(filter);
  const [idList] = useState(id);
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
    setActiveIndexValue(activeIndex);
    setCurrentFilter(filter);
  }, [activeIndex, filter]);

  const dataSourceEvent = (event: DataSourceEvent<T>) => {
    if (dataSource) {
      switch (event.type) {
        case DataSourceEventNames.afterScroll: {
          if (onSelectListItem && !dataSource.isEmpty()) {
            setActiveIndexValue(dataSource.getCurrentIndex());
            onSelectListItem(dataSource.getCurrentIndex(), dataSource.getCurrentRecord());
          }
          break;
        }
        case (DataSourceEventNames.fieldChanged,
        DataSourceEventNames.dataChanged,
        DataSourceEventNames.recordChanged,
        DataSourceEventNames.afterCancel): {
          setActiveIndexValue(dataSource.getCurrentIndex());
          if (onSelectListItem && !dataSource.isEmpty()) {
            onSelectListItem(dataSource.getCurrentIndex(), dataSource.getCurrentRecord());
          }
          break;
        }
        default:
      }
    }
  };

  const handleSelectItem = (index: number, data: T) => {
    setActiveIndexValue(index);
    if (dataSource) {
      dataSource.gotoRecordByData(data);
    }
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
    if (activeIndexValue >= 0 && rebuildedChildrens.length > 0) {
      const action = keyActions[event.keyCode];
      if (action) {
        event.preventDefault();
        action();
      }
    }
  };

  const handleArrowUp = () => {
    let index = activeIndexValue;
    if (index - 1 >= 0) {
      setActiveIndexValue(index - 1);
      handleSelectItem(index - 1, getRecordDataFromChildren(index - 1));
    }
  };
  
  const handleArrowLeft = () => {
    handleArrowUp();
  };

  const handleArrowDown = () => {
    let index = activeIndexValue;
    if (index + 1 < rebuildedChildrens.length) {
      setActiveIndexValue(index + 1);
      handleSelectItem(index + 1, getRecordDataFromChildren(index + 1));
    }
  };
  
  const handleArrowRight = () => {
    handleArrowDown()
  };

  const handlePageUp = () => {
    let index = Math.max(activeIndexValue - 5, 0);
    setActiveIndexValue(index);
    handleSelectItem(index, getRecordDataFromChildren(index));
  };
  
  const handlePageDown = () => {
    let index = Math.min(activeIndexValue + 5, rebuildedChildrens.length - 1);
    setActiveIndexValue(index);
    handleSelectItem(index, getRecordDataFromChildren(index));
  };

  const handleHome = () => {
    setActiveIndexValue(0);
    handleSelectItem(0, getRecordDataFromChildren(0));
  };
  
  const handleEnd = () => {
    const index = rebuildedChildrens.length - 1;
    setActiveIndexValue(index);
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
        if (record[dataFieldText]) {
          if (!record[dataFieldText].includes(currentFilter)) {
            itemIsValid = false;
          }
        }
      }
      if (onFilter) {
        itemIsValid = onFilter(record);
      }

      if (itemIsValid) {
        let active = record.active === undefined ? false : record.active;
        if (activeIndexValue >= 0) {
          active = false;
          if (activeIndexValue === index) {
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

          let newId = record[dataFieldId];
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
              disabled={record.disabled}
              {...compProps}
              {...rest}
              {...component.props}
            />
          );
        } else {
          let newId = record[dataFieldId];
          if (!newId) {
            newId = `${idList}_${index}`;
          }
          let newKey = `${idList}_${index}`;
          return (
            <ArchbaseListItem
              key={newKey}
              disabled={record.disabled}
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
              icon={record.icon?record.icon:icon}
              image={image}
              spacing={spacing}
              caption={record[dataFieldText]}
              showBorder={record.showBorder === undefined ? showBorder : record.showBorder}
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
      if (activeIndexValue >= 0) {
        active = false;
        if (activeIndexValue === index) {
          active = true;
        }
      }
      return (
        <ArchbaseListItem
          key={child.id}
          disabled={child.disabled}
          id={child.id}
          index={index}
          active={active}
          align={align}
          justify={child.justify === undefined ? justify : child.justify}
          activeBackgroundColor={child.activeBackColor === undefined ? activeBackgroundColor : child.activeBackColor}
          activeColor={child.activeColor === undefined ? activeColor : child.activeColor}
          backgroundColor={child.backgroundColor === undefined ? backgroundColor : child.backgroundColor}
          color={child.color === undefined ? color : child.color}
          imageRadius={child.imageRadius?child.imageRadius:imageRadius}
          imageHeight={child.imageHeight?child.imageHeight:imageHeight}
          imageWidth={child.imageWidth?child.imageWidth:imageWidth}
          icon={child.icon?child.icon:icon}
          image={child.image?child.image:image}
          spacing={child.spacing?child.spacing:spacing}
          caption={child.caption}
          showBorder={child.showBorder === undefined ? showBorder : child.showBorder}
          visible={child.visible}
        >
          {child.children}
        </ArchbaseListItem>
      );
    });
  };

  const rebuildedChildrens = useMemo(() => {
    if (dataSource) {
      return buildChildrensFromDataSource(dataSource);
    } else if (children) {
      return rebuildChildrens();
    }
    return [];
  }, [dataSource, children, activeIndexValue, props]);

  const { classes } = useStyles({
    withPadding,
    listStyleType,
    center,
    spacing,
    horizontal,
  });

  return (
    <Paper id={idList} tabIndex={-1} withBorder={showBorder} radius={borderRadius} onKeyDown={handleKeyDown}>
      <Box<any>
        component={type === 'unordered' ? 'ul' : type === 'ordered' ? 'ol' : 'div'}
        className={classes.root}
        tabIndex={-1}
        style={{ width: width, height: height, overflowY: 'auto', ...style }}
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
