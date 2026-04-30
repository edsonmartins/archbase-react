import React, { useState } from 'react';
import { Stack, Text, SegmentedControl, Paper, Group, Badge } from '@mantine/core';
import {
  ArchbasePhotoAlbum,
  ArchbasePhotoAlbumPhoto,
  ArchbasePhotoAlbumLayout,
} from '@archbase/components';

// Fotos de exemplo com dimensões reais (necessário para o layout)
const samplePhotos: ArchbasePhotoAlbumPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    width: 800,
    height: 600,
    title: 'Montanhas',
    description: 'Vista panorâmica das montanhas ao amanhecer',
    alt: 'Paisagem de montanhas',
    badge: 'Destaque',
    badgeColor: 'blue',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    width: 800,
    height: 533,
    title: 'Floresta',
    description: 'Floresta verde com neblina matinal',
    alt: 'Floresta com neblina',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    width: 800,
    height: 533,
    title: 'Raios de Sol',
    description: 'Raios de sol atravessando as árvores',
    alt: 'Raios de sol na floresta',
    favorite: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1518173946687-a4c036bc8bc6?w=800',
    width: 800,
    height: 1200,
    title: 'Lago',
    description: 'Lago cristalino refletindo as montanhas',
    alt: 'Lago com reflexo',
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    width: 800,
    height: 533,
    title: 'Pôr do Sol',
    description: 'Pôr do sol dourado sobre o oceano',
    alt: 'Pôr do sol no mar',
    badge: 'Novo',
    badgeColor: 'green',
  },
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    width: 800,
    height: 533,
    title: 'Campo',
    description: 'Campo verde com flores silvestres',
    alt: 'Campo florido',
  },
  {
    src: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a00?w=800',
    width: 800,
    height: 600,
    title: 'Cachoeira',
    description: 'Cachoeira em meio à floresta tropical',
    alt: 'Cachoeira',
    favorite: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
    width: 800,
    height: 533,
    title: 'Estrada',
    description: 'Estrada sinuosa através das montanhas',
    alt: 'Estrada nas montanhas',
  },
];

export function ArchbasePhotoAlbumUsage() {
  const [layout, setLayout] = useState<ArchbasePhotoAlbumLayout>('rows');

  return (
    <Stack>
      <Group>
        <Text size="sm" fw={500}>Layout:</Text>
        <SegmentedControl
          value={layout}
          onChange={(value) => setLayout(value as ArchbasePhotoAlbumLayout)}
          data={[
            { label: 'Linhas', value: 'rows' },
            { label: 'Colunas', value: 'columns' },
            { label: 'Masonry', value: 'masonry' },
          ]}
        />
      </Group>

      <Paper withBorder p="md" radius="md">
        <ArchbasePhotoAlbum
          photos={samplePhotos}
          layout={layout}
          spacing={8}
          targetRowHeight={180}
          columns={4}
          withLightbox
          showOverlay
          showBadge
          showFavorite
          borderRadius={8}
        />
      </Paper>
    </Stack>
  );
}

export function ArchbasePhotoAlbumWithActions() {
  const [photos, setPhotos] = useState<ArchbasePhotoAlbumPhoto[]>(samplePhotos);

  const handleFavorite = (photo: ArchbasePhotoAlbumPhoto, index: number) => {
    setPhotos((prev) =>
      prev.map((p, i) =>
        i === index ? { ...p, favorite: !p.favorite } : p
      )
    );
  };

  const handleDownload = (photo: ArchbasePhotoAlbumPhoto) => {
    // Simulação de download
    window.open(photo.src, '_blank');
  };

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Passe o mouse sobre as fotos para ver as ações
      </Text>

      <Paper withBorder p="md" radius="md">
        <ArchbasePhotoAlbum
          photos={photos}
          layout="rows"
          spacing={8}
          targetRowHeight={200}
          withLightbox
          showOverlay
          showBadge
          showFavorite
          onFavorite={handleFavorite}
          onDownload={handleDownload}
          borderRadius={8}
        />
      </Paper>

      <Group>
        <Badge color="red" variant="light">
          Favoritos: {photos.filter((p) => p.favorite).length}
        </Badge>
      </Group>
    </Stack>
  );
}

export function ArchbasePhotoAlbumMasonry() {
  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Layout masonry com 3 colunas
      </Text>

      <Paper withBorder p="md" radius="md">
        <ArchbasePhotoAlbum
          photos={samplePhotos}
          layout="masonry"
          columns={3}
          spacing={12}
          withLightbox
          showOverlay={false}
          borderRadius={4}
        />
      </Paper>
    </Stack>
  );
}

export function ArchbasePhotoAlbumSimple() {
  const simplePhotos: ArchbasePhotoAlbumPhoto[] = samplePhotos.slice(0, 4).map((p) => ({
    src: p.src,
    width: p.width,
    height: p.height,
    alt: p.alt,
  }));

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Galeria simples sem overlay ou badges
      </Text>

      <Paper withBorder p="md" radius="md">
        <ArchbasePhotoAlbum
          photos={simplePhotos}
          layout="rows"
          targetRowHeight={150}
          spacing={4}
          withLightbox
          showOverlay={false}
          showBadge={false}
          showFavorite={false}
          borderRadius={0}
        />
      </Paper>
    </Stack>
  );
}
