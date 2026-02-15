// Types
export type {
	SidebarVariant,
	SidebarCollapsibleMode,
	ExtendedNavigationItem,
	ArchbaseMantineSidebarProps,
	SidebarContextValue,
	SidebarItemProps,
	SidebarGroupProps,
	SidebarSearchProps,
	SidebarUserProfileProps,
	SidebarGroupIconProps,
	SidebarBadgeProps,
	SidebarProviderProps,
} from './types';

// Context
export { SidebarProvider, useSidebar, useSidebarOptional, SidebarContext } from './context';

// Hooks
export {
	useSidebarNavigation,
	useSidebarSearch,
	useSidebarKeyboard,
} from './hooks';
export type {
	UseSidebarNavigationOptions,
	UseSidebarNavigationReturn,
	UseSidebarSearchOptions,
	UseSidebarSearchReturn,
	UseSidebarKeyboardOptions,
	UseSidebarKeyboardReturn,
} from './hooks';

// Components
export { SidebarItem } from './components/SidebarItem';
export { SidebarGroup, SidebarSection } from './components/SidebarGroup';
export { SidebarGroupIcon } from './components/SidebarGroupIcon';
export { SidebarSearch } from './components/SidebarSearch';
export { SidebarUserProfile } from './components/SidebarUserProfile';
export { SidebarBadge, SidebarIndicator } from './components/SidebarBadge';
export {
	SidebarMenuSkeleton,
	SidebarGroupsSkeleton,
	SidebarHeaderSkeleton,
	SidebarUserProfileSkeleton,
	SidebarErrorMessage,
} from './components/SidebarSkeleton';
export type { SidebarSkeletonProps } from './components/SidebarSkeleton';

// Main Component and Variants
export { ArchbaseMantineSidebar, StandardSidebar, MinimalSidebar, RailSidebar } from './ArchbaseMantineSidebar';
