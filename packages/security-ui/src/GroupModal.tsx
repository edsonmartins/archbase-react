/**
 * GroupModal — modal para gerenciar grupos/roles de usuários.
 * @status stable
 */
import React from 'react'
import { Grid, ScrollArea, Stack, Modal, Button, Group } from '@mantine/core'
import { getI18nextInstance } from '@archbase/core';
import { GroupDto } from '@archbase/security'
import { IArchbaseDataSourceBase } from '@archbase/data'
import { ArchbaseEdit } from '@archbase/components'

export interface GroupModalOptions {
  customContentBefore?: (group: GroupDto) => React.ReactNode;
  customContentAfter?: (group: GroupDto) => React.ReactNode;
}

export interface GroupModalProps {
  dataSource: IArchbaseDataSourceBase<GroupDto>
  opened: boolean
  onClickOk: (record?: GroupDto, result?: any) => void
  onClickCancel: (record?: GroupDto) => void
  onCustomSave?: (record?: GroupDto, callback?: Function) => void
  onAfterSave?: (record?: GroupDto) => void
  options?: GroupModalOptions
}

export const GroupModal = (props: GroupModalProps) => {
  const options = {...(props.options ?? {}) }
  
  const handleSave = () => {
    if (props.onCustomSave) {
      props.onCustomSave(props.dataSource.getCurrentRecord()!, (success: boolean) => {
        if (success && props.onAfterSave) {
          props.onAfterSave(props.dataSource.getCurrentRecord()!);
        }
        props.onClickOk(props.dataSource.getCurrentRecord()!, success);
      });
    } else {
      props.onClickOk(props.dataSource.getCurrentRecord()!, true);
    }
  };

  const handleCancel = () => {
    props.onClickCancel(props.dataSource.getCurrentRecord()!);
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
          {options?.customContentBefore && options.customContentBefore(props.dataSource.getCurrentRecord()!)}
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
          {options?.customContentAfter && options.customContentAfter(props.dataSource.getCurrentRecord()!)}
          
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
