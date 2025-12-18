import { Shell } from '../../components/Shell';
import Content from '../../content/security/overview.mdx';

export default function Page() {
  return (
    <Shell currentPath="/security/overview">
      <Content />
    </Shell>
  );
}
