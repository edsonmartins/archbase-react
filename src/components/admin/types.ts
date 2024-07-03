import { ReactNode } from 'react';

export type ArchbaseNavigationGroup = {
	label: string;
	icon: any;
	name: string;
	hint: string;
	indexOrder: number;
};

export type ArchbaseNavigationItem = {
	label: string;
	icon: any;
	link?: string | undefined;
	initiallyOpened?: boolean;
	links?: ArchbaseNavigationItem[];
	category: string | undefined | null;
	color: any | undefined;
	component?: ReactNode;
	showInSidebar: boolean;
	disabled?: boolean | Function;
	redirect?: string;
	keepAlive?: boolean;
	group?: ArchbaseNavigationGroup;
	hideDisabledItem?: boolean;
};

export type ArchbaseCommandColor = {
	backgroundColor: string;
	color: string;
};

export type ArchbaseCommandMenu = {
	id: any;
	command: () => void;
	category: string;
	color: ArchbaseCommandColor;
	name: string;
};

export interface ArchbaseOwner {
	uuid: string;
	name: string;
	logo: string;
	code: string;
}

export interface ArchbaseCompany {
	uuid: string;
	name: string;
	logo: string;
	code: string;
}

export type ArchbaseTabItem = {
	id: string;
	title: string;
	path: string;
	content: React.ReactNode;
	iconClass: any;
	closeButton: boolean;
	active: boolean;
	redirect?: string;
};

export type LocationDataItem = {
	navItemUUID: string;
	params: any;
};
