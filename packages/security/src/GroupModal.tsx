import React from 'react'
import { Grid, ScrollArea, Stack } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { useArchbaseTranslation } from '@archbase/core';
import { GroupDto } from './SecurityDomain'
import { ArchbaseDataSource } from '@archbase/data'
import { Modal, Button, Group } from '@mantine/core'
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
    <Modal
      opened={props.opened}
      onClose={props.onClickCancel}
      title={t('archbase:Grupo')}
      size="60%"
      styles={{content: {maxWidth: 1000}}}
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
          {options?.customContentAfter && (
            <>
              {props.options.customContentAfter}
            </>
          )}
        </Stack>
      </ScrollArea>
      <Group mt="md" justify="flex-end">
        <Button variant="outline" onClick={() => props.onClickCancel()}>
          {t('archbase:Cancelar')}
        </Button>
        <Button onClick={() => props.onClickOk()}>
          {t('archbase:Salvar')}
        </Button>
      </Group>
    </Modal>
  )
}
