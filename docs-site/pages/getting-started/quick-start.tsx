import { Shell } from '../../components/Shell';
import Content from '../../content/getting-started/quick-start.mdx';

export default function Page() {
  return (
    <Shell currentPath="/getting-started/quick-start">
      <Content />
    </Shell>
  );
}
