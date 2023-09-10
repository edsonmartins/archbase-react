import { Card, Grid, Input, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseSpaceTemplate } from '../ArchbaseSpaceTemplate';
import { ArchbaseActionButtons } from '@components/buttons/ArchbaseActionButtons';
import { Actions } from '@components/buttons/ArchbaseActionButtons.story';

export const ArchbaseSpaceTemplateExample = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <ArchbaseSpaceTemplate
          title={'Pessoas'}
          options={{
            headerFlexGrow: 'right',
          }}
          headerLeft={
            <Card>
              <Text>Pesquisar</Text>
              <Input miw={'300px'} />
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
      </Grid.Col>
    </Grid>
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
