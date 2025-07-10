# @archbase/ssr

Server-Side Rendering utilities for Archbase React components with TanStack Start support.

## Installation

```bash
npm install @archbase/ssr
# or
yarn add @archbase/ssr
# or
pnpm add @archbase/ssr
```

## Peer Dependencies

```bash
npm install react react-dom @mantine/core @mantine/hooks @tanstack/react-query @tanstack/start
```

## Features

### 🚀 **TanStack Start Integration**
- Full SSR support for TanStack Start applications
- Seamless server/client data synchronization
- Optimized hydration strategies

### 📊 **DataSource SSR Support**
- SSR-compatible DataSource implementations
- State serialization/deserialization
- Automatic hydration from server data

### 🎯 **SSR-Safe Components**
- Hydration-safe providers and hooks
- Client-only and server-only components
- Media query hooks that work with SSR

### ⚡ **Performance Optimized**
- Minimal payload serialization
- Streaming-compatible
- Lazy hydration support

## Basic Setup

### 1. Wrap your app with ArchbaseSSRProvider

```typescript
// app.tsx (TanStack Start)
import { ArchbaseSSRProvider, ArchbaseTanStackProvider } from '@archbase/ssr';
import { QueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <ArchbaseSSRProvider>
      <ArchbaseTanStackProvider queryClient={queryClient}>
        <YourAppContent />
      </ArchbaseTanStackProvider>
    </ArchbaseSSRProvider>
  );
}
```

### 2. Use SSR-compatible DataSources

```typescript
import { useArchbaseSSRDataSource } from '@archbase/ssr';

function UsersList() {
  const {
    dataSource,
    isLoading,
    error,
    isHydrated
  } = useArchbaseSSRDataSource('users', {
    initialRecords: [], // Server-side initial data
    autoHydrate: true,
    fallbackRecords: []
  });

  if (!isHydrated) {
    return <div>Loading...</div>; // SSR placeholder
  }

  return (
    <div>
      {dataSource.getRecords().map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Advanced Usage

### Server-Side Data Fetching with TanStack Start

```typescript
// routes/users.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useArchbaseQuery, prepareServerQueries } from '@archbase/ssr';

export const Route = createFileRoute('/users')({
  component: UsersPage,
  loader: async ({ context }) => {
    // Prepare queries for SSR
    const queryClient = context.queryClient;
    
    await prepareServerQueries(queryClient, [
      {
        key: ['users'],
        fetchFn: () => fetch('/api/users').then(res => res.json())
      }
    ]);

    return {
      dehydratedState: queryClient.getQueryData(['users'])
    };
  }
});

function UsersPage() {
  const { dataSource } = useArchbaseSSRDataSource('users');
  
  const { data, isLoading } = useArchbaseQuery(
    ['users'],
    () => fetch('/api/users').then(res => res.json()),
    {
      dataSource,
      syncWithDataSource: true,
      ssr: true
    }
  );

  return (
    <div>
      <h1>Users</h1>
      {/* Your user list component */}
    </div>
  );
}
```

### SSR-Safe Utilities

```typescript
import { 
  canUseDOM, 
  safeLocalStorage, 
  withSSRFallback,
  ClientOnly,
  ServerOnly
} from '@archbase/ssr';

function MyComponent() {
  // Safe localStorage access
  const savedData = safeLocalStorage.getItem('userData');
  
  // Safe operation with fallback
  const windowWidth = withSSRFallback(
    () => window.innerWidth,
    1024 // fallback for SSR
  );

  return (
    <div>
      <ServerOnly>
        <div>This only renders on server</div>
      </ServerOnly>
      
      <ClientOnly fallback={<div>Loading...</div>}>
        <div>This only renders on client after hydration</div>
      </ClientOnly>
    </div>
  );
}
```

### Hydration-Safe State Management

```typescript
import { useHydrationSafeState, useSSRSafeMediaQuery } from '@archbase/ssr';

function ResponsiveComponent() {
  // Media query that works with SSR
  const isMobile = useSSRSafeMediaQuery('(max-width: 768px)', false);
  
  // State that's safe during hydration
  const theme = useHydrationSafeState(
    'light', // SSR value
    () => localStorage.getItem('theme') || 'light' // Client value
  );

  return (
    <div className={`theme-${theme} ${isMobile ? 'mobile' : 'desktop'}`}>
      Content
    </div>
  );
}
```

### Advanced DataSource Serialization

```typescript
import { ArchbaseSSRDataSource } from '@archbase/ssr';

