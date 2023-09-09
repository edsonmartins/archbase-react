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
import { Box, Space } from '@mantine/core';
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
  },
  {
    id: '2',
    icon: <IconTrash />,
    color: 'red.5',
    label: 'Remover',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '3',
    icon: <IconPrinter />,
    color: 'blue.5',
    label: 'Imprimir',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '4',
    icon: <IconDownload />,
    color: 'orange.5',
    label: 'Baixar',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '5',
    icon: <IconUpload />,
    color: 'yellow.5',
    label: 'Carregar',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '6',
    icon: <IconTableImport />,
    color: 'lime.5',
    label: 'Importar',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '7',
    icon: <IconTableExport />,
    color: 'teal.5',
    label: 'Exportar',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '8',
    icon: <IconPencil />,
    color: 'cyan.5',
    label: 'Editar',
    executeAction: () => {},
    enabled: true,
  },
  {
    id: '9',
    icon: <IconRefresh />,
    color: 'indigo.5',
    label: 'Recarregar',
    executeAction: () => {},
    enabled: true,
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

const ArchbaseActionButtonsExample = () => {
  return (
    <Box maw={1600}>
      <ArchbaseActionButtons
        actions={actions}
        options={{
          largerBreakPoint: '800px',
          smallerBreakPoint: '600px',
          largerSpacing: '2rem',
          smallerSpacing: '0.1rem',
          largerButtonVariant: 'filled',
          smallerButtonVariant: 'filled',
          menuItemVariant: 'filled',
          menuButtonVariant: 'gradient',
          menuButtonColor: 'blue.5',
          menuVariant: 'gradient',
          menuPosition: 'left',
        }}
      />
    </Box>
  );
};

export default {
  title: 'ActionButtons',
  component: ArchbaseActionButtonsExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseActionButtonsExample> = {
  args: {
    render: () => {
      <ArchbaseActionButtonsExample />;
    },
  },
};
