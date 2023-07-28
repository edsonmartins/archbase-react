import React from 'react';
import { Grid } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoas } from '../core';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { ArchbaseEdit } from './ArchbaseEdit';
import { useArchbaseForceUpdate } from '../hooks/';
import { Meta, StoryObj } from "@storybook/react";

const ArchbaseEditExample = () => {
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
      <Grid.Col span={4}>
        <ArchbaseEdit label="Nome" dataSource={dataSource} dataField="nome" />
      </Grid.Col>
      <Grid.Col span={4}>
        <ArchbaseJsonView data={data} />
      </Grid.Col>
      <Grid.Col span={4}>
        <ArchbaseObjectInspector data={dataSource} />
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/Edit',
  component: ArchbaseEditExample,
} as Meta;


const data = [pessoas[0]];

export const Example: StoryObj<typeof ArchbaseEditExample> = {
  args: {
    render: ()=>{<ArchbaseEditExample/>}
  },
};

