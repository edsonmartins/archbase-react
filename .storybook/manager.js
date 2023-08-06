import { addons } from '@storybook/addons';
import { create } from '@storybook/theming/create';
import {archbaseLogo} from '../src/components/core'


addons.setConfig({
  // Config
  panelPosition: 'bottom',

  // Base theme
  theme: create({
    base: 'light',
    brandTitle: 'Archbase React Storybook',
    brandUrl: '/',
    brandImage: archbaseLogo
  }),
});
