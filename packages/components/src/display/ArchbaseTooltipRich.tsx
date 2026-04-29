import React, { forwardRef, ReactNode } from 'react';
import {
  HoverCard,
  HoverCardProps,
  Stack,
  Group,
  Text,
  Image,
  Anchor,
  Box,
  MantineSize,
  MantineColor,
  MantineRadius,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';

export interface ArchbaseTooltipRichProps {
  /** Elemento alvo (trigger) */
  children: ReactNode;
  /** Título do tooltip */
  title: string;
  /** Descrição */
  description?: string;
  /** URL da imagem */
  image?: string;
  /** Alt da imagem */
  imageAlt?: string;
  /** Altura da imagem */
  imageHeight?: number;
  /** Link "saiba mais" */
  link?: string;
  /** Label do link */
  linkLabel?: string;
  /** Se o link abre em nova aba */
  linkExternal?: boolean;
  /** Conteúdo customizado adicional */
  footer?: ReactNode;
  /** Largura do tooltip */
  width?: number;
  /** Delay para abrir */
  openDelay?: number;
  /** Delay para fechar */
  closeDelay?: number;
  /** Posição */
  position?: HoverCardProps['position'];
  /** Se deve ter seta */
  withArrow?: boolean;
  /** Tamanho da seta */
  arrowSize?: number;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Sombra */
  shadow?: MantineSize;
  /** Cor do título */
  titleColor?: MantineColor;
  /** Tamanho do título */
  titleSize?: MantineSize;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseTooltipRich = forwardRef<HTMLDivElement, ArchbaseTooltipRichProps>(
  (
    {
      children,
      title,
      description,
      image,
      imageAlt,
      imageHeight = 120,
      link,
      linkLabel = 'Saiba mais',
      linkExternal = true,
      footer,
      width = 280,
      openDelay = 300,
      closeDelay = 150,
      position = 'top',
      withArrow = true,
      arrowSize = 8,
      radius = 'md',
      shadow = 'md',
      titleColor,
      titleSize = 'sm',
      disabled = false,
      className,
      style,
    },
    ref
  ) => {
    if (disabled) {
      return <>{children}</>;
    }

    return (
      <HoverCard
        width={width}
        openDelay={openDelay}
        closeDelay={closeDelay}
        position={position}
        withArrow={withArrow}
        arrowSize={arrowSize}
        radius={radius}
        shadow={shadow}
      >
        <HoverCard.Target>{children}</HoverCard.Target>
        <HoverCard.Dropdown ref={ref} className={className} style={style}>
          <Stack gap="xs">
            {/* Image */}
            {image && (
              <Image
                src={image}
                alt={imageAlt || title}
                height={imageHeight}
                radius="sm"
                fit="cover"
              />
            )}

            {/* Title */}
            <Text size={titleSize} fw={600} c={titleColor}>
              {title}
            </Text>

            {/* Description */}
            {description && (
              <Text size="xs" c="dimmed" lineClamp={4}>
                {description}
              </Text>
            )}

            {/* Link */}
            {link && (
              <Anchor
                href={link}
                target={linkExternal ? '_blank' : undefined}
                rel={linkExternal ? 'noopener noreferrer' : undefined}
                size="xs"
              >
                <Group gap={4}>
                  {linkLabel}
                  {linkExternal && <IconExternalLink size={12} />}
                </Group>
              </Anchor>
            )}

            {/* Footer */}
            {footer && <Box mt={4}>{footer}</Box>}
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  }
);

ArchbaseTooltipRich.displayName = 'ArchbaseTooltipRich';

// ================== Variante com Avatar ==================

export interface ArchbaseTooltipUserProps {
  /** Elemento alvo (trigger) */
  children: ReactNode;
  /** Nome do usuário */
  name: string;
  /** Email ou cargo */
  subtitle?: string;
  /** URL do avatar */
  avatar?: string;
  /** Status online */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Bio ou descrição */
  bio?: string;
  /** Ações customizadas */
  actions?: ReactNode;
  /** Largura */
  width?: number;
  /** Delay para abrir */
  openDelay?: number;
  /** Delay para fechar */
  closeDelay?: number;
  /** Posição */
  position?: HoverCardProps['position'];
  /** Se deve ter seta */
  withArrow?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseTooltipUser = forwardRef<HTMLDivElement, ArchbaseTooltipUserProps>(
  (
    {
      children,
      name,
      subtitle,
      avatar,
      status,
      bio,
      actions,
      width = 300,
      openDelay = 300,
      closeDelay = 150,
      position = 'top',
      withArrow = true,
      className,
      style,
    },
    ref
  ) => {
    const statusColors: Record<string, MantineColor> = {
      online: 'green',
      offline: 'gray',
      away: 'yellow',
      busy: 'red',
    };

    const statusLabels: Record<string, string> = {
      online: 'Online',
      offline: 'Offline',
      away: 'Ausente',
      busy: 'Ocupado',
    };

    return (
      <HoverCard
        width={width}
        openDelay={openDelay}
        closeDelay={closeDelay}
        position={position}
        withArrow={withArrow}
        shadow="md"
      >
        <HoverCard.Target>{children}</HoverCard.Target>
        <HoverCard.Dropdown ref={ref} className={className} style={style}>
          <Stack gap="sm">
            <Group wrap="nowrap">
              {/* Avatar */}
              <Box
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: avatar ? undefined : 'var(--mantine-color-gray-3)',
                  backgroundImage: avatar ? `url(${avatar})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {/* Status indicator */}
                {status && (
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: `var(--mantine-color-${statusColors[status]}-6)`,
                      border: '2px solid var(--mantine-color-body)',
                    }}
                  />
                )}
              </Box>

              {/* Info */}
              <Stack gap={2} style={{ flex: 1 }}>
                <Text size="sm" fw={600}>
                  {name}
                </Text>
                {subtitle && (
                  <Text size="xs" c="dimmed">
                    {subtitle}
                  </Text>
                )}
                {status && (
                  <Group gap={4}>
                    <Box
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: `var(--mantine-color-${statusColors[status]}-6)`,
                      }}
                    />
                    <Text size="xs" c={statusColors[status]}>
                      {statusLabels[status]}
                    </Text>
                  </Group>
                )}
              </Stack>
            </Group>

            {/* Bio */}
            {bio && (
              <Text size="xs" c="dimmed" lineClamp={3}>
                {bio}
              </Text>
            )}

            {/* Actions */}
            {actions && <Box>{actions}</Box>}
          </Stack>
        </HoverCard.Dropdown>
      </HoverCard>
    );
  }
);

ArchbaseTooltipUser.displayName = 'ArchbaseTooltipUser';
