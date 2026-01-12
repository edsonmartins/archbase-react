import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

export const Shell = dynamic(
  () => import('./Shell').then(mod => ({ default: mod.Shell })),
  {
    ssr: false,
    loading: () => null,
  }
);

export type ShellProps = ComponentProps<typeof Shell>;
