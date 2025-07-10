import type { ReactNode } from 'react'
import { isValidElement } from 'react'

export const getElementName = (element: ReactNode): string | null => {
  if (!isValidElement(element)) {
    return null
  }

  return typeof element.type === 'string' ? element.type : element.type.name
}


