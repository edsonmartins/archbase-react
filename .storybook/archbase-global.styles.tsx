import type { CSSObject, MantineTheme } from '@mantine/core'

export default (_theme: MantineTheme): CSSObject => ({
  body: {
    overflowY: 'hidden',
    margin: 0,
    fontFamily: 'Inter',
  }
})
