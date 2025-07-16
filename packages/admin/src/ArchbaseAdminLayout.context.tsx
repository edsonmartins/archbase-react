import React, { ReactNode, useEffect, useState } from 'react';
import { ArchbaseUser } from '@archbase/security';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { useArchbaseSecurityManager } from '@archbase/security';
import { ArchbaseAdminMainLayoutSecurityOptions } from './ArchbaseAdminMainLayout';
import { useUncontrolled } from '@mantine/hooks';

export interface ArchbaseAdminLayoutListener {
	onChangeLocationPath: (item: ArchbaseNavigationItem) => void;
}

export interface ArchbaseAdminLayoutContextValue {
	navigationData?: ArchbaseNavigationItem[];
	setNavigationData?: (navigationData: ArchbaseNavigationItem[]) => void;
	user?: ArchbaseUser;
	owner?: ArchbaseOwner;
	company?: ArchbaseCompany;
	navigationRootLink?: string;
	collapsed?: boolean;
	setCollapsed?: (value: boolean) => void;
	hidden?: boolean;
	setHidden?: (value: boolean) => void;
	onNavigationDataChange?: (navigationData: ArchbaseNavigationItem[]) => void;
}

export interface ArchbaseAdminLayoutContextProps {
	navigationData?: ArchbaseNavigationItem[];
	user?: ArchbaseUser;
	owner?: ArchbaseOwner;
	company?: ArchbaseCompany;
	navigationRootLink?: string;
	children?: ReactNode;
	opened?: boolean;
	enableSecurity?: boolean;
	securityOptions?: ArchbaseAdminMainLayoutSecurityOptions;
	onNavigationDataChange?: (navigationData: ArchbaseNavigationItem[]) => void;
	initialSidebarCollapsed?: boolean;
}

const ArchbaseAdminLayoutContext = React.createContext<ArchbaseAdminLayoutContextValue>({});

const ArchbaseAdminLayoutProvider: React.FC<ArchbaseAdminLayoutContextProps> = ({
	navigationData: initialNavigationData,
	user,
	owner,
	company,
	navigationRootLink,
	children,
	enableSecurity,
	securityOptions,
	onNavigationDataChange,
	initialSidebarCollapsed,
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(initialSidebarCollapsed);
	const [hidden, setHidden] = useState<boolean>(false);
	const [navigationData, setNavigationData] = useUncontrolled({
		value: onNavigationDataChange !== undefined ? initialNavigationData : undefined,
		defaultValue: enableSecurity ? [] : initialNavigationData,
		finalValue: [],
		onChange: onNavigationDataChange,
	});

	// DEBUG: Log quando navigationData é atualizado
	useEffect(() => {
		console.log('🐛 ArchbaseAdminLayoutContext - navigationData atualizado:', {
			navigationDataLength: navigationData?.length || 0,
			navigationItems: navigationData?.map(item => ({ label: item.label, link: item.link })) || [],
			enableSecurity,
			timestamp: new Date().toISOString()
		});
	}, [navigationData, enableSecurity]);

	const { securityManager } = useArchbaseSecurityManager({
		resourceName: securityOptions?.navigationResourceName ? securityOptions.navigationResourceName : "ArchbaseAdvancedSidebar",
		resourceDescription: securityOptions?.navigationResourceDescription ? securityOptions.navigationResourceDescription : "archbase:Navegação",
		enableSecurity
	});

	useEffect(() => {
		console.log('🐛 ArchbaseAdminLayoutContext - useEffect security executado:', {
			enableSecurity,
			userId: user?.id,
			initialNavigationDataLength: initialNavigationData?.length || 0,
			timestamp: new Date().toISOString()
		});
		
		if (enableSecurity) {
			const filteredData = initialNavigationData.filter(item => item.showInSidebar);
			console.log('🐛 ArchbaseAdminLayoutContext - registrando ações de segurança:', {
				filteredDataLength: filteredData.length,
				items: filteredData.map(item => ({ label: item.label, link: item.link })),
				timestamp: new Date().toISOString()
			});
			
			filteredData.forEach(item => {
				securityManager.registerAction(item.label, item.label);
				item?.links?.forEach(itemChild => securityManager.registerAction(`${item.label} -> ${itemChild.label}`, `${item.label} -> ${itemChild.label}`));
			});
			
			securityManager.apply(() => {
				console.log('🐛 ArchbaseAdminLayoutContext - securityManager.apply executado:', {
					timestamp: new Date().toISOString()
				});
				
				const updatedNavigationData = initialNavigationData.map(item => ({
					...item,
					disabled: !securityManager.hasPermission(item.label),
					links: item.links && item.links.map(itemChild => {
						const childHasPermission = securityManager.hasPermission(`${item.label} -> ${itemChild.label}`)
						return {
							...itemChild,
							disabled: !childHasPermission
						}
					})
				}))
				
				console.log('🐛 ArchbaseAdminLayoutContext - setNavigationData será chamado:', {
					updatedNavigationDataLength: updatedNavigationData.length,
					items: updatedNavigationData.map(item => ({ label: item.label, link: item.link, disabled: item.disabled })),
					timestamp: new Date().toISOString()
				});
				
				setNavigationData(updatedNavigationData);
			});
		}
	}, [user?.id, enableSecurity, initialNavigationData, securityManager, setNavigationData]);

	return (
		<ArchbaseAdminLayoutContext.Provider
			value={{
				navigationData,
				setNavigationData,
				user,
				owner,
				company,
				navigationRootLink,
				collapsed,
				setCollapsed,
				hidden,
				setHidden,
				onNavigationDataChange
			}}
		>
			{children}
		</ArchbaseAdminLayoutContext.Provider>
	);
};

export { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutProvider };
