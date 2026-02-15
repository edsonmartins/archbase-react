import React from 'react';
import { ArchbaseMantineSidebarProps } from './types';
import { StandardSidebar } from './variants/StandardSidebar';
import { MinimalSidebar } from './variants/MinimalSidebar';
import { RailSidebar } from './variants/RailSidebar';

/**
 * ArchbaseMantineSidebar - Componente de sidebar moderno baseado em Mantine
 *
 * Este componente substitui o ArchbaseAdvancedSidebar (baseado em react-pro-sidebar)
 * oferecendo 3 variantes de design:
 *
 * - **standard**: Menu completo com accordion, nested menus, search integrado (Notion/Slack style)
 * - **minimal**: Icon-only com tooltips e menus flutuantes (VSCode/Outlook style)
 * - **rail**: Double panel com coluna de grupos e menu detalhado (Discord/Supabase style)
 *
 * @example
 * ```tsx
 * // Variante Standard (padrão)
 * <ArchbaseMantineSidebar
 *   navigationData={navigationData}
 *   variant="standard"
 *   showSearch
 *   header={<Logo />}
 *   footer={<UserProfile />}
 * />
 *
 * // Variante Minimal
 * <ArchbaseMantineSidebar
 *   navigationData={navigationData}
 *   variant="minimal"
 *   width={60}
 * />
 *
 * // Variante Rail (similar ao ArchbaseAdvancedSidebar)
 * <ArchbaseMantineSidebar
 *   navigationData={navigationData}
 *   variant="rail"
 *   groupColumnWidth={80}
 *   showGroupLabels
 * />
 * ```
 */
export function ArchbaseMantineSidebar({
	variant = 'standard',
	...props
}: ArchbaseMantineSidebarProps) {
	switch (variant) {
		case 'minimal':
			return <MinimalSidebar {...props} />;
		case 'rail':
			return <RailSidebar {...props} />;
		case 'standard':
		default:
			return <StandardSidebar {...props} />;
	}
}

// Re-export das variantes para uso direto
export { StandardSidebar, MinimalSidebar, RailSidebar };
