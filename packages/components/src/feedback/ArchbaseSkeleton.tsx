import React, { forwardRef } from 'react';
import { Skeleton, Stack, Group, Box, MantineRadius } from '@mantine/core';

// ================== DataGrid Skeleton ==================

export interface ArchbaseDataGridSkeletonProps {
  /** Número de linhas */
  rows?: number;
  /** Número de colunas */
  columns?: number;
  /** Se deve mostrar header */
  showHeader?: boolean;
  /** Altura da linha */
  rowHeight?: number;
  /** Espaçamento entre linhas */
  gap?: number;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Se deve animar */
  animate?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseDataGridSkeleton = forwardRef<HTMLDivElement, ArchbaseDataGridSkeletonProps>(
  (
    {
      rows = 5,
      columns = 4,
      showHeader = true,
      rowHeight = 40,
      gap = 8,
      radius = 'sm',
      animate = true,
      className,
      style,
    },
    ref
  ) => {
    const columnWidths = Array.from({ length: columns }, (_, i) => {
      // Primeira coluna menor (checkbox), última maior
      if (i === 0) return '40px';
      if (i === columns - 1) return '1fr';
      return `${Math.floor(Math.random() * 50) + 100}px`;
    });

    return (
      <Stack ref={ref} gap={gap} className={className} style={style}>
        {/* Header */}
        {showHeader && (
          <Group gap={gap} style={{ display: 'grid', gridTemplateColumns: columnWidths.join(' ') }}>
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} height={rowHeight} radius={radius} animate={animate} />
            ))}
          </Group>
        )}

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Group
            key={rowIndex}
            gap={gap}
            style={{ display: 'grid', gridTemplateColumns: columnWidths.join(' ') }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height={rowHeight} radius={radius} animate={animate} />
            ))}
          </Group>
        ))}
      </Stack>
    );
  }
);

ArchbaseDataGridSkeleton.displayName = 'ArchbaseDataGridSkeleton';

// ================== Form Skeleton ==================

