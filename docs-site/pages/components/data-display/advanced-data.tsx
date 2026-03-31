import { Shell } from '../../../components/Shell';
import GanttContent from '../../../content/components/data-display/archbase-gantt.mdx';
import ResourceTimelineContent from '../../../content/components/data-display/archbase-resource-timeline.mdx';
import SpreadsheetContent from '../../../content/components/data-display/archbase-spreadsheet.mdx';

export default function Page() {
  return (
    <Shell currentPath="/components/data-display/advanced-data">
      <GanttContent />
      <ResourceTimelineContent />
      <SpreadsheetContent />
    </Shell>
  );
}
