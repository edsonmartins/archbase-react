import { ReactNode } from 'react';
export interface ArchbaseDockableContainerProps {
    children?: ReactNode;
    title: string;
    reducedTitle: string;
    containerWidth?: string;
    backgroundColor?: string;
    hiddenBackgroundColor?: string;
    withBorder?: boolean;
    hiddenWidth?: string;
    position?: 'left' | 'right';
    onShow?: () => void;
    onHide?: () => void;
    defaultIsDocked?: boolean;
    defaultIsVisible?: boolean;
}
export declare const ArchbaseDockableContainer: ({ children, title, reducedTitle, containerWidth, backgroundColor, hiddenBackgroundColor, withBorder, hiddenWidth, position, onShow, onHide, defaultIsDocked, defaultIsVisible, }: ArchbaseDockableContainerProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseDockableContainer.d.ts.map