import React from 'react'
import { Flex, Space, Text } from '@mantine/core'
import { forwardRef } from 'react'
import { ProfileDto } from './SecurityDomain'

export interface RenderProfileUserItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string
  label: string
  description: string
  origin: ProfileDto
}

export const RenderProfileUserItem = forwardRef<HTMLDivElement, RenderProfileUserItemProps>(
  ({ image, label, description, origin, ...others }: RenderProfileUserItemProps, ref) => (
    <div ref={ref} {...others}>
      <Flex>
        <Text size="sm" fw={600}>
          {origin ? origin.name:''}
        </Text>
        <Space w="lg" />
      </Flex>
    </div>
  )
)
