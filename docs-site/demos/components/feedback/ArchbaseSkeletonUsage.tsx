import React from 'react';
import { Stack, Group, Tabs, Card, Text } from '@mantine/core';
import {
  ArchbaseDataGridSkeleton,
  ArchbaseFormSkeleton,
  ArchbaseCardSkeleton,
  ArchbaseKanbanSkeleton,
  ArchbaseListSkeleton,
} from '@archbase/components';

export function ArchbaseSkeletonUsage() {
  return (
    <Stack gap="md" p="md">
      <Tabs defaultValue="grid">
        <Tabs.List>
          <Tabs.Tab value="grid">DataGrid</Tabs.Tab>
          <Tabs.Tab value="form">Form</Tabs.Tab>
          <Tabs.Tab value="card">Card</Tabs.Tab>
          <Tabs.Tab value="kanban">Kanban</Tabs.Tab>
          <Tabs.Tab value="list">List</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="grid" pt="md">
          <ArchbaseDataGridSkeleton rows={5} columns={4} />
        </Tabs.Panel>

        <Tabs.Panel value="form" pt="md">
          <ArchbaseFormSkeleton fields={6} columns={2} showActions />
        </Tabs.Panel>

        <Tabs.Panel value="card" pt="md">
          <Group>
            <ArchbaseCardSkeleton showImage showActions />
            <ArchbaseCardSkeleton showAvatar lines={4} />
          </Group>
        </Tabs.Panel>

        <Tabs.Panel value="kanban" pt="md">
          <ArchbaseKanbanSkeleton columns={3} cardsPerColumn={2} />
        </Tabs.Panel>

        <Tabs.Panel value="list" pt="md">
          <ArchbaseListSkeleton items={5} showAvatar showDescription />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
