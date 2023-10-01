import type { MantineThemeOverride } from '@mantine/core'

import ArchbaseGlobalStyles from './archbase-global.styles'

export const ArchbaseDark: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Inter, sans-serif',
  colors: {
    archbase: [
      '#def3ff',
      '#bdddf2',
      '#98c9e4',
      '#72b6d8',
      '#4da6cc',
      '#3391b2',
      '#24698c',
      '#154665',
      '#03253e',
      '#000b1a'
    ]
  },
  primaryColor: 'archbase',
  globalStyles: ArchbaseGlobalStyles
}
