import { Shell } from '../../components/Shell';
import Content from '../../content/api-reference/data.mdx';

export default function Page() {
  return (
    <Shell currentPath="/api-reference/data">
      <Content />
    </Shell>
  );
}
