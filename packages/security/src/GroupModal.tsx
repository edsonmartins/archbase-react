import React from 'react'
import { Grid, ScrollArea, Stack } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { getI18nextInstance } from '@archbase/core';
import { GroupDto } from './SecurityDomain'
import { ArchbaseDataSource } from '@archbase/data'
import { ArchbaseFormModalTemplate } from '@archbase/template'
import { ArchbaseEdit } from '@archbase/components'

export interface GroupModalOptions {
  customContentBefore?: React.ReactNode;

  customContentAfter?: React.ReactNode;
}

export interface GroupModalProps {
  dataSource: ArchbaseDataSource<GroupDto, string>
  opened: boolean
  onClickOk: (record?: GroupDto, result?: any) => void
  onClickCancel: (record?: GroupDto) => void
  onCustomSave?: (record?: GroupDto, callback?: Function) => void
  onAfterSave?: (record?: GroupDto) => void
  customContentBefore?: React.ReactNode
  customContentAfter?: React.ReactNode
  options?: GroupModalOptions
}

export const GroupModal = (props: GroupModalProps) => {
  const focusTrapRef = useFocusTrap()
  const options = {...(props.options ?? {}) }
  return (
    <ArchbaseFormModalTemplate
      opened={props.opened}
      onClickOk={props.onClickOk}
      onClickCancel={props.onClickCancel}
      onCustomSave={props.onCustomSave}
      onAfterSave={props.onAfterSave}
      title={getI18nextInstance().t('archbase:Grupo')}
      size="60%"
      height="460px"
      styles={{content: {maxWidth: 1000}}}
      dataSource={props.dataSource}
    >
      <ScrollArea ref={focusTrapRef} style={{ height: '460px' }}>
        <Stack w={"98%"}>
          {options?.customContentBefore && (
            <>
              {props.options.customContentBefore}
            </>
          )}
          <Grid ref={focusTrapRef}>
            <Grid.Col span={{ base: 12 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Nome do grupo')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe o nome do grupo')}`}
                dataSource={props.dataSource}
                dataField="name"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Descrição do grupo')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe a descrição do grupo')}`}
                dataSource={props.dataSource}
                dataField="description"
              />
            </Grid.Col>
          </Grid>
          {options?.customContentAfter && (
            <>
              {props.options.customContentAfter}
            </>
          )}
        </Stack>
      </ScrollArea>
    </ArchbaseFormModalTemplate>
  )
}
