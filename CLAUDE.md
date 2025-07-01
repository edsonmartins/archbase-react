# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Archbase React is a comprehensive TypeScript React component library built on top of Mantine.dev, designed for rapid development of business applications (SAAS). It provides 80+ components with integrated state management, validation, and data binding capabilities.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm storybook              # Run Storybook on port 6006
pnpm test                   # Run tests
pnpm test:watch            # Run tests in watch mode
pnpm test:coverage         # Run tests with coverage report
pnpm lint                  # Run ESLint

# Build
pnpm build                 # Build library with Rollup
pnpm build:storybook       # Build Storybook for deployment

# Documentation
pnpm docs                  # Generate TypeDoc documentation
pnpm storybook:deploy      # Deploy Storybook to GitHub Pages

# Version Management
pnpm changeset             # Create a changeset for version bumps
pnpm release              # Publish new version
```

## Architecture

### Component Structure
Components follow a consistent pattern with TypeScript generics for type safety:

```typescript
export interface Archbase[ComponentName]Props<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;  // DataSource integration
  dataField?: string;                       // Field binding
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  style?: CSSProperties;
  size?: MantineSize;
  width?: string | number;
  onChangeValue?: (value: any, event: any) => void;
  onFocusEnter?: FocusEventHandler<T>;
  onFocusExit?: FocusEventHandler<T>;
  innerRef?: React.RefObject<HTMLElement>;
}
```

### DataSource Pattern
The core architectural pattern for data management:
- `ArchbaseDataSource<T, ID>` - Base class for data binding
- `ArchbaseLocalFilterDataSource` - Local data with filtering
- `ArchbaseRemoteDataSource` - Remote API integration
- Event-driven updates using listeners
- Automatic UI synchronization

### Directory Organization
- `src/components/admin/` - Admin layouts with navigation
- `src/components/auth/` - Authentication system with OAuth2
- `src/components/core/` - Core utilities, contexts, IoC
- `src/components/datasource/` - Data management layer
- `src/components/editors/` - 30+ form input components
- `src/components/template/` - CRUD templates
- `src/components/security/` - Security management
- `src/components/hooks/` - Custom React hooks

### Key Technologies
- React 18+ with TypeScript
- Mantine UI v8.1.2 for base components
- Zustand for state management
- i18next for internationalization (pt-BR, en, es)
- InversifyJS for dependency injection
- Jest + React Testing Library for testing
- Rollup for building (outputs CJS and ESM)
- Storybook for documentation

## Testing

Run tests with proper component setup:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('component behavior', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

## Component Integration

When creating or modifying components:
1. Follow the existing DataSource integration pattern
2. Use Mantine components as base when possible
3. Support dark/light theme through Mantine theme system
4. Include TypeScript generics for data binding
5. Export both component and types from index.ts
6. Add Storybook story for documentation
7. Use i18next for any user-facing text
8. Follow existing event handler patterns (onChangeValue, onFocusEnter, etc.)

## Common Patterns

### DataSource Listener Hook
```typescript
useArchbaseDataSourceListener<T, ID>({
  dataSource,
  listener: (event: DataSourceEvent<T>) => {
    if (event.type === DataSourceEventNames.fieldChanged) {
      // Handle field change
    }
  }
});
```

### Component Export Pattern
```typescript
// In component file
export { ArchbaseComponent } from './ArchbaseComponent';
export type { ArchbaseComponentProps } from './ArchbaseComponent';

// In index.ts
export * from './ArchbaseComponent';
```

### Style Handling
- CSS Modules for component-specific styles (`.module.css`)
- Mantine theme overrides for consistent theming
- Style props passed to components
- Global SCSS for shared styles