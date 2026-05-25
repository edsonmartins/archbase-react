import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabSnapshot {
  scrollY: number;
  expandedPanels: string[];
  formValues: Record<string, any>;
  formDirty: boolean;
  gridState: {
    columnWidths: Record<string, number>;
    sortModel: { field: string; sort: 'asc' | 'desc' }[];
    filterModel: Record<string, any>;
    page: number;
    pageSize: number;
  } | null;
  dataSourceIndex: number;
  customState: Record<string, any>;
  openModals: string[];
  viewMode: string;
  activeInternalTab: string | null;
  filters: Record<string, any>;
  lastAccessed: number;
}

export interface TabRegistryState {
  openTabs: string[];
  activeTabId: string | null;
  snapshots: Record<string, TabSnapshot>;
  maxSnapshots: number;

  // Actions
  addTab: (tabId: string) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  saveSnapshot: (tabId: string, snapshot: Partial<TabSnapshot>) => void;
  getSnapshot: (tabId: string) => TabSnapshot | undefined;
  clearSnapshot: (tabId: string) => void;
  pruneOldSnapshots: () => void;
}

export const useTabRegistryStore = create<TabRegistryState>()(
  persist(
    (set, get) => ({
      openTabs: [],
      activeTabId: null,
      snapshots: {},
      maxSnapshots: 20,

      addTab: (tabId) => set((state) => ({
        openTabs: state.openTabs.includes(tabId)
          ? state.openTabs
          : [...state.openTabs, tabId],
        activeTabId: tabId,
      })),

      removeTab: (tabId) => set((state) => {
        const { [tabId]: removed, ...remaining } = state.snapshots;
        return {
          openTabs: state.openTabs.filter((id) => id !== tabId),
          snapshots: remaining,
          activeTabId: state.activeTabId === tabId
            ? state.openTabs[0] || null
            : state.activeTabId,
        };
      }),

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      saveSnapshot: (tabId, snapshot) => {
        set((state) => ({
          snapshots: {
            ...state.snapshots,
            [tabId]: {
              ...state.snapshots[tabId],
              ...snapshot,
              lastAccessed: Date.now(),
            } as TabSnapshot,
          },
        }));
        // Auto-prune após salvar
        get().pruneOldSnapshots();
      },

      getSnapshot: (tabId) => get().snapshots[tabId],

      clearSnapshot: (tabId) => set((state) => {
        const { [tabId]: _, ...remaining } = state.snapshots;
        return { snapshots: remaining };
      }),

      pruneOldSnapshots: () => set((state) => {
        const entries = Object.entries(state.snapshots);
        if (entries.length <= state.maxSnapshots) return state;

        // LRU eviction - remove oldest accessed
        const sorted = entries.sort(
          ([, a], [, b]) => b.lastAccessed - a.lastAccessed
        );
        const kept = sorted.slice(0, state.maxSnapshots);
        return { snapshots: Object.fromEntries(kept) };
      }),
    }),
    {
      name: 'archbase-tab-registry',
      partialize: (state) => ({
        snapshots: state.snapshots,
        // Nao persistir openTabs - tabs sao reconstruidas pelo router
      }),
    }
  )
);
