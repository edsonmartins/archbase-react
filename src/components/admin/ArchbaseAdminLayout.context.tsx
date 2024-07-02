import React, { ReactNode, useEffect, useState } from 'react';
import { ArchbaseUser } from '../auth';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';

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
}

const ArchbaseAdminLayoutContext = React.createContext<ArchbaseAdminLayoutContextValue>({});

const ArchbaseAdminLayoutProvider: React.FC<ArchbaseAdminLayoutContextProps> = ({
	navigationData: initialNavigationData,
	user,
	owner,
	company,
	navigationRootLink,
	children,
}) => {
	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [hidden, setHidden] = useState<boolean>(false);
	const [navigationData, setNavigationData] = useState<ArchbaseNavigationItem[]>(initialNavigationData);

	return (
		<ArchbaseAdminLayoutContext.Provider
			value={{ navigationData, setNavigationData, user, owner, company, navigationRootLink, collapsed, setCollapsed, hidden, setHidden }}
		>
			{children}
		</ArchbaseAdminLayoutContext.Provider>
	);
};

export { ArchbaseAdminLayoutContext, ArchbaseAdminLayoutProvider };
