import { create } from '@storybook/theming/create';
import {archbaseLogo} from '../src/components/core'

export default create({
    base: 'light',
    brandTitle: 'Archbase React Storybook',
    brandUrl: '/',
    brandImage: archbaseLogo,
});