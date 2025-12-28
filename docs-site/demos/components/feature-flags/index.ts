import type { MantineDemo } from '@mantinex/demo';
import { ArchbaseFeatureFlagsUsage } from './ArchbaseFeatureFlagsUsage';
import { ArchbaseFeatureFlagsWithContext } from './ArchbaseFeatureFlagsWithContext';

// Usage Demo
const usageCode = `
import {
  ArchbaseFeatureFlagsProvider,
  useArchbaseFeatureFlag,
  useArchbaseVariant,
} from '@archbase/feature-flags';

function Demo() {
  const { enabled: newDashboard, loading } = useArchbaseFeatureFlag('new-dashboard');
  const { variant } = useArchbaseVariant('button-color');

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{newDashboard ? 'New Dashboard' : 'Old Dashboard'}</h1>
      <button style={{ background: variant?.payload?.value || 'blue' }}>
        Click Me
      </button>
    </div>
  );
}

function App() {
  return (
    <ArchbaseFeatureFlagsProvider
      config={{
        url: 'https://app.unleash-hosted.com',
        clientKey: 'your-api-key',
        appName: 'my-app',
        environment: 'production',
      }}
    >
      <Demo />
    </ArchbaseFeatureFlagsProvider>
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: ArchbaseFeatureFlagsUsage,
  code: usageCode,
};

// With Context Demo
const withContextCode = `
import {
  ArchbaseFeatureFlagsProvider,
  useArchbaseFeatureFlag,
} from '@archbase/feature-flags';

function Demo({ userId }: { userId: string }) {
  const { enabled: premium } = useArchbaseFeatureFlag('premium-features');

  return (
    <div>
      {premium ? 'Premium Content' : 'Free Content'}
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState('user-123');

  return (
    <ArchbaseFeatureFlagsProvider
      config={{
        url: 'https://app.unleash-hosted.com',
        clientKey: 'your-api-key',
        appName: 'my-app',
        context: {
          userId,
          properties: {
            plan: 'premium',
            region: 'us',
          },
        },
      }}
    >
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <Demo userId={userId} />
    </ArchbaseFeatureFlagsProvider>
  );
}
`;

export const withContext: MantineDemo = {
  type: 'code',
  component: ArchbaseFeatureFlagsWithContext,
  code: withContextCode,
};
