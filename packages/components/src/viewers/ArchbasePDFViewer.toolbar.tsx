import React from 'react';
import { ActionIcon, Group, Stack, Text, Tooltip } from '@mantine/core';
import {
  IconZoomIn,
  IconZoomOut,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconRotate,
  IconDownload,
  IconPrinter,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import type { PDFToolbarActions } from './ArchbasePDFViewer.types';

interface ArchbasePDFViewerToolbarProps {
  currentPage: number;
  totalPages: number;
  scale: number;
  rotation: number;
  toolbarActions?: PDFToolbarActions;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onRotate: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  disabled?: boolean;
}

const DEFAULT_ACTIONS: PDFToolbarActions = {
  zoomIn: true,
  zoomOut: true,
  nextPage: true,
  previousPage: true,
  firstPage: true,
  lastPage: true,
  rotate: true,
  download: true,
  print: true,
  pageNavigation: true,
};

export function ArchbasePDFViewerToolbar({
  currentPage,
  totalPages,
  scale,
  rotation,
  toolbarActions,
  onZoomIn,
  onZoomOut,
  onNextPage,
  onPreviousPage,
  onFirstPage,
  onLastPage,
  onRotate,
  onDownload,
  onPrint,
  disabled,
}: ArchbasePDFViewerToolbarProps) {
  const { t } = useArchbaseTranslation();

  const actions = typeof toolbarActions === 'boolean'
    ? (toolbarActions ? DEFAULT_ACTIONS : {})
    : { ...DEFAULT_ACTIONS, ...toolbarActions };

  const scalePercent = Math.round(scale * 100);

  return (
    <Stack gap="xs" py="sm">
      {/* Page Navigation */}
      {(actions.pageNavigation || actions.nextPage || actions.previousPage || actions.firstPage || actions.lastPage) && (
        <Group justify="center" gap="xs">
          {actions.firstPage && (
            <Tooltip label={String(t('First Page'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onFirstPage}
                disabled={disabled || currentPage <= 1}
              >
                <IconChevronsLeft size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {actions.previousPage && (
            <Tooltip label={String(t('Previous'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onPreviousPage}
                disabled={disabled || currentPage <= 1}
              >
                <IconChevronLeft size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {actions.pageNavigation && (
            <Text size="sm" miw={80} ta="center">
              {String(t('Page'))} {currentPage} {String(t('of'))} {totalPages}
            </Text>
          )}

          {actions.nextPage && (
            <Tooltip label={String(t('Next'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onNextPage}
                disabled={disabled || currentPage >= totalPages}
              >
                <IconChevronRight size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {actions.lastPage && (
            <Tooltip label={String(t('Last Page'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onLastPage}
                disabled={disabled || currentPage >= totalPages}
              >
                <IconChevronsRight size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      )}

      {/* Zoom and Rotation */}
      {(actions.zoomIn || actions.zoomOut || actions.rotate) && (
        <Group justify="center" gap="xs">
          {actions.zoomOut && (
            <Tooltip label={String(t('Zoom Out'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onZoomOut}
                disabled={disabled || scale <= 0.25}
              >
                <IconZoomOut size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          <Text size="sm" miw={50} ta="center">
            {scalePercent}%
          </Text>

          {actions.zoomIn && (
            <Tooltip label={String(t('Zoom In'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onZoomIn}
                disabled={disabled || scale >= 3.0}
              >
                <IconZoomIn size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {actions.rotate && (
            <Tooltip label={`${String(t('Rotate'))} (${rotation}°)`}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onRotate}
                disabled={disabled}
              >
                <IconRotate size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      )}

      {/* Actions */}
      {(actions.download || actions.print) && (
        <Group justify="center" gap="xs">
          {actions.download && onDownload && (
            <Tooltip label={String(t('Download'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onDownload}
                disabled={disabled}
              >
                <IconDownload size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {actions.print && onPrint && (
            <Tooltip label={String(t('Print'))}>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={onPrint}
                disabled={disabled}
              >
                <IconPrinter size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      )}
    </Stack>
  );
}
