# @archbase/components

UI Components for Archbase React v3 - Form editors, data visualization, and business components.

## Installation

```bash
npm install @archbase/components @archbase/core @archbase/data @archbase/layout
# or
pnpm add @archbase/components @archbase/core @archbase/data @archbase/layout
# or
yarn add @archbase/components @archbase/core @archbase/data @archbase/layout
```

## Features

- **Form Components**: Auto-generated forms from JSON schema
- **Data Grid**: Advanced data grid with sorting, filtering, and pagination
- **Charts**: React Chart.js and ApexCharts wrappers
- **Code Editor**: CodeMirror integration
- **File Components**: File upload, preview, and management
- **PDF Viewer**: PDF.js integration
- **Rich Text Editor**: Markdown and WYSIWYG editors
- **Print Components**: Print-to-PDF functionality
- **Timeline**: Vis.js timeline integration

## Dependencies

```json
{
  "@mantine/core": "8.3.12",
  "@mantine/charts": "8.3.12",
  "@mantine/form": "8.3.12",
  "@tabler/icons-react": "^3.26.0",
  "react": "^18.3.0 || ^19.0.0",
  "react-dom": "^18.3.0 || ^19.0.0"
}
```

## Usage

```typescript
import { 
  ArchbaseForm, 
  ArchbaseDataGrid,
  ArchbaseChart 
} from '@archbase/components';
```

## License

MIT © Edson Martins

## Documentation

For full documentation, visit [https://react.archbase.dev](https://react.archbase.dev)
