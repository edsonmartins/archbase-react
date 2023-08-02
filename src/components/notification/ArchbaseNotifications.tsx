import { Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconBug } from '@tabler/icons-react'
import React from 'react'


export class ArchbaseNotifications {
  public static showError(
    title: string,
    error: string,
    origin: any,
    autoClose: number = 5000
  ): void {
    notifications.show({
      withCloseButton: true,
      autoClose,
      title: (
        <Text c="red" fz="lg">
          {title}
        </Text>
      ),
      message: error,
      color: 'red',
      icon: <IconBug size="1.4rem" />,
      loading: false
    })
  }
}
