import { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { ArchbaseNotifications } from './ArchbaseNotifications';

const meta: Meta<typeof ArchbaseNotifications> = {
  title: 'Feedback/ArchbaseNotifications',
  component: ArchbaseNotifications,
  tags: ['autodocs']
};

export default meta;

export const WithProgrammaticToast: StoryObj<typeof ArchbaseNotifications> = {
  render: () => {
    useEffect(() => {
      ArchbaseNotifications.showError('Erro programático', 'Erro');
    }, []);
    return <ArchbaseNotifications position="top-right" />;
  }
};
