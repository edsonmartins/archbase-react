# @archbase/feature-flags

Feature flags integration for Archbase React v3 using Unleash.

## Installation

```bash
npm install @archbase/feature-flags
# or
pnpm add @archbase/feature-flags
# or
yarn add @archbase/feature-flags
```

## Features

- **Unleash Integration**: Full Unleash proxy client support
- **React Hooks**: Easy-to-use hooks for feature flag checks
- **Context Provider**: Global feature flag context
- **Type Safety**: Full TypeScript support

## Dependencies

```json
{
  "@mantine/core": "8.3.12",
  "react": "^18.3.0 || ^19.0.0",
  "react-dom": "^18.3.0 || ^19.0.0"
}
```

## Usage

```typescript
import { useFeature, FeatureProvider } from '@archbase/feature-flags';

// Check if a feature is enabled
const { isEnabled } = useFeature('my-feature');

if (isEnabled) {
  // Feature code
}
```

## License

MIT © Edson Martins

## Documentation

For full documentation, visit [https://react.archbase.dev](https://react.archbase.dev)
