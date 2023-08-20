import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '@components/hooks';
import { Flex, MantineThemeColorsOverride, useMantineTheme } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { ArchbaseThemeColor } from './ArchbaseThemeColor';
import { ArchbaseThemeColorInput } from './ArchbaseThemeColorInput';
import { OriginColor } from './ArchbaseThemeEditorCommon';

interface ArchbaseThemeDarkAndLightProps<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;
}

export function ArchbaseThemeDarkAndLight<T, ID>({ dataSource }: ArchbaseThemeDarkAndLightProps<T, ID>) {
  const theme = useMantineTheme();
  const [colorsList, setColorsList] = useState(theme.colors);
  const initialEmptyOriginColors = Object.fromEntries(
    Object.keys(theme.colors).map((color) => [color, theme.colors[color][4]]),
  );
  const [originColorsList, setOriginColorsList] = useState(initialEmptyOriginColors);
  const [white, setWhite] = useState(theme.white);
  const [black, setblack] = useState(theme.black);

  const loadDataSourceFieldValue = () => {
    let initialColors: any = colorsList;
    let initialOriginColors: any = originColorsList;
    let initialWhite: any = white;
    let initialBlack: any = black;

    if (dataSource) {
      initialColors = dataSource.getFieldValue('colors');
      initialOriginColors = dataSource.getFieldValue('other.originColors');
      initialWhite = dataSource.getFieldValue('white');
      initialBlack = dataSource.getFieldValue('black');
      if (!initialColors) {
        initialColors = {};
      }
      if (!initialOriginColors) {
        initialOriginColors = initialEmptyOriginColors;
      }
      if (!initialWhite) {
        initialWhite = '#ffffff';
      }
      if (!initialBlack) {
        initialBlack = '#000000';
      }
    }

    setColorsList(initialColors);
    setOriginColorsList(initialOriginColors);
    setWhite(initialWhite);
    setblack(initialBlack);
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
      dataSource.addFieldChangeListener('white', fieldChangedListener);
      dataSource.addFieldChangeListener('black', fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChangeThemeColor = (colors: MantineThemeColorsOverride, originColor: OriginColor) => {
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

  const handleChangeWhite = (white: string) => {
    setWhite(white);
    if (dataSource && !dataSource.isBrowsing()) {
      if (dataSource.getFieldValue('white') !== white) {
        dataSource.setFieldValue('white', white);
      }
    }
  };

  const handleChangeBlack = (black: string) => {
    setblack(black);
    if (dataSource && !dataSource.isBrowsing()) {
      if (dataSource.getFieldValue('black') !== black) {
        dataSource.setFieldValue('black', black);
      }
    }
  };

  return (
    <>
      <ArchbaseThemeColor
        label={'dark'}
        placeholder="Pick a color"
        onChangeValue={handleChangeThemeColor}
        initialColors={colorsList['dark']}
        initialOriginColor={originColorsList['dark']}
        key={'dark'}
      />
      <Flex justify={'space-between'} align={'center'}>
        <ArchbaseThemeColorInput placeholder="White" handleChange={handleChangeWhite} value={white} />
        <ArchbaseThemeColorInput placeholder="Black" handleChange={handleChangeBlack} value={black} />
      </Flex>
    </>
  );
}
