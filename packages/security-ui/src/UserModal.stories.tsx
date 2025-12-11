import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { UserModal } from './UserModal';

const meta: Meta<typeof UserModal> = {
  title: 'Security/UserModal',
  component: UserModal,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof UserModal>;

export const Basic: Story = {
  args: {
    opened: true,
    onClose: () => {}
  }
};
