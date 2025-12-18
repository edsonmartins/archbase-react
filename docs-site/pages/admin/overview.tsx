import { Shell } from '../../components/Shell';
import Content from '../../content/admin/overview.mdx';

export default function Page() {
  return (
    <Shell currentPath="/admin/overview">
      <Content />
    </Shell>
  );
}
