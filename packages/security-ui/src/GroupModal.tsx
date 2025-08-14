import React from 'react'
import { Grid, ScrollArea, Stack, Modal, Button, Group } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { getI18nextInstance } from '@archbase/core';
import { GroupDto } from '@archbase/security'
import { ArchbaseDataSource } from '@archbase/data'
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
      title={getI18nextInstance().t('archbase:Grupo')}
      size="60%"
      styles={{content: {maxWidth: 1000}}}
    >
      <ScrollArea style={{ height: '460px' }}>
        <Stack w={"98%"}>
          {options?.customContentBefore && (
            <>
              {props.options.customContentBefore}
            </>
          )}
          <Grid>
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
