import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface DependencyDiagramProps {
  width?: number;
  height?: number;
}

export function DependencyDiagram({ width = 700, height = 450 }: DependencyDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Cores baseadas no tema
  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    core: isDark ? '#228be6' : '#15aabf',
    coreText: '#ffffff',
    data: isDark ? '#40c057' : '#37b24d',
    security: isDark ? '#fd7e14' : '#f76707',
    layout: isDark ? '#7950f2' : '#7048e8',
    components: isDark ? '#82c91e' : '#82c91e',
    template: isDark ? '#3b5bdb' : '#228be6',
    securityUi: isDark ? '#fa5252' : '#fa5252',
    admin: isDark ? '#868e96' : '#495057',
    text: isDark ? '#c1c2c5' : '#228be6',
    textDark: isDark ? '#ffffff' : '#1c7ed6',
  };

  return (
    <Box style={{ maxWidth: width, mx: 'auto' }}>
      <svg width="100%" viewBox="0 0 700 450" xmlns="http://www.w3.org/2000/svg">
        {/* Fundo */}
        <rect width="700" height="450" fill="transparent" />

        {/* Linhas de conexão */}
        <g stroke={colors.stroke} strokeWidth="2" fill="none">
          {/* Core -> data, security, layout */}
          <path d="M350 80 L200 140" />
          <path d="M350 80 L350 140" />
          <path d="M350 80 L500 140" />

          {/* data -> components */}
          <path d="M200 190 L200 230" />

          {/* components -> template, security-ui, admin */}
          <path d="M200 290 L200 340" />
          <path d="M200 290 L350 340" />
          <path d="M200 290 L500 340" />

          {/* security -> security-ui */}
          <path d="M350 190 L350 340" />

          {/* layout -> admin */}
          <path d="M500 190 L500 340" />
        </g>

        {/* @archbase/core */}
        <g>
          <rect x="275" y="30" width="150" height="50" rx="8" fill={colors.core} />
          <text x="350" y="60" textAnchor="middle" fill={colors.coreText} fontFamily="monospace" fontSize="14" fontWeight="bold">
            @archbase/core
          </text>
        </g>

        {/* @archbase/data */}
        <g>
          <rect x="125" y="140" width="150" height="50" rx="8" fill={colors.data} />
          <text x="200" y="170" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="14" fontWeight="bold">
            @archbase/data
          </text>
        </g>

        {/* @archbase/security */}
        <g>
          <rect x="275" y="140" width="150" height="50" rx="8" fill={colors.security} />
          <text x="350" y="162" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold">
            @archbase/
          </text>
          <text x="350" y="178" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold">
            security
          </text>
        </g>

        {/* @archbase/layout */}
        <g>
          <rect x="425" y="140" width="150" height="50" rx="8" fill={colors.layout} />
          <text x="500" y="170" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="14" fontWeight="bold">
            @archbase/layout
          </text>
        </g>

        {/* @archbase/components */}
        <g>
          <rect x="125" y="230" width="150" height="60" rx="8" fill={colors.components} />
          <text x="200" y="265" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="14" fontWeight="bold">
            @archbase/
          </text>
          <text x="200" y="255" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold">
            components
          </text>
        </g>

        {/* @archbase/template */}
        <g>
          <rect x="125" y="340" width="150" height="50" rx="8" fill={colors.template} />
          <text x="200" y="370" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold">
            @archbase/
          </text>
          <text x="200" y="358" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="bold">
            template
          </text>
        </g>

        {/* @archbase/security-ui */}
        <g>
          <rect x="275" y="340" width="150" height="50" rx="8" fill={colors.securityUi} />
          <text x="350" y="362" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="bold">
            @archbase/
          </text>
          <text x="350" y="378" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="11" fontWeight="bold">
            security-ui
          </text>
        </g>

        {/* @archbase/admin */}
        <g>
          <rect x="425" y="340" width="150" height="50" rx="8" fill={colors.admin} />
          <text x="500" y="370" textAnchor="middle" fill={isDark ? '#ffffff' : '#1c7ed6'} fontFamily="monospace" fontSize="14" fontWeight="bold">
            @archbase/admin
          </text>
        </g>
      </svg>
    </Box>
  );
}
