import type { ReactNode } from 'react';
import { isValidElement } from 'react';

import { deepFilter } from './deepFilter';

export const onlyValid = (children: ReactNode | ReactNode[]): ReactNode[] =>
  deepFilter(children, (child: ReactNode) => isValidElement(child));
