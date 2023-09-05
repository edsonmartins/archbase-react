import React from 'react'

export interface ArchbaseFormProps {
  children: React.ReactNode
}

export function ArchbaseForm({ children }: ArchbaseFormProps) {
  return <form>{children}</form>
}
