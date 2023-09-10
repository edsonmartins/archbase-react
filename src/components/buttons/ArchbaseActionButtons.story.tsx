import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseActionButtons, ArchbaseAction } from './ArchbaseActionButtons';
import {
  IconDeviceFloppy,
  IconDownload,
  IconPencil,
  IconRefresh,
  IconSettings,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { Box, Button } from '@mantine/core';
import { IconPrinter } from '@tabler/icons-react';
import { IconTableExport } from '@tabler/icons-react';
import { IconTableImport } from '@tabler/icons-react';

const actions: ArchbaseAction[] = [
  {
    id: '1',
    icon: <IconDeviceFloppy />,
    color: 'green.5',
    label: 'Salvar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para salvar.',
  },
  {
    id: '2',
    icon: <IconTrash />,
    color: 'red.5',
    label: 'Remover',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para remover.',
  },
  {
    id: '3',
    icon: <IconPrinter />,
    color: 'blue.5',
    label: 'Imprimir',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para imprimir.',
  },
  {
    id: '4',
    icon: <IconDownload />,
    color: 'orange.5',
    label: 'Baixar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para baixar.',
  },
  {
    id: '5',
    icon: <IconUpload />,
    color: 'yellow.5',
    label: 'Carregar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para carregar.',
  },
  {
    id: '6',
    icon: <IconTableImport />,
    color: 'lime.5',
    label: 'Importar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para importar.',
  },
  {
    id: '7',
    icon: <IconTableExport />,
    color: 'teal.5',
    label: 'Exportar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para exportar.',
  },
  {
    id: '8',
    icon: <IconPencil />,
    color: 'cyan.5',
    label: 'Editar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para editar.',
  },
  {
    id: '9',
    icon: <IconRefresh />,
    color: 'indigo.5',
    label: 'Recarregar',
    executeAction: () => {},
    enabled: true,
    hint: 'Clique para recarregar.',
  },
  {
    id: '10',
    icon: <IconSettings />,
    color: 'grape.5',
    label: 'Opções',
    executeAction: () => {},
    enabled: true,
  },
];

function CustomMediumButtom(props: any) {
  return (
    <Button style={{ borderRadius: '2rem' }} color={props.action.color} {...props}>
      {props.action.icon}
    </Button>
  );
}

const ArchbaseActionButtonsExample = () => {
  return (
    <Box maw={1600}>
      <ArchbaseActionButtons
        actions={actions}
        // customComponents={{
        //   mediumButtonType: CustomMediumButtom,
        // }}
        options={{
          largerBreakPoint: '600px',
          smallerBreakPoint: '400px',
          largerSpacing: '2rem',
          smallerSpacing: '5rem',
          largerButtonVariant: 'filled',
          smallerButtonVariant: 'filled',
          menuItemVariant: 'filled',
          menuButtonVariant: 'filled',
          menuButtonColor: 'blue.5',
          menuDropdownPosition: 'bottom',
          menuItemApplyActionColor: true,
          menuPosition: 'right',
        }}
      />
    </Box>
  );
};

export default {
  title: 'Buttons/ActionButtons',
  component: ArchbaseActionButtonsExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseActionButtonsExample> = {
  args: {
    render: () => {
      <ArchbaseActionButtonsExample />;
    },
  },
};
