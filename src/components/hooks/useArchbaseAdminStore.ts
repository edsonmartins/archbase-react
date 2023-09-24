import { create } from 'zustand'

import { ArchbaseTabItem } from '../admin/types'

export interface AdminState {
  collapsed: boolean
  nameStore: string
  openedTabs?: ArchbaseTabItem[]
  activeTabId?: string | number | undefined
  setOpenedTabs: (openedTabs: ArchbaseTabItem[]) => void
  setActiveTabId: (activeTabId: any) => void
  setCollapsed: (collapsed: boolean) => void
}

export const useArchbaseAdminStore = create<AdminState>((set) => ({
  nameStore: 'ADMIN_STORE',
  openedTabs: [],
  activeTabId: undefined,
  collapsed: false,
  setOpenedTabs: (openedTabs: ArchbaseTabItem[]) => set({ openedTabs }),
  setActiveTabId: (activeTabId: any) => set({ activeTabId }),
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
}))
