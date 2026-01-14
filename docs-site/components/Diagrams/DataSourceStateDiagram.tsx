import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface DataSourceStateDiagramProps {
  width?: number;
  height?: number;
}

export function DataSourceStateDiagram({ width = 500, height = 280 }: DataSourceStateDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    browse: isDark ? '#228be6' : '#15aabf',
    edit: isDark ? '#fd7e14' : '#f76707',
    insert: isDark ? '#40c057' : '#37b24d',
    text: isDark ? '#ffffff' : '#ffffff',
    label: isDark ? '#c1c2c5' : '#495057',
    arrow: isDark ? '#909296' : '#868e96',
  };

  return (
    <Box style={{ maxWidth: width, mx: 'auto' }}>
      <svg width="100%" viewBox="0 0 500 280" xmlns="http://www.w3.org/2000/svg">
        {/* Definições das setas */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.arrow} />
          </marker>
        </defs>

        {/* Fundo */}
        <rect width="500" height="280" fill="transparent" />

        {/* Estados - BROWSE (topo) */}
        <g>
          <rect x="175" y="20" width="150" height="45" rx="8" fill={colors.browse} />
          <text x="250" y="48" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="14" fontWeight="bold">
            BROWSE
          </text>
        </g>

        {/* Estados - EDIT (esquerda) */}
        <g>
          <rect x="50" y="120" width="150" height="45" rx="8" fill={colors.edit} />
          <text x="125" y="148" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="14" fontWeight="bold">
            EDIT
          </text>
        </g>

        {/* Estados - INSERT (direita) */}
        <g>
          <rect x="300" y="120" width="150" height="45" rx="8" fill={colors.insert} />
          <text x="375" y="148" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="14" fontWeight="bold">
            INSERT
          </text>
        </g>

        {/* Linhas de conexão e Labels */}
        <g stroke={colors.arrow} strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)">
          {/* BROWSE -> EDIT (edit) */}
          <path d="M220 65 L160 115" />
          <text x="175" y="80" fill={colors.label} fontFamily="monospace" fontSize="11">edit()</text>

          {/* EDIT -> BROWSE (save) */}
          <path d="M125 120 L125 75" />
          <text x="100" y="100" fill={colors.label} fontFamily="monospace" fontSize="11">save()</text>

          {/* EDIT -> BROWSE (cancel) */}
          <path d="M100 120 L100 85 L180 85 L220 65" fill="none" strokeDasharray="4" markerEnd="url(#arrowhead)" />
          <text x="105" y="75" fill={colors.label} fontFamily="monospace" fontSize="11">cancel()</text>

          {/* BROWSE -> INSERT (insert) */}
          <path d="M280 65 L340 115" />
          <text x="295" y="80" fill={colors.label} fontFamily="monospace" fontSize="11">insert()</text>

          {/* INSERT -> BROWSE (save) */}
          <path d="M375 120 L375 75" />
          <text x="350" y="100" fill={colors.label} fontFamily="monospace" fontSize="11">save()</text>

          {/* INSERT -> BROWSE (cancel) */}
          <path d="M400 120 L400 85 L320 85 L280 65" fill="none" strokeDasharray="4" markerEnd="url(#arrowhead)" />
          <text x="350" y="75" fill={colors.label} fontFamily="monospace" fontSize="11">cancel()</text>
        </g>

        {/* Legenda */}
        <g transform="translate(50, 210)">
          <rect width="400" height="60" rx="8" fill={isDark ? '#2a2a2a' : '#f8f9fa'} stroke={colors.stroke} strokeWidth="1" />
          <text x="200" y="20" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="11" fontWeight="bold">
            Estados do DataSource
          </text>
          <text x="200" y="38" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10">
            BROWSE: Navegação e leitura | EDIT: Editando registro | INSERT: Inserindo novo
          </text>
          <text x="200" y="52" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10">
            Linhas tracejadas = cancel() (volta ao estado original)
          </text>
        </g>
      </svg>
    </Box>
  );
}
