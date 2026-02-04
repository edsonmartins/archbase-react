export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export const NAVIGATION_DATA: NavItem[] = [
  { label: 'Introdução', href: '/' },
  {
    label: 'Getting Started',
    children: [
      { label: 'Instalação', href: '/getting-started/installation' },
      { label: 'Quick Start', href: '/getting-started/quick-start' },
      { label: 'Estrutura do Projeto', href: '/getting-started/project-structure' },
    ],
  },
  {
    label: 'Core Concepts',
    children: [
      { label: 'Providers', href: '/core-concepts/providers' },
      { label: 'DataSource v2', href: '/core-concepts/datasource-v2' },
      { label: 'Fluxo de Aprendizado', href: '/core-concepts/datasource-learning-path' },
      { label: 'Hooks', href: '/core-concepts/hooks' },
      { label: 'Validação', href: '/core-concepts/validation' },
      { label: 'i18n', href: '/core-concepts/i18n' },
    ],
  },
  {
    label: 'Components',
    children: [
      { label: 'Visão Geral', href: '/components/overview' },
      {
        label: 'Editors',
        children: [
          { label: 'Text Inputs', href: '/components/editors/text-inputs' },
          { label: 'Select Inputs', href: '/components/editors/select-inputs' },
          { label: 'Number Inputs', href: '/components/editors/number-inputs' },
          { label: 'Date/Time', href: '/components/editors/date-time' },
          { label: 'Boolean Inputs', href: '/components/editors/boolean-inputs' },
          { label: 'Rich Content', href: '/components/editors/rich-content' },
          { label: 'Specialized', href: '/components/editors/specialized' },
        ],
      },
      {
        label: 'Data Display',
        children: [
          { label: 'DataGrid', href: '/components/data-display/datagrid' },
          { label: 'Lists', href: '/components/data-display/lists' },
          { label: 'Charts', href: '/components/data-display/charts' },
        ],
      },
      {
        label: 'Feedback',
        children: [
          { label: 'Notifications', href: '/components/feedback/notifications' },
          { label: 'Modals', href: '/components/feedback/modals' },
        ],
      },
      {
        label: 'Navigation',
        children: [{ label: 'Buttons', href: '/components/navigation/buttons' }],
      },
      {
        label: 'Debug',
        children: [{ label: 'Inspector', href: '/components/debug/inspector' }],
      },
    ],
  },
  {
    label: 'Templates',
    children: [
      { label: 'Visão Geral', href: '/templates/overview' },
      { label: 'Form Template', href: '/templates/form-template' },
      { label: 'Grid Template', href: '/templates/grid-template' },
      { label: 'Lookup Template', href: '/templates/lookup-template' },
      { label: 'Modal Template', href: '/templates/modal-template' },
      { label: 'Masonry Template', href: '/templates/masonry-template' },
      { label: 'Space Template', href: '/templates/space-template' },
    ],
  },
  {
    label: 'Layout',
    children: [
      { label: 'Visão Geral', href: '/layout/overview' },
      { label: 'Containers', href: '/layout/containers' },
      { label: 'Space System', href: '/layout/space-system' },
      { label: 'Dockable', href: '/layout/dockable' },
    ],
  },
  {
    label: 'Admin',
    children: [
      { label: 'Visão Geral', href: '/admin/overview' },
      { label: 'Main Layout', href: '/admin/main-layout' },
      { label: 'Sidebar', href: '/admin/sidebar' },
      { label: 'Navigation', href: '/admin/navigation' },
      { label: 'Tabs', href: '/admin/tabs' },
      { label: 'Drawers', href: '/admin/drawers' },
    ],
  },
  {
    label: 'Security',
    children: [
      { label: 'Security & Authentication', href: '/security/security' },
      { label: 'Fluxo de Aprendizado', href: '/security/security-learning-path' },
      { label: 'Visão Geral', href: '/security/overview' },
      { label: 'Authentication', href: '/security/authentication' },
      { label: 'Authorization', href: '/security/authorization' },
      { label: 'Providers', href: '/security/providers' },
      { label: 'Components', href: '/security/components' },
      { label: 'UI Components', href: '/security/ui-components' },
    ],
  },
  {
    label: 'Advanced',
    children: [
      { label: 'Query Builder', href: '/advanced/query-builder' },
      { label: 'Filters', href: '/advanced/filters' },
    ],
  },
  {
    label: 'SSR',
    children: [
      { label: 'Visão Geral', href: '/ssr/overview' },
      { label: 'Providers', href: '/ssr/providers' },
      { label: 'DataSource SSR', href: '/ssr/datasource-ssr' },
      { label: 'TanStack Integration', href: '/ssr/tanstack-integration' },
    ],
  },
  {
    label: 'Guides',
    children: [
      { label: 'Best Practices', href: '/guides/best-practices' },
      { label: 'Performance', href: '/guides/performance' },
      { label: 'Accessibility', href: '/guides/accessibility' },
      { label: 'Testing', href: '/guides/testing' },
      { label: 'Theming', href: '/guides/theming' },
      { label: 'Migração v2 → v3', href: '/guides/migration-v2-v3' },
    ],
  },
  {
    label: 'API Reference',
    children: [
      { label: 'Core', href: '/api-reference/core' },
      { label: 'Data', href: '/api-reference/data' },
      { label: 'Components', href: '/api-reference/components' },
      { label: 'Template', href: '/api-reference/template' },
      { label: 'Layout', href: '/api-reference/layout' },
      { label: 'Admin', href: '/api-reference/admin' },
      { label: 'Security', href: '/api-reference/security' },
      { label: 'Advanced', href: '/api-reference/advanced' },
      { label: 'SSR', href: '/api-reference/ssr' },
    ],
  },
  {
    label: 'Troubleshooting',
    children: [
      { label: 'FAQ', href: '/troubleshooting/faq' },
      { label: 'Problemas Comuns', href: '/troubleshooting/common-issues' },
      { label: 'Mensagens de Erro', href: '/troubleshooting/error-messages' },
    ],
  },
];
