import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface SecurityArchitectureDiagramProps {
  width?: number;
  height?: number;
}

export function SecurityArchitectureDiagram({ width = 600, height = 350 }: SecurityArchitectureDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    layer1: isDark ? '#228be6' : '#15aabf',
    layer2: isDark ? '#7950f2' : '#7048e8',
    layer3: isDark ? '#fd7e14' : '#f76707',
    layer4: isDark ? '#40c057' : '#37b24d',
    text: isDark ? '#ffffff' : '#ffffff',
    subtext: isDark ? '#e5e5e5' : '#f8f9fa',
    label: isDark ? '#c1c2c5' : '#495057',
    arrow: isDark ? '#909296' : '#868e96',
  };

  const layerColors = [colors.layer1, colors.layer2, colors.layer3, colors.layer4];

  return (
    <Box style={{ maxWidth: width, mx: 'auto' }}>
      <svg width="100%" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg">
        {/* Definições das setas */}
        <defs>
          <marker id="arrow2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.arrow} />
          </marker>
        </defs>

        {/* Fundo */}
        <rect width="600" height="350" fill="transparent" />

        {/* Camada 1: React Components (UI) */}
        <g>
          <rect x="50" y="20" width="500" height="55" rx="8" fill={colors.layer1} opacity="0.9" />
          <text x="70" y="42" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            Camada 1: React Components (UI)
          </text>
          <text x="70" y="60" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            ArchbaseLogin, UserModal, ProtectedComponent
          </text>
        </g>

        {/* Seta 1->2 */}
        <line x1="300" y1="75" x2="300" y2="95" stroke={colors.arrow} strokeWidth="2" markerEnd="url(#arrow2)" />

        {/* Camada 2: Hooks & Providers */}
        <g>
          <rect x="50" y="100" width="500" height="55" rx="8" fill={colors.layer2} opacity="0.9" />
          <text x="70" y="122" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            Camada 2: Hooks & Providers
          </text>
          <text x="70" y="140" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            useArchbaseAuthenticationManager, ArchbaseSecurityProvider
          </text>
        </g>

        {/* Seta 2->3 */}
        <line x1="300" y1="155" x2="300" y2="175" stroke={colors.arrow} strokeWidth="2" markerEnd="url(#arrow2)" />

        {/* Camada 3: Serviços & Managers */}
        <g>
          <rect x="50" y="180" width="500" height="55" rx="8" fill={colors.layer3} opacity="0.9" />
          <text x="70" y="202" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            Camada 3: Serviços & Managers
          </text>
          <text x="70" y="220" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            ArchbaseAuthenticator, SecurityManager, TokenManager, TenantManager
          </text>
        </g>

        {/* Seta 3->4 */}
        <line x1="300" y1="235" x2="300" y2="255" stroke={colors.arrow} strokeWidth="2" markerEnd="url(#arrow2)" />

        {/* Camada 4: Backend API (OAuth2) */}
        <g>
          <rect x="50" y="260" width="500" height="55" rx="8" fill={colors.layer4} opacity="0.9" />
          <text x="70" y="282" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            Camada 4: Backend API (OAuth2)
          </text>
          <text x="70" y="300" fill={colors.subtext} fontFamily="monospace" fontSize="10">
            /auth/login, /auth/refresh, /users, /permissions
          </text>
        </g>

        {/* Legenda lateral */}
        <g transform="translate(560, 150)">
          <text x="0" y="0" fill={colors.label} fontFamily="monospace" fontSize="9" transform="rotate(-90)">
            Fluxo de Autenticação
          </text>
        </g>
      </svg>
    </Box>
  );
}
