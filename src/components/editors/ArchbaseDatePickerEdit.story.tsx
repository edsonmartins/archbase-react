import React, { useState } from 'react';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';
import { Grid, ScrollArea } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoas } from '../core';
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks';

export default {
  title: 'Editors/DatePicker Edit',
  component: ArchbaseDatePickerEdit,
};

const data = [pessoas[0]];

export const Default = () => {
  const [forceUpdate,setForceUpdate] = useState<number>(0);
  const {dataSource} = useArchbaseDataSource<Pessoa,string>({initialData:data,name:"dsPessoas"});
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()){
    dataSource.edit();
  }
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
      switch (event.type) {
        case (DataSourceEventNames.fieldChanged): {
          setForceUpdate((prev) => prev + 1)
          break
        }
        default:
      }
      
    }
  })
  return (
    <ScrollArea.Autosize mx="auto">
      <Grid>
        <Grid.Col span="content">
          <ArchbaseDatePickerEdit label="Descrição" dataSource={dataSource} dataField='data_nasc' />
        </Grid.Col>
        <Grid.Col span={3}>
          <ArchbaseJsonView data={data} />
        </Grid.Col>
        <Grid.Col span={3}>
          <ArchbaseObjectInspector data={dataSource} />
        </Grid.Col>
      </Grid>
    </ScrollArea.Autosize>
  );
};
