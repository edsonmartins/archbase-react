import React from 'react';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';
import { Grid } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoas } from '../core';
import { useArchbaseDataSource } from '../hooks';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { Meta, StoryObj } from "@storybook/react";
import { useArchbaseForceUpdate } from '../hooks/';



const ArchbaseDatePickerEditExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const {dataSource} = useArchbaseDataSource<Pessoa,string>({initialData:data,name:"dsPessoas"});
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()){
    dataSource.edit();
  }
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
      switch (event.type) {
        case (DataSourceEventNames.fieldChanged): {
          forceUpdate();
          break
        }
        default:
      }
      
    }
  })
  return (
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
  );
};


export default {
  title: 'Editors/DatePicker Edit',
  component: ArchbaseDatePickerEditExample,
} as Meta;

const data = [pessoas[0]];

export const Example: StoryObj<typeof ArchbaseDatePickerEditExample> = {
  args: {
    render: ()=>{<ArchbaseDatePickerEditExample/>}
  },
};

