import { Button, Flex, Group, MantineNumberSize, Modal, ModalProps } from '@mantine/core'
import React, { ReactNode } from 'react'
import { useArchbaseAppContext } from '../core'
import { Bottom, Fill, Fixed, Left } from 'react-spaces'
import { useArchbaseTheme } from '../hooks'
import { IconCheck, IconDeviceFloppy } from '@tabler/icons-react'
import { IconX } from '@tabler/icons-react'
import { ArchbaseDataSource } from '../datasource'
import { t } from 'i18next'
import { ArchbaseDialog } from '../notification'

export interface ArchbaseFormModalTemplateProps<T extends object, ID> extends ModalProps {
  dataSource?: ArchbaseDataSource<T, ID>
  height: MantineNumberSize
  userActions?: ReactNode
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
  onClose,
  userActions
}: ArchbaseFormModalTemplateProps<T, ID>) {
  const appContext = useArchbaseAppContext()
  const theme = useArchbaseTheme()

  const handleSave = () => {
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  const handleClose = () => {
      ArchbaseDialog.showWarning(t("Click on Ok or Cancel to close"))
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
      <Fixed height={height}>
        <Fill>{children}</Fill>
        <Bottom size="40px">
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
        </Bottom>
      </Fixed>
    </Modal>
  )
}
