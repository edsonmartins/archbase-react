import React, { ReactNode, useEffect, useState } from 'react';
import { ArchbaseUser } from '../auth';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { useArchbaseSecurityManager } from '@components/hooks';
import { ArchbaseAdminMainLayoutSecurityOptions } from './ArchbaseAdminMainLayout';

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
	initialSidebarCollapsed,
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(initialSidebarCollapsed);
	const [hidden, setHidden] = useState<boolean>(false);
	const [navigationData, setNavigationData] = useState<ArchbaseNavigationItem[]>(enableSecurity ? [] : initialNavigationData);
	const { securityManager } = useArchbaseSecurityManager({
		resourceName: securityOptions?.navigationResourceName ? securityOptions.navigationResourceName : "ArchbaseAdvancedSidebar",
		resourceDescription: securityOptions?.navigationResourceDescription ? securityOptions.navigationResourceDescription : "Navegação",
		enableSecurity
	})

	useEffect(() => {
		if (enableSecurity) {
			initialNavigationData.filter(item => item.showInSidebar).forEach(item => {
				securityManager.registerAction(item.label, item.label)
				item?.links?.forEach(itemChild => securityManager.registerAction(`${item.label} -> ${itemChild.label}`, `${item.label} -> ${itemChild.label}`))
			})
			securityManager.apply(() => {
				setNavigationData([...initialNavigationData.map(item => ({
					...item,
					disabled: !securityManager.hasPermission(item.label),
					links: item.links && item.links.map(itemChild => ({...itemChild, disabled: !securityManager.hasPermission(`${item.label} -> ${itemChild.label}`)}))
				}))])
			})
		}
	}, [user?.id])

	return (
		<ArchbaseAdminLayoutContext.Provider
			value={{ navigationData, setNavigationData, user, owner, company, navigationRootLink, collapsed, setCollapsed, hidden, setHidden }}
		>
			{children}
		</ArchbaseAdminLayoutContext.Provider>
	);
};

export { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutProvider };
