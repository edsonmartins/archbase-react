import React from 'react'
import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoonStars } from '@tabler/icons-react'
import i18next from 'i18next'

export const ArchbaseColorSchemeAction = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  
  const dark = colorScheme === 'dark'
  return (
    <ActionIcon
      variant="transparent"
      color={dark ? 'white' : 'blue'}
      onClick={() => toggleColorScheme()}
      title={i18next.t('toggleColorScheme')}
    >
      {dark ? <IconSun size="1.5rem" /> : <IconMoonStars size="1.5rem" />}
    </ActionIcon>
  )
}
