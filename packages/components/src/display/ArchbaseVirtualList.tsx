import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Box,
  BoxProps,
  Text,
  Center,
  Loader,
  ScrollArea,
  Stack,
} from '@mantine/core';

// =============================================================================
// Types
// =============================================================================

export interface VirtualListItem {
  id: string | number;
  [key: string]: any;
}

export interface ArchbaseVirtualListProps<T extends VirtualListItem>
  extends Omit<BoxProps, 'children'> {
  /** Array de itens */
  items: T[];
  /** Altura de cada item em pixels */
  itemHeight: number;
  /** Altura do container */
  height: number | string;
  /** Largura do container */
  width?: number | string;
  /** Quantidade de itens extras para renderizar (overscan) */
  overscan?: number;
  /** Renderizador de item */
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  /** Callback ao alcançar o final */
  onEndReached?: () => void;
  /** Threshold para onEndReached (em pixels) */
  endReachedThreshold?: number;
  /** Estado de carregamento */
  loading?: boolean;
  /** Componente de loading */
  loadingComponent?: ReactNode;
  /** Mensagem quando vazio */
  emptyMessage?: string;
  /** Componente quando vazio */
  emptyComponent?: ReactNode;
  /** Renderizar header */
  header?: ReactNode;
  /** Renderizar footer */
  footer?: ReactNode;
  /** Callback ao scrollar */
  onScroll?: (scrollTop: number) => void;
  /** Scroll inicial */
  initialScrollTop?: number;
  /** Estilo dos itens */
  itemStyle?: React.CSSProperties;
  /** Gap entre itens */
  gap?: number;
  /** Key extractor */
  keyExtractor?: (item: T, index: number) => string | number;
}

export interface ArchbaseVirtualListRef {
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  getScrollTop: () => number;
}

// =============================================================================
// ArchbaseVirtualList Component
// =============================================================================

