import React, { ReactNode, useEffect, useState } from 'react';
import { ArchbaseUser } from '../auth';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { useArchbaseSecurityManager } from '@components/hooks';
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
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(false);
	const [navigationData, setNavigationData] = useUncontrolled({
		value: initialNavigationData,
		defaultValue: enableSecurity ? [] : initialNavigationData,
		finalValue: [],
		onChange: onNavigationDataChange,
	});

	const { securityManager } = useArchbaseSecurityManager({
		resourceName: securityOptions?.navigationResourceName ? securityOptions.navigationResourceName : "ArchbaseAdvancedSidebar",
		resourceDescription: securityOptions?.navigationResourceDescription ? securityOptions.navigationResourceDescription : "Navegação",
		enableSecurity
	});

	useEffect(() => {
		if (enableSecurity) {
			const filteredData = initialNavigationData.filter(item => item.showInSidebar);
			filteredData.forEach(item => {
				securityManager.registerAction(item.label, item.label);
				item?.links?.forEach(itemChild => securityManager.registerAction(`${item.label} -> ${itemChild.label}`, `${item.label} -> ${itemChild.label}`));
			});
			securityManager.apply(() => {
				setNavigationData(initialNavigationData.map(item => ({
					...item,
					disabled: !securityManager.hasPermission(item.label),
					links: item.links && item.links.map(itemChild => ({
						...itemChild,
						disabled: !securityManager.hasPermission(`${item.label} -> ${itemChild.label}`)
					}))
				})));
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
