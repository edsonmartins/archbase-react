import { create } from 'zustand'

import { ArchbaseTabItem } from '../types'

export interface AdminState {
  collapsed: boolean
  nameStore: string
  openedTabs?: ArchbaseTabItem[]
  activeTabId?: string | number | undefined
  setOpenedTabs: (openedTabs: ArchbaseTabItem[]) => void
  setActiveTabId: (activeTabId: any) => void
  setCollapsed: (collapsed: boolean) => void
}

/**
 * @deprecated Use `useTabRegistryStore` de `state/tabRegistryStore` para gerenciar
 * estado de tabs com persistencia. Este store sera removido em versoes futuras.
 *
 * Migracao:
 * ```tsx
 * // Antes
 * const { activeTabId, setActiveTabId } = useArchbaseAdminStore();
 *
 * // Depois
 * import { useTabRegistryStore } from '@archbase/admin';
 * const activeTabId = useTabRegistryStore((s) => s.activeTabId);
 * const setActiveTab = useTabRegistryStore((s) => s.setActiveTab);
 * ```
 */
export const useArchbaseAdminStore = create<AdminState>((set) => ({
  nameStore: 'ADMIN_STORE',
  openedTabs: [],
  activeTabId: undefined,
  collapsed: false,
  setOpenedTabs: (openedTabs: ArchbaseTabItem[]) => set({ openedTabs }),
  setActiveTabId: (activeTabId: any) => set({ activeTabId }),
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
}))
