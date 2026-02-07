// Importar estilos CSS do admin
import './admin.css';

export { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutProvider } from './ArchbaseAdminLayout.context';
export type {
	ArchbaseAdminLayoutListener,
	ArchbaseAdminLayoutContextValue,
	ArchbaseAdminLayoutContextProps,
} from './ArchbaseAdminLayout.context';
export type { ArchbaseAdminLayoutFooterProps } from './ArchbaseAdminLayoutFooter';
export { ArchbaseAdminLayoutFooter } from './ArchbaseAdminLayoutFooter';
export type { ArchbaseAdminLayoutHeaderProps } from './ArchbaseAdminLayoutHeader';
export { ArchbaseAdminLayoutHeader, defaultAvatar } from './ArchbaseAdminLayoutHeader';
export type { ArchbaseAdminMainLayoutProps } from './ArchbaseAdminMainLayout';
export { ArchbaseAdminMainLayout } from './ArchbaseAdminMainLayout';
export type { ArchbaseAdminTabContainerProps } from './ArchbaseAdminTabContainer';
export { ArchbaseAdminTabContainer } from './ArchbaseAdminTabContainer';
export { ArchbaseChangeLanguageAction } from './ArchbaseChangeLanguageAction';
export { ArchbaseColorSchemeAction } from './ArchbaseColorSchemeAction';
export type { ArchbaseHeaderNavActionProps } from './ArchbaseHeaderNavAction';
export { ArchbaseHeaderNavAction } from './ArchbaseHeaderNavAction';
export {
	ArchbaseNavigationContext,
	ArchbaseNavigationProvider,
	useArchbaseNavigationContext,
	useArchbaseNavigationListener,
} from './ArchbaseNavigation.context';
export type { ArchbaseNavigationContextValues, ArchbaseNavigationListenerType } from './ArchbaseNavigation.context';
export { navigationDataSample } from './navigationData';
export type {
	ArchbaseNavigationItem,
	ArchbaseCommandColor,
	ArchbaseCommandMenu,
	ArchbaseOwner,
	ArchbaseCompany,
	ArchbaseTabItem,
	LocationDataItem,
} from './types';
export {
	ArchbaseKeepAliveRoute,
	ArchbaseAliveAbleRoutes,
	useKeepAliveVisibility,
	useArchbaseRouteParams,
	useParams,
	useKeepAliveCache
} from './ArchbaseAliveAbleRoutes';
export type { ArchbaseKeepAliveRouteProps, ArchbaseAliveAbleRoutesProps } from './ArchbaseAliveAbleRoutes';
export type { CommandPaletteButtonProps, ArchbaseSpotlightActionData } from './CommandPaletteButton';
export { CommandPaletteButton } from './CommandPaletteButton';

export type { ArchbaseAdvancedSidebarProps } from './ArchbaseAdvancedSidebar';
export { ArchbaseAdvancedSidebar } from './ArchbaseAdvancedSidebar';

export type { SidebarMenuSkeletonProps, SidebarGroupsSkeletonProps, SidebarErrorMessageProps } from './SidebarMenuSkeleton';
export { SidebarMenuSkeleton, SidebarGroupsSkeleton, SidebarErrorMessage } from './SidebarMenuSkeleton';

export { ArchbaseDrawerContent } from './drawer/DrawerContent'
export type { ArchbaseDrawerContentProps } from './drawer/DrawerContent'
export { ArchbaseDrawerTrigger } from './drawer/DrawerTrigger'
export { useArchbaseDrawer } from './drawer/useArchbaseDrawer'

export { ArchbaseMyProfileModal, defaultMyProfileModalOptions } from './ArchbaseMyProfileModal'
export type { ArchbaseMyProfileModalProps, MyProfileModalOptions } from './ArchbaseMyProfileModal'

// Hooks
export * from './hooks';
