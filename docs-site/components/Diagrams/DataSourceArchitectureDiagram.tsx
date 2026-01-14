import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface DataSourceArchitectureDiagramProps {
  width?: number;
  height?: number;
}

export function DataSourceArchitectureDiagram({ width = 550, height = 200 }: DataSourceArchitectureDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    components: isDark ? '#228be6' : '#15aabf',
    dataSource: isDark ? '#7950f2' : '#7048e8',
    service: isDark ? '#40c057' : '#37b24d',
    text: isDark ? '#ffffff' : '#ffffff',
    subtext: isDark ? '#e5e5e5' : '#f8f9fa',
    label: isDark ? '#c1c2c5' : '#495057',
    arrow: isDark ? '#909296' : '#868e96',
  };

  return (
    <Box style={{ width: '100%', mx: 'auto' }}>
      <svg width="100%" style={{ maxWidth: width }} viewBox="0 0 550 200" xmlns="http://www.w3.org/2000/svg">
        {/* Definições das setas */}
        <defs>
          <marker id="arrowDS" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.arrow} />
          </marker>
        </defs>

        {/* Fundo */}
        <rect width="550" height="200" fill="transparent" />

        {/* Camada 1: Componentes (Apresentação) */}
        <g>
          <rect x="30" y="30" width="150" height="80" rx="8" fill={colors.components} opacity="0.9" />
          <text x="105" y="55" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            Componentes
          </text>
          <text x="105" y="72" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            (Apresentação)
          </text>
          <text x="105" y="92" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            ArchbaseEdit
          </text>
          <text x="105" y="104" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            DataGrid, etc.
          </text>
        </g>

        {/* Seta bidirecional Componentes <-> DataSource */}
        <g stroke={colors.arrow} strokeWidth="2">
          <line x1="180" y1="60" x2="220" y2="60" markerEnd="url(#arrowDS)" />
          <line x1="220" y1="80" x2="180" y2="80" markerEnd="url(#arrowDS)" />
        </g>

        {/* Camada 2: DataSource (Lógica/Estado) */}
        <g>
          <rect x="220" y="30" width="150" height="80" rx="8" fill={colors.dataSource} opacity="0.9" />
          <text x="295" y="55" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            DataSource
          </text>
          <text x="295" y="72" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            (Lógica/Estado)
          </text>
          <text x="295" y="92" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            Estados: BROWSE
          </text>
          <text x="295" y="104" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            EDIT, INSERT
          </text>
        </g>

        {/* Seta bidirecional DataSource <-> Service */}
        <g stroke={colors.arrow} strokeWidth="2">
          <line x1="370" y1="60" x2="410" y2="60" markerEnd="url(#arrowDS)" />
          <line x1="410" y1="80" x2="370" y2="80" markerEnd="url(#arrowDS)" />
        </g>

        {/* Camada 3: Service (Comunicação) */}
        <g>
          <rect x="410" y="30" width="130" height="80" rx="8" fill={colors.service} opacity="0.9" />
          <text x="475" y="55" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            Service
          </text>
          <text x="475" y="72" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            (Comunicação)
          </text>
          <text x="475" y="92" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            API calls
          </text>
          <text x="475" y="104" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            HTTP requests
          </text>
        </g>

        {/* Legenda / Benefícios */}
        <g transform="translate(30, 130)">
          <rect width="510" height="55" rx="8" fill={isDark ? '#2a2a2a' : '#f8f9fa'} stroke={colors.stroke} strokeWidth="1" />
          <text x="255" y="150" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="11" fontWeight="bold">
            Benefícios da Arquitetura de 3 Camadas
          </text>
          <text x="255" y="167" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10">
            Maior testabilidade • Melhor manutenibilidade • Reutilização de código
          </text>
          <text x="255" y="180" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10">
            Separação de responsabilidades • Cada camada independente
          </text>
        </g>
      </svg>
    </Box>
  );
}
