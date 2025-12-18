import { Shell } from '../../components/Shell';
import Content from '../../content/api-reference/admin.mdx';

export default function Page() {
  return (
    <Shell currentPath="/api-reference/admin">
      <Content />
    </Shell>
  );
}
