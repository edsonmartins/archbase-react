import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';

const Content = dynamic(() => import('../../../content/components/data-display/display-tools.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function Page() {
  return (
    <Shell currentPath="/components/data-display/display-tools">
      <Content />
    </Shell>
  );
}
