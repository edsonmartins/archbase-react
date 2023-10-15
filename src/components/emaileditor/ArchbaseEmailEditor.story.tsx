import React from 'react'
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core'
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug'
import { Pessoa, pessoasData } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks/'
import { Meta, StoryObj } from '@storybook/react'
import { EmailEditor, EmailEditorProvider } from './editor'
import { useWindowSize } from 'react-use'
import { BasicType, BlockManager } from './core'
import { StandardLayout } from './extensions'
import '../../styles/arco.css'

const initialValues = {
  subject: 'Welcome to Easy-email',
  subTitle: 'Nice to meet you!',
  content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
};

const ArchbaseEmailEditorExample = () => {
    const { width } = useWindowSize();

  const smallScene = width < 1400;

  return (
    <EmailEditorProvider
      data={initialValues}
      height={'calc(100vh - 72px)'}
      autoComplete
      dashed={false}
    >
      {({ values }) => {
        return (
          <StandardLayout
                compact={!smallScene}
                showSourceCode={true} categories={[]}          >
            <EmailEditor />
          </StandardLayout>
        );
      }}
    </EmailEditorProvider>
  );
}


const meta: Meta<typeof EmailEditor> = {
  title: 'Editores/Email Editor',
  component: EmailEditor,
};

export default meta;
type Story = StoryObj<typeof EmailEditor>;


export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseEmailEditorExample />,
};