export interface ArchbaseFormSkeletonProps {
  /** Número de campos */
  fields?: number;
  /** Número de colunas do form */
  columns?: number;
  /** Se deve mostrar labels */
  showLabels?: boolean;
  /** Altura do input */
  inputHeight?: number;
  /** Altura do label */
  labelHeight?: number;
  /** Espaçamento */
  gap?: number;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Se deve animar */
  animate?: boolean;
  /** Se deve mostrar botões de ação */
  showActions?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseFormSkeleton = forwardRef<HTMLDivElement, ArchbaseFormSkeletonProps>(
  (
    {
      fields = 6,
      columns = 2,
      showLabels = true,
      inputHeight = 36,
      labelHeight = 14,
      gap = 16,
      radius = 'sm',
      animate = true,
      showActions = true,
      className,
      style,
    },
    ref
  ) => {
    const fieldGroups = Math.ceil(fields / columns);

    return (
      <Stack ref={ref} gap={gap} className={className} style={style}>
        {Array.from({ length: fieldGroups }).map((_, groupIndex) => (
          <Group key={groupIndex} gap={gap} grow>
            {Array.from({ length: Math.min(columns, fields - groupIndex * columns) }).map(
              (_, fieldIndex) => (
                <Stack key={fieldIndex} gap={4}>
                  {showLabels && (
                    <Skeleton
                      height={labelHeight}
                      width={`${Math.floor(Math.random() * 30) + 40}%`}
                      radius={radius}
                      animate={animate}
                    />
                  )}
                  <Skeleton height={inputHeight} radius={radius} animate={animate} />
                </Stack>
              )
            )}
          </Group>
        ))}

        {/* Actions */}
        {showActions && (
          <Group justify="flex-end" gap={gap} mt="md">
            <Skeleton height={36} width={100} radius={radius} animate={animate} />
            <Skeleton height={36} width={100} radius={radius} animate={animate} />
          </Group>
        )}
      </Stack>
    );
  }
);

ArchbaseFormSkeleton.displayName = 'ArchbaseFormSkeleton';

// ================== Card Skeleton ==================

export interface ArchbaseCardSkeletonProps {
  /** Se deve mostrar avatar */
  showAvatar?: boolean;
  /** Tamanho do avatar */
  avatarSize?: number;
  /** Número de linhas de texto */
  lines?: number;
  /** Se deve mostrar imagem no topo */
  showImage?: boolean;
  /** Altura da imagem */
  imageHeight?: number;
  /** Se deve mostrar ações */
  showActions?: boolean;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Se deve animar */
  animate?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseCardSkeleton = forwardRef<HTMLDivElement, ArchbaseCardSkeletonProps>(
  (
    {
      showAvatar = true,
      avatarSize = 40,
      lines = 3,
      showImage = false,
      imageHeight = 160,
      showActions = false,
      radius = 'md',
      animate = true,
      className,
      style,
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        className={className}
        style={{
          ...style,
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: `var(--mantine-radius-${radius})`,
          padding: 16,
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Stack gap="sm">
          {/* Image */}
          {showImage && (
            <Skeleton height={imageHeight} radius={radius} animate={animate} mb="sm" />
          )}

          {/* Avatar + Title */}
          <Group gap="sm">
            {showAvatar && (
              <Skeleton height={avatarSize} width={avatarSize} circle animate={animate} />
            )}
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton height={16} width="60%" radius={radius} animate={animate} />
              <Skeleton height={12} width="40%" radius={radius} animate={animate} />
            </Stack>
          </Group>

          {/* Content lines */}
          <Stack gap={8}>
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton
                key={i}
                height={12}
                width={i === lines - 1 ? `${Math.floor(Math.random() * 30) + 50}%` : '100%'}
                radius={radius}
                animate={animate}
              />
            ))}
          </Stack>

          {/* Actions */}
          {showActions && (
            <Group gap="sm" mt="sm">
              <Skeleton height={32} width={80} radius={radius} animate={animate} />
              <Skeleton height={32} width={80} radius={radius} animate={animate} />
            </Group>
          )}
        </Stack>
      </Box>
    );
  }
);

ArchbaseCardSkeleton.displayName = 'ArchbaseCardSkeleton';

// ================== Kanban Skeleton ==================

export interface ArchbaseKanbanSkeletonProps {
  /** Número de colunas */
  columns?: number;
  /** Número de cards por coluna */
  cardsPerColumn?: number;
  /** Largura da coluna */
  columnWidth?: number;
  /** Altura do card */
  cardHeight?: number;
  /** Espaçamento */
  gap?: number;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Se deve animar */
  animate?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseKanbanSkeleton = forwardRef<HTMLDivElement, ArchbaseKanbanSkeletonProps>(
  (
    {
      columns = 3,
      cardsPerColumn = 3,
      columnWidth = 280,
      cardHeight = 100,
      gap = 16,
      radius = 'md',
      animate = true,
      className,
      style,
    },
    ref
  ) => {
    return (
      <Group ref={ref} gap={gap} align="flex-start" className={className} style={style}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Box
            key={colIndex}
            style={{
              width: columnWidth,
              backgroundColor: 'var(--mantine-color-gray-1)',
              borderRadius: `var(--mantine-radius-${radius})`,
              padding: 12,
            }}
          >
            <Stack gap={gap}>
              {/* Column header */}
              <Group justify="space-between">
                <Skeleton height={20} width={100} radius={radius} animate={animate} />
                <Skeleton height={20} width={24} radius="xl" animate={animate} />
              </Group>

              {/* Cards */}
              {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
                <Box
                  key={cardIndex}
                  style={{
                    backgroundColor: 'var(--mantine-color-body)',
                    borderRadius: `var(--mantine-radius-${radius})`,
                    padding: 12,
                    boxShadow: 'var(--mantine-shadow-xs)',
                  }}
                >
                  <Stack gap={8}>
                    <Skeleton height={14} width="80%" radius={radius} animate={animate} />
                    <Skeleton height={12} width="60%" radius={radius} animate={animate} />
                    <Group gap={8} mt={4}>
                      <Skeleton height={24} width={24} circle animate={animate} />
                      <Skeleton height={16} width={60} radius={radius} animate={animate} />
                    </Group>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Group>
    );
  }
);

ArchbaseKanbanSkeleton.displayName = 'ArchbaseKanbanSkeleton';

// ================== List Skeleton ==================

export interface ArchbaseListSkeletonProps {
  /** Número de itens */
  items?: number;
  /** Se deve mostrar avatar */
  showAvatar?: boolean;
  /** Tamanho do avatar */
  avatarSize?: number;
  /** Se deve mostrar descrição */
  showDescription?: boolean;
  /** Se deve mostrar ação à direita */
  showAction?: boolean;
  /** Espaçamento */
  gap?: number;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Se deve animar */
  animate?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseListSkeleton = forwardRef<HTMLDivElement, ArchbaseListSkeletonProps>(
  (
    {
      items = 5,
      showAvatar = true,
      avatarSize = 40,
      showDescription = true,
      showAction = false,
      gap = 12,
      radius = 'sm',
      animate = true,
      className,
      style,
    },
    ref
  ) => {
    return (
      <Stack ref={ref} gap={gap} className={className} style={style}>
        {Array.from({ length: items }).map((_, i) => (
          <Group key={i} gap="sm" wrap="nowrap">
            {showAvatar && (
              <Skeleton height={avatarSize} width={avatarSize} circle animate={animate} />
            )}
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton
                height={14}
                width={`${Math.floor(Math.random() * 30) + 50}%`}
                radius={radius}
                animate={animate}
              />
              {showDescription && (
                <Skeleton
                  height={12}
                  width={`${Math.floor(Math.random() * 20) + 30}%`}
                  radius={radius}
                  animate={animate}
                />
              )}
            </Stack>
            {showAction && <Skeleton height={32} width={32} radius={radius} animate={animate} />}
          </Group>
        ))}
      </Stack>
    );
  }
);

ArchbaseListSkeleton.displayName = 'ArchbaseListSkeleton';
