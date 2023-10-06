import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Box } from '@mantine/core'

import { ArchbaseActionButtons } from './ArchbaseActionButtons'
import { ActionsDemo } from './ActionsDemo'

const ArchbaseActionButtonsExample = () => {
  return (
    <Box maw={1600}>
      <ArchbaseActionButtons
        actions={ActionsDemo}
        options={{
          largerBreakPoint: '600px',
          smallerBreakPoint: '400px',
          largerSpacing: '1rem',
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
  )
}

const meta: Meta<typeof ArchbaseActionButtons> = {
  title: 'Botões/ActionButtons',
  component: ArchbaseActionButtons,
}

export default meta
type Story = StoryObj<typeof ArchbaseActionButtons>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseActionButtonsExample />,
}
