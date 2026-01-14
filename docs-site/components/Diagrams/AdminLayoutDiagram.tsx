import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface AdminLayoutDiagramProps {
  width?: number;
  height?: number;
}

export function AdminLayoutDiagram({ width = 600, height = 400 }: AdminLayoutDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    header: isDark ? '#228be6' : '#15aabf',
    sidebar: isDark ? '#7950f2' : '#7048e8',
    main: isDark ? '#40c057' : '#37b24d',
    tabs: isDark ? '#fd7e14' : '#f76707',
    text: isDark ? '#ffffff' : '#ffffff',
    subtext: isDark ? '#e5e5e5' : '#f8f9fa',
    label: isDark ? '#c1c2c5' : '#495057',
    arrow: isDark ? '#909296' : '#868e96',
  };

  return (
    <Box style={{ maxWidth: width, mx: 'auto' }}>
      <svg width="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        {/* Fundo */}
        <rect width="600" height="400" fill="transparent" />

        {/* Container principal */}
        <rect x="50" y="60" width="500" height="300" rx="4" fill={isDark ? '#2a2a2a' : '#f5f5f5'} stroke={colors.stroke} strokeWidth="2" />

        {/* Header */}
        <rect x="50" y="60" width="500" height="50" rx="4" fill={colors.header} opacity="0.9" />
        <text x="300" y="90" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
          Header (Logo, User Dropdown, Actions)
        </text>

        {/* Sidebar */}
        <rect x="50" y="110" width="120" height="250" fill={colors.sidebar} opacity="0.9" />
        <text x="110" y="140" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="11" fontWeight="bold">
          Sidebar
        </text>
        <text x="110" y="160" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
          Navigation
        </text>

        {/* Sidebar items */}
        <rect x="60" y="180" width="100" height="20" rx="2" fill={colors.subtext} opacity="0.3" />
        <rect x="60" y="205" width="100" height="20" rx="2" fill={colors.subtext} opacity="0.3" />
        <rect x="60" y="230" width="100" height="20" rx="2" fill={colors.subtext} opacity="0.3" />

        {/* Tabs Container (abaixo do header, ao lado da sidebar) */}
        <rect x="170" y="110" width="380" height="35" fill={colors.tabs} opacity="0.8" />
        <text x="360" y="133" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="10" fontWeight="bold">
          TabContainer (múltiplas abas com keep-alive)
        </text>

        {/* Main Content Area */}
        <rect x="170" y="145" width="380" height="215" fill={colors.main} opacity="0.15" />
        <text x="360" y="250" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="11" fontWeight="bold">
          Main Content
        </text>
        <text x="360" y="270" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10">
          (Rotas / Páginas)
        </text>

        {/* Título */}
        <text x="300" y="35" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="14" fontWeight="bold">
          ArchbaseAdminMainLayout
        </text>

        {/* Componentes */}
        <g transform="translate(50, 380)">
          <text x="0" y="0" fill={colors.label} fontFamily="monospace" fontSize="9">
            Componentes: ArchbaseAdminMainLayout, ArchbaseAdvancedSidebar, ArchbaseTabContainer
          </text>
        </g>
      </svg>
    </Box>
  );
}
