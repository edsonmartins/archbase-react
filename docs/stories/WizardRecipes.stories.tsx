import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const catalogComponents = [
  { name: 'ArchbaseFormTemplate', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-form-template' },
  { name: 'ArchbaseSpaceTemplate', canonicalUrl: 'https://docs.archbase.com/storybook/archbase-space-template' }
];

const WizardLinksDemo = () => (
  <div>
    <p>
      Documente o uso de <code>ArchbaseFormTemplate</code> +{' '}
      <code>ArchbaseAdvancedTabs</code>/<code>ArchbaseSpaceTemplate</code> com{' '}
      <code>canonicalUrl</code> para o wizard/stepper.
    </p>
    <ul>
      {catalogComponents.map((component) => (
        <li key={component.name}>
          <strong>{component.name}</strong>:{' '}
          <a href={component.canonicalUrl}>{component.canonicalUrl}</a>
        </li>
      ))}
    </ul>
    <p>
      Enfatize <code>steps</code>, <code>onSubmit</code>, <code>validation</code> e instruções de
      a11y (aria-current) nas receitas baseadas em wizard.
    </p>
  </div>
);

const meta: Meta = {
  title: 'Recipes/Wizard Recipes',
  parameters: {
    docs: {
      description: {
        component: '# Wizard Recipes\n\nReceitas e links canônicos para wizards e steppers.'
      }
    }
  }
};

export default meta;

export const Links: StoryObj = {
  render: () => <WizardLinksDemo />
};
