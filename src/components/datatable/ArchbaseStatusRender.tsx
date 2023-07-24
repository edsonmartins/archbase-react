import { Badge, Box } from '@mantine/core'
import React from 'react'

export type MandalaStatusType = {
  value: any
  label: string
  color: string
}

export interface MandalaStatusRenderProps {
  currentValue: string | undefined
  values: MandalaStatusType[]
}

export function MandalaStatusRender({ currentValue, values }: MandalaStatusRenderProps) {
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
