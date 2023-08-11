import React, { ChangeEventHandler } from 'react';
import { Button, Flex, Paper, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import i18next from 'i18next';
import { IconBug, IconCircleFilled, IconOctagonFilled, IconTriangle} from '@tabler/icons-react';

export class ArchbaseDialog {

  static showConfirmDialogYesNo = (title: string, question: string, onConfirm: () => void, onCancel: () => void) => {
    modals.openConfirmModal({
      title,
      centered: true,
      children: <Text size="sm">{question}</Text>,
      labels: { confirm: i18next.t('Yes'), cancel: i18next.t('No') },
      confirmProps: { color: 'green' },
      cancelProps: { color: 'red' },
      onCancel,
      onConfirm,
    });
  };

  static showInfo = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title : title?title:i18next.t("Information"),
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconCircleFilled color='blue'/>
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll();
              onConfirm && onConfirm();
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      ),
    });
  };

  static showWarning = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title : title?title:i18next.t("Attention"),
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconTriangle color='blue'/>
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll();
              onConfirm && onConfirm();
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      ),
    });
  };

  static showError = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title: title?title:i18next.t("Attention"),
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconBug color="red"/>
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll();
              onConfirm && onConfirm();
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      ),
    });
  };

  static showInputDialog = (label: string, placeholder?: string, title?: string, onInputChange?: ChangeEventHandler<any> | undefined, onConfirm?: () => void, onCancel?: () => void) => {
    modals.open({
      title: title?title:i18next.t("Informe"),
      children: (
        <Paper>
          <TextInput label={label} placeholder={placeholder} data-autofocus onChange={onInputChange}/>
          <Button
            onClick={() => {
              modals.closeAll();
              onConfirm && onConfirm();
            }}
            mt="md"
          >
            Ok
          </Button>
          <Button
            onClick={() => {
              modals.closeAll();
              onCancel && onCancel();
            }}
            mt="md"
          >
            Cancela
          </Button>
        </Paper>
      ),
    });
  };
}
