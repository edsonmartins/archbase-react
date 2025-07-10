// detail-panel-hooks.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { GridRowId } from '@mui/x-data-grid';

/**
 * Hook personalizado para gerenciar os painéis de detalhes
 */
export function useDetailPanels<T extends object = any>({
  allowMultipleDetailPanels = false,
  onDetailPanelChange,
  detailPanelMinHeight = 200
}: {
  allowMultipleDetailPanels?: boolean;
  onDetailPanelChange?: (expandedRowIds: GridRowId[]) => void;
  detailPanelMinHeight?: number;
} = {}) {
  // Estados para gerenciar os painéis
  const [expandedRowIds, setExpandedRowIds] = useState<Set<GridRowId>>(new Set());
  const [detailPanelHeight, setDetailPanelHeight] = useState<number>(0);
  
  // Ref para o elemento do painel
  const detailPanelRefs = useRef<Map<GridRowId, HTMLDivElement>>(new Map());
  
  // Toggle para expandir/recolher
  const toggleExpand = useCallback((rowId: GridRowId) => {
    setExpandedRowIds(prev => {
      const newSet = new Set<GridRowId>();
      
      // Se já está expandido, apenas feche (conjunto vazio)
      if (prev.has(rowId)) {
        // Não adiciona nada ao conjunto = fechado
      } 
      // Se não está expandido, adicione apenas este (ignorando os anteriores se não permitir múltiplos)
      else {
        // Se permitir múltiplos painéis, copiar os existentes
        if (allowMultipleDetailPanels) {
          prev.forEach(id => newSet.add(id));
        }
        // Adicionar o novo
        newSet.add(rowId);
      }
      
      // Notificar mudança se callback estiver definido
      if (onDetailPanelChange) {
        onDetailPanelChange(Array.from(newSet));
      }
      
      return newSet;
    });
  }, [allowMultipleDetailPanels, onDetailPanelChange]);
  
  // Restante do hook permanece igual...
  // Fechar um painel específico
  const closeDetailPanel = useCallback((rowId: GridRowId) => {
    setExpandedRowIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(rowId);
      
      if (onDetailPanelChange) {
        onDetailPanelChange(Array.from(newSet));
      }
      
      return newSet;
    });
  }, [onDetailPanelChange]);
  
  // Fechar todos os painéis
  const closeAllDetailPanels = useCallback(() => {
    if (expandedRowIds.size > 0) {
      setExpandedRowIds(new Set());
      
      if (onDetailPanelChange) {
        onDetailPanelChange([]);
      }
    }
  }, [expandedRowIds, onDetailPanelChange]);
  
  // Expandir um painel
  const expandDetailPanel = useCallback((rowId: GridRowId) => {
    setExpandedRowIds(prev => {
      const newSet = new Set<GridRowId>();
      
      // Se permitir múltiplos painéis, copiar os existentes
      if (allowMultipleDetailPanels) {
        prev.forEach(id => newSet.add(id));
      }
      
      // Adicionar o novo se ainda não existir
      if (!prev.has(rowId)) {
        newSet.add(rowId);
        
        if (onDetailPanelChange) {
          onDetailPanelChange(Array.from(newSet));
        }
      }
      
      return newSet;
    });
  }, [allowMultipleDetailPanels, onDetailPanelChange]);
  
  // Efeito para medir a altura do painel
  useEffect(() => {
    // Precisamos esperar o próximo ciclo de renderização para que os refs sejam definidos
    setTimeout(() => {
      if (expandedRowIds.size === 0) {
        setDetailPanelHeight(0);
        return;
      }
      
      // Usar apenas o primeiro painel para altura (já que geralmente teremos apenas um)
      const firstRowId = Array.from(expandedRowIds)[0];
      const element = detailPanelRefs.current.get(firstRowId);
      
      if (element) {
        const height = Math.max(element.offsetHeight, detailPanelMinHeight);
        setDetailPanelHeight(height);
      } else {
        // Usar altura mínima como fallback
        setDetailPanelHeight(detailPanelMinHeight);
      }
    }, 0);
  }, [expandedRowIds, detailPanelMinHeight]);
  
  // Efeito para fechar painéis ao redimensionar a janela
  useEffect(() => {
    const handleResize = () => {
      if (expandedRowIds.size > 0) {
        closeAllDetailPanels();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [expandedRowIds, closeAllDetailPanels]);
  
  return {
    expandedRowIds,
    detailPanelHeight,
    detailPanelRefs,
    toggleExpand,
    closeDetailPanel,
    closeAllDetailPanels,
    expandDetailPanel,
    setExpandedRowIds
  };
}


/**
 * Hook para detectar cliques fora e scroll para fechar os painéis de detalhes
 */
export function useDetailPanelAutoClose({
  containerRef,
  expandedRowIds,
  detailPanelRefs,
  closeAllDetailPanels
}: {
  containerRef: React.RefObject<HTMLElement>;
  expandedRowIds: Set<GridRowId>;
  detailPanelRefs: React.MutableRefObject<Map<GridRowId, HTMLDivElement>>;
  closeAllDetailPanels: () => void;
}) {
  useEffect(() => {
    if (expandedRowIds.size === 0) return;
    
    // Função para fechar os painéis ao rolar
    const handleScroll = (e: Event) => {
      // Verificar se o scroll está ocorrendo no contêiner da grid
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        closeAllDetailPanels();
      }
    };
    
    // Função para fechar os painéis ao clicar fora
    const handleClickOutside = (e: MouseEvent) => {
      // Verificar se há painéis expandidos
      if (expandedRowIds.size === 0) return;
      
      // Verificar se o clique foi dentro do contêiner da grid
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
        // Verificar se o clique foi dentro de algum painel de detalhes
        const isClickInDetailPanel = Array.from(expandedRowIds).some(rowId => {
          const detailPanel = detailPanelRefs.current.get(rowId);
          return detailPanel && detailPanel.contains(e.target as Node);
        });
        
        // Se não foi em um painel de detalhes, mas foi na grid, fechar os painéis
        if (!isClickInDetailPanel) {
          // Verificar se o clique não foi no botão de expansão
          const isClickOnExpandButton = (e.target as HTMLElement).closest('.archbase-expand-button');
          if (!isClickOnExpandButton) {
            closeAllDetailPanels();
          }
        }
      }
    };
    
    // Adicionar os listeners
    // document.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Limpar os listeners quando o componente for desmontado ou quando não houver painéis expandidos
    return () => {
      // document.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedRowIds, containerRef, detailPanelRefs, closeAllDetailPanels]);
}

/**
 * Hook para calcular as posições dos painéis de detalhes inline
 */
export function useDetailPanelPositions<T extends object = any>({
  rows,
  getRowId,
  safeGetRowId,
  expandedRowIds,
  detailPanelHeights,
  rowHeight = 52,
  headerHeight = 56,
  detailPanelMinHeight = 200
}: {
  rows: T[];
  getRowId?: (row: T) => any;
  safeGetRowId: (row: T, getRowId?: any) => any;
  expandedRowIds: Set<GridRowId>;
  detailPanelHeights: Map<GridRowId, number>;
  rowHeight?: number;
  headerHeight?: number;
  detailPanelMinHeight?: number;
}) {
  return useCallback(() => {
    const positions = new Map<GridRowId, number>();
    let additionalOffset = 0;
    
    // Para cada linha, calcular a posição com base na altura da linha
    // e nas alturas dos painéis expandidos acima
    rows.forEach((row, index) => {
      const rowId = safeGetRowId(row, getRowId);
      
      if (rowId !== undefined) {
        // Posição base (cabeçalho + linhas acima * altura da linha)
        const basePosition = headerHeight + (index * rowHeight);
        
        // Posição ajustada (base + offset acumulado dos painéis expandidos acima)
        positions.set(rowId, basePosition + additionalOffset);
        
        // Se esta linha estiver expandida, adicionar sua altura ao offset
        if (expandedRowIds.has(rowId)) {
          const panelHeight = detailPanelHeights.get(rowId) || detailPanelMinHeight;
          additionalOffset += panelHeight;
        }
      }
    });
    
    return positions;
  }, [rows, rowHeight, headerHeight, expandedRowIds, detailPanelHeights, detailPanelMinHeight, getRowId, safeGetRowId]);
}

/**
 * Hook para verificar o espaço disponível na viewport
 */
export function useAvailableSpace<T extends object = any>({
  containerRef,
  rows,
  getRowId,
  safeGetRowId,
  rowHeight = 52,
  detailPanelMinHeight = 200
}: {
  containerRef: React.RefObject<HTMLElement>;
  rows: T[];
  getRowId?: (row: T) => any;
  safeGetRowId: (row: T, getRowId?: any) => any;
  rowHeight?: number;
  detailPanelMinHeight?: number;
}) {
  // Este hook está simplificado para apenas determinar se o modo 'auto' deve usar
  // modal ou inline, agora que inline é fixo
  const [shouldUseModal, setShouldUseModal] = useState<boolean>(false);
  
  // Recalcular a decisão quando a janela é redimensionada
  useEffect(() => {
    const checkContainer = () => {
      if (!containerRef.current) {
        setShouldUseModal(true);
        return;
      }
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Se a altura disponível for pequena, use modal
      if (rect.height < 300) {
        setShouldUseModal(true);
      } else {
        setShouldUseModal(false);
      }
    };
    
    // Verificar inicialmente
    checkContainer();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkContainer);
    
    // Limpar o listener
    return () => {
      window.removeEventListener('resize', checkContainer);
    };
  }, [containerRef]);
  
  return shouldUseModal;
}
