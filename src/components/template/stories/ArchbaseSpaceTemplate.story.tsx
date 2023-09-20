import { Card } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseSpaceTemplate } from '../ArchbaseSpaceTemplate';
import { ArchbaseActionButtons } from '@components/buttons/ArchbaseActionButtons';
import { Actions } from '@components/buttons/ArchbaseActionButtons.story';
import { ArchbaseGlobalFilter } from '@components/querybuilder/ArchbaseGlobalFilter';

export const ArchbaseSpaceTemplateExample = () => {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
      <ArchbaseSpaceTemplate
        title={'Pessoas'}
        options={{
          headerFlexGrow: 'right',
        }}
        headerLeft={
          <Card>
            <ArchbaseGlobalFilter
              minFilterValueLength={3}
              searchableFields={['id', 'cpf', 'nome', 'idade']}
              onFilter={(value) => console.log(value)}
              options={{
                flexContainerProps: {
                  miw: 300,
                },
              }}
            />
          </Card>
        }
        headerRight={
          <ArchbaseActionButtons
            actions={Actions}
            options={{
              largerBreakPoint: '800px',
              smallerBreakPoint: '400px',
              largerSpacing: '2rem',
              smallerSpacing: '0.5rem',
              largerButtonVariant: 'filled',
              smallerButtonVariant: 'filled',
              menuItemVariant: 'filled',
              menuButtonVariant: 'filled',
              menuButtonColor: 'blue.5',
              menuItemApplyActionColor: true,
              menuPosition: 'right',
            }}
          />
        }
      />
    </div>
  );
};

export default {
  title: 'Templates/Space template',
  component: ArchbaseSpaceTemplateExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseSpaceTemplateExample> = {
  args: {
    render: () => {
      <ArchbaseSpaceTemplateExample />;
    },
  },
};
