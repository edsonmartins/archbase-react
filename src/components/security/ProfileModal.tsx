import React from 'react'
import { Grid, ScrollArea, Stack } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { ArchbaseDataSource } from '@components/datasource'
import { ArchbaseFormModalTemplate } from '@components/template'
import { t } from 'i18next'
import { ProfileDto } from './SecurityDomain'
import { ArchbaseEdit } from '@components/editors'

export interface ProfileModalOptions {
  customContentBefore?: React.ReactNode;

  customContentAfter?: React.ReactNode;
}

export interface ProfileModalProps {
  dataSource: ArchbaseDataSource<ProfileDto, string>
  opened: boolean
  onClickOk: (record?: ProfileDto, result?: any) => void
  onClickCancel: (record?: ProfileDto) => void
  onCustomSave?: (record?: ProfileDto, callback?: Function) => void
  onAfterSave?: (record?: ProfileDto) => void
  customContentBefore?: React.ReactNode
  customContentAfter?: React.ReactNode
  options?: ProfileModalOptions
}

export const ProfileModal = (props: ProfileModalProps) => {
  const focusTrapRef = useFocusTrap()
  const options = {...(props.options ?? {}) }
  return (
    <ArchbaseFormModalTemplate
      title={t('archbase:Perfil')}
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
          {options?.customContentBefore && (
            <>
              {options.customContentBefore}
            </>
          )}
          <Grid ref={focusTrapRef}>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <ArchbaseEdit
                label={`${t('archbase:Nome do perfil')}`}
                placeholder={`${t('archbase:Informe o nome do perfil')}`}
                dataSource={props.dataSource}
                dataField="name"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <ArchbaseEdit
                label={`${t('archbase:Descrição do perfil')}`}
                placeholder={`${t('archbase:Informe a descrição do perfil')}`}
                dataSource={props.dataSource}
                dataField="description"
              />
            </Grid.Col>
          </Grid>
          {options?.customContentAfter && (
            <>
              {options.customContentAfter}
            </>
          )}
        </Stack>
      </ScrollArea>
    </ArchbaseFormModalTemplate>
  )
}
