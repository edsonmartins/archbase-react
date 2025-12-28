import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Group,
  Textarea,
  Button,
  Menu,
  ActionIcon,
  Tooltip,
  Badge,
  Stack,
  Text,
  Modal,
  ColorInput,
} from '@mantine/core';
import {
  IconMessage2,
  IconBookmark,
  IconHighlight,
  IconTrash,
  IconEdit,
  IconPlus,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import type { PDFAnnotation } from './ArchbasePDFViewer.types';

interface ArchbasePDFAnnotationsProps {
  annotations: PDFAnnotation[];
  onAnnotationAdd?: (annotation: PDFAnnotation) => void;
  onAnnotationRemove?: (annotationId: string) => void;
  onAnnotationUpdate?: (annotationId: string, updates: Partial<PDFAnnotation>) => void;
  disabled?: boolean;
  pageIndex: number;
  pageWidth: number;
  pageHeight: number;
}

const DEFAULT_COLORS = {
  highlight: '#ffd700',
  comment: '#00bcd4',
  bookmark: '#4caf50',
};

export function ArchbasePDFAnnotations({
  annotations,
  onAnnotationAdd,
  onAnnotationRemove,
  onAnnotationUpdate,
  disabled,
  pageIndex,
  pageWidth,
  pageHeight,
}: ArchbasePDFAnnotationsProps) {
  const { t } = useArchbaseTranslation();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [openedModal, setOpenedModal] = useState(false);
  const [pendingAnnotation, setPendingAnnotation] = useState<{
    type: PDFAnnotation['type'];
    rect: { x: number; y: number; width: number; height: number };
  } | null>(null);
  const [comment, setComment] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_COLORS.highlight);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter annotations for current page
  const pageAnnotations = annotations.filter((a) => a.pageIndex === pageIndex);

  // Handle mouse down for drawing annotations
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !onAnnotationAdd) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setStartPos({ x, y });
      setIsDrawing(true);
    },
    [disabled, onAnnotationAdd]
  );

  // Handle mouse move for drawing
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !startPos) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCurrentRect({
        x: Math.min(startPos.x, x),
        y: Math.min(startPos.y, y),
        width: Math.abs(x - startPos.x),
        height: Math.abs(y - startPos.y),
      });
    },
    [isDrawing, startPos]
  );

  // Handle mouse up to finish drawing
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentRect || !onAnnotationAdd) {
      setIsDrawing(false);
      setStartPos(null);
      setCurrentRect(null);
      return;
    }

    // Only create annotation if rect has meaningful size
    if (currentRect.width > 10 && currentRect.height > 10) {
      setPendingAnnotation({
        type: 'highlight',
        rect: currentRect,
      });
      setSelectedColor(DEFAULT_COLORS.highlight);
      setOpenedModal(true);
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentRect(null);
  }, [isDrawing, currentRect, onAnnotationAdd]);

  // Create annotation
  const handleCreateAnnotation = useCallback(() => {
    if (!pendingAnnotation || !onAnnotationAdd) return;

    const newAnnotation: PDFAnnotation = {
      id: `annotation-${Date.now()}`,
      type: pendingAnnotation.type,
      pageIndex,
      rect: pendingAnnotation.rect,
      content: comment,
      color: selectedColor,
      author: 'User',
      createdAt: new Date(),
    };

    onAnnotationAdd(newAnnotation);
    setOpenedModal(false);
    setComment('');
    setPendingAnnotation(null);
  }, [pendingAnnotation, onAnnotationAdd, pageIndex, comment, selectedColor]);

  // Remove annotation
  const handleRemoveAnnotation = useCallback(
    (annotationId: string) => {
      if (onAnnotationRemove) {
        onAnnotationRemove(annotationId);
      }
    },
    [onAnnotationRemove]
  );

  // Get icon for annotation type
  const getAnnotationIcon = (type: PDFAnnotation['type']) => {
    switch (type) {
      case 'highlight':
        return IconHighlight;
      case 'comment':
        return IconMessage2;
      case 'bookmark':
        return IconBookmark;
    }
  };

  return (
    <>
      {/* Annotation layer */}
      <Box
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: pageWidth,
          height: pageHeight,
          cursor: disabled ? 'default' : 'crosshair',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Render existing annotations */}
        {pageAnnotations.map((annotation) => {
          const Icon = getAnnotationIcon(annotation.type);
          return (
            <Box
              key={annotation.id}
              style={{
                position: 'absolute',
                left: annotation.rect.x,
                top: annotation.rect.y,
                width: annotation.rect.width,
                height: annotation.rect.height,
                backgroundColor:
                  annotation.type === 'highlight'
                    ? `${annotation.color}40`
                    : 'transparent',
                border: `2px solid ${annotation.color}`,
                borderRadius: 4,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Could open a modal to edit/view annotation
              }}
            >
              {/* Annotation badge */}
              <Group gap={4} style={{ padding: 2 }}>
                <Icon size={14} color={annotation.color} />
                {annotation.content && (
                  <Tooltip label={annotation.content}>
                    <Text size="xs" lineClamp={1} style={{ maxWidth: 100 }}>
                      {annotation.content}
                    </Text>
                  </Tooltip>
                )}
                {!disabled && (
                  <ActionIcon
                    size="xs"
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAnnotation(annotation.id);
                    }}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                )}
              </Group>
            </Box>
          );
        })}

        {/* Current drawing rect */}
        {currentRect && (
          <Box
            style={{
              position: 'absolute',
              left: currentRect.x,
              top: currentRect.y,
              width: currentRect.width,
              height: currentRect.height,
              border: '2px dashed #00bcd4',
              backgroundColor: 'rgba(0, 188, 212, 0.1)',
              borderRadius: 4,
            }}
          />
        )}
      </Box>

      {/* Annotation creation modal */}
      <Modal
        opened={openedModal}
        onClose={() => setOpenedModal(false)}
        title={String(t('Add Annotation'))}
        size="sm"
      >
        <Stack gap="md">
          {/* Annotation type selection */}
          <Group>
            <Button
              variant={pendingAnnotation?.type === 'highlight' ? 'filled' : 'light'}
              leftSection={<IconHighlight size={16} />}
              onClick={() => setPendingAnnotation((prev) => prev ? { ...prev, type: 'highlight' } : null)}
            >
              {String(t('Highlight'))}
            </Button>
            <Button
              variant={pendingAnnotation?.type === 'comment' ? 'filled' : 'light'}
              leftSection={<IconMessage2 size={16} />}
              onClick={() => setPendingAnnotation((prev) => prev ? { ...prev, type: 'comment' } : null)}
            >
              {String(t('Comment'))}
            </Button>
            <Button
              variant={pendingAnnotation?.type === 'bookmark' ? 'filled' : 'light'}
              leftSection={<IconBookmark size={16} />}
              onClick={() => setPendingAnnotation((prev) => prev ? { ...prev, type: 'bookmark' } : null)}
            >
              {String(t('Bookmark'))}
            </Button>
          </Group>

          {/* Color selection */}
          <ColorInput
            label={String(t('Color'))}
            value={selectedColor}
            onChange={setSelectedColor}
            disallowInput
          />

          {/* Comment input */}
          {pendingAnnotation?.type === 'comment' && (
            <Textarea
              label={String(t('Comment'))}
              placeholder={String(t('Enter your comment...'))}
              value={comment}
              onChange={(e) => setComment(e.currentTarget.value)}
              minRows={3}
            />
          )}

          {/* Actions */}
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setOpenedModal(false)}>
              {String(t('Cancel'))}
            </Button>
            <Button onClick={handleCreateAnnotation}>
              {String(t('Add'))}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

