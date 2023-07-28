import type { CSSObject, MantineTheme } from '@mantine/core'
import { Global } from '@mantine/core'

import React from 'react'

export function ArchbaseFonts() {
  return (
    <Global
      styles={[
        {
        }
      ]}
    />
  )
}

export default (_theme: MantineTheme): CSSObject => ({
  body: {
    overflowY: 'auto'
  }
})
