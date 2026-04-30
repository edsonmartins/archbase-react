import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';

const GanttContent = dynamic(() => import('../../../content/components/data-display/archbase-gantt.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ResourceTimelineContent = dynamic(() => import('../../../content/components/data-display/archbase-resource-timeline.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const SpreadsheetContent = dynamic(() => import('../../../content/components/data-display/archbase-spreadsheet.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function Page() {
  return (
    <Shell currentPath="/components/data-display/advanced-data">
      <GanttContent />
      <ResourceTimelineContent />
      <SpreadsheetContent />
    </Shell>
  );
}
