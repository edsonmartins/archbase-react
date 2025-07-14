import React, { CSSProperties, ReactNode } from 'react';
export interface ArchbaseAdvancedTabItem {
    key: any;
    favicon: ReactNode | string | undefined;
    title: string;
    customTitle?: string;
}
export interface ArchbaseAdvancedTabProps {
    favicon: ReactNode | string | undefined;
    title: string;
    /** Título customizado que aparecerá na aba. Pode ser utilizado $title para interpolar o valor na string do customTitle */
    customTitle?: string;
    activeTab: boolean;
    position: number;
    contentWidth: number;
    onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    onClose: (event: React.MouseEvent<HTMLDivElement>) => void;
    setDragging: Function;
    tabsContentWidth: number;
    animateTabMove: Function;
    isDragging: boolean;
    id: any;
    index: number;
    sorting: boolean;
    showButtonClose: boolean;
}
export interface ArchbaseAdvancedTabsProps {
    currentTabs: ArchbaseAdvancedTabItem[];
    buttonCloseOnlyActiveTab: boolean;
    activeTab: any;
    onTabChange: Function;
    onTabClose: Function;
    className?: string;
    style?: CSSProperties;
    dark: boolean;
    onClick: Function;
}
export declare const ArchbaseAdvancedTabs: React.FC<ArchbaseAdvancedTabsProps>;
//# sourceMappingURL=ArchbaseAdvancedTabs.d.ts.map