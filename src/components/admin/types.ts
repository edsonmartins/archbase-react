import { ReactNode } from 'react'

export type ArchbaseNavigationItem = {
  label: string
  icon: any
  link?: string | undefined
  initiallyOpened?: boolean
  links?: ArchbaseNavigationItem[]
  category: string | undefined | null
  color: any | undefined
  component?: ReactNode
  showInSidebar: boolean
  disabled?: boolean;
}

export type ArchbaseCommandColor = {
  backgroundColor: string
  color: string
}

export type ArchbaseCommandMenu = {
  id: any
  command: () => {}
  category: string
  color: ArchbaseCommandColor
  name: string
}

export interface ArchbaseOwner {
  uuid: string
  name: string
  logo: string
  code: string
}

export interface ArchbaseCompany {
  uuid: string
  name: string
  logo: string
  code: string
}

export type ArchbaseTabItem = {
  id: string
  title: string
  path: string
  content: React.ReactNode
  iconClass: any
  closeButton: boolean
  active: boolean
}

export type LocationDataItem = {
  navItemUUID: string
  params: any
}
