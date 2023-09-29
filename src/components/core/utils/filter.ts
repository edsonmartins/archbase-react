import type { ReactNode } from 'react'
import { Children } from 'react'

export const filter = (
  children: ReactNode | ReactNode[],
  filterFn: (child: ReactNode, index?: number, children?: ReactNode[]) => boolean
): ReactNode[] => Children.toArray(children).filter(filterFn)

