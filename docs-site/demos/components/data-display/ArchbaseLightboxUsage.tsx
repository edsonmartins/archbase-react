import React, { useState } from 'react';
import { Button, Group, Stack, Image, SimpleGrid, Text, Paper } from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import {
  ArchbaseLightbox,
  useArchbaseLightbox,
  ArchbaseLightboxSlide,
} from '@archbase/components';

// Imagens de exemplo (usando Unsplash)
const sampleImages: ArchbaseLightboxSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    title: 'Montanhas',
    description: 'Vista panorâmica das montanhas ao amanhecer',
    alt: 'Paisagem de montanhas',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
    title: 'Floresta',
    description: 'Floresta verde com neblina matinal',
    alt: 'Floresta com neblina',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
    title: 'Raios de Sol',
    description: 'Raios de sol atravessando as árvores',
    alt: 'Raios de sol na floresta',
  },
  {
    src: 'https://images.unsplash.com/photo-1518173946687-a4c036bc8bc6?w=1200',
    title: 'Lago',
    description: 'Lago cristalino refletindo as montanhas',
    alt: 'Lago com reflexo',
  },
];

export function ArchbaseLightboxUsage() {
  const lightbox = useArchbaseLightbox();

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Clique em uma imagem para abrir o lightbox
      </Text>

      <SimpleGrid cols={4} spacing="md">
        {sampleImages.map((image, index) => (
          <Paper
            key={index}
            shadow="sm"
            radius="md"
            style={{ overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => lightbox.open(sampleImages, index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              height={120}
              fit="cover"
            />
          </Paper>
        ))}
      </SimpleGrid>

      <ArchbaseLightbox
        slides={sampleImages}
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
    </Stack>
  );
}

export function ArchbaseLightboxWithButton() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <Stack>
      <Group>
        <Button
          leftSection={<IconPhoto size={16} />}
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
        >
          Abrir Galeria
        </Button>
      </Group>

      <ArchbaseLightbox
        slides={sampleImages}
        open={open}
        index={index}
        onClose={() => setOpen(false)}
        onSlideChange={setIndex}
        enableZoom
        enableThumbnails
        enableSlideshow
        enableFullscreen
        enableDownload
        showCounter
        showCaptions
        slideshowDelay={3000}
      />
    </Stack>
  );
}

export function ArchbaseLightboxMinimal() {
  const lightbox = useArchbaseLightbox();

  const minimalImages: ArchbaseLightboxSlide[] = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
  ];

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Lightbox minimalista (sem plugins extras)
      </Text>

      <Group>
        {minimalImages.map((image, index) => (
          <Paper
            key={index}
            shadow="sm"
            radius="md"
            style={{ overflow: 'hidden', cursor: 'pointer', width: 100, height: 100 }}
            onClick={() => lightbox.open(minimalImages, index)}
          >
            <Image src={image.src} alt="" height={100} fit="cover" />
          </Paper>
        ))}
      </Group>

      <ArchbaseLightbox
        slides={minimalImages}
        open={lightbox.isOpen}
        index={lightbox.currentIndex}
        onClose={lightbox.close}
        enableZoom={false}
        enableThumbnails={false}
        showCounter={false}
        showCaptions={false}
      />
    </Stack>
  );
}
