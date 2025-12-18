import { Shell } from '../../components/Shell';
import Content from '../../content/admin/sidebar.mdx';

export default function Page() {
  return (
    <Shell currentPath="/admin/sidebar">
      <Content />
    </Shell>
  );
}
