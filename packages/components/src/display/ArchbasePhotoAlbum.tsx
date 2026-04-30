import React, { useCallback, useMemo, useState } from 'react';
import { RowsPhotoAlbum, ColumnsPhotoAlbum, MasonryPhotoAlbum, Photo, RenderPhotoProps } from 'react-photo-album';
import { Box, Overlay, Text, Badge, ActionIcon, Group, useMantineTheme } from '@mantine/core';
import { IconZoomIn, IconDownload, IconHeart } from '@tabler/icons-react';
import { ArchbaseLightbox, ArchbaseLightboxSlide, useArchbaseLightbox } from './ArchbaseLightbox';

// Import CSS
import 'react-photo-album/rows.css';
import 'react-photo-album/columns.css';
import 'react-photo-album/masonry.css';

// =============================================================================
// Types
// =============================================================================

export type ArchbasePhotoAlbumLayout = 'rows' | 'columns' | 'masonry';

export interface ArchbasePhotoAlbumPhoto extends Photo {
  /** Título da foto */
  title?: string;
  /** Descrição da foto */
  description?: string;
  /** ID único (para tracking) */
  id?: string | number;
  /** Badge/tag para exibir */
  badge?: string;
  /** Cor do badge */
  badgeColor?: string;
  /** Se é favorito */
  favorite?: boolean;
  /** Dados extras */
  data?: Record<string, unknown>;
}

export interface ArchbasePhotoAlbumProps {
  /** Array de fotos */
  photos: ArchbasePhotoAlbumPhoto[];
  /** Tipo de layout */
  layout?: ArchbasePhotoAlbumLayout;
  /** Espaçamento entre fotos (px) */
  spacing?: number;
  /** Padding interno (px) */
  padding?: number;
  /** Altura alvo das linhas (layout 'rows') */
  targetRowHeight?: number;
  /** Número de colunas (layout 'columns' ou 'masonry') */
  columns?: number | ((containerWidth: number) => number);
  /** Callback ao clicar em uma foto */
  onClick?: (photo: ArchbasePhotoAlbumPhoto, index: number) => void;
  /** Abre lightbox automaticamente ao clicar */
  withLightbox?: boolean;
  /** Mostra overlay com ações ao hover */
  showOverlay?: boolean;
  /** Mostra badge nas fotos */
  showBadge?: boolean;
  /** Mostra indicador de favorito */
  showFavorite?: boolean;
  /** Callback ao favoritar */
  onFavorite?: (photo: ArchbasePhotoAlbumPhoto, index: number) => void;
  /** Callback ao baixar */
  onDownload?: (photo: ArchbasePhotoAlbumPhoto, index: number) => void;
  /** Border radius das fotos */
  borderRadius?: number;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

// =============================================================================
// Default Photo Renderer
// =============================================================================

interface DefaultPhotoRendererProps {
  photo: ArchbasePhotoAlbumPhoto;
  index: number;
  width: number;
  height: number;
  showOverlay: boolean;
  showBadge: boolean;
  showFavorite: boolean;
  borderRadius: number;
  onClick?: (photo: ArchbasePhotoAlbumPhoto, index: number) => void;
  onFavorite?: (photo: ArchbasePhotoAlbumPhoto, index: number) => void;
  onDownload?: (photo: ArchbasePhotoAlbumPhoto, index: number) => void;
}

function DefaultPhotoRenderer({
  photo,
  index,
  width,
  height,
  showOverlay,
  showBadge,
  showFavorite,
  borderRadius,
  onClick,
  onFavorite,
  onDownload,
}: DefaultPhotoRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick?.(photo, index);
    },
    [onClick, photo, index]
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFavorite?.(photo, index);
    },
    [onFavorite, photo, index]
  );

  const handleDownload = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDownload?.(photo, index);
    },
    [onDownload, photo, index]
  );

  return (
    <Box
      style={{
        position: 'relative',
        width,
        height,
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        borderRadius,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={photo.src}
        alt={photo.alt || photo.title || ''}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Badge */}
      {showBadge && photo.badge && (
        <Badge
          color={photo.badgeColor || 'blue'}
          variant="filled"
          size="sm"
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
          }}
        >
          {photo.badge}
        </Badge>
      )}

      {/* Favorite indicator */}
      {showFavorite && photo.favorite && (
        <IconHeart
          size={20}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            fill: theme.colors.red[6],
            color: theme.colors.red[6],
          }}
        />
      )}

      {/* Overlay with actions */}
      {showOverlay && isHovered && (
        <>
          <Overlay
            gradient="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"
            opacity={1}
            zIndex={1}
            style={{ borderRadius }}
          />
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 12,
              zIndex: 2,
            }}
          >
            {photo.title && (
              <Text c="white" fw={500} size="sm" lineClamp={1}>
                {photo.title}
              </Text>
            )}
            {photo.description && (
              <Text c="gray.3" size="xs" lineClamp={2}>
                {photo.description}
              </Text>
            )}
            <Group gap={4} mt={8}>
              {onClick && (
                <ActionIcon
                  variant="filled"
                  color="dark"
                  size="sm"
                  onClick={handleClick}
                  title="Ampliar"
                >
                  <IconZoomIn size={14} />
                </ActionIcon>
              )}
              {onDownload && (
                <ActionIcon
                  variant="filled"
                  color="dark"
                  size="sm"
                  onClick={handleDownload}
                  title="Baixar"
                >
                  <IconDownload size={14} />
                </ActionIcon>
              )}
              {onFavorite && (
                <ActionIcon
                  variant="filled"
                  color={photo.favorite ? 'red' : 'dark'}
                  size="sm"
                  onClick={handleFavorite}
                  title={photo.favorite ? 'Remover favorito' : 'Favoritar'}
                >
                  <IconHeart size={14} style={{ fill: photo.favorite ? 'currentColor' : 'none' }} />
                </ActionIcon>
              )}
            </Group>
          </Box>
        </>
      )}
    </Box>
  );
}

