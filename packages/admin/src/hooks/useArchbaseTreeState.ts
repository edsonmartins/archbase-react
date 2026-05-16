import { useCallback } from 'react';
import { useArchbaseState } from './useArchbaseState';

/**
 * Estado de TreeView/Arvore que deve persistir.
 */
export interface ArchbaseTreePersistedState {
  /** IDs dos nos expandidos */
  expandedNodeIds: string[];
  /** IDs dos nos selecionados */
  selectedNodeIds: string[];
  /** ID do no focado */
  focusedNodeId: string | null;
}

const DEFAULT_TREE_STATE: ArchbaseTreePersistedState = {
  expandedNodeIds: [],
  selectedNodeIds: [],
  focusedNodeId: null,
};

/**
 * Hook para persistir estado de TreeView/Arvore.
 *
 * @param treeId Identificador unico da arvore
 * @param initialExpanded IDs dos nos que devem iniciar expandidos
 *
 * @example
 * ```tsx
 * const tree = useArchbaseTreeState('menuTree', ['root', 'config']);
 *
 * <TreeView
 *   expanded={tree.state.expandedNodeIds}
 *   selected={tree.state.selectedNodeIds}
 *   onNodeToggle={(nodeId) => tree.toggleExpanded(nodeId)}
 *   onNodeSelect={(nodeId) => tree.setSelected([nodeId])}
 * />
 * ```
 */
export function useArchbaseTreeState(
  treeId: string,
  initialExpanded: string[] = []
) {
  const [state, setState] = useArchbaseState<ArchbaseTreePersistedState>(
    `tree_${treeId}`,
    { ...DEFAULT_TREE_STATE, expandedNodeIds: initialExpanded }
  );

  // Toggle expansao de no
  const toggleExpanded = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      expandedNodeIds: prev.expandedNodeIds.includes(nodeId)
        ? prev.expandedNodeIds.filter(id => id !== nodeId)
        : [...prev.expandedNodeIds, nodeId]
    }));
  }, [setState]);

  // Expandir no
  const expand = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      expandedNodeIds: prev.expandedNodeIds.includes(nodeId)
        ? prev.expandedNodeIds
        : [...prev.expandedNodeIds, nodeId]
    }));
  }, [setState]);

  // Colapsar no
  const collapse = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      expandedNodeIds: prev.expandedNodeIds.filter(id => id !== nodeId)
    }));
  }, [setState]);

  // Expandir todos
  const expandAll = useCallback((allNodeIds: string[]) => {
    setState(prev => ({ ...prev, expandedNodeIds: allNodeIds }));
  }, [setState]);

  // Colapsar todos
  const collapseAll = useCallback(() => {
    setState(prev => ({ ...prev, expandedNodeIds: [] }));
  }, [setState]);

  // Selecao
  const setSelected = useCallback((nodeIds: string[]) => {
    setState(prev => ({ ...prev, selectedNodeIds: nodeIds }));
  }, [setState]);

  const toggleSelected = useCallback((nodeId: string) => {
    setState(prev => ({
      ...prev,
      selectedNodeIds: prev.selectedNodeIds.includes(nodeId)
        ? prev.selectedNodeIds.filter(id => id !== nodeId)
        : [...prev.selectedNodeIds, nodeId]
    }));
  }, [setState]);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedNodeIds: [] }));
  }, [setState]);

  // Foco
  const setFocused = useCallback((nodeId: string | null) => {
    setState(prev => ({ ...prev, focusedNodeId: nodeId }));
  }, [setState]);

  // Helpers
  const isExpanded = useCallback((nodeId: string) => state.expandedNodeIds.includes(nodeId), [state.expandedNodeIds]);
  const isSelected = useCallback((nodeId: string) => state.selectedNodeIds.includes(nodeId), [state.selectedNodeIds]);

  const reset = useCallback(() => {
    setState({ ...DEFAULT_TREE_STATE, expandedNodeIds: initialExpanded });
  }, [setState, initialExpanded]);

  return {
    state,
    reset,

    // Expansao
    toggleExpanded,
    expand,
    collapse,
    expandAll,
    collapseAll,
    isExpanded,

    // Selecao
    setSelected,
    toggleSelected,
    clearSelection,
    isSelected,
    selectedCount: state.selectedNodeIds.length,
    hasSelection: state.selectedNodeIds.length > 0,

    // Foco
    setFocused,
    focusedNodeId: state.focusedNodeId,
  };
}

/**
 * Hook para persistir estado de Accordion/Paineis expansiveis.
 *
 * @param accordionId Identificador unico
 * @param initialExpanded IDs dos paineis que devem iniciar expandidos
 * @param allowMultiple Se permite multiplos paineis abertos (default: true)
 *
 * @example
 * ```tsx
 * const accordion = useArchbaseAccordionState('filters', ['basic']);
 *
 * <Accordion
 *   multiple
 *   value={accordion.expandedIds}
 *   onChange={accordion.setExpanded}
 * >
 *   <Accordion.Item value="basic">...</Accordion.Item>
 *   <Accordion.Item value="advanced">...</Accordion.Item>
 * </Accordion>
 * ```
 */
export function useArchbaseAccordionState(
  accordionId: string,
  initialExpanded: string[] = [],
  allowMultiple: boolean = true
) {
  const [expandedIds, setExpandedIds] = useArchbaseState<string[]>(
    `accordion_${accordionId}`,
    initialExpanded
  );

  const toggle = useCallback((panelId: string) => {
    setExpandedIds(prev => {
      if (prev.includes(panelId)) {
        return prev.filter(id => id !== panelId);
      }
      return allowMultiple ? [...prev, panelId] : [panelId];
    });
  }, [setExpandedIds, allowMultiple]);

  const expand = useCallback((panelId: string) => {
    setExpandedIds(prev => {
      if (prev.includes(panelId)) return prev;
      return allowMultiple ? [...prev, panelId] : [panelId];
    });
  }, [setExpandedIds, allowMultiple]);

  const collapse = useCallback((panelId: string) => {
    setExpandedIds(prev => prev.filter(id => id !== panelId));
  }, [setExpandedIds]);

  const collapseAll = useCallback(() => setExpandedIds([]), [setExpandedIds]);

  const isExpanded = useCallback((panelId: string) => expandedIds.includes(panelId), [expandedIds]);

  // Para Mantine Accordion que aceita string | string[] | null
  const setExpanded = useCallback((value: string | string[] | null) => {
    if (value === null) {
      setExpandedIds([]);
    } else if (typeof value === 'string') {
      setExpandedIds([value]);
    } else {
      setExpandedIds(value);
    }
  }, [setExpandedIds]);

  return {
    /** IDs dos paineis expandidos */
    expandedIds,
    /** Para usar direto no Accordion.value */
    value: allowMultiple ? expandedIds : (expandedIds[0] ?? null),
    /** Setar expandidos (compativel com Mantine Accordion.onChange) */
    setExpanded,
    toggle,
    expand,
    collapse,
    collapseAll,
    isExpanded,
  };
}
