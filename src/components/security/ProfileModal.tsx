import React from 'react'
import { Grid, ScrollArea } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { ArchbaseDataSource } from '@components/datasource'
import { ArchbaseFormModalTemplate } from '@components/template'
import { t } from 'i18next'
import { ProfileDto } from './SecurityDomain'
import { ArchbaseEdit } from '@components/editors'

export interface ProfileModalProps {
  dataSource: ArchbaseDataSource<ProfileDto, string>
  opened: boolean
  onClickOk: (record?: ProfileDto, result?: any) => void
  onClickCancel: (record?: ProfileDto) => void
  onCustomSave?: (record?: ProfileDto, callback?: Function) => void
  onAfterSave?: (record?: ProfileDto) => void
}

export const ProfileModal = (props: ProfileModalProps) => {
  const focusTrapRef = useFocusTrap()

  return (
    <ArchbaseFormModalTemplate
      title={t('archbase:Perfil')}
      size="60%"
      height={'200px'}
      dataSource={props.dataSource}
      opened={props.opened}
      onClickOk={props.onClickOk}
      onClickCancel={props.onClickCancel}
      onCustomSave={props.onCustomSave}
      onAfterSave={props.onAfterSave}
    >
      <ScrollArea ref={focusTrapRef} style={{ height: '200px' }}>
        <Grid>
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
      </ScrollArea>
    </ArchbaseFormModalTemplate>
  )
}
