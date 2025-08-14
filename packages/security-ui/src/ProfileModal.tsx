import React from 'react'
import { Grid, ScrollArea, Stack, Modal, Button, Group } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { ArchbaseDataSource } from '@archbase/data'
import { getI18nextInstance } from '@archbase/core';
import { ProfileDto } from '@archbase/security'
import { ArchbaseEdit } from '@archbase/components'

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
  
  const handleSave = () => {
    if (props.onCustomSave) {
      props.onCustomSave(props.dataSource.current, (success: boolean) => {
        if (success && props.onAfterSave) {
          props.onAfterSave(props.dataSource.current);
        }
        props.onClickOk(props.dataSource.current, success);
      });
    } else {
      props.onClickOk(props.dataSource.current, true);
    }
  };

  const handleCancel = () => {
    props.onClickCancel(props.dataSource.current);
  };
  
  return (
    <Modal
      opened={props.opened}
      onClose={handleCancel}
      title={getI18nextInstance().t('archbase:Perfil')}
      size="60%"
      styles={{content: {maxWidth: 1000}}}
    >
      <ScrollArea style={{ height: '460px' }}>
        <Stack w={"98%"}>
          {options?.customContentBefore && (
            <>
              {options.customContentBefore}
            </>
          )}
          <Grid>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Nome do perfil')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe o nome do perfil')}`}
                dataSource={props.dataSource}
                dataField="name"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Descrição do perfil')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe a descrição do perfil')}`}
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
          
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCancel}>
              {getI18nextInstance().t('archbase:Cancelar')}
            </Button>
            <Button onClick={handleSave}>
              {getI18nextInstance().t('archbase:Salvar')}
            </Button>
          </Group>
        </Stack>
      </ScrollArea>
    </Modal>
  )
}
