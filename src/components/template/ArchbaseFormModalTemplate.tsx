import { Button, Flex, Group, MantineNumberSize, Modal, ModalProps } from '@mantine/core'
import React, { ReactNode } from 'react'
import { useArchbaseAppContext } from '../core'
import { useArchbaseTheme } from '../hooks'
import { IconCheck } from '@tabler/icons-react'
import { IconX } from '@tabler/icons-react'
import { ArchbaseDataSource } from '../datasource'
import { t } from 'i18next'
import { ArchbaseDialog } from '../notification'
import { ArchbaseForm, ArchbaseSpaceBottom, ArchbaseSpaceFill, ArchbaseSpaceFixed } from '../containers'
import { processDetailErrorMessage, processErrorMessage } from '../core/exceptions'

export interface ArchbaseFormModalTemplateProps<T extends object, ID> extends Omit<ModalProps, "onClose"> {
  dataSource?: ArchbaseDataSource<T, ID>
  height: MantineNumberSize
  userActions?: ReactNode
  onCustomSave?: (record?: T, callback?: Function)=> void; 
  onAfterSave?: (record?: T)=> void;
  onClickOk: (record?: T, result?: any)=> void;
  onClickCancel: (record?: T)=> void;
  onBeforeOk?: (record? : T)=> Promise<any> | boolean | undefined;
}

export function ArchbaseFormModalTemplate<T extends object, ID>({
  title,
  withOverlay = true,
  overlayProps,
  children,
  withCloseButton = true,
  closeButtonProps,
  opened,
  fullScreen,
  centered,
  variant,
  closeOnEscape = true,
  size,
  dataSource,
  height,
  userActions,
  onAfterSave,
  onClickOk,
  onClickCancel,
  onBeforeOk,
  onCustomSave
}: ArchbaseFormModalTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext()
  const theme = useArchbaseTheme()

  const save = async () : Promise<boolean> => {
    if (dataSource) {
      if (!dataSource.isBrowsing()) {
        try {
          await dataSource.save()
          onAfterSave && onAfterSave(dataSource.getCurrentRecord())
        } catch (ex) {
          ArchbaseDialog.showErrorWithDetails(`${t('archbase:Warning')}`,processErrorMessage(ex), processDetailErrorMessage(ex))              
          return false
        }
      }
    }
    return true
  }

  const cancel = () => {
    if (dataSource) {
      if (!dataSource.isBrowsing()) {
        try {
          dataSource.cancel()
        } catch (ex) {
          // null
        }
      }
    }
  }

  const handleSave = async () => {
    if (onCustomSave) {
      if (dataSource){
        onCustomSave(dataSource.getCurrentRecord(), ()=>{
          onClickOk && onClickOk()
        })
      }
    } else {
      if (onBeforeOk) {
        let result = onBeforeOk();
        if (result instanceof Promise) {
          result.then(async ()=>{
            if (await save()) {
              onClickOk && onClickOk()
            }
          }).catch((error)=>{
            ArchbaseDialog.showErrorWithDetails(`${t('archbase:Warning')}`,processErrorMessage(error), processDetailErrorMessage(error))              
          })
        }
      } else {
        if (await save()) {
          onClickOk && onClickOk()
        }
      }  
    }    
  }

  const handleCancel = () => {
    cancel()
    onClickCancel && onClickCancel()
  }

  const handleClose = () => {
      ArchbaseDialog.showWarning(t("archbase:Click on Ok or Cancel to close"))
  }

  return (
    <Modal
      title={title}
      withOverlay={withOverlay}
      overlayProps={
        overlayProps || {
          color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],
          opacity: 0.25
        }
      }
      withCloseButton={withCloseButton}
      closeButtonProps={closeButtonProps}
      onClose={handleClose}
      opened={opened}
      fullScreen={fullScreen}
      centered={centered}
      closeOnEscape={closeOnEscape}
      size={size}
    >
      <ArchbaseSpaceFixed height={height}>
        <ArchbaseSpaceFill><ArchbaseForm>{children}</ArchbaseForm></ArchbaseSpaceFill>
        <ArchbaseSpaceBottom size="40px">
          <Flex justify="space-between" align="center">
            <Group>
                {userActions}
            </Group>
            {dataSource && !dataSource.isBrowsing()?<Group spacing="md">
              <Button
                leftIcon={<IconCheck />}
                onClick={handleSave}
                disabled={dataSource && dataSource.isBrowsing()}
                variant={variant ?? appContext.variant}
                color="green"
              >{`${t('Ok')}`}</Button>
              <Button
                leftIcon={<IconX />}
                onClick={handleCancel}
                disabled={dataSource && dataSource.isBrowsing()}
                variant={variant ?? appContext.variant}
                color="red"
              >{`${t('Cancel')}`}</Button>
            </Group>:<Group spacing="md">
              <Button
                leftIcon={<IconX />}
                onClick={handleCancel}
                variant={variant ?? appContext.variant}
              >{`${t('Close')}`}</Button>
            </Group>}
          </Flex>
        </ArchbaseSpaceBottom>
      </ArchbaseSpaceFixed>
    </Modal>
  )
}
