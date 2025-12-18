module.exports = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/project-structure',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/providers',
        'core-concepts/datasource-v2',
        'core-concepts/hooks',
        'core-concepts/validation',
        'core-concepts/i18n',
      ],
    },
    {
      type: 'category',
      label: 'Components',
      items: [
        'components/overview',
        {
          type: 'category',
          label: 'Editors',
          items: [
            'components/editors/text-inputs',
            'components/editors/select-inputs',
            'components/editors/number-inputs',
            'components/editors/date-time',
            'components/editors/boolean-inputs',
            'components/editors/rich-content',
            'components/editors/specialized',
          ],
        },
        {
          type: 'category',
          label: 'Data Display',
          items: [
            'components/data-display/datagrid',
            'components/data-display/lists',
            'components/data-display/charts',
          ],
        },
        {
          type: 'category',
          label: 'Feedback',
          items: [
            'components/feedback/notifications',
            'components/feedback/modals',
          ],
        },
        {
          type: 'category',
          label: 'Navigation',
          items: [
            'components/navigation/buttons',
          ],
        },
        {
          type: 'category',
          label: 'Debug',
          items: [
            'components/debug/inspector',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Templates',
      items: [
        'templates/overview',
        'templates/form-template',
        'templates/grid-template',
        'templates/modal-template',
        'templates/masonry-template',
        'templates/space-template',
      ],
    },
    {
      type: 'category',
      label: 'Layout',
      items: [
        'layout/overview',
        'layout/containers',
        'layout/space-system',
        'layout/dockable',
      ],
    },
    {
      type: 'category',
      label: 'Admin',
      items: [
        'admin/overview',
        'admin/main-layout',
        'admin/sidebar',
        'admin/navigation',
        'admin/tabs',
        'admin/drawers',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/overview',
        'security/authentication',
        'security/authorization',
        'security/providers',
        'security/components',
        'security/ui-components',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/query-builder',
        'advanced/filters',
      ],
    },
    {
      type: 'category',
      label: 'SSR',
      items: [
        'ssr/overview',
        'ssr/providers',
        'ssr/datasource-ssr',
        'ssr/tanstack-integration',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/best-practices',
        'guides/performance',
        'guides/accessibility',
        'guides/testing',
        'guides/theming',
        'guides/migration-v2-v3',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/core',
        'api-reference/data',
        'api-reference/components',
        'api-reference/template',
        'api-reference/layout',
        'api-reference/admin',
        'api-reference/security',
        'api-reference/advanced',
        'api-reference/ssr',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/faq',
        'troubleshooting/common-issues',
        'troubleshooting/error-messages',
      ],
    },
  ],
};
