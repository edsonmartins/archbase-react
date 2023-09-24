import React from 'react';
import { Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseMasonry, ArchbaseMasonryResponsive } from './ArchbaseMasonry';

const images = [
  'https://picsum.photos/200/300?image=1050',
  'https://picsum.photos/400/400?image=1039',
  'https://picsum.photos/400/400?image=1080',
  'https://picsum.photos/200/200?image=997',
  'https://picsum.photos/500/400?image=287',
  'https://picsum.photos/400/500?image=955',
  'https://picsum.photos/200/300?image=916',
  'https://picsum.photos/300/300?image=110',
  'https://picsum.photos/300/300?image=206',
];

const ArchbaseMasonryExample = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Masonry</Text>
            </Group>
          </Card.Section>
          <ArchbaseMasonry columnsCount={6} gutter="10px">
            {images.map((image, i) => (
              <img key={i} src={image} style={{ width: '100%', display: 'block' }} alt="test" />
            ))}
          </ArchbaseMasonry>
        </Card>
      </Grid.Col>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Responsive masonry</Text>
            </Group>
          </Card.Section>
          <ArchbaseMasonryResponsive columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}>
            <ArchbaseMasonry columnsCount={4} gutter="10px">
              {images.map((image, i) => (
                <img key={i} src={image} style={{ width: '100%', display: 'block' }} alt="test" />
              ))}
            </ArchbaseMasonry>
          </ArchbaseMasonryResponsive>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Masonry/Masonry',
  component: ArchbaseMasonryExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseMasonryExample> = {
  render: () => {
    return <ArchbaseMasonryExample />;
  },
  args: {},
};
