import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * Windowing proprio, de altura de linha fixa.
 *
 * O monorepo nao tem biblioteca de virtualizacao, e acrescentar uma para uma
 * tabela de linhas homogeneas seria ferramental novo sem justificativa. O caso
 * dificil da virtualizacao e altura variavel; aqui a altura e uniforme, e o
 * calculo se resume a fatiar o intervalo visivel e compensar com espacadores.
 */

export interface VirtualRowsOptions {
  rowCount: number;
  rowHeight: number;
  /** Linhas renderizadas alem do visivel, para o scroll nao piscar. */
  overscan?: number;
  /**
   * Altura presumida do viewport enquanto a medicao real nao chegou.
   *
   * Existe porque `clientHeight` vale zero antes do primeiro efeito — e sempre,
   * em ambiente sem layout. Sem esta estimativa a janela cairia para "todas as
   * linhas", que e precisamente o travamento com resultado volumoso que a
   * virtualizacao existe para evitar.
   */
  estimatedViewport?: number;
}

export interface VirtualRows {
  scrollRef: (node: HTMLElement | null) => void;
  startIndex: number;
  endIndex: number;
  paddingTop: number;
  paddingBottom: number;
  totalHeight: number;
}

export function useVirtualRows({
  rowCount,
  rowHeight,
  overscan = 8,
  estimatedViewport = 600,
}: VirtualRowsOptions): VirtualRows {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const nodeRef = useRef<HTMLElement | null>(null);

  const measure = useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    setScrollTop(node.scrollTop);
    setViewportHeight(node.clientHeight);
  }, []);

  const scrollRef = useCallback(
    (node: HTMLElement | null) => {
      nodeRef.current = node;
      if (node) {
        setScrollTop(node.scrollTop);
        setViewportHeight(node.clientHeight);
      }
    },
    [],
  );

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    node.addEventListener('scroll', measure, { passive: true });

    // O viewport muda de tamanho sem scroll — painel redimensionado, coluna
    // aberta. Sem observar, a janela renderizada fica curta e a tabela some.
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);

    return () => {
      node.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [measure]);

  const effectiveHeight = viewportHeight > 0 ? viewportHeight : estimatedViewport;
  const visibleCount = Math.ceil(effectiveHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(rowCount, startIndex + visibleCount + overscan * 2);

  return {
    scrollRef,
    startIndex,
    endIndex,
    paddingTop: startIndex * rowHeight,
    paddingBottom: Math.max(0, (rowCount - endIndex) * rowHeight),
    totalHeight: rowCount * rowHeight,
  };
}
