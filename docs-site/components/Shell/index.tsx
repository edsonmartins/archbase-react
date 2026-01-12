import dynamic from 'next/dynamic';

export const Shell = dynamic(
  () => import('./Shell').then(mod => ({ default: mod.Shell })),
  {
    ssr: false,
    loading: () => null,
  }
);
