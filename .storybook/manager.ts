import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';


addons.setConfig({
  // Config
  panelPosition: 'bottom',
  // Base theme
  theme: create({
    base: 'light',
    brandTitle: 'Archbase React Storybook',
    brandImage: '/archbase_logo.png',
})
});

