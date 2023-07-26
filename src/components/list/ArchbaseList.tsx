import React, { useState, useEffect, useCallback } from 'react';
import lodash from 'lodash';
import { ArchbaseListItem } from './ArchbaseListItem'; // Assuming the ArchbaseListItem component is defined in a separate file.
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from 'components/datasource';
import { ArchbaseError } from 'components/core/exceptions';

export interface ArchbaseListProps<T, ID> {
  activeBackColor?: string;
  activeColor?: string;
  align?: 'left' | 'right' | 'center';
  backgroundColor?: string;
  color?: string;
  height?: string;
  justify?: boolean;
  onSelectListItem?: (index: number, data: any) => void;
  width?: string;
  showBorder?: boolean;
  dataFieldText?: string;
  dataFieldId?: string;
  activeIndex?: number;
  onMouseOver?: (event: React.MouseEvent, data: any) => void;
  onMouseOut?: (event: React.MouseEvent, data: any) => void;
  style?: React.CSSProperties;
  id?: string;
  dataSource: ArchbaseDataSource<T, ID>;
  filter?: string;
  horizontal?: boolean;
  onFilter?: (record: any) => boolean;
  component?: React.ComponentType<any> | { component: React.ComponentType<any>; props: any };
}

export function ArchbaseList<T, ID>({
  activeBackColor,
  activeColor,
  align,
  color,
  height,
  justify,
  onSelectListItem,
  width,
  showBorder = true,
  dataFieldText = 'text',
  dataFieldId = 'id',
  activeIndex = 0,
  onMouseOver,
  onMouseOut,
  style,
  id = lodash.uniqueId('list'),
  dataSource,
  filter,
  horizontal,
  onFilter,
  component,
}: ArchbaseListProps<T, ID>) {
  const [activeIndexValue, setActiveIndexValue] = useState(activeIndex);
  const [currentFilter, setCurrentFilter] = useState(filter);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [idList] = useState(id);
  const [rebuildedChildrens, setRebuildedChildrens] = useState([]);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource) {
      switch (event.type) {
        case DataSourceEventNames.afterScroll: {
          if (onSelectListItem && !dataSource.isEmpty()) {
            setActiveIndexValue(dataSource.getCurrentIndex());
            onSelectListItem(dataSource.getCurrentIndex(), dataSource.getCurrentRecord());
          }
          break;
        }
        case (DataSourceEventNames.dataChanged, DataSourceEventNames.recordChanged, DataSourceEventNames.afterCancel): {
          setActiveIndexValue(dataSource.getCurrentIndex());
          if (onSelectListItem && !dataSource.isEmpty()) {
            onSelectListItem(dataSource.getCurrentIndex(), dataSource.getCurrentRecord());
          }
          break;
        }
        default:
      }
    }
  }, []);

  useEffect(() => {
    dataSource.addListener(dataSourceEvent);
    return () => {
       dataSource.removeListener(dataSourceEvent);
    };
  }, [dataSource]);

  useEffect(() => {
    setActiveIndexValue(activeIndex);
    setCurrentFilter(filter);
  }, [activeIndex, filter]);

  

  const handleSelectItem = (index, data) => {
    setActiveIndexValue(index);
    dataSource.gotoRecordByData(data);
  };

  const handleKeyDown = (event) => {
    if (activeIndex >= 0 && numberOfItems > 0) {
      if (event.keyCode === 38 || event.keyCode === 37) {
        event.preventDefault();
        let index = activeIndex;
        if (index - 1 >= 0) {
          setActiveIndexValue(index - 1);
          handleSelectItem(index - 1, getRecordDataFromChildren(index - 1));
        }
      } else if (event.keyCode === 40 || event.keyCode === 39) {
        event.preventDefault();
        let index = activeIndex;
        if (index + 1 < numberOfItems) {
          setActiveIndexValue(index + 1);
          handleSelectItem(index + 1, getRecordDataFromChildren(index + 1));
        }
      } else if (event.keyCode === 33) {
        event.preventDefault();
        setActiveIndexValue((prevIndex) => Math.max(prevIndex - 5, 0));
        handleSelectItem(activeIndex, getRecordDataFromChildren(activeIndex));
      } else if (event.keyCode === 34) {
        event.preventDefault();
        setActiveIndexValue((prevIndex) => Math.min(prevIndex + 5, numberOfItems - 1));
        handleSelectItem(activeIndex, getRecordDataFromChildren(activeIndex));
      } else if (event.keyCode === 36) {
        event.preventDefault();
        setActiveIndexValue(0);
        handleSelectItem(0, getRecordDataFromChildren(0));
      } else if (event.keyCode === 35) {
        event.preventDefault();
        setActiveIndexValue(numberOfItems - 1);
        handleSelectItem(activeIndex, getRecordDataFromChildren(activeIndex));
      }
    }
  };


  const buildChildrensFromDataSource = () => {
    let sourceData = dataSource.browseRecords();
    if (sourceData.constructor !== Array) {
      throw new ArchbaseError('O dataSource deve ser obrigatoriamente um array de dados.');
    }

    return sourceData.map((record : any, index) => {
      if (!record) {
        return null;
      }

      let cnt = true;
      if (currentFilter && dataFieldText) {
        if (record[dataFieldText]) {
          if (!record[dataFieldText].includes(currentFilter)) {
            cnt = false;
          }
        }
      }
      if (onFilter) {
        cnt = onFilter(record);
      }

      if (cnt) {
        let active = record.active === undefined ? false : record.active;
        if (activeIndex >= 0) {
          active = false;
          if (activeIndex === index) {
            active = true;
          }
        } else if (record.active) {
            activeIndex = index;
        }

        if (component) {
          let DynamicComponent : any = component;
          let compProps = {};
          if (component.hasOwnProperty('component')) {
            // DynamicComponent = component.component;
          }
          if (component.hasOwnProperty('props')) {
            // compProps = component.props;
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
              handleSelectItem={handleSelectItem}
              recordData={record}
              {...compProps}
              //{...rest}
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
                  //index={index}
                  active={active}
                  align={record.align}
                  justify={record.justify === undefined ? justify : record.justify}
                  activeBackColor={record.activeBackColor === undefined ? activeBackColor : record.activeBackColor}
                  activeColor={record.activeColor === undefined ? activeColor : record.activeColor}
                  //backgroundColor={record.backgroundColor === undefined ? backgroundColor : record.backgroundColor}
                  color={record.color === undefined ? color : record.color}
                  imageCircle={record.imageCircle}
                  imageHeight={record.imageHeight}
                  imageWidth={record.imageWidth}
                  icon={record.icon}
                  image={record.image}
                  //   onMouseOver={onMouseOver}
                  //   onMouseOut={onMouseOut}
                  caption={record[dataFieldText]}
                  //   handleSelectItem={handleSelectItem}
                  onSelectListItem={record.onSelectListItem === undefined ? onSelectListItem : record.onSelectListItem}
                  href={record.href}
                  showBorder={record.showBorder === undefined ? showBorder : record.showBorder} hide={false}            //   ownerId={id ? id : idList}
            />
          );
        }
      }
      return null;
    });
  };

  const getRecordDataFromChildren = (_index) => {
    let result;
    // rebuildedChildrens.forEach((item:any) => {
    //   if (item.index === index) {
    //     result = item.recordData;
    //   }
    // });
    return result;
  };

  const rebuildChildrens = () => {
    return [];
    // return React.Children.toArray(children).map((child, index) => {
    //   if (child.type && child.type.componentName !== 'ArchbaseListItem') {
    //     throw new ArchbaseError(
    //       'Apenas componentes do tipo ArchbaseListItem podem ser usados como filhos de ArchbaseList.',
    //     );
    //   }
    //   if (!child.id) {
    //     throw new ArchbaseError('Todos os itens da lista devem conter um ID.');
    //   }
    //   let active = child.active;
    //   if (state.activeIndex >= 0) {
    //     active = false;
    //     if (state.activeIndex === index) {
    //       active = true;
    //     }
    //   } else if (child.active) {
    //     state.activeIndex = index;
    //   }
    //   return (
    //     <ArchbaseListItem
    //       key={child.id}
    //       disabled={child.disabled}
    //       id={child.id}
    //       index={index}
    //       active={active}
    //       dataSource={dataSource}
    //       success={child.success}
    //       warning={child.warning}
    //       danger={child.danger}
    //       info={child.info}
    //       alignRight={child.alignRight === undefined ? alignRight : child.alignRight}
    //       alignLeft={child.alignLeft === undefined ? alignLeft : child.alignLeft}
    //       alignCenter={child.alignCenter === undefined ? alignCenter : child.alignCenter}
    //       justify={child.justify === undefined ? justify : child.justify}
    //       activeBackColor={child.activeBackColor === undefined ? activeBackColor : child.activeBackColor}
    //       activeColor={child.activeColor === undefined ? activeColor : child.activeColor}
    //       backgroundColor={child.backgroundColor === undefined ? backgroundColor : child.backgroundColor}
    //       color={child.color === undefined ? color : child.color}
    //       imageCircle={child.imageCircle}
    //       imageHeight={child.imageHeight}
    //       imageWidth={child.imageWidth}
    //       icon={child.icon}
    //       image={child.image}
    //       caption={child.caption}
    //       onMouseOver={onMouseOver}
    //       onMouseOut={onMouseOut}
    //       handleSelectItem={handleSelectItem}
    //       onSelectListItem={child.onSelectListItem === undefined ? onSelectListItem : child.onSelectListItem}
    //       href={child.href}
    //       showBorder={child.showBorder === undefined ? showBorder : child.showBorder}
    //       ownerId={id ? id : idList}
    //     >
    //       {child.children}
    //     </ArchbaseListItem>
    //   );
    // });
  };

//   useEffect(() => {
//     let rebuiltChildren;
//     if (dataSource) {
//       rebuiltChildren = buildChildrensFromDataSource();
//     } else if (children) {
//       rebuiltChildren = rebuildChildrens();
//     }
//     setRebuildedChildrens(rebuiltChildren);
//   }, [dataSource, children]);

  return (
    <div
      id={idList}
      //ref={(ref) => (list = ref)}
      tabIndex={-1}
      className={showBorder ? 'list-group-container' : ''}
      onKeyDown={handleKeyDown}
      style={{ width: width, height: height, ...style }}
    >
      {/* <ul className="list-group" style={{ flexDirection: horizontal ? 'row' : 'column', ...listStyle }}>
        {rebuildedChildrens}
      </ul> */}
    </div>
  );
}
