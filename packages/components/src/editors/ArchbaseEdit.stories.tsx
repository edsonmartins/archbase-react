import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ArchbaseEdit, ArchbaseEditProps } from './ArchbaseEdit';

const meta: Meta<typeof ArchbaseEdit> = {
  title: 'Components/Editores/ArchbaseEdit',
  component: ArchbaseEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Input texto que se liga a um DataSource (v1/v2) e expõe `onChangeValue`.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseEdit>;

const ControlledEdit: React.FC<ArchbaseEditProps<any, any>> = (props) => {
  const [value, setValue] = useState('Archbase User');
  return (
    <ArchbaseEdit
      {...props}
      value={value}
      onChangeValue={(nextValue) => setValue(nextValue)}
    />
  );
};

export const Default: Story = {
  args: {
    label: 'Nome completo',
    placeholder: 'Digite seu nome'
  },
  render: (args) => <ControlledEdit {...args} />
};
