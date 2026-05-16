import { createStore } from 'zustand/vanilla';

export interface GridState {
  columnWidths: Record<string, number>;
  sortModel: { field: string; sort: 'asc' | 'desc' }[];
  filterModel: Record<string, any>;
  page: number;
  pageSize: number;
}

export interface TabLocalState {
  // Scroll
  scrollY: number;
  setScrollY: (y: number) => void;

  // Paineis expandidos
  expandedPanels: string[];
  togglePanel: (panelId: string) => void;
  setExpandedPanels: (panels: string[]) => void;

  // Form
  formValues: Record<string, any>;
  formDirty: boolean;
  setFormValues: (values: Record<string, any>) => void;
  setFormDirty: (dirty: boolean) => void;

  // Grid
  gridState: GridState | null;
  setGridState: (state: Partial<GridState> | null) => void;

  // DataSource
  dataSourceIndex: number;
  setDataSourceIndex: (index: number) => void;

  // Custom state - para filtros, view modes, etc.
  customState: Record<string, any>;
  setCustomState: (key: string, value: any) => void;
  getCustomState: <T = any>(key: string) => T | undefined;
  clearCustomState: (key?: string) => void;

  // Modals/Drawers state
  openModals: string[];
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  closeAllModals: () => void;

  // View mode (kanban, list, grid, etc.)
  viewMode: string;
  setViewMode: (mode: string) => void;

  // Active internal tab
  activeInternalTab: string | null;
  setActiveInternalTab: (tabId: string | null) => void;

  // Filters state (separado de customState para clareza)
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;

  // Hydration
  hydrate: (snapshot: Partial<SerializedTabState>) => void;
  serialize: () => SerializedTabState;
}

export interface SerializedTabState {
  scrollY: number;
  expandedPanels: string[];
  formValues: Record<string, any>;
  formDirty: boolean;
  gridState: GridState | null;
  dataSourceIndex: number;
  customState: Record<string, any>;
  openModals: string[];
  viewMode: string;
  activeInternalTab: string | null;
  filters: Record<string, any>;
}

export const createTabStore = (initialState?: Partial<SerializedTabState>) =>
  createStore<TabLocalState>((set, get) => ({
    // Initial state values
    scrollY: initialState?.scrollY ?? 0,
    expandedPanels: initialState?.expandedPanels ?? [],
    formValues: initialState?.formValues ?? {},
    formDirty: initialState?.formDirty ?? false,
    gridState: initialState?.gridState ?? null,
    dataSourceIndex: initialState?.dataSourceIndex ?? 0,
    customState: initialState?.customState ?? {},
    openModals: initialState?.openModals ?? [],
    viewMode: initialState?.viewMode ?? 'default',
    activeInternalTab: initialState?.activeInternalTab ?? null,
    filters: initialState?.filters ?? {},

    // Scroll actions
    setScrollY: (y) => set({ scrollY: y }),

    // Panel actions
    togglePanel: (panelId) => set((s) => ({
      expandedPanels: s.expandedPanels.includes(panelId)
        ? s.expandedPanels.filter((id) => id !== panelId)
        : [...s.expandedPanels, panelId],
    })),
    setExpandedPanels: (panels) => set({ expandedPanels: panels }),

    // Form actions
    setFormValues: (values) => set({ formValues: values }),
    setFormDirty: (dirty) => set({ formDirty: dirty }),

    // Grid actions
    setGridState: (state) => set((s) => ({
      gridState: state === null ? null : { ...s.gridState, ...state } as GridState,
    })),

    // DataSource actions
    setDataSourceIndex: (index) => set({ dataSourceIndex: index }),

    // Custom state actions
    setCustomState: (key, value) => set((s) => ({
      customState: { ...s.customState, [key]: value },
    })),
    getCustomState: <T = any>(key: string) => get().customState[key] as T | undefined,
    clearCustomState: (key) => set((s) => {
      if (key) {
        const { [key]: _, ...rest } = s.customState;
        return { customState: rest };
      }
      return { customState: {} };
    }),

    // Modal actions
    openModal: (modalId) => set((s) => ({
      openModals: s.openModals.includes(modalId) ? s.openModals : [...s.openModals, modalId],
    })),
    closeModal: (modalId) => set((s) => ({
      openModals: s.openModals.filter((id) => id !== modalId),
    })),
    isModalOpen: (modalId) => get().openModals.includes(modalId),
    closeAllModals: () => set({ openModals: [] }),

    // View mode actions
    setViewMode: (mode) => set({ viewMode: mode }),

    // Internal tab actions
    setActiveInternalTab: (tabId) => set({ activeInternalTab: tabId }),

    // Filter actions
    setFilter: (key, value) => set((s) => ({
      filters: { ...s.filters, [key]: value },
    })),
    setFilters: (filters) => set({ filters }),
    clearFilters: () => set({ filters: {} }),

    // Hydration
    hydrate: (snapshot) => set({
      scrollY: snapshot.scrollY ?? get().scrollY,
      expandedPanels: snapshot.expandedPanels ?? get().expandedPanels,
      formValues: snapshot.formValues ?? get().formValues,
      formDirty: snapshot.formDirty ?? get().formDirty,
      gridState: snapshot.gridState ?? get().gridState,
      dataSourceIndex: snapshot.dataSourceIndex ?? get().dataSourceIndex,
      customState: snapshot.customState ?? get().customState,
      openModals: snapshot.openModals ?? get().openModals,
      viewMode: snapshot.viewMode ?? get().viewMode,
      activeInternalTab: snapshot.activeInternalTab ?? get().activeInternalTab,
      filters: snapshot.filters ?? get().filters,
    }),

    serialize: () => {
      const s = get();
      return {
        scrollY: s.scrollY,
        expandedPanels: s.expandedPanels,
        formValues: s.formValues,
        formDirty: s.formDirty,
        gridState: s.gridState,
        dataSourceIndex: s.dataSourceIndex,
        customState: s.customState,
        openModals: s.openModals,
        viewMode: s.viewMode,
        activeInternalTab: s.activeInternalTab,
        filters: s.filters,
      };
    },
  }));

export type TabStore = ReturnType<typeof createTabStore>;
