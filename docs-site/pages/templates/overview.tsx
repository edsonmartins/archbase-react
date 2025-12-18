import { Shell } from '../../components/Shell';
import Content from '../../content/templates/overview.mdx';

export default function Page() {
  return (
    <Shell currentPath="/templates/overview">
      <Content />
    </Shell>
  );
}
