import React from 'react'
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core'
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug'
import { Pessoa, pessoasData } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks/'
import { Meta, StoryObj } from '@storybook/react'
import { ArchbaseEmailEditor, ArchbaseEmailEditorProvider } from './editor'
import { useWindowSize } from 'react-use'
import { AdvancedType, BasicType, BlockManager } from './core'
import { ExtensionProps, StandardLayout } from './extensions'
import '../../styles/arco.css'

const initialValues = {
  subject: 'Bem vindo ao Archbase-Email',
  subTitle: 'Prazer em conhecê-lo!',
  content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
};

const ArchbaseEmailEditorExample = () => {
    const { width } = useWindowSize();

  const smallScene = width < 1400;


  return (
    <ArchbaseEmailEditorProvider
      data={initialValues}
      height={'calc(100vh - 72px)'}
      autoComplete
      dashed={false}
    >
      {({ values }) => {
        return (
          <StandardLayout
                compact={!smallScene}
                showSourceCode={true} >
            <ArchbaseEmailEditor />
          </StandardLayout>
        );
      }}
    </ArchbaseEmailEditorProvider>
  );
}


const meta: Meta<typeof ArchbaseEmailEditor> = {
  title: 'Editores/Email Editor',
  component: ArchbaseEmailEditor,
};

export default meta;
type Story = StoryObj<typeof ArchbaseEmailEditor>;


export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseEmailEditorExample />,
};