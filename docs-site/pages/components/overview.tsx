import { Shell } from '../../components/Shell';
import { ComponentGallery } from '../../components/ComponentGallery/ComponentGallery';

export default function Page() {
  return (
    <Shell currentPath="/components/overview">
      <ComponentGallery />
    </Shell>
  );
}
