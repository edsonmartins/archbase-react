import React from 'react';
import { Grid } from '@mantine/core';
import { ArchbaseJsonView } from '../views';
import { Pessoa, pessoas } from '../core';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { ArchbaseEdit } from './ArchbaseEdit';

export default {
  title: 'Editors/Edit',
  component: ArchbaseEdit,
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
        <ArchbaseEdit label="Nome" dataSource={dataSource} dataField="nome" />
      </Grid.Col>
      <Grid.Col span={6}>
        <ArchbaseJsonView data={data} />
      </Grid.Col>
    </Grid>
  );
};