// Create SSR-compatible DataSource
const userDataSource = new ArchbaseSSRDataSource('users');

// On server - serialize state
const serializedState = userDataSource.serializeState();

// Send to client and deserialize
userDataSource.deserializeState(serializedState);

// Or use minimal serialization for performance
const minimalState = userDataSource.serializeMinimalState();

// Create from server data
const hydratedDataSource = ArchbaseSSRDataSource.fromServerData(
  'users',
  serverData,
  { /* options */ }
);
```

### Multiple DataSources Management

```typescript
import { useArchbaseSSRDataSources } from '@archbase/ssr';

function Dashboard() {
  const {
    sources,
    getDataSource,
    serializeAll,
    isAnyLoading,
    errors
  } = useArchbaseSSRDataSources([
    { name: 'users', options: { initialRecords: [] } },
    { name: 'products', options: { initialRecords: [] } },
    { name: 'orders', options: { initialRecords: [] } }
  ]);

  const userDataSource = getDataSource('users');
  const productDataSource = getDataSource('products');

  if (isAnyLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <UsersList dataSource={userDataSource?.dataSource} />
      <ProductsList dataSource={productDataSource?.dataSource} />
    </div>
  );
}
```

## TanStack Start Route Example

Complete example of a TanStack Start route with Archbase SSR:

```typescript
// routes/products/$productId.tsx
import { createFileRoute } from '@tanstack/react-router';
import { 
  ArchbaseSSRProvider,
  useArchbaseSSRDataSource,
  prepareServerQueries 
} from '@archbase/ssr';

export const Route = createFileRoute('/products/$productId')({
  component: ProductPage,
  loader: async ({ params, context }) => {
    const { productId } = params;
    const queryClient = context.queryClient;

    // Prefetch product data on server
    await prepareServerQueries(queryClient, [
      {
        key: ['product', productId],
        fetchFn: () => fetchProduct(productId)
      }
    ]);

    const productData = queryClient.getQueryData(['product', productId]);

    return {
      productData,
      dehydratedState: queryClient.getQueryData(['product', productId])
    };
  }
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { productData } = Route.useLoaderData();

  const { dataSource, isHydrated } = useArchbaseSSRDataSource('product', {
    initialRecords: productData ? [productData] : [],
    autoHydrate: true
  });

  if (!isHydrated) {
    // SSR/hydration loading state
    return <ProductSkeleton />;
  }

  const product = dataSource.getCurrentRecord();

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <ProductForm dataSource={dataSource} />
    </div>
  );
}

async function fetchProduct(id: string) {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
}
```

## Best Practices

### 1. **Minimize Serialized Data**
```typescript
// Good: Only serialize essential data
const minimalState = dataSource.serializeMinimalState();

// Avoid: Serializing large datasets
const fullState = dataSource.serializeState(); // Use sparingly
```

### 2. **Graceful Fallbacks**
```typescript
const { dataSource, error } = useArchbaseSSRDataSource('users', {
  fallbackRecords: [], // Always provide fallbacks
  autoHydrate: true
});

if (error) {
  return <ErrorBoundary error={error} />;
}
```

### 3. **Conditional Client Features**
```typescript
import { ClientOnly, canUseDOM } from '@archbase/ssr';

function AdvancedFeatures() {
  return (
    <ClientOnly fallback={<BasicView />}>
      {canUseDOM() && <InteractiveChart />}
    </ClientOnly>
  );
}
```

### 4. **Performance Optimization**
```typescript
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <ClientOnly>
      <React.Suspense fallback={<Loading />}>
        <HeavyComponent />
      </React.Suspense>
    </ClientOnly>
  );
}
```

## Migration from Client-Only Archbase

1. **Wrap your app with SSR providers**
2. **Replace DataSource with useArchbaseSSRDataSource**
3. **Add SSR-safe utilities where needed**
4. **Update server routes for data prefetching**

## TypeScript Support

All components and hooks are fully typed with TypeScript. The package includes complete type definitions for optimal development experience.

## Browser Compatibility

- **Server**: Node.js 18+
- **Client**: Modern browsers with ES2020 support
- **SSR**: Full support for all server-side environments

## Performance

- **Bundle Size**: ~15KB gzipped
- **Runtime Overhead**: Minimal (hydration detection only)
- **Memory Usage**: Optimized serialization reduces memory footprint

## Contributing

This package is part of the Archbase React ecosystem. See the main repository for contribution guidelines.

## License

MIT License