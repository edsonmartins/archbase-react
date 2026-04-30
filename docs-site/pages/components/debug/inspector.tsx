import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';

const Content = dynamic(() => import('../../../content/components/debug/inspector.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function Page() {
  return (
    <Shell currentPath="/components/debug/inspector">
      <Content />
    </Shell>
  );
}
