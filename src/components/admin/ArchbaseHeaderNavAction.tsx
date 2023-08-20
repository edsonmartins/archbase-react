import React from 'react';
import { Group } from "@mantine/core"
import { ReactNode } from "react"

export interface ArchbaseHeaderNavActionProps {
    children: ReactNode[]
  }
  
  export const ArchbaseHeaderNavAction = (props: ArchbaseHeaderNavActionProps) => {
    return <Group spacing="sm">{props.children}</Group>
  }
  