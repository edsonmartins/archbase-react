# @archbase/graphics

Graphics and infographic components for Archbase React v3 powered by [@antv/infographic](https://github.com/antvis/Infographic).

## Installation

```bash
npm install @archbase/graphics
```

## Features

- 📊 **Infographic Components**: React components for rendering infographics
- 🎨 **200+ Templates**: Access to all @antv/infographic templates
- 🤖 **AI-Friendly**: Support for streaming AI-generated content
- 🎯 **TypeScript**: Full TypeScript support
- 🎨 **Theme System**: Customizable themes for infographics
- 📝 **DSL Syntax**: Declarative specification language

## Usage

### Basic Infographic Renderer

```tsx
import { InfographicRenderer } from '@archbase/graphics';

function App() {
  const specification = `
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Step 1
      desc: Start
    - label: Step 2
      desc: In Progress
    - label: Step 3
      desc: Complete
  `;

  return (
    <InfographicRenderer
      width="100%"
      height="500px"
      specification={specification}
      onRenderComplete={() => console.log('Rendered!')}
    />
  );
}
```

### Using the Hook

```tsx
import { useInfographic } from '@archbase/graphics';

function App() {
  const { infographic, render, isLoading, error } = useInfographic({
    width: '100%',
    height: '500px',
    editable: true,
  });

  useEffect(() => {
    if (infographic) {
      render('infographic timeline-simple-vertical\ndata\n  items:\n    - label: Event 1');
    }
  }, [infographic, render]);

  return <div ref={containerRef} />;
}
```

### Using Utility Functions

```tsx
import {
  createProcessInfographic,
  createTimelineInfographic,
  createMetricCard,
  INFGRAPHIC_TEMPLATES
} from '@archbase/graphics';

// Create a process flow
const processSpec = createProcessInfographic([
  { label: 'Planning', desc: 'Define requirements' },
  { label: 'Development', desc: 'Build the solution' },
  { label: 'Testing', desc: 'Quality assurance' },
  { label: 'Deployment', desc: 'Release to production' },
]);

// Create a timeline
const timelineSpec = createTimelineInfographic([
  { label: 'Q1', desc: 'Project kick-off', date: '2024-01-01' },
  { label: 'Q2', desc: 'MVP release', date: '2024-04-01' },
]);

// Create a metric card
const metricSpec = createMetricCard('Total Users', 12500, 'Active users this month');
```

## Available Templates

The package includes access to 200+ infographic templates from @antv/infographic:

- **List Templates**: `list-row-simple-horizontal-arrow`, `list-row-simple-horizontal-line`, etc.
- **Timeline Templates**: `timeline-simple-vertical`, `timeline-horizontal`, etc.
- **Card Templates**: `card-simple`, `card-detailed`, etc.
- **Mind Map Templates**: `mindmap-simple`, `mindmap-organic`, etc.
- **Flowchart Templates**: `flowchart-simple`, `flowchart-connector`, etc.

And many more! See [@antv/infographic documentation](https://github.com/antvis/Infographic) for the complete list.

## API Reference

### Components

#### `<InfographicRenderer />`

Main component for rendering infographics.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| number` | `'100%'` | Container width |
| `height` | `string \| number` | `'100%'` | Container height |
| `editable` | `boolean` | `false` | Enable editing mode |
| `specification` | `string` | - | Infographic DSL specification |
| `theme` | `string` | - | Theme to apply |
| `className` | `string` | - | Additional CSS class |
| `onReady` | `(instance) => void` | - | Callback when ready |
| `onRenderComplete` | `() => void` | - | Callback after render |
| `onError` | `(error) => void` | - | Callback on error |

### Hooks

#### `useInfographic(options)`

Hook for managing infographic instances.

```typescript
const {
  infographic,  // The Infographic instance
  isLoading,    // Loading state
  error,        // Error state
  render,       // Render a specification
  destroy,      // Destroy the instance
  updateTheme   // Update the theme
} = useInfographic({
  width: '100%',
  height: '500px',
  editable: false,
});
```

### Utilities

| Function | Description |
|----------|-------------|
| `generateInfographicSpec(template, data)` | Generate specification from template and data |
| `createProcessInfographic(steps)` | Create a process flow infographic |
| `createTimelineInfographic(events)` | Create a timeline infographic |
| `createMetricCard(title, value, desc)` | Create a metric card specification |
| `extractTemplate(spec)` | Extract template name from specification |
| `isValidSpecification(spec)` | Validate specification format |
| `mergeDataIntoTemplate(template, data)` | Merge data into template |

## License

MIT
