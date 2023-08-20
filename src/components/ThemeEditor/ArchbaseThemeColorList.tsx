import { MantineThemeColorsOverride, useMantineTheme } from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import React, { useCallback, useState } from 'react';
import { ArchbaseThemeColor } from './ArchbaseThemeColor';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '@components/hooks';
import { OriginColor } from './ArchbaseThemeEditorCommon';

interface ArchbaseThemeColorListProps<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;
}

export function ArchbaseThemeColorList<T, ID>({ dataSource }: ArchbaseThemeColorListProps<T, ID>) {
  const theme = useMantineTheme();
  const [colorsList, setColorsList] = useState(theme.colors);
  const initialEmptyOriginColors = Object.fromEntries(
    Object.keys(theme.colors).map((color) => [color, theme.colors[color][4]]),
  );
  const [originColorsList, setOriginColorsList] = useState(initialEmptyOriginColors);

  const loadDataSourceFieldValue = () => {
    let initialColors: any = colorsList;
    let initialOriginColors: any = originColorsList;

    if (dataSource) {
      initialColors = dataSource.getFieldValue('colors');
      initialOriginColors = dataSource.getFieldValue('other.originColors');
      if (!initialColors) {
        initialColors = {};
      }
      if (!initialOriginColors) {
        initialOriginColors = initialEmptyOriginColors;
      }
    }

    setColorsList(initialColors);
    setOriginColorsList(initialOriginColors);
  };

  const fieldChangedListener = useCallback(() => {}, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.fieldChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        loadDataSourceFieldValue();
      }
    }
  }, []);

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue();
    if (dataSource) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener('colors', fieldChangedListener);
      dataSource.addFieldChangeListener('other.originColors', fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (colors: MantineThemeColorsOverride, originColor: OriginColor) => {
    const changedColors = { ...colorsList, ...colors };
    const changedOriginColors = { ...originColorsList, ...originColor };
    setColorsList(changedColors);
    setOriginColorsList(changedOriginColors);
    if (dataSource && !dataSource.isBrowsing()) {
      if (dataSource.getFieldValue('colors') !== changedColors) {
        dataSource.setFieldValue('colors', changedColors);
      }
      if (dataSource.getFieldValue('other.originColors') !== changedOriginColors) {
        dataSource.setFieldValue('other.originColors', changedOriginColors);
      }
    }
  };

  return (
    <>
      {Object.keys(theme.colors)
        .filter((color) => color !== 'dark')
        .map((color) => (
          <ArchbaseThemeColor
            label={color}
            placeholder="Pick a color"
            onChangeValue={handleChange}
            initialColors={colorsList[color]}
            initialOriginColor={originColorsList[color]}
            key={color}
          />
        ))}
    </>
  );
}
