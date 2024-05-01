import { ReactNode } from 'react';

export interface ArchbaseTreeNode {
	id: string;
	nodes?: ArchbaseTreeNode[];
	parentNode?: ArchbaseTreeNode;
	isleaf?: boolean;
	state: {
		selected: boolean;
		expanded: boolean;
		loading: boolean;
	};
	text: string;
	icon?: ReactNode;
	color?: string;
	backgroundColor?: string;
	image?: string;
	data?: any;
	type?: string;
}

export interface ArchbaseTreeViewOptions {
	selectable: boolean;
	color: string;
	iconColor: string;
	iconBackgroundColor?: string;
	backgroundColor: string;
	borderColor: string;
	hoverColor: string;
	hoverBackgroundColor?: string;
	highlightSelected: boolean;
	selectedColor: string;
	selectedBackgroundColor: string;
	focusedColor: string;
	focusedBackgroundColor: string;
	id: string;
	enableLinks: boolean;
	withBorder: boolean;
	showTags: boolean;
}
