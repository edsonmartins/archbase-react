import React from 'react'
import { useMantineTheme } from '@mantine/core'

export const withArchbaseMantineThemeHOC = (Component: any) => {
  return (props: any) => {
    const theme = useMantineTheme()

    return <Component theme={theme} {...props} />
  }
}