// =============================================================================
// Component
// =============================================================================

export function ArchbasePhotoAlbum({
  photos,
  layout = 'rows',
  spacing = 8,
  padding = 0,
  targetRowHeight = 200,
  columns = 4,
  onClick,
  withLightbox = true,
  showOverlay = true,
  showBadge = true,
  showFavorite = true,
  onFavorite,
  onDownload,
  borderRadius = 4,
  className,
  style,
}: ArchbasePhotoAlbumProps) {
  const lightbox = useArchbaseLightbox();

  // Converte fotos para formato do Lightbox
  const lightboxSlides: ArchbaseLightboxSlide[] = useMemo(
    () =>
      photos.map((photo) => ({
        src: photo.src,
        title: photo.title,
        description: photo.description,
        alt: photo.alt,
        width: photo.width,
        height: photo.height,
      })),
    [photos]
  );

  // Handler de clique
  const handleClick = useCallback(
    (photo: ArchbasePhotoAlbumPhoto, index: number) => {
      if (withLightbox) {
        lightbox.open(lightboxSlides, index);
      }
      onClick?.(photo, index);
    },
    [withLightbox, lightbox, lightboxSlides, onClick]
  );

  // Renderização customizada de foto
  const renderPhoto = useCallback(
    (renderProps: RenderPhotoProps) => {
      const { photo: photoObj, width, height } = renderProps as unknown as {
        photo: ArchbasePhotoAlbumPhoto;
        width: number;
        height: number;
      };
      const index = photos.findIndex((p) => p.src === photoObj.src);

      return (
        <DefaultPhotoRenderer
          key={photoObj.src}
          photo={photoObj}
          index={index}
          width={width}
          height={height}
          showOverlay={showOverlay}
          showBadge={showBadge}
          showFavorite={showFavorite}
          borderRadius={borderRadius}
          onClick={handleClick}
          onFavorite={onFavorite}
          onDownload={onDownload}
        />
      );
    },
    [
      photos,
      showOverlay,
      showBadge,
      showFavorite,
      borderRadius,
      handleClick,
      onFavorite,
      onDownload,
    ]
  );

  // Renderiza o álbum baseado no layout
  const renderAlbum = () => {
    const commonProps = {
      photos,
      spacing,
      padding,
      render: { photo: renderPhoto },
    };

    switch (layout) {
      case 'rows':
        return (
          <RowsPhotoAlbum
            {...commonProps}
            targetRowHeight={targetRowHeight}
          />
        );
      case 'columns':
        return (
          <ColumnsPhotoAlbum
            {...commonProps}
            columns={columns}
          />
        );
      case 'masonry':
        return (
          <MasonryPhotoAlbum
            {...commonProps}
            columns={columns}
          />
        );
      default:
        return (
          <RowsPhotoAlbum
            {...commonProps}
            targetRowHeight={targetRowHeight}
          />
        );
    }
  };

  return (
    <Box className={className} style={style}>
      {renderAlbum()}

      {/* Lightbox */}
      {withLightbox && (
        <ArchbaseLightbox
          slides={lightboxSlides}
          open={lightbox.isOpen}
          index={lightbox.currentIndex}
          onClose={lightbox.close}
          onSlideChange={lightbox.goTo}
          enableZoom
          enableThumbnails
          enableFullscreen
          showCounter
          showCaptions
        />
      )}
    </Box>
  );
}

ArchbasePhotoAlbum.displayName = 'ArchbasePhotoAlbum';

// =============================================================================
// Exports
// =============================================================================

export default ArchbasePhotoAlbum;