function ArchbaseVirtualListInner<T extends VirtualListItem>(
  {
    items,
    itemHeight,
    height,
    width = '100%',
    overscan = 3,
    renderItem,
    onEndReached,
    endReachedThreshold = 200,
    loading = false,
    loadingComponent,
    emptyMessage = 'Nenhum item encontrado',
    emptyComponent,
    header,
    footer,
    onScroll,
    initialScrollTop = 0,
    itemStyle,
    gap = 0,
    keyExtractor,
    ...boxProps
  }: ArchbaseVirtualListProps<T>,
  ref: React.Ref<ArchbaseVirtualListRef>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const [containerHeight, setContainerHeight] = useState(0);
  const endReachedCalled = useRef(false);

  // Calculate container height
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, [height]);

  // Reset end reached flag when items change
  useEffect(() => {
    endReachedCalled.current = false;
  }, [items.length]);

  // Effective item height (including gap)
  const effectiveItemHeight = itemHeight + gap;

  // Total height of all items
  const totalHeight = items.length * effectiveItemHeight - gap;

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / effectiveItemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / effectiveItemHeight) + overscan
  );

  // Visible items
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({ item: items[i], index: i });
      }
    }
    return result;
  }, [items, startIndex, endIndex]);

  // Handle scroll
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      const newScrollTop = target.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);

      // Check if reached end
      if (
        onEndReached &&
        !endReachedCalled.current &&
        target.scrollHeight - target.scrollTop - target.clientHeight < endReachedThreshold
      ) {
        endReachedCalled.current = true;
        onEndReached();
      }
    },
    [onScroll, onEndReached, endReachedThreshold]
  );

  // Imperative methods
  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number, align: 'start' | 'center' | 'end' = 'start') => {
        if (!containerRef.current) return;

        const itemTop = index * effectiveItemHeight;
        let targetScrollTop = itemTop;

        if (align === 'center') {
          targetScrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
        } else if (align === 'end') {
          targetScrollTop = itemTop - containerHeight + itemHeight;
        }

        containerRef.current.scrollTop = Math.max(0, targetScrollTop);
      },
      scrollToTop: () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      },
      scrollToBottom: () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      },
      getScrollTop: () => scrollTop,
    }),
    [effectiveItemHeight, containerHeight, itemHeight, scrollTop]
  );

  // Get item key
  const getKey = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      return item.id ?? index;
    },
    [keyExtractor]
  );

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <Box style={{ height, width }} {...boxProps}>
        {header}
        {emptyComponent ?? (
          <Center style={{ height: '100%' }}>
            <Text c="dimmed">{emptyMessage}</Text>
          </Center>
        )}
        {footer}
      </Box>
    );
  }

  return (
    <Box {...boxProps}>
      {header}
      <Box
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height,
          width,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Spacer for total height */}
        <Box style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          {visibleItems.map(({ item, index }) => {
            const style: React.CSSProperties = {
              position: 'absolute',
              top: index * effectiveItemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
              ...itemStyle,
            };

            return (
              <React.Fragment key={getKey(item, index)}>
                {renderItem(item, index, style)}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Loading at bottom */}
        {loading && (
          <Center py="md">
            {loadingComponent ?? <Loader size="sm" />}
          </Center>
        )}
      </Box>
      {footer}
    </Box>
  );
}

export const ArchbaseVirtualList = forwardRef(ArchbaseVirtualListInner) as <
  T extends VirtualListItem
>(
  props: ArchbaseVirtualListProps<T> & { ref?: React.Ref<ArchbaseVirtualListRef> }
) => ReturnType<typeof ArchbaseVirtualListInner>;

// =============================================================================
// ArchbaseVirtualGrid Component
// =============================================================================

export interface ArchbaseVirtualGridProps<T extends VirtualListItem>
  extends Omit<BoxProps, 'children'> {
  /** Array de itens */
  items: T[];
  /** Largura de cada item */
  itemWidth: number;
  /** Altura de cada item */
  itemHeight: number;
  /** Altura do container */
  height: number | string;
  /** Gap entre itens */
  gap?: number;
  /** Overscan de linhas */
  overscan?: number;
  /** Renderizador de item */
  renderItem: (item: T, index: number, style: React.CSSProperties) => ReactNode;
  /** Callback ao alcançar o final */
  onEndReached?: () => void;
  /** Threshold para onEndReached */
  endReachedThreshold?: number;
  /** Estado de carregamento */
  loading?: boolean;
  /** Mensagem quando vazio */
  emptyMessage?: string;
  /** Key extractor */
  keyExtractor?: (item: T, index: number) => string | number;
}

export function ArchbaseVirtualGrid<T extends VirtualListItem>({
  items,
  itemWidth,
  itemHeight,
  height,
  gap = 16,
  overscan = 2,
  renderItem,
  onEndReached,
  endReachedThreshold = 200,
  loading = false,
  emptyMessage = 'Nenhum item encontrado',
  keyExtractor,
  ...boxProps
}: ArchbaseVirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const endReachedCalled = useRef(false);

  // Calculate dimensions
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      setContainerHeight(containerRef.current.clientHeight);

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setContainerWidth(entry.contentRect.width);
          setContainerHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Calculate columns
  const columns = Math.max(1, Math.floor((containerWidth + gap) / (itemWidth + gap)));
  const rows = Math.ceil(items.length / columns);
  const effectiveRowHeight = itemHeight + gap;
  const totalHeight = rows * effectiveRowHeight - gap;

  // Calculate visible range
  const startRow = Math.max(0, Math.floor(scrollTop / effectiveRowHeight) - overscan);
  const endRow = Math.min(
    rows - 1,
    Math.ceil((scrollTop + containerHeight) / effectiveRowHeight) + overscan
  );

  // Visible items
  const visibleItems = useMemo(() => {
    const result = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < items.length) {
          result.push({ item: items[index], index, row, col });
        }
      }
    }
    return result;
  }, [items, startRow, endRow, columns]);

  // Handle scroll
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget;
      setScrollTop(target.scrollTop);

      if (
        onEndReached &&
        !endReachedCalled.current &&
        target.scrollHeight - target.scrollTop - target.clientHeight < endReachedThreshold
      ) {
        endReachedCalled.current = true;
        onEndReached();
      }
    },
    [onEndReached, endReachedThreshold]
  );

  // Reset end reached flag
  useEffect(() => {
    endReachedCalled.current = false;
  }, [items.length]);

  // Get key
  const getKey = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) return keyExtractor(item, index);
      return item.id ?? index;
    },
    [keyExtractor]
  );

  // Empty state
  if (items.length === 0 && !loading) {
    return (
      <Box style={{ height }} {...boxProps}>
        <Center style={{ height: '100%' }}>
          <Text c="dimmed">{emptyMessage}</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
      }}
      {...boxProps}
    >
      <Box style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, row, col }) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            top: row * effectiveRowHeight,
            left: col * (itemWidth + gap),
            width: itemWidth,
            height: itemHeight,
          };

          return (
            <React.Fragment key={getKey(item, index)}>
              {renderItem(item, index, style)}
            </React.Fragment>
          );
        })}
      </Box>

      {loading && (
        <Center py="md">
          <Loader size="sm" />
        </Center>
      )}
    </Box>
  );
}

