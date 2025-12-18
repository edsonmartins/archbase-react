import { Shell } from '../../components/Shell';
import Content from '../../content/ssr/overview.mdx';

export default function Page() {
  return (
    <Shell currentPath="/ssr/overview">
      <Content />
    </Shell>
  );
}
