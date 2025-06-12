import React from 'react'
import { Grid, ScrollArea, Stack } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { t } from 'i18next'
import { GroupDto } from './SecurityDomain'
import { ArchbaseDataSource } from '@components/datasource'
import { ArchbaseFormModalTemplate } from '@components/template'
import { ArchbaseEdit } from '@components/editors'

export interface GroupModalOptions {
  customContentBefore?: (group: GroupDto) => React.ReactNode

  customContentAfter?: (group: GroupDto) => React.ReactNode
}

export interface GroupModalProps {
  dataSource: ArchbaseDataSource<GroupDto, string>
  opened: boolean
  onClickOk: (record?: GroupDto, result?: any) => void
  onClickCancel: (record?: GroupDto) => void
  onCustomSave?: (record?: GroupDto, callback?: Function) => void
  onAfterSave?: (record?: GroupDto) => void
  options?: GroupModalOptions
}

export const GroupModal = (props: GroupModalProps) => {
  const focusTrapRef = useFocusTrap()
  const options = {...(props.options ?? {}) }
  return (
    <ArchbaseFormModalTemplate
      title={t('archbase:Grupo')}
      size="60%"
      height={'500px'}
      styles={{content: {maxWidth: 1000}}}
      dataSource={props.dataSource}
      opened={props.opened}
      onClickOk={props.onClickOk}
      onClickCancel={props.onClickCancel}
      onCustomSave={props.onCustomSave}
      onAfterSave={props.onAfterSave}
    >
      <ScrollArea ref={focusTrapRef} style={{ height: '460px' }}>
        <Stack w={"98%"}>
          {options?.customContentBefore && props?.dataSource?.getCurrentRecord() && (
            <>
              {options.customContentBefore(props.dataSource.getCurrentRecord())}
            </>
          )}
          <Grid ref={focusTrapRef}>
            <Grid.Col span={{ base: 12 }}>
              <ArchbaseEdit
                label={`${t('archbase:Nome do grupo')}`}
                placeholder={`${t('archbase:Informe o nome do grupo')}`}
                dataSource={props.dataSource}
                dataField="name"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <ArchbaseEdit
                label={`${t('archbase:Descrição do grupo')}`}
                placeholder={`${t('archbase:Informe a descrição do grupo')}`}
                dataSource={props.dataSource}
                dataField="description"
              />
            </Grid.Col>
          </Grid>
          {options?.customContentAfter && props?.dataSource?.getCurrentRecord() && (
            <>
              {options.customContentAfter(props.dataSource.getCurrentRecord())}
            </>
          )}
        </Stack>
      </ScrollArea>
    </ArchbaseFormModalTemplate>
  )
}
