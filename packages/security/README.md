# @archbase/security

Security and authentication components for Archbase React.

## Installation

```bash
npm install @archbase/security
# or
pnpm add @archbase/security
# or
yarn add @archbase/security
```

## Features

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Crypto Utilities**: Crypto-js wrapper utilities
- **Session Management**: Session handling and persistence
- **Security Context**: Global security state management

## Dependencies

```json
{
  "@mantine/core": "8.3.12",
  "@mantine/hooks": "8.3.12",
  "@tabler/icons-react": "^3.27.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Usage

```typescript
import { 
  useAuth,
  SecurityProvider,
  ProtectedRoute 
} from '@archbase/security';
```

## License

MIT © Edson Martins

## Documentation

For full documentation, visit [https://react.archbase.dev](https://react.archbase.dev)
