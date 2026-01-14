# @archbase/core

Core utilities and foundation for Archbase React v3.

## Installation

```bash
npm install @archbase/core
# or
pnpm add @archbase/core
# or
yarn add @archbase/core
```

## Features

- 🎯 **Error Handling**: Comprehensive error boundary system
- 🔧 **IOC Container**: Dependency injection with InversifyJS
- 🌍 **Context Providers**: Global app context management
- 🛠️ **Utilities**: 20+ utility functions for common operations
- 🔍 **RSQL Parser**: Complete RSQL query parser

## Usage

```typescript
import {
  ArchbaseError,
  ArchbaseErrorBoundary,
  ArchbaseAppContext,
  withArchbaseErrorBoundary
} from '@archbase/core';

// Error Boundary
<ArchbaseErrorBoundary>
  <YourApp />
</ArchbaseErrorBoundary>

// Global Context
<ArchbaseAppContext.Provider value={appConfig}>
  <YourApp />
</ArchbaseAppContext.Provider>
```

## License

MIT © Edson Martins

## Documentation

For full documentation, visit [https://react.archbase.dev](https://react.archbase.dev)