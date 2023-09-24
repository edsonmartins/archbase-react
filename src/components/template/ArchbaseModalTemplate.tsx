import { Button, Flex, Group, MantineNumberSize, Modal, ModalProps } from '@mantine/core';
import React, { ReactNode } from 'react';
import { useArchbaseAppContext } from '../core';
import { Bottom, Fill, Fixed } from 'react-spaces';
import { useArchbaseTheme } from '../hooks';
import { IconCheck } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { t } from 'i18next';
import { ArchbaseDialog } from '../notification';
import { ArchbaseForm, ArchbaseSpaceFill, ArchbaseSpaceFixed } from '../containers';

export interface ArchbaseModalTemplateProps extends ModalProps {
  height: MantineNumberSize;
  userActions?: ReactNode;
  onClickOk?: () => void;
  onClickCancel?: () => void;
}

export function ArchbaseModalTemplate({
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
  height,
  onClose,
  onClickOk,
  onClickCancel,
  userActions,
}: ArchbaseModalTemplateProps) {
  const appContext = useArchbaseAppContext();
  const theme = useArchbaseTheme();

  const handleSave = () => {
    if (onClickOk) {
      onClickOk();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onClickCancel) {
      onClickCancel();
    }
    onClose();
  };

  const handleClose = () => {
    ArchbaseDialog.showWarning(t('Click on Ok or Cancel to close'));
  };

  return (
    <Modal
      title={title}
      withOverlay={withOverlay}
      overlayProps={
        overlayProps || {
          color: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[6],
          opacity: 0.25,
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
        <ArchbaseSpaceFill>
          <ArchbaseForm>{children}</ArchbaseForm>
        </ArchbaseSpaceFill>
        <Bottom size="40px">
          <Flex justify="space-between" align="center">
            <Group>{userActions}</Group>
            <Group spacing="md">
              <Button
                leftIcon={<IconCheck />}
                onClick={handleSave}
                variant={variant ?? appContext.variant}
                color="green"
              >{`${t('Ok')}`}</Button>
              <Button
                leftIcon={<IconX />}
                onClick={handleCancel}
                variant={variant ?? appContext.variant}
                color="red"
              >{`${t('Cancel')}`}</Button>
            </Group>
          </Flex>
        </Bottom>
      </ArchbaseSpaceFixed>
    </Modal>
  );
}
