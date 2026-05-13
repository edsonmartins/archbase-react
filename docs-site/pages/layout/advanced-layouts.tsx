import dynamic from 'next/dynamic';
import { Shell } from '../../components/Shell';

const Content = dynamic(
  () => import('../../content/layout/advanced-layouts.mdx'),
  { ssr: false, loading: () => <div style={{ padding: '1rem' }}>Carregando...</div> }
);

export default function Page() {
  return (
    <Shell currentPath="/layout/advanced-layouts">
      <Content />
    </Shell>
  );
}
