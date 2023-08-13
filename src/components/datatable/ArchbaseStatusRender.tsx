import { Badge, Box } from '@mantine/core'
import React from 'react'

export type ArchbaseStatusType = {
  value: any
  label: string
  color: string
}

export interface ArchbaseStatusRenderProps {
  currentValue: string | undefined
  values: ArchbaseStatusType[]
}

export function ArchbaseStatusRender({ currentValue, values }: ArchbaseStatusRenderProps) {
  const index = values.findIndex((item) => item.value.toString() === currentValue)
  if (index !== -1) {
    return (
      <Box>
        <Badge color={values[index].color}>{values[index].label}</Badge>
      </Box>
    )
  }
  return null
}
