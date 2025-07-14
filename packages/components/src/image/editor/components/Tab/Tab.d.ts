import React, { ReactNode } from "react";
import './TabsStyles.scss';
export interface TabContainerProp {
    children: Array<React.JSX.Element> | React.JSX.Element;
    activeIndex?: number;
    backgroundColor?: string;
    color?: string;
    indicatorStyle?: 'simple' | 'bottomLine' | 'button';
    onTabChange?: Function;
    lazy?: boolean;
    transitionMs?: number;
    borderLine?: boolean;
    fontColor?: string;
}
declare const TabContainer: React.MemoExoticComponent<({ activeIndex, children, backgroundColor, color, indicatorStyle, onTabChange, transitionMs, borderLine, fontColor, lazy }: TabContainerProp) => import("react/jsx-runtime").JSX.Element>;
export declare const TabItem: React.MemoExoticComponent<({ name, children, icon, type, disabled }: {
    name: string;
    children: ReactNode;
    icon?: React.JSX.Element | string | null | undefined;
    disabled?: boolean;
    type?: string;
}) => import("react/jsx-runtime").JSX.Element>;
export default TabContainer;
//# sourceMappingURL=Tab.d.ts.map