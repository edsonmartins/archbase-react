import React from 'react';
import { Box, useMantineColorScheme } from '@mantine/core';

interface TemplatesOverviewDiagramProps {
  width?: number;
  height?: number;
}

export function TemplatesOverviewDiagram({ width = 650, height = 320 }: TemplatesOverviewDiagramProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    stroke: isDark ? '#e5e5e5' : '#333333',
    form: isDark ? '#228be6' : '#15aabf',
    grid: isDark ? '#40c057' : '#37b24d',
    modal: isDark ? '#7950f2' : '#7048e8',
    masonry: isDark ? '#fd7e14' : '#f76707',
    space: isDark ? '#82c91e' : '#82c91e',
    text: isDark ? '#ffffff' : '#ffffff',
    subtext: isDark ? '#e5e5e5' : '#f8f9fa',
    label: isDark ? '#c1c2c5' : '#495057',
    arrow: isDark ? '#909296' : '#868e96',
  };

  return (
    <Box style={{ maxWidth: width, mx: 'auto' }}>
      <svg width="100%" viewBox="0 0 650 320" xmlns="http://www.w3.org/2000/svg">
        {/* Fundo */}
        <rect width="650" height="320" fill="transparent" />

        {/* Título Central */}
        <text x="325" y="25" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="14" fontWeight="bold">
          Archbase Templates
        </text>

        {/* FormTemplate */}
        <g>
          <rect x="30" y="45" width="110" height="90" rx="8" fill={colors.form} opacity="0.9" />
          <text x="85" y="65" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            FormTemplate
          </text>
          <text x="85" y="80" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            Formulário com
          </text>
          <text x="85" y="93" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            toolbar de ações
          </text>
          <rect x="40" y="105" width="90" height="6" rx="2" fill={colors.subtext} opacity="0.5" />
          <rect x="40" y="114" width="70" height="6" rx="2" fill={colors.subtext} opacity="0.5" />
          <rect x="40" y="123" width="80" height="6" rx="2" fill={colors.subtext} opacity="0.5" />
        </g>

        {/* GridTemplate */}
        <g>
          <rect x="155" y="45" width="110" height="90" rx="8" fill={colors.grid} opacity="0.9" />
          <text x="210" y="65" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            GridTemplate
          </text>
          <text x="210" y="80" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            Grid com CRUD
          </text>
          <text x="210" y="93" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            integrado
          </text>
          <rect x="165" y="105" width="90" height="25" rx="2" fill={colors.subtext} opacity="0.3" />
          <line x1="165" y1="116" x2="255" y2="116" stroke={colors.subtext} strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* ModalTemplate */}
        <g>
          <rect x="280" y="45" width="110" height="90" rx="8" fill={colors.modal} opacity="0.9" />
          <text x="335" y="65" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            ModalTemplate
          </text>
          <text x="335" y="80" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            Modal para
          </text>
          <text x="335" y="93" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            edição rápida
          </text>
          <rect x="300" y="105" width="70" height="25" rx="3" fill="none" stroke={colors.subtext} strokeWidth="1" opacity="0.5" />
        </g>

        {/* MasonryTemplate */}
        <g>
          <rect x="405" y="45" width="110" height="90" rx="8" fill={colors.masonry} opacity="0.9" />
          <text x="460" y="65" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            MasonryTemplate
          </text>
          <text x="460" y="80" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            Layout em
          </text>
          <text x="460" y="93" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            grade/dashboard
          </text>
          <rect x="418" y="105" width="35" height="25" rx="2" fill={colors.subtext} opacity="0.4" />
          <rect x="458" y="110" width="35" height="20" rx="2" fill={colors.subtext} opacity="0.4" />
        </g>

        {/* SpaceTemplate */}
        <g>
          <rect x="530" y="45" width="110" height="90" rx="8" fill={colors.space} opacity="0.9" />
          <text x="585" y="65" textAnchor="middle" fill={colors.text} fontFamily="monospace" fontSize="12" fontWeight="bold">
            SpaceTemplate
          </text>
          <text x="585" y="80" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            Posicionamento
          </text>
          <text x="585" y="93" textAnchor="middle" fill={colors.subtext} fontFamily="monospace" fontSize="9">
            livre com drag
          </text>
          <circle cx="560" cy="115" r="8" fill={colors.subtext} opacity="0.4" />
          <circle cx="585" cy="125" r="8" fill={colors.subtext} opacity="0.4" />
          <circle cx="610" cy="115" r="8" fill={colors.subtext} opacity="0.4" />
        </g>

        {/* Conexões com DataSource central */}
        <g stroke={colors.arrow} strokeWidth="1" opacity="0.5">
          <line x1="85" y1="135" x2="280" y2="170" />
          <line x1="210" y1="135" x2="300" y2="170" />
          <line x1="335" y1="135" x2="325" y2="170" />
          <line x1="460" y1="135" x2="350" y2="170" />
          <line x1="585" y1="135" x2="370" y2="170" />
        </g>

        {/* DataSource central */}
        <g>
          <rect x="250" y="170" width="150" height="50" rx="8" fill={isDark ? '#2a2a2a' : '#f0f0f0'} stroke={colors.label} strokeWidth="2" />
          <text x="325" y="192" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="12" fontWeight="bold">
            DataSource V2
          </text>
          <text x="325" y="208" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="10">
            (Estado e Dados)
          </text>
        </g>

        {/* Casos de Uso */}
        <g transform="translate(0, 240)">
          <rect width="650" height="70" rx="8" fill={isDark ? '#2a2a2a' : '#f8f9fa'} stroke={colors.stroke} strokeWidth="1" />
          <text x="325" y="260" textAnchor="middle" fill={colors.label} fontFamily="monospace" fontSize="11" fontWeight="bold">
            Casos de Uso Recomendados
          </text>

          <g fontSize="9" fill={colors.label} fontFamily="monospace">
            <text x="50" y="280" fill={colors.form}>FormTemplate:</text>
            <text x="130" y="280">Cadastros, edições</text>

            <text x="50" y="295" fill={colors.grid}>GridTemplate:</text>
            <text x="130" y="295">Listagens com CRUD</text>

            <text x="280" y="280" fill={colors.modal}>ModalTemplate:</text>
            <text x="370" y="280">Edição em popup</text>

            <text x="280" y="295" fill={colors.masonry}>MasonryTemplate:</text>
            <text x="400" y="295">Dashboards, cards</text>

            <text x="530" y="280" fill={colors.space}>SpaceTemplate:</text>
            <text x="610" y="280">Layouts custom</text>
          </g>
        </g>
      </svg>
    </Box>
  );
}
