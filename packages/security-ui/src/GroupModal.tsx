/**
 * GroupModal — modal para gerenciar grupos/roles de usuários.
 * @status stable
 *
 * PERFORMANCE FIX: Usa DataSource isolado para evitar re-renders do Grid
 * durante a digitação nos inputs da modal.
 */
import React from 'react'
import { Grid, ScrollArea, Stack, Modal, Button, Group } from '@mantine/core'
import { useFocusTrap } from '@mantine/hooks'
import { getI18nextInstance } from '@archbase/core';
import { GroupDto } from '@archbase/security'
import { ArchbaseDataSource, useArchbaseIsolatedDataSource } from '@archbase/data'
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

  // PERFORMANCE FIX: Usar DataSource isolado para evitar re-renders do Grid
  const {
    dataSource: isolatedDS,
    applyChanges,
    currentRecord,
  } = useArchbaseIsolatedDataSource<GroupDto>({
    parentDataSource: props.dataSource,
    opened: props.opened,
    name: 'dsGroupModal',
  });

  const handleSave = () => {
    // Aplicar mudanças do DS isolado de volta ao DS principal
    const savedRecord = applyChanges();

    if (props.onCustomSave) {
      props.onCustomSave(savedRecord, (success: boolean) => {
        if (success && props.onAfterSave) {
          props.onAfterSave(savedRecord);
        }
        props.onClickOk(savedRecord, success);
      });
    } else {
      props.onClickOk(savedRecord, true);
    }
  };

  const handleCancel = () => {
    props.onClickCancel(currentRecord);
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
              {props.options?.customContentBefore}
            </>
          )}
          <Grid>
            <Grid.Col span={{ base: 12 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Nome do grupo')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe o nome do grupo')}`}
                dataSource={isolatedDS}
                dataField="name"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <ArchbaseEdit
                label={`${getI18nextInstance().t('archbase:Descrição do grupo')}`}
                placeholder={`${getI18nextInstance().t('archbase:Informe a descrição do grupo')}`}
                dataSource={isolatedDS}
                dataField="description"
              />
            </Grid.Col>
          </Grid>
          {options?.customContentAfter && (
            <>
              {props.options?.customContentAfter}
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
