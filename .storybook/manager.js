import { addons } from '@storybook/addons';
import ArchbaseStoryBookTheme from "./archbase-storybook-theme";

addons.setConfig({
  // Config
  panelPosition: 'bottom',
  // Base theme
  theme: ArchbaseStoryBookTheme
});


const storybookLinks = window.document.querySelectorAll('a[title="Storybook"]');
console.log(storybookLinks)