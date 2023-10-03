import { Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconBug, IconCircleCheck } from '@tabler/icons-react'
import React from 'react'

export class ArchbaseNotifications {
  public static showError(title: string, error: string, autoClose: number = 5000, variant?: string): void {
    notifications.show({
      withCloseButton: true,
      autoClose,
      title: (
        <Text c="red" fz="lg">
          {title}
        </Text>
      ),
      message: error,
      variant,
      withBorder: true,
      color: 'red',
      icon: <IconBug size="1.4rem" />,
      loading: false
    })
  }

  public static showSuccess(title: string, message: string, autoClose: number = 5000, variant?: string): void {
    notifications.show({
      withCloseButton: true,
      autoClose,
      title: (
        <Text c="#1AC455" fz="lg">
          {title}
        </Text>
      ),
      message,
      variant:"filled",
      withBorder:true,
      color: '#1AC455',
      icon: <IconCircleCheck size="1.4rem" />,
      loading: false
    })
  }

  public static showWarning(title: string, message: string, autoClose: number = 5000, variant?: string): void {
    notifications.show({
      withCloseButton: true,
      autoClose,
      title: (
        <Text c="orange" fz="lg">
          {title}
        </Text>
      ),
      message,
      variant:"filled",
      withBorder:true,
      color: 'orange',
      icon: <IconAlertCircle size="1.4rem" />,
      loading: false
    })
  }
}