// Helper component for annotations list sidebar
export interface ArchbasePDFAnnotationsListProps {
  annotations: PDFAnnotation[];
  onAnnotationRemove?: (annotationId: string) => void;
  onAnnotationClick?: (annotation: PDFAnnotation) => void;
  disabled?: boolean;
}

export function ArchbasePDFAnnotationsList({
  annotations,
  onAnnotationRemove,
  onAnnotationClick,
  disabled,
}: ArchbasePDFAnnotationsListProps) {
  const { t } = useArchbaseTranslation();

  const groupedAnnotations = annotations.reduce((acc, annotation) => {
    if (!acc[annotation.pageIndex]) {
      acc[annotation.pageIndex] = [];
    }
    acc[annotation.pageIndex].push(annotation);
    return acc;
  }, {} as Record<number, PDFAnnotation[]>);

  const getAnnotationIcon = (type: PDFAnnotation['type']) => {
    switch (type) {
      case 'highlight':
        return IconHighlight;
      case 'comment':
        return IconMessage2;
      case 'bookmark':
        return IconBookmark;
    }
  };

  return (
    <Stack gap="xs" p="sm">
      <Text fw={500}>{String(t('Annotations'))}</Text>
      {annotations.length === 0 ? (
        <Text c="dimmed" size="sm">
          {String(t('No annotations yet'))}
        </Text>
      ) : (
        Object.entries(groupedAnnotations).map(([pageIndex, pageAnnotations]) => (
          <Stack key={pageIndex} gap={4}>
            <Text size="sm" c="dimmed">
              {String(t('Page'))} {parseInt(pageIndex) + 1}
            </Text>
            {pageAnnotations.map((annotation) => {
              const Icon = getAnnotationIcon(annotation.type);
              return (
                <Group
                  key={annotation.id}
                  justify="space-between"
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    borderLeft: `3px solid ${annotation.color}`,
                    backgroundColor: `${annotation.color}10`,
                    cursor: onAnnotationClick ? 'pointer' : 'default',
                  }}
                  onClick={() => onAnnotationClick?.(annotation)}
                >
                  <Group gap={8}>
                    <Icon size={16} color={annotation.color} />
                    <div>
                      <Text size="sm">{annotation.type}</Text>
                      {annotation.content && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {annotation.content}
                        </Text>
                      )}
                    </div>
                  </Group>
                  {!disabled && onAnnotationRemove && (
                    <ActionIcon
                      size="sm"
                      color="red"
                      variant="light"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnnotationRemove(annotation.id);
                      }}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  )}
                </Group>
              );
            })}
          </Stack>
        ))
      )}
    </Stack>
  );
}
