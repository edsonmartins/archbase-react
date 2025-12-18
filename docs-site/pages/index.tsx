import { Shell } from '@/components/Shell';
import IntroContent from '@/content/intro.mdx';

export default function HomePage() {
  return (
    <Shell currentPath="/">
      <IntroContent />
    </Shell>
  );
}
