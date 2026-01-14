import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface AuthFlowDiagramProps {
  width?: number;
  height?: number;
}

export function AuthFlowDiagram({ width = 600, height = 380 }: AuthFlowDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    client: isDark ? '#228be6' : '#15aabf',
    backend: isDark ? '#7950f2' : '#7048e8',
    oauth: isDark ? '#40c057' : '#37b24d',
    text: isDark ? '#ffffff' : '#ffffff',
    label: isDark ? '#c1c2c5' : '#495057',
    arrow: isDark ? '#909296' : '#868e96',
    arrowLine: isDark ? '#b0b2b5' : '#a0a2a5',
  };

  return (
    <Box style={{ maxWidth: width, mx: 'auto' }}>
      <svg width="100%" viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
        {/* Definições das setas */}
        <defs>
          <marker id="arrowHead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.arrow} />
          </marker>
        </defs>

        {/* Fundo */}
        <rect width="600" height="380" fill="transparent" />

        {/* Colunas - Atores */}
        {/* Cliente */}
        <g>
          <rect x="50" y="20" width="120" height="40" rx="8" fill={colors.client} />
          <text x="110" y="45" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="13" fontWeight="bold">
            Cliente
          </text>
          <line x1="110" y1="60" x2="110" y2="360" stroke={colors.client} strokeWidth="1" strokeDasharray="4" opacity="0.5" />
        </g>

        {/* Backend */}
        <g>
          <rect x="240" y="20" width="120" height="40" rx="8" fill={colors.backend} />
          <text x="300" y="45" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="13" fontWeight="bold">
            Backend
          </text>
          <line x1="300" y1="60" x2="300" y2="360" stroke={colors.backend} strokeWidth="1" strokeDasharray="4" opacity="0.5" />
        </g>

        {/* OAuth2 */}
        <g>
          <rect x="430" y="20" width="120" height="40" rx="8" fill={colors.oauth} />
          <text x="490" y="45" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="13" fontWeight="bold">
            OAuth2
          </text>
          <line x1="490" y1="60" x2="490" y2="360" stroke={colors.oauth} strokeWidth="1" strokeDasharray="4" opacity="0.5" />
        </g>

        {/* Fluxo 1: Cliente -> Backend (loginWithContext) */}
        <g>
          <line x1="110" y1="90" x2="290" y2="90" stroke={colors.arrowLine} strokeWidth="1.5" markerEnd="url(#arrowHead3)" />
          <text x="200" y="85" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="9">
            1. loginWithContext()
          </text>
          <text x="200" y="98" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="8" opacity="0.8">
            {"{email, password, context}"}
          </text>
        </g>

        {/* Fluxo 2: Backend -> OAuth2 (Valida credenciais) */}
        <g>
          <line x1="310" y1="120" x2="480" y2="120" stroke={colors.arrowLine} strokeWidth="1.5" markerEnd="url(#arrowHead3)" />
          <text x="395" y="115" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="9">
            2. Valida credenciais
          </text>
        </g>

        {/* Fluxo 3: OAuth2 -> Backend (Access + Refresh Token) */}
        <g>
          <line x1="480" y1="150" x2="310" y2="150" stroke={colors.arrowLine} strokeWidth="1.5" markerEnd="url(#arrowHead3)" />
          <text x="395" y="145" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="9">
            3. Access + Refresh Token
          </text>
        </g>

        {/* Fluxo 4: Backend -> Cliente (Tokens + Context + User) */}
        <g>
          <line x1="290" y1="180" x2="110" y2="180" stroke={colors.arrowLine} strokeWidth="1.5" markerEnd="url(#arrowHead3)" />
          <text x="200" y="175" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="9">
            4. Tokens + Context + User
          </text>
        </g>

        {/* Estado Autenticado */}
        <g>
          <rect x="50" y="200" width="500" height="30" rx="6" fill={isDark ? '#2a2a2a' : '#f0f0f0'} stroke={colors.client} strokeWidth="1" />
          <text x="300" y="220" textAnchor="middle" fill={colors.client} fontFamily="monospace" fontSize="11" fontWeight="bold">
            ✓ Authenticated
          </text>
        </g>

        {/* Fluxo 5: Armazena tokens */}
        <g>
          <line x1="110" y1="260" x2="110" y2="290" stroke={colors.arrowLine} strokeWidth="1.5" markerEnd="url(#arrowHead3)" />
          <text x="110" y="275" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="9">
            5. Armazena tokens
          </text>
          <text x="110" y="300" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="8" opacity="0.8">
            (localStorage)
          </text>
        </g>

        {/* Legenda */}
        <g transform="translate(50, 330)">
          <rect width="500" height="40" rx="6" fill={isDark ? '#2a2a2a' : '#f8f9fa'} stroke={colors.stroke} strokeWidth="1" />
          <text x="250" y="315" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10" fontWeight="bold">
            OAuth2 Authorization Code Flow com PKCE
          </text>
          <text x="250" y="332" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="9">
            Tokens são renovados automaticamente antes da expiração
          </text>
        </g>
      </svg>
    </Box>
  );
}
