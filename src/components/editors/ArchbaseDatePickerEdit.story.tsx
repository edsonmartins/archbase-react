import React from 'react';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';
import { Grid } from '@mantine/core';
import { ArchbaseJsonView } from '../views';
import { Pessoa, pessoas } from '../core';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';

export default {
  title: 'Editors/DatePicker Edit',
  component: ArchbaseDatePickerEdit,
};

const data = [pessoas[0]];

export const Default = () => {
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({
    initialData: data,
    name: 'dsPessoas',
    editOnInit: true,
  });

  return (
    <Grid>
      <Grid.Col span="content">
        <ArchbaseDatePickerEdit label="Descrição" dataSource={dataSource} dataField="data_nasc" />
      </Grid.Col>
      <Grid.Col span={6}>
        <ArchbaseJsonView data={data} />
      </Grid.Col>
    </Grid>
  );
};
