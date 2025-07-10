# @archbase/data

Data management layer for Archbase React v3 - DataSource, hooks, and API services.

## Installation

```bash
npm install @archbase/data @archbase/core
```

## Features

- 🗄️ **DataSource**: Local and Remote data sources with TanStack Query
- 🔄 **State Management**: Zustand-based state management
- 🌐 **API Client**: Axios-based HTTP client with interceptors
- 🪝 **React Hooks**: Data fetching and state management hooks
- 📄 **Pagination**: Built-in pagination support
- 🔍 **Filtering**: Advanced filtering with RSQL
- 📊 **Sorting**: Multi-column sorting support

## Usage

### DataSource v2 (TanStack Query)

```typescript
import { 
  useArchbaseRemoteDataSourceV2,
  ArchbaseDataSourceProvider 
} from '@archbase/data';

// Remote data source with TanStack Query
const { dataSource, isLoading, error } = useArchbaseRemoteDataSourceV2({
  name: 'users',
  endpoint: '/api/users',
  queryKey: ['users']
});

// Provider for context
<ArchbaseDataSourceProvider dataSource={dataSource}>
  <YourComponent />
</ArchbaseDataSourceProvider>
```

### Local DataSource

```typescript
import { useArchbaseLocalDataSource } from '@archbase/data';

const dataSource = useArchbaseLocalDataSource({
  data: users,
  idField: 'id'
});
```

## API Documentation

Detailed API documentation coming soon...