// =============================================================================
// ArchbaseInfiniteList Component
// =============================================================================

export interface ArchbaseInfiniteListProps<T extends VirtualListItem>
  extends Omit<ArchbaseVirtualListProps<T>, 'onEndReached'> {
  /** Função para carregar mais itens */
  loadMore: () => Promise<void>;
  /** Se há mais itens para carregar */
  hasMore: boolean;
  /** Erro ao carregar */
  error?: string | null;
  /** Componente de erro */
  errorComponent?: ReactNode;
  /** Callback para retry */
  onRetry?: () => void;
}

export function ArchbaseInfiniteList<T extends VirtualListItem>({
  loadMore,
  hasMore,
  error,
  errorComponent,
  onRetry,
  loading,
  ...props
}: ArchbaseInfiniteListProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleEndReached = useCallback(async () => {
    if (isLoadingMore || !hasMore || error) return;

    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, error, loadMore]);

  const footerContent = error ? (
    errorComponent ?? (
      <Center py="md">
        <Stack align="center" gap="xs">
          <Text c="red" size="sm">
            {error}
          </Text>
          {onRetry && (
            <Text
              size="sm"
              c="blue"
              style={{ cursor: 'pointer' }}
              onClick={onRetry}
            >
              Tentar novamente
            </Text>
          )}
        </Stack>
      </Center>
    )
  ) : null;

  return (
    <ArchbaseVirtualList
      {...props}
      loading={loading || isLoadingMore}
      onEndReached={handleEndReached}
      footer={
        <>
          {props.footer}
          {footerContent}
        </>
      }
    />
  );
}

// =============================================================================
// Hook useVirtualList
// =============================================================================

export interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  gap?: number;
}

export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  gap = 0,
}: UseVirtualListOptions<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const effectiveItemHeight = itemHeight + gap;
  const totalHeight = items.length * effectiveItemHeight - gap;

  const startIndex = Math.max(0, Math.floor(scrollTop / effectiveItemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / effectiveItemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number; style: React.CSSProperties }> = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i]) {
        result.push({
          item: items[i],
          index: i,
          style: {
            position: 'absolute',
            top: i * effectiveItemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          },
        });
      }
    }
    return result;
  }, [items, startIndex, endIndex, effectiveItemHeight, itemHeight]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      const itemTop = index * effectiveItemHeight;
      let targetScrollTop = itemTop;

      if (align === 'center') {
        targetScrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
      } else if (align === 'end') {
        targetScrollTop = itemTop - containerHeight + itemHeight;
      }

      return Math.max(0, targetScrollTop);
    },
    [effectiveItemHeight, containerHeight, itemHeight]
  );

  return {
    totalHeight,
    visibleItems,
    handleScroll,
    scrollToIndex,
    scrollTop,
    setScrollTop,
  };
}

export default ArchbaseVirtualList;
