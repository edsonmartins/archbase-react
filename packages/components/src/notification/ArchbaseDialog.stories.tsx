import { Meta, StoryObj } from '@storybook/react';
import { Button, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';
import { ArchbaseDialog } from './ArchbaseDialog';

const meta: Meta<typeof ArchbaseDialog> = {
  title: 'Components/Feedback/ArchbaseDialog',
  component: ArchbaseDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Utilitários de diálogos (confirmação, aviso, erro) baseados em Mantine modals.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseDialog>;

export const ConfirmationFlow: Story = {
  render: () => {
    const [lastAction, setLastAction] = useState('Nenhuma ação registrada');

    const openConfirm = () => {
      ArchbaseDialog.showConfirmDialogYesNo(
        'Confirmar exclusão',
        'Deseja realmente deletar o registro?',
        () => setLastAction('Cancelado'),
        () => setLastAction('Confirmado')
      );
    };

    const openSuccess = () => {
      ArchbaseDialog.showSuccess('Registro salvo com sucesso!', 'Sucesso', () =>
        setLastAction('Success dialog confirmado')
      );
    };

    return (
      <Stack spacing="md">
        <Button onClick={openConfirm}>Abrir diálogo de confirmação</Button>
        <Button onClick={openSuccess} variant="outline">
          Abrir diálogo de sucesso
        </Button>
        <Text size="sm">Última ação: {lastAction}</Text>
      </Stack>
    );
  }
};
