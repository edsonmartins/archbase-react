import React, { ChangeEventHandler } from 'react'
import { Accordion, Button, Flex, Paper, ScrollArea, Text, TextInput, rem } from '@mantine/core'
import { ContextModalProps, modals } from '@mantine/modals'
import i18next from 'i18next'
import { IconAlertTriangleFilled, IconBug, IconCircleCheckFilled, IconCircleFilled, IconInfoCircle, IconInfoCircleFilled, IconTriangle } from '@tabler/icons-react'

export class ArchbaseDialog {
  static showConfirmDialogYesNo = (
    title: string,
    question: string,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    modals.openConfirmModal({
      title,
      centered: true,
      children: <Text size="sm">{question}</Text>,
      labels: { confirm: i18next.t('archbase:No'), cancel: i18next.t('archbase:Yes')},
      confirmProps: { color: 'red' },
      cancelProps: { color: 'green' },
      onConfirm:onCancel,
      onCancel:onConfirm,
    })
  }

  static showInfo = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title: title || i18next.t('archbase:Information'),
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconInfoCircleFilled size="2rem" style={{color:"#099CFF"}}/>
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll()
              onConfirm && onConfirm!()
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      )
    })
  }

  static showWarning = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title: title || i18next.t('archbase:Attention'),
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconAlertTriangleFilled size="2rem" style={{color:"orange"}} />
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll()
              onConfirm && onConfirm!()
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      )
    })
  }

  static showSuccess = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title: title || i18next.t('archbase:Attention'),
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconCircleCheckFilled size="2rem" style={{color:"#1AC455"}} />
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll()
              onConfirm && onConfirm!()
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      )
    })
  }

  static showError = (message: string, title?: string, onConfirm?: () => void) => {
    modals.open({
      title: title || i18next.t('archbase:Attention'),
      size:'md',
      children: (
        <Paper>
          <Flex gap="md" direction="row" justify="flex-start" align="center">
            <IconBug size="2rem" style={{color:"red"}}  />
            <Text size="md">{message}</Text>
          </Flex>
          <Button
            fullWidth
            onClick={() => {
              modals.closeAll()
              onConfirm && onConfirm!()
            }}
            mt="md"
          >
            Ok
          </Button>
        </Paper>
      )
    })
  }

  static showErrorWithDetails = (title: string, message: string, detailMessage?: string, onConfirm?: () => void) => {
    modals.openContextModal({
      modal: 'archbaseShowError',
      title: title,
      innerProps: {
        message, detailMessage, onConfirm
      },
    })
  }

  static showInputDialog = (
    label: string,
    placeholder?: string,
    title?: string,
    onInputChange?: ChangeEventHandler<any> | undefined,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    modals.open({
      title: title || i18next.t('archbase:Informe'),
      children: (
        <Paper>
          <TextInput
            label={label}
            placeholder={placeholder}
            data-autofocus
            onChange={onInputChange}
          />
          <Button
            onClick={() => {
              modals.closeAll()
              onConfirm && onConfirm!()
            }}
            mt="md"
          >
            Ok
          </Button>
          <Button
            onClick={() => {
              modals.closeAll()
              onCancel && onCancel!()
            }}
            mt="md"
          >
            {i18next.t('archbase:Cancel')}
          </Button>
        </Paper>
      )
    })
  }
}



export const CustomShowErrorModal = ({ context, id, innerProps }: ContextModalProps<{ message: string, detailMessage?: string, onConfirm?: () => void  }>) => (
    <Paper miw={"400px"}>
      <Accordion variant="contained">
        <Accordion.Item value="photos">
          <Accordion.Control
            icon={
              <IconBug size="2.8rem"
                style={{ color: 'red' }}
              />
            }
          >
            <ScrollArea h={"160px"} mah={"160px"}>{innerProps.message}</ScrollArea>
          </Accordion.Control>
          <Accordion.Panel>
            <ScrollArea h={"200px"} mah={"200px"}>{innerProps.detailMessage}</ScrollArea>
          </Accordion.Panel>
        </Accordion.Item>
        </Accordion>
      <Button fullWidth mt="md" onClick={() => {
        if (innerProps.onConfirm){
          innerProps.onConfirm()
        }
        context.closeModal(id)}
      }>
        Ok
      </Button>
    </Paper>
);