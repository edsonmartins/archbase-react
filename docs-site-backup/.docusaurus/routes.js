import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs/',
    component: ComponentCreator('/docs/', '70e'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', '534'),
        routes: [
          {
            path: '/docs/',
            component: ComponentCreator('/docs/', '756'),
            routes: [
              {
                path: '/docs/admin/drawers',
                component: ComponentCreator('/docs/admin/drawers', '3a2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/admin/main-layout',
                component: ComponentCreator('/docs/admin/main-layout', '557'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/admin/navigation',
                component: ComponentCreator('/docs/admin/navigation', '171'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/admin/overview',
                component: ComponentCreator('/docs/admin/overview', 'b4e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/admin/sidebar',
                component: ComponentCreator('/docs/admin/sidebar', 'e74'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/admin/tabs',
                component: ComponentCreator('/docs/admin/tabs', 'aee'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/advanced/filters',
                component: ComponentCreator('/docs/advanced/filters', '8be'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/advanced/query-builder',
                component: ComponentCreator('/docs/advanced/query-builder', '60c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/admin',
                component: ComponentCreator('/docs/api-reference/admin', '315'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/advanced',
                component: ComponentCreator('/docs/api-reference/advanced', 'dd5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/components',
                component: ComponentCreator('/docs/api-reference/components', 'e58'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/core',
                component: ComponentCreator('/docs/api-reference/core', '2cf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/data',
                component: ComponentCreator('/docs/api-reference/data', '771'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/layout',
                component: ComponentCreator('/docs/api-reference/layout', 'd70'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/security',
                component: ComponentCreator('/docs/api-reference/security', '711'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/ssr',
                component: ComponentCreator('/docs/api-reference/ssr', '004'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/api-reference/template',
                component: ComponentCreator('/docs/api-reference/template', '350'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/data-display/charts',
                component: ComponentCreator('/docs/components/data-display/charts', 'e5b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/data-display/datagrid',
                component: ComponentCreator('/docs/components/data-display/datagrid', '397'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/data-display/lists',
                component: ComponentCreator('/docs/components/data-display/lists', 'be8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/debug/inspector',
                component: ComponentCreator('/docs/components/debug/inspector', '2a4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/boolean-inputs',
                component: ComponentCreator('/docs/components/editors/boolean-inputs', '013'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/date-time',
                component: ComponentCreator('/docs/components/editors/date-time', '3a5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/number-inputs',
                component: ComponentCreator('/docs/components/editors/number-inputs', '3d3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/rich-content',
                component: ComponentCreator('/docs/components/editors/rich-content', '2f0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/select-inputs',
                component: ComponentCreator('/docs/components/editors/select-inputs', '13d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/specialized',
                component: ComponentCreator('/docs/components/editors/specialized', 'c84'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/editors/text-inputs',
                component: ComponentCreator('/docs/components/editors/text-inputs', 'be0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/feedback/modals',
                component: ComponentCreator('/docs/components/feedback/modals', 'e95'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/feedback/notifications',
                component: ComponentCreator('/docs/components/feedback/notifications', '1a3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/navigation/buttons',
                component: ComponentCreator('/docs/components/navigation/buttons', '70e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/components/overview',
                component: ComponentCreator('/docs/components/overview', 'cc4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/core-concepts/datasource-v2',
                component: ComponentCreator('/docs/core-concepts/datasource-v2', 'fa4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/core-concepts/hooks',
                component: ComponentCreator('/docs/core-concepts/hooks', 'c38'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/core-concepts/i18n',
                component: ComponentCreator('/docs/core-concepts/i18n', 'a6c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/core-concepts/providers',
                component: ComponentCreator('/docs/core-concepts/providers', '46d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/core-concepts/validation',
                component: ComponentCreator('/docs/core-concepts/validation', '469'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/getting-started/installation',
                component: ComponentCreator('/docs/getting-started/installation', '4da'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/getting-started/project-structure',
                component: ComponentCreator('/docs/getting-started/project-structure', '367'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/getting-started/quick-start',
                component: ComponentCreator('/docs/getting-started/quick-start', '936'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/guides/accessibility',
                component: ComponentCreator('/docs/guides/accessibility', '2c2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/guides/best-practices',
                component: ComponentCreator('/docs/guides/best-practices', '38d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/guides/migration-v2-v3',
                component: ComponentCreator('/docs/guides/migration-v2-v3', '162'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/guides/performance',
                component: ComponentCreator('/docs/guides/performance', '779'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/guides/testing',
                component: ComponentCreator('/docs/guides/testing', 'db7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/guides/theming',
                component: ComponentCreator('/docs/guides/theming', '597'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/layout/containers',
                component: ComponentCreator('/docs/layout/containers', '1cb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/layout/dockable',
                component: ComponentCreator('/docs/layout/dockable', 'fb4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/layout/overview',
                component: ComponentCreator('/docs/layout/overview', '9cd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/layout/space-system',
                component: ComponentCreator('/docs/layout/space-system', 'db6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/security/authentication',
                component: ComponentCreator('/docs/security/authentication', 'a71'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/security/authorization',
                component: ComponentCreator('/docs/security/authorization', '7e4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/security/components',
                component: ComponentCreator('/docs/security/components', 'e78'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/security/overview',
                component: ComponentCreator('/docs/security/overview', 'b99'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/security/providers',
                component: ComponentCreator('/docs/security/providers', '124'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/security/ui-components',
                component: ComponentCreator('/docs/security/ui-components', 'de6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/ssr/datasource-ssr',
                component: ComponentCreator('/docs/ssr/datasource-ssr', '90d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/ssr/overview',
                component: ComponentCreator('/docs/ssr/overview', '262'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/ssr/providers',
                component: ComponentCreator('/docs/ssr/providers', 'e51'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/ssr/tanstack-integration',
                component: ComponentCreator('/docs/ssr/tanstack-integration', '974'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/templates/form-template',
                component: ComponentCreator('/docs/templates/form-template', '942'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/templates/grid-template',
                component: ComponentCreator('/docs/templates/grid-template', 'b36'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/templates/masonry-template',
                component: ComponentCreator('/docs/templates/masonry-template', 'd00'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/templates/modal-template',
                component: ComponentCreator('/docs/templates/modal-template', '11a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/templates/overview',
                component: ComponentCreator('/docs/templates/overview', 'c89'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/templates/space-template',
                component: ComponentCreator('/docs/templates/space-template', '235'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/troubleshooting/common-issues',
                component: ComponentCreator('/docs/troubleshooting/common-issues', '2d3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/troubleshooting/error-messages',
                component: ComponentCreator('/docs/troubleshooting/error-messages', 'a62'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/troubleshooting/faq',
                component: ComponentCreator('/docs/troubleshooting/faq', 'bb2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '098'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
