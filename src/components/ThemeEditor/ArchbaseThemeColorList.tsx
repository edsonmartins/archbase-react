import { MantineThemeColorsOverride, useMantineTheme } from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import React, { useCallback, useState } from 'react';
import { ArchbaseThemeColor } from './ArchbaseThemeColor';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '@components/hooks';

interface ArchbaseThemeColorListProps<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;
}

export function ArchbaseThemeColorList<T, ID>({ dataSource }: ArchbaseThemeColorListProps<T, ID>) {
  const theme = useMantineTheme();
  const [colorsList, setColorsList] = useState(theme.colors as MantineThemeColorsOverride);

  const loadDataSourceFieldValue = () => {
    let initialValue: any = colorsList;

    if (dataSource) {
      initialValue = dataSource.getFieldValue('colors');
      if (!initialValue) {
        initialValue = {};
      }
    }

    setColorsList(initialValue);
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
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (colors: MantineThemeColorsOverride) => {
    const changedValue = { ...colorsList, ...colors };
    setColorsList(changedValue);
    if (dataSource && !dataSource.isBrowsing() && dataSource.getFieldValue('colors') !== changedValue) {
      dataSource.setFieldValue('colors', changedValue);
    }
  };

  return (
    <>
      <ArchbaseThemeColor
        label="dark"
        placeholder="#000000"
        onChangeValue={handleChange}
        initialColors={colorsList['dark']}
      />
      <ArchbaseThemeColor
        label="light"
        placeholder="#ffffff"
        onChangeValue={handleChange}
        initialColors={colorsList['light']}
      />
    </>
  );
}
