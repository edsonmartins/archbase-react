import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ArchbaseJsonView, defaultStyles, darkStyles, allExpanded, collapseAllNested } from '../index';

export default {
  title: 'Views/Json View',
  component: ArchbaseJsonView,
  argTypes: {
    data: {
      name: 'data',
      description: 'Dados a serem renderizados no controle. Deve ser um objeto ou array.'
    },
    shouldInitiallyExpand: {
      name: 'shouldInitiallyExpand',
      source: {
        type: 'code'
      },
      description:
        'A função que será inicialmente chamada para cada Object e Array dos dados para calcular deve se este nó for expandido. `level` começa em `0`, `field` não tem um valor para o elemento do array. A biblioteca fornece duas implementações integradas: `allExpanded` e `collapseAllNested`'
    },
    style: {
      name: 'style',
      defaultValue: defaultStyles,
      description:
        'Coleção de estilo CSS a ser usado para o componente. A biblioteca fornece duas implementações integradas: `darkStyles`, `defaultStyles`'
    }
  },
  decorators: [
    (Story) => (
      <div
        style={{
          fontSize: '14px',
          fontFamily: `ui-monospace,Menlo,Monaco,"Roboto Mono","Oxygen Mono","Ubuntu Monospace","Source Code Pro","Droid Sans Mono","Courier New",monospace`
        }}
      >
        {Story()}
      </div>
    )
  ]
} as ComponentMeta<typeof ArchbaseJsonView>;

const Template: ComponentStory<typeof ArchbaseJsonView> = (args) => <ArchbaseJsonView {...args} />;

const jsonData = {
  'string property': 'Meu texto',
  'number property': 42.42,
  'boolean property': true,
  'null property': null,
  'array propery': [1, 2, 3, 4, 5],
  'nested object': {
    first: true,
    second: 'outro valor',
    'sub nested': {
      sub1: [true, true, true],
      longText:
        ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pharetra at dolor eu egestas. Mauris bibendum a sem vel euismod. Proin vitae imperdiet diam. In sed gravida nisi, in convallis felis. Fusce convallis dapibus molestie. In tristique dapibus velit et rutrum. Nam vestibulum sodales tortor. Integer gravida aliquet sollicitudin. Duis at nulla varius, congue risus sit amet, gravida ipsum. Cras placerat pellentesque ipsum, a consequat magna pretium et. Duis placerat dui nisi, eget varius dui egestas eget. Etiam leo mauris, mattis et aliquam hendrerit, dapibus eu massa. Phasellus vitae vestibulum elit. Nulla congue eleifend massa at efficitur. '
    }
  }
};

export const Basic = Template.bind({});
Basic.args = {
  data: jsonData,
  style: defaultStyles,
  shouldInitiallyExpand: allExpanded
};

export const DarkTheme = Template.bind({});
DarkTheme.args = {
  data: jsonData,
  style: darkStyles
};

export const CollapsedNestedObjects = Template.bind({});
CollapsedNestedObjects.args = {
  data: jsonData,
  style: defaultStyles,
  shouldInitiallyExpand: collapseAllNested
};

export const CollapsedRoot = Template.bind({});
const collapseAll = () => false;

CollapsedRoot.args = {
  data: jsonData,
  style: defaultStyles,
  shouldInitiallyExpand: collapseAll
